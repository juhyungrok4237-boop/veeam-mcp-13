/**
 * Shared TypeScript types for Veeam MCP Server
 */

export interface VeeamClientConfig {
  serverUrl: string;
  username: string;
  password: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: object;
  handler: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<ToolResult>;

/** Helper: wrap any data as a successful tool result */
export function ok(data: unknown): ToolResult {
  return {
    content: [{ type: "text", text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }],
  };
}

/** Helper: wrap an error message as a failed tool result */
export function err(message: string): ToolResult {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

/** Helper: convert axios/unknown errors to a human-readable message */
export function toErrMsg(e: unknown): string {
  if (e instanceof Error) {
    const ax = e as any;
    const status = ax.response?.status;
    const detail = ax.response?.data?.message ?? ax.response?.data ?? ax.message;
    const msg = typeof detail === "string" ? detail : JSON.stringify(detail);
    return status ? `[HTTP ${status}] ${msg}` : msg;
  }
  return String(e);
}
