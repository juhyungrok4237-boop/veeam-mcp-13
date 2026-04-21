/**
 * Entry point: Veeam VBR MCP Server
 *
 * Supports two transport modes:
 *   1. stdio            - for Claude Desktop / Cursor (default)
 *   2. streamable-http  - for Dify, cloud AI agents (replaces deprecated SSE mode)
 *
 * The "streamable-http" mode implements the MCP 2025-03-26 Streamable HTTP spec,
 * which is the current standard required by Dify and modern MCP clients.
 *
 * Environment variables:
 *   MCP_TRANSPORT_MODE  = "stdio" (default) | "streamable-http"
 *   MCP_HTTP_PORT       = HTTP listen port (default: 3000)
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
import cors from "cors";
import { createMcpServer } from "./server.js";

const MODE = (process.env.MCP_TRANSPORT_MODE ?? "stdio").toLowerCase();
const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT ?? "3000", 10);

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
// ─────────────────────────────────────────────
async function startStreamableHTTP(): Promise<void> {
  console.error(`[MCP] Starting Streamable HTTP mode on port ${HTTP_PORT} (stateless multi-client)...`);

  const app = express();
  
  // Enable CORS
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "mcp-session-id", "Last-Event-ID", "mcp-protocol-version"],
    exposedHeaders: ["mcp-session-id", "mcp-protocol-version"]
  }));
  
  app.use(express.json());

  // ----------------------------------------------------------------------
  // STATELESS MODE (Required for multiple clients like Dify)
  // Every request gets a fresh transport + server instantiation.
  // This prevents "Server already initialized" 400 errors.
  // ----------------------------------------------------------------------
  app.all("/mcp", async (req: Request, res: Response) => {
    const statelessTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Enforce stateless behavior
    });
    const server = createMcpServer();
    await server.connect(statelessTransport);
    
    // Process single request and close implicitly
    await statelessTransport.handleRequest(req, res, req.body);
  });

  // ── Health check ──
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      transport: "streamable-http",
      stateless: true,
      server: "veeam-vbr-mcp v2.0.0",
      mcpEndpoint: `http://localhost:${HTTP_PORT}/mcp`,
    });
  });

  // ── 404 fallback ──
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found. MCP endpoint is /mcp (GET/POST)" });
  });

  app.listen(HTTP_PORT, "0.0.0.0", () => {
    console.error(`[MCP] Streamable HTTP server listening on http://0.0.0.0:${HTTP_PORT}`);
    console.error(`[MCP]   MCP endpoint : /mcp`);
    console.error(`[MCP]   Health       : /health`);
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
      await startStreamableHTTP();
    }
  } catch (error) {
    console.error("[MCP] Fatal startup error:", error);
    process.exit(1);
  }
})();
