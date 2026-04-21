/**
 * Tools: Jobs
 * 15 operations covering job CRUD, start/stop/retry/enable/disable, and quick backup.
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const jobTools: ToolDefinition[] = [
  {
    name: "GetAllJobs",
    description: "Get all backup, replication, and copy jobs configured on the Veeam Backup server.",
    inputSchema: {
      type: "object",
      properties: {
        skip: { type: "number" }, limit: { type: "number" },
        orderColumn: { type: "string" }, orderAsc: { type: "boolean" },
        nameFilter: { type: "string" }, typeFilter: { type: "string" },
        viHostNameFilter: { type: "string" }, lastResultFilter: { type: "string" },
        isDisabledFilter: { type: "boolean" },
      },
    },
    handler: async (args) => { try { return ok((await api().get("/jobs", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateJob",
    description: "Create a new backup, replication, or copy job on the Veeam Backup server.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "Job specification JSON." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/jobs", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllJobsStates",
    description: "Get the current real-time state (running, idle, warning, etc.) for all jobs.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, stateFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/jobs/states", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetJob",
    description: "Get a specific job configuration by its ID.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Job ID (UUID)." } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/jobs/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateJob",
    description: "Edit/update an existing job configuration.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object", description: "Updated job spec." } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/jobs/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteJob",
    description: "Delete a job from the Veeam Backup server.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/jobs/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartJob",
    description: "Start/run a specific job immediately. Returns a session ID to track progress.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Job ID to start." },
        body: { type: "object", description: "Optional: run mode or specific objects to backup." },
      },
      required: ["id"],
    },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/start`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopJob",
    description: "Stop a currently running job.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/stop`)).data ?? "Stop requested."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RetryJob",
    description: "Retry a failed job.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/retry`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DisableJob",
    description: "Disable a job (prevents scheduled execution).",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/disable`)).data ?? "Disabled."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EnableJob",
    description: "Enable a previously disabled job.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/enable`)).data ?? "Enabled."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "applyAgentPolicyConfiguration",
    description: "Apply backup policy configuration to all computers managed by the policy (agent jobs only).",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/applyConfiguration`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "clearAgentPolicyCache",
    description: "Clear the backup cache for an agent backup policy.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/clearCache`)).data ?? "Cache cleared."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CloneJob",
    description: "Clone an existing job to create a duplicate with a new name.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object", description: "CloneJobSpec with new job name." } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/jobs/${args.id}/clone`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartVSphereQuickBackupJob",
    description: "Start a quick backup for VMware vSphere VMs without creating a full job.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "QuickBackupSpec with VM references." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/jobs/quickBackup/vSphere", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
