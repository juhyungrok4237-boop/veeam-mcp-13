/**
 * Tools: License
 * 16 operations covering VBR license install, remove, renew, instance/socket/capacity management.
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const licenseTools: ToolDefinition[] = [
  {
    name: "InstallLicense",
    description: "Install a license on the Veeam Backup server.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "LicenseInstallationSpec." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/license/install", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetInstalledLicense",
    description: "Get the installed license information on the Veeam Backup server.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/license")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RemoveLicense",
    description: "Remove a license from the Veeam Backup server.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "LicenseRemoveSpec." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/license/remove", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateLicenseReport",
    description: "Create a license usage report for the backup server.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "LicenseCreateReportSpec." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/license/createReport", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RenewInstalledLicense",
    description: "Renew the installed license on the Veeam Backup server.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "LicenseRenewSpec." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/license/renew", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetLicensedSockets",
    description: "Get information about socket license consumption.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/license/sockets", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RevokeSocketLicense",
    description: "Revoke a socket license from a specific host.",
    inputSchema: { type: "object", properties: { hostId: { type: "string", description: "Host ID." } }, required: ["hostId"] },
    handler: async (args) => { try { return ok((await api().post(`/license/sockets/${args.hostId}/revoke`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetLicensedInstances",
    description: "Get instance license consumption details.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/license/instances", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "AssignInstanceLicense",
    description: "Assign an instance license to a workload.",
    inputSchema: { type: "object", properties: { instanceId: { type: "string" } }, required: ["instanceId"] },
    handler: async (args) => { try { return ok((await api().post(`/license/instances/${args.instanceId}/assign`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RevokeInstanceLicense",
    description: "Revoke an instance license from a workload.",
    inputSchema: { type: "object", properties: { instanceId: { type: "string" } }, required: ["instanceId"] },
    handler: async (args) => { try { return ok((await api().post(`/license/instances/${args.instanceId}/revoke`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RemoveInstanceLicense",
    description: "Remove an instance license record.",
    inputSchema: { type: "object", properties: { instanceId: { type: "string" } }, required: ["instanceId"] },
    handler: async (args) => { try { return ok((await api().post(`/license/instances/${args.instanceId}/remove`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetLicensedCapacity",
    description: "Get capacity license consumption details.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/license/capacity", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RevokeCapacityLicense",
    description: "Revoke a capacity license from an unstructured data workload.",
    inputSchema: { type: "object", properties: { instanceId: { type: "string" } }, required: ["instanceId"] },
    handler: async (args) => { try { return ok((await api().post(`/license/capacity/${args.instanceId}/revoke`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateLicense",
    description: "Update the Veeam license.",
    inputSchema: { type: "object", properties: { body: { type: "object" } } },
    handler: async (args) => { try { return ok((await api().post("/license/update", args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "SetAutoUpdate",
    description: "Enable or disable automatic license auto-update.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "Auto update enabled spec." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/license/autoupdate", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "SetAgentConsumption",
    description: "Enable or disable instance consumption for unlicensed agents.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/license/agentConsumption", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
