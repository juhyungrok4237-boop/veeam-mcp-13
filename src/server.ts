/**
 * MCP Server setup - registers all tools and creates the server instance.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - SDK McpServer type overloads
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { allTools, toolHandlerMap } from "./tools/index.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "veeam-vbr-mcp",
    version: "2.0.0",
  });

  // Register each tool from the aggregated array
  for (const tool of allTools) {
    const zodShape = buildZodShape(tool.inputSchema);

    // Capture tool.name in closure to avoid the loop variable reference issue
    const toolName = tool.name;

    (server as any).tool(
      toolName,
      tool.description,
      zodShape,
      async (args: Record<string, unknown>) => {
        const handler = toolHandlerMap.get(toolName);
        if (!handler) {
          return {
            content: [{ type: "text" as const, text: `Tool ${toolName} has no handler registered.` }],
            isError: true,
          };
        }
        const result = await handler(args);
        return {
          content: result.content,
          isError: result.isError,
        };
      }
    );
  }

  return server;
}

/**
 * Build a Zod shape from a JSON-schema-like inputSchema definition.
 * This is a lightweight converter that supports the patterns used in our tool modules.
 */
function buildZodShape(inputSchema: object): Record<string, z.ZodTypeAny> {
  const schema = inputSchema as {
    properties?: Record<string, { type?: string; description?: string }>;
    required?: string[];
  };
  const properties = schema.properties ?? {};
  const required: string[] = schema.required ?? [];

  const zodShape: Record<string, z.ZodTypeAny> = {};

  for (const [key, def] of Object.entries(properties)) {
    let fieldSchema: z.ZodTypeAny;

    switch (def.type) {
      case "number":
        fieldSchema = z.number();
        break;
      case "boolean":
        fieldSchema = z.boolean();
        break;
      case "object":
        fieldSchema = z.record(z.string(), z.unknown());
        break;
      case "array":
        fieldSchema = z.array(z.unknown());
        break;
      default:
        fieldSchema = z.string();
        break;
    }

    // Fields not in "required" list are optional
    if (!required.includes(key)) {
      fieldSchema = fieldSchema.optional();
    }

    zodShape[key] = fieldSchema;
  }

  return zodShape;
}
