/**
 * Entry point: Veeam VBR MCP Server
 *
 * Supports two transport modes:
 *   1. stdio            - for Claude Desktop / Cursor (default)
 *   2. streamable-http  - for Dify, cloud AI agents (replaces deprecated SSE mode)
 *
 * The "streamable-http" mode implements the MCP 2025-03-26 Streamable HTTP spec,
 * which is the current standard required by Dify and modern MCP clients.
 * (The old HTTP+SSE transport from 2024-11-05 is deprecated and no longer works with Dify.)
 *
 * Environment variables:
 *   MCP_TRANSPORT_MODE  = "stdio" (default) | "streamable-http" | "sse" (alias)
 *   MCP_HTTP_PORT       = HTTP listen port (default: 3000)
 *   MCP_STATELESS       = "true" to run stateless (no session ID); default: stateful
 *   VEEAM_SERVER        = https://<hostname | IP>
 *   VEEAM_PORT          = 9419
 *   VEEAM_USERNAME      = admin username
 *   VEEAM_PASSWORD      = admin password
 *   NODE_TLS_REJECT_UNAUTHORIZED = 0  (for self-signed certificates)
 */

import * as dotenv from "dotenv";
dotenv.config();

import { randomUUID } from "node:crypto";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import { createMcpServer } from "./server.js";

const MODE = (process.env.MCP_TRANSPORT_MODE ?? "stdio").toLowerCase();
const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT ?? "3000", 10);
const STATELESS = process.env.MCP_STATELESS === "true";

// ─────────────────────────────────────────────
// stdio mode
// ─────────────────────────────────────────────
async function startStdio(): Promise<void> {
  console.error("[MCP] Starting in stdio mode...");
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP] stdio ready.");
}

// ─────────────────────────────────────────────
// Streamable HTTP mode (MCP 2025-03-26 spec)
// Required by Dify and modern MCP clients.
// Single /mcp endpoint handles GET + POST + DELETE.
// ─────────────────────────────────────────────
async function startStreamableHTTP(): Promise<void> {
  console.error(`[MCP] Starting Streamable HTTP mode on port ${HTTP_PORT} (stateless=${STATELESS})...`);

  const app = express();
  app.use(express.json());

  // Session map: sessionId → { transport, server }
  // Only used in stateful mode.
  const sessions = new Map<string, StreamableHTTPServerTransport>();

  // ── GET /mcp  (open SSE notification stream) ──
  app.get("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (STATELESS) {
      // Stateless: return 405 for GET (no persistent notification stream)
      res.status(405).json({ error: "GET not supported in stateless mode" });
      return;
    }

    if (!sessionId || !sessions.has(sessionId)) {
      res.status(404).json({ error: "Session not found. POST /mcp first to initialize." });
      return;
    }

    const transport = sessions.get(sessionId)!;
    await transport.handleRequest(req, res);
  });

  // ── POST /mcp  (main JSON-RPC channel) ──
  app.post("/mcp", async (req: Request, res: Response) => {
    if (STATELESS) {
      // Stateless: each request gets a fresh transport + server, no session
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
      });
      const server = createMcpServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // Stateful: reuse session if Mcp-Session-Id header is present
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId && sessions.has(sessionId)) {
      // Existing session — route to existing transport
      const transport = sessions.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // New session (initialize request)
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
    });

    transport.onclose = () => {
      const sid = transport.sessionId;
      if (sid) {
        console.error(`[MCP] Session closed: ${sid}`);
        sessions.delete(sid);
      }
    };

    const server = createMcpServer();
    await server.connect(transport);

    // Handle the request — this will write Mcp-Session-Id header in the response
    await transport.handleRequest(req, res, req.body);

    // Register session AFTER handling so sessionId is populated
    const newSessionId = transport.sessionId;
    if (newSessionId) {
      sessions.set(newSessionId, transport);
      console.error(`[MCP] New session created: ${newSessionId}`);
    }
  });

  // ── DELETE /mcp  (client explicitly terminates session) ──
  app.delete("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && sessions.has(sessionId)) {
      const transport = sessions.get(sessionId)!;
      await transport.close();
      sessions.delete(sessionId);
      console.error(`[MCP] Session deleted: ${sessionId}`);
      res.status(200).json({ message: "Session terminated." });
    } else {
      res.status(404).json({ error: "Session not found." });
    }
  });

  // ── Health check ──
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      transport: "streamable-http",
      stateless: STATELESS,
      activeSessions: sessions.size,
      server: "veeam-vbr-mcp v2.0.0",
      mcpEndpoint: `http://localhost:${HTTP_PORT}/mcp`,
    });
  });

  // ── 404 fallback ──
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found. MCP endpoint is POST /mcp" });
  });

  app.listen(HTTP_PORT, "0.0.0.0", () => {
    console.error(`[MCP] Streamable HTTP server listening on http://0.0.0.0:${HTTP_PORT}`);
    console.error(`[MCP]   MCP endpoint : POST http://localhost:${HTTP_PORT}/mcp`);
    console.error(`[MCP]   SSE stream   : GET  http://localhost:${HTTP_PORT}/mcp  (with Mcp-Session-Id)`);
    console.error(`[MCP]   Session end  : DELETE http://localhost:${HTTP_PORT}/mcp (with Mcp-Session-Id)`);
    console.error(`[MCP]   Health       : GET  http://localhost:${HTTP_PORT}/health`);
    console.error(`[MCP] → Configure Dify with URL: http://<your-host>:${HTTP_PORT}/mcp`);
  });
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────
(async () => {
  try {
    if (MODE === "stdio") {
      await startStdio();
    } else {
      // "streamable-http", "sse", "http" → all use Streamable HTTP
      await startStreamableHTTP();
    }
  } catch (error) {
    console.error("[MCP] Fatal startup error:", error);
    process.exit(1);
  }
})();
