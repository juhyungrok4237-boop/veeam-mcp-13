/**
 * Tools: Service & Services
 * GET /api/v1/serverTime  /api/v1/serverCertificate  /api/v1/serverInfo  /api/v1/registerVbr  /api/v1/services
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

export const serviceTools: ToolDefinition[] = [
  {
    name: "GetServerTime",
    description: "Get the current date and time on the Veeam Backup server. Does not require authentication.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      try {
        const res = await getVeeamClient().api.get("/serverTime");
        return ok(res.data);
      } catch (e) { return err(toErrMsg(e)); }
    },
  },
  {
    name: "GetServerCertificate",
    description: "Get the TLS certificate of the Veeam Backup server.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      try {
        const res = await getVeeamClient().api.get("/serverCertificate");
        return ok(res.data);
      } catch (e) { return err(toErrMsg(e)); }
    },
  },
  {
    name: "GetServerInfo",
    description: "Get the Veeam Backup & Replication installation ID, server name, build number, and patches.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => {
      try {
        const res = await getVeeamClient().api.get("/serverInfo");
        return ok(res.data);
      } catch (e) { return err(toErrMsg(e)); }
    },
  },
  {
    name: "RegisterVbr",
    description: "Register the backup server on My Account Portal.",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "RegisterVbrSpec JSON body." },
      },
      required: ["body"],
    },
    handler: async (args) => {
      try {
        const res = await getVeeamClient().api.post("/registerVbr", args.body);
        return ok(res.data);
      } catch (e) { return err(toErrMsg(e)); }
    },
  },
  {
    name: "GetAllServices",
    description: "Get all associated backend services for integration with Veeam Backup & Replication.",
    inputSchema: {
      type: "object",
      properties: {
        skip: { type: "number", description: "Number of services to skip." },
        limit: { type: "number", description: "Max number of services to return (default 200)." },
        orderColumn: { type: "string", description: "Column to sort by." },
        orderAsc: { type: "boolean", description: "Sort ascending." },
        nameFilter: { type: "string", description: "Filter by name pattern." },
      },
    },
    handler: async (args) => {
      try {
        const res = await getVeeamClient().api.get("/services", { params: args });
        return ok(res.data);
      } catch (e) { return err(toErrMsg(e)); }
    },
  },
];
