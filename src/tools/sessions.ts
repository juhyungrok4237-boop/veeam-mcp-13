/**
 * Tools: Sessions & Task Sessions
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const sessionTools: ToolDefinition[] = [
  {
    name: "GetAllSessions",
    description: "Get all backup/restore sessions with status, progress and result. Use this to check SLA and job health.",
    inputSchema: {
      type: "object",
      properties: {
        skip: { type: "number" }, limit: { type: "number" },
        orderColumn: { type: "string" }, orderAsc: { type: "boolean" },
        typeFilter: { type: "string" }, stateFilter: { type: "string" },
        resultFilter: { type: "string" }, nameFilter: { type: "string" },
        createdAfterFilter: { type: "string", description: "ISO 8601 datetime." },
        createdBeforeFilter: { type: "string", description: "ISO 8601 datetime." },
        endedAfterFilter: { type: "string" }, endedBeforeFilter: { type: "string" },
        jobIdFilter: { type: "string" },
      },
    },
    handler: async (args) => { try { return ok((await api().get("/sessions", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetSession",
    description: "Get details for a specific session by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/sessions/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetSessionLogs",
    description: "Get the log entries for a specific session.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/sessions/${args.id}/logs`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopSession",
    description: "Stop a running session.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/sessions/${args.id}/stop`)).data ?? "Stop requested."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetSessionTaskSessionsWithFiltering",
    description: "Get task sessions for a specific session.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/sessions/${args.id}/taskSessions`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllTaskSessions",
    description: "Get all task sessions across all sessions.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, stateFilter: { type: "string" }, resultFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/taskSessions", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetTaskSession",
    description: "Get a specific task session by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/taskSessions/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetTaskSessionLogs",
    description: "Get the log entries for a specific task session.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/taskSessions/${args.id}/logs`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
