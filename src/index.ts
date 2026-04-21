/**
 * Entry point: Veeam VBR MCP Server
 * Supports both stdio and HTTP (SSE) transport modes.
 * 
 * Environment variables:
 *   MCP_TRANSPORT_MODE  = "stdio" (default) | "sse"
 *   MCP_HTTP_PORT       = HTTP port when using SSE mode (default: 3000)
 *   VEEAM_SERVER        = https://<hostname | IP>
 *   VEEAM_PORT          = 9419
 *   VEEAM_USERNAME      = admin username
 *   VEEAM_PASSWORD      = admin password
 *   NODE_TLS_REJECT_UNAUTHORIZED = 0  (for self-signed certificates)
 */

import * as dotenv from "dotenv";
dotenv.config();

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { createMcpServer } from "./server.js";

const MODE = (process.env.MCP_TRANSPORT_MODE ?? "stdio").toLowerCase();
const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT ?? "3000", 10);

async function startStdio(): Promise<void> {
  console.error("[MCP] Starting in stdio mode...");
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP] Server connected via stdio. Ready for requests.");
}

async function startSSE(): Promise<void> {
  console.error(`[MCP] Starting HTTP/SSE mode on port ${HTTP_PORT}...`);
  const app = express();
  app.use(express.json());

  // Transport sessions map for multiple concurrent SSE connections
  const transports = new Map<string, SSEServerTransport>();

  app.get("/sse", async (_req, res) => {
    console.error("[MCP] New SSE connection established.");
    // Each SSE connection gets its own MCP server instance to avoid shared state issues
    const server = createMcpServer();
    const transport = new SSEServerTransport("/messages", res);
    transports.set(transport.sessionId, transport);
    await server.connect(transport);

    res.on("close", () => {
      console.error(`[MCP] SSE connection closed: ${transport.sessionId}`);
      transports.delete(transport.sessionId);
    });
  });

  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: `Session ${sessionId} not found.` });
      return;
    }
    await transport.handlePostMessage(req, res);
  });

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: "sse",
      activeSessions: transports.size,
      server: "veeam-vbr-mcp v2.0.0",
    });
  });

  app.listen(HTTP_PORT, () => {
    console.error(`[MCP] HTTP server listening on http://0.0.0.0:${HTTP_PORT}`);
    console.error(`[MCP]   SSE endpoint : GET  http://localhost:${HTTP_PORT}/sse`);
    console.error(`[MCP]   Messages     : POST http://localhost:${HTTP_PORT}/messages?sessionId=<id>`);
    console.error(`[MCP]   Health       : GET  http://localhost:${HTTP_PORT}/health`);
  });
}

// Entry point
(async () => {
  try {
    if (MODE === "sse" || MODE === "http") {
      await startSSE();
    } else {
      await startStdio();
    }
  } catch (error) {
    console.error("[MCP] Fatal startup error:", error);
    process.exit(1);
  }
})();
