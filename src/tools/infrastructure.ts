/**
 * Tools: Infrastructure - Managed Servers, Repositories, Mount Servers, Proxies, WAN Accelerators
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const managedServerTools: ToolDefinition[] = [
  {
    name: "GetAllManagedServers",
    description: "Get all managed servers (Windows, Linux, VMware ESXi, Hyper-V) in the backup infrastructure.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, typeFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/managedServers", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateManagedServer",
    description: "Add a new server to the backup infrastructure.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/managedServers", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ResolveCloudDirectorHosts",
    description: "Get vCenter Servers attached to a VMware Cloud Director server.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/managedServers/cloudDirectorHosts", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ResolveHyperVHosts",
    description: "Get Microsoft Hyper-V servers managed by a Hyper-V cluster or SCVMM server.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/managedServers/hyperVHosts", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetManagedServer",
    description: "Get details of a specific managed server by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/managedServers/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateManagedServer",
    description: "Edit the configuration of a managed server.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/backupInfrastructure/managedServers/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteManagedServer",
    description: "Remove a server from the backup infrastructure.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/backupInfrastructure/managedServers/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateSingleUseCredentials",
    description: "Change a managed server to use single-use credentials.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/managedServers/${args.id}/updateSingleUseCredentials`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetManagedServerVolume",
    description: "Get volumes for a Microsoft Hyper-V standalone server.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/managedServers/${args.id}/volumes`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateVolume",
    description: "Edit volumes on a Microsoft Hyper-V standalone server.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/backupInfrastructure/managedServers/${args.id}/volumes`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RescanAllManagedServers",
    description: "Rescan all managed servers to refresh their configuration.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().post("/backupInfrastructure/managedServers/rescan")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RescanManagedServer",
    description: "Rescan a specific managed server.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/managedServers/${args.id}/rescan`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetHostOptionalComponentsDefaults",
    description: "Get the default set of optional managed server components.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/backupInfrastructure/managedServers/optionalComponents/defaults")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateServerComponents",
    description: "Update managed server components (agents, drivers).",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/managedServers/updateComponents", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const repositoryTools: ToolDefinition[] = [
  {
    name: "GetAllRepositories",
    description: "Get all backup repositories (local disk, NAS, object storage, cloud vault).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, typeFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/repositories", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateRepository",
    description: "Add a new backup repository.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/repositories", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RescanRepositories",
    description: "Rescan all repositories to refresh their state and capacity.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().post("/backupInfrastructure/repositories/rescan")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllRepositoriesStates",
    description: "Get the current state and capacity (total/free space) of all repositories. Essential for capacity monitoring.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/repositories/states", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetRepository",
    description: "Get a specific repository by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/repositories/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateRepository",
    description: "Edit a backup repository configuration.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/backupInfrastructure/repositories/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteRepository",
    description: "Remove a backup repository.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/backupInfrastructure/repositories/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllScaleOutRepositories",
    description: "Get all Scale-Out Backup Repositories (SOBR).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/scaleOutRepositories", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateScaleOutRepository",
    description: "Add a new Scale-Out Backup Repository.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/scaleOutRepositories", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetScaleOutRepository",
    description: "Get a specific SOBR by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/scaleOutRepositories/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateScaleOutRepository",
    description: "Edit a Scale-Out Backup Repository.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/backupInfrastructure/scaleOutRepositories/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteScaleOutRepository",
    description: "Remove a Scale-Out Backup Repository.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/backupInfrastructure/scaleOutRepositories/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EnableScaleOutExtentSealedMode",
    description: "Enable sealed mode on a SOBR extent.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/scaleOutRepositories/${args.id}/enableSealedMode`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DisableScaleOutExtentSealedMode",
    description: "Disable sealed mode on a SOBR extent.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/scaleOutRepositories/${args.id}/disableSealedMode`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EnableScaleOutExtentMaintenanceMode",
    description: "Enable maintenance mode on a SOBR extent.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/scaleOutRepositories/${args.id}/enableMaintenanceMode`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DisableScaleOutExtentMaintenanceMode",
    description: "Disable maintenance mode on a SOBR extent.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/scaleOutRepositories/${args.id}/disableMaintenanceMode`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const proxyTools: ToolDefinition[] = [
  {
    name: "GetAllProxies",
    description: "Get all backup proxies (VMware, Hyper-V, general-purpose).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, typeFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/proxies", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateProxy",
    description: "Add a new backup proxy.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/proxies", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetProxy",
    description: "Get a specific backup proxy by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/proxies/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateProxy",
    description: "Edit a backup proxy configuration.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/backupInfrastructure/proxies/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteProxy",
    description: "Remove a backup proxy.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/backupInfrastructure/proxies/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EnableProxy",
    description: "Enable a backup proxy for use in backup jobs.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/proxies/${args.id}/enable`)).data ?? "Enabled."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DisableProxy",
    description: "Disable a backup proxy.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/proxies/${args.id}/disable`)).data ?? "Disabled."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllProxiesStates",
    description: "Get the current state of all backup proxies.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/proxies/states", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const mountServerTools: ToolDefinition[] = [
  {
    name: "GetAllMountServers",
    description: "Get all mount servers used for file restore and instant recovery operations.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/mountServers", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "SetupMountServer",
    description: "Add a new mount server.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backupInfrastructure/mountServers", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetMountServer",
    description: "Get a specific mount server by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/mountServers/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateMountServer",
    description: "Update a mount server configuration.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/backupInfrastructure/mountServers/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetDefaultMountServer",
    description: "Get the default mount server.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/backupInfrastructure/mountServers/default")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "SetAsDefaultMountServer",
    description: "Set a specific mount server as the default.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backupInfrastructure/mountServers/${args.id}/default`)).data ?? "Set as default."); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const wanAcceleratorTools: ToolDefinition[] = [
  {
    name: "GetAllWANAccelerators",
    description: "Get all WAN accelerators configured in the backup infrastructure.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/backupInfrastructure/wanAccelerators", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetWANAccelerator",
    description: "Get a specific WAN accelerator by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupInfrastructure/wanAccelerators/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
