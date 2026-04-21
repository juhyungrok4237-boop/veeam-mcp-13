/**
 * Tools: General Options, Traffic Rules, Configuration Backup, Connection, Deployment
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const generalOptionTools: ToolDefinition[] = [
  {
    name: "GetGeneralOptions",
    description: "Get general options/settings of Veeam Backup & Replication.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/generalOptions")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateGeneralOptions",
    description: "Edit general options/settings of Veeam Backup & Replication.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/generalOptions", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetEmailSettings",
    description: "Get email notification settings.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/generalOptions/emailSettings")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateEmailSettings",
    description: "Edit email notification settings.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/generalOptions/emailSettings", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "SendTestEmailMessage",
    description: "Send a test email to verify email settings.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().post("/generalOptions/emailSettings/testMessage")).data ?? "Test email sent."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetNotificationsSettings",
    description: "Get notification settings (on-screen alerts, etc.).",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/generalOptions/notifications")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateNotificationsSettings",
    description: "Edit notification settings.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/generalOptions/notifications", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetEventForwardingSettings",
    description: "Get event forwarding settings (SNMP, syslog, etc.).",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/generalOptions/eventForwarding")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateEventForwardingSettings",
    description: "Edit event forwarding settings.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/generalOptions/eventForwarding", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetStorageLatencySettings",
    description: "Get storage latency control settings.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/generalOptions/storageLatency")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateStorageLatencySettings",
    description: "Edit storage latency control settings.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/generalOptions/storageLatency", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "AddDatastoreLatency",
    description: "Add latency settings for a specific datastore.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/generalOptions/storageLatency/datastores", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetDatastoreLatencySettings",
    description: "Get latency settings for a specific datastore.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/generalOptions/storageLatency/datastores/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateDatastoreLatencySettings",
    description: "Edit latency settings for a specific datastore.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/generalOptions/storageLatency/datastores/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteDatastoreLatencySettings",
    description: "Remove latency settings for a specific datastore.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/generalOptions/storageLatency/datastores/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const trafficRuleTools: ToolDefinition[] = [
  {
    name: "GetAllTrafficRules",
    description: "Get all network traffic rules configured on the Veeam Backup server.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/trafficRules")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateTrafficRules",
    description: "Edit network traffic rules.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/trafficRules", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const configBackupTools: ToolDefinition[] = [
  {
    name: "GetConfigBackupOptions",
    description: "Get configuration backup settings (schedule, repository, encryption).",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/configBackup")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateConfigBackupOptions",
    description: "Edit configuration backup settings.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/configBackup", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartConfigBackup",
    description: "Start an immediate configuration backup.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().post("/configBackup/backup")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const connectionTools: ToolDefinition[] = [
  {
    name: "GetConnectionCertificate",
    description: "Request a TLS certificate or SSH fingerprint from a server to verify its identity before adding.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "ConnectionCertificateSpec with host info." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/connectionCertificate", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const deploymentTools: ToolDefinition[] = [
  {
    name: "CreateDeploymentKit",
    description: "Generate a deployment kit package for adding Windows machines as managed servers.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/deployment/generateKit", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DownloadDeploymentKit",
    description: "Download a generated deployment kit package.",
    inputSchema: { type: "object", properties: { taskId: { type: "string" } }, required: ["taskId"] },
    handler: async (args) => { try { return ok(`Download URL: ${getVeeamClient().api.defaults.baseURL}/deployment/${args.taskId}/downloadKit (requires direct HTTP access)`); } catch (e) { return err(toErrMsg(e)); } },
  },
];
