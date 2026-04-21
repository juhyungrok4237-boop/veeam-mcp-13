/**
 * Tools: Failover, Failback, Replicas, Agents, Automation, Log Export
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const failoverTools: ToolDefinition[] = [
  {
    name: "ViVMSnapshotReplicaFailover",
    description: "Start failover for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failover/failoverNow/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViVMSnapshotReplicaPlannedFailover",
    description: "Start planned failover for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failover/plannedFailover/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViVMSnapshotReplicaPermanentFailover",
    description: "Start permanent failover for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failover/permanentFailover/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViVMSnapshotReplicaUndoFailover",
    description: "Undo failover for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failover/undoFailover/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const failbackTools: ToolDefinition[] = [
  {
    name: "ViVMSnapshotReplicaFailback",
    description: "Start failback for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failback/failbackToProduction/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViVMSnapshotReplicaSwitchToProduction",
    description: "Switch over to production after failback.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failback/switchToProduction/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeReplicaFailbackSwitchoverTime",
    description: "Change switchover time for replica failback.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failback/changeSwitchoverTime/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViVMSnapshotReplicaCommitFailback",
    description: "Commit failback for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failback/commitFailback/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViVMSnapshotReplicaUndoFailback",
    description: "Undo failback for a VMware vSphere snapshot replica.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/failback/undoFailback/vSphere/snapshot", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const replicaTools: ToolDefinition[] = [
  {
    name: "GetAllReplicas",
    description: "Get all VMware vSphere snapshot replicas.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/replicas", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetReplica",
    description: "Get a specific replica by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/replicas/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RescanReplica",
    description: "Rescan all replicas.",
    inputSchema: { type: "object", properties: { body: { type: "object" } } },
    handler: async (args) => { try { return ok((await api().post("/replicas/rescan", args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetObjectReplicaRestorePoints",
    description: "Get all restore points for a specific replica.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/replicas/${args.id}/replicaPoints`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetObjectReplicaRestorePointInReplica",
    description: "Get a specific restore point within a replica.",
    inputSchema: { type: "object", properties: { replicaId: { type: "string" }, id: { type: "string" } }, required: ["replicaId", "id"] },
    handler: async (args) => { try { return ok((await api().get(`/replicas/${args.replicaId}/replicaPoints/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllObjectReplicaRestorePoints",
    description: "Get all replica restore points across all replicas.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/replicaPoints", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetObjectReplicaRestorePoint",
    description: "Get a specific replica restore point by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/replicaPoints/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const agentTools: ToolDefinition[] = [
  {
    name: "GetAllComputerRecoveryTokens",
    description: "Get all recovery tokens for bare metal recovery.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/agents/recoveryTokens", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateComputerRecoveryToken",
    description: "Create a recovery token for a protected computer.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/agents/recoveryTokens", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetComputerRecoveryToken",
    description: "Get a specific recovery token by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/agents/recoveryTokens/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateComputerRecoveryToken",
    description: "Edit a recovery token.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/agents/recoveryTokens/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteComputerRecoveryToken",
    description: "Delete a recovery token.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/agents/recoveryTokens/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetProtectedComputers",
    description: "Get all protected Linux computers.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/agents/protectedComputers", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetProtectedComputer",
    description: "Get a specific protected Linux computer by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/agents/protectedComputers/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllProtectionGroups",
    description: "Get all protection groups.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/agents/protectionGroups", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateProtectionGroup",
    description: "Add a new protection group.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/agents/protectionGroups", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetProtectionGroup",
    description: "Get a specific protection group by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/agents/protectionGroups/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateProtectionGroup",
    description: "Edit a protection group.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/agents/protectionGroups/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteProtectionGroup",
    description: "Remove a protection group.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/agents/protectionGroups/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RescanProtectionGroup",
    description: "Rescan a protection group to discover new machines.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/agents/protectionGroups/${args.id}/rescan`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EnableProtectionGroup",
    description: "Enable a protection group.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/agents/protectionGroups/${args.id}/enable`)).data ?? "Enabled."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DisableProtectionGroup",
    description: "Disable a protection group.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/agents/protectionGroups/${args.id}/disable`)).data ?? "Disabled."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetDiscoveredEntities",
    description: "Get computers discovered by a protection group.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/agents/protectionGroups/${args.id}/discoveredEntities`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetDiscoveredEntity",
    description: "Get a specific discovered entity by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, entityId: { type: "string" } }, required: ["id", "entityId"] },
    handler: async (args) => { try { return ok((await api().get(`/agents/protectionGroups/${args.id}/discoveredEntities/${args.entityId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstallAgentOnDiscoveredEntities",
    description: "Install Veeam Agent on discovered entities.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/agents/protectionGroups/${args.id}/discoveredEntities/installAgent`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UninstallAgentFromDiscoveredEntities",
    description: "Uninstall Veeam Agent from discovered entities.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/agents/protectionGroups/${args.id}/discoveredEntities/uninstallAgent`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpgradeAgentOnDiscoveredEntities",
    description: "Upgrade Veeam Agent on discovered entities.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/agents/protectionGroups/${args.id}/discoveredEntities/upgradeAgent`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllAgentPackages",
    description: "Get available Linux agent packages.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/agents/packages/linux", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllAgentPackagesForUnix",
    description: "Get available Unix agent packages.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/agents/packages/unix", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const automationTools: ToolDefinition[] = [
  {
    name: "ImportJobs",
    description: "Import jobs from a JSON specification.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/jobs/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportJobs",
    description: "Export jobs to a JSON specification.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/jobs/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ImportCredentials",
    description: "Import credentials records.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/credentials/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportCredentials",
    description: "Export credentials records.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/credentials/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ImportCloudCredentials",
    description: "Import cloud credentials records.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/cloudcredentials/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportCloudCredentials",
    description: "Export cloud credentials records.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/cloudcredentials/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ImportProxies",
    description: "Import backup proxy configurations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/proxies/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportProxies",
    description: "Export backup proxy configurations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/proxies/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ImportManagedServers",
    description: "Import managed server configurations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/managedServers/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportManagedServers",
    description: "Export managed server configurations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/managedServers/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ImportRepositories",
    description: "Import repository configurations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/repositories/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportRepositories",
    description: "Export repository configurations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/repositories/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ImportEncryptionPasswords",
    description: "Import encryption passwords.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/encryptionPasswords/import", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ExportEncryptionPasswords",
    description: "Export encryption passwords.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/automation/encryptionPasswords/export", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllAutomationSessions",
    description: "Get all automation import/export sessions.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/automation/sessions", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAutomationSession",
    description: "Get a specific automation session by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/automation/sessions/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAutomationSessionLogs",
    description: "Get logs for a specific automation session.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/automation/sessions/${args.id}/logs`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopAutomationSession",
    description: "Stop a running automation session.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/automation/sessions/${args.id}/stop`)).data ?? "Stopped."); } catch (e) { return err(toErrMsg(e)); } },
  },
];
