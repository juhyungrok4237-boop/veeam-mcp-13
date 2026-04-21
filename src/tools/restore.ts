/**
 * Tools: Restore Operations (34 operations)
 * Covers: VMware IR, Hyper-V IR, Azure IR, Entire VM, FCD, File Restore, Entra ID restore
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const restoreTools: ToolDefinition[] = [
  // Unstructured Data Restore
  {
    name: "EntireUnstructuredDataShareRestore",
    description: "Restore an entire file share to the original or another location.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/unstructuredData/fileShare", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EntireUnstructuredDataOSRestore",
    description: "Restore an entire object storage bucket or container.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/unstructuredData/objectStorage", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // File Share Instant Recovery
  {
    name: "GetAllInstantUnstructuredDataRecoveryMounts",
    description: "Get all active instant file share recovery mount points.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/restore/instantRecovery/unstructuredData", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantUnstructuredDataRecoveryMount",
    description: "Start Instant File Share Recovery - mount a file share backup.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/instantRecovery/unstructuredData", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetInstantUnstructuredDataRecoveryMount",
    description: "Get a specific instant file share recovery mount point.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/unstructuredData/${args.mountId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantUnstructuredDataRecoveryUnmount",
    description: "Stop file share publishing (unmount).",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/unstructuredData/${args.mountId}/unmount`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantUnstructuredDataRecoveryMigrate",
    description: "Start file share migration to the original or another location.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/unstructuredData/${args.mountId}/migrate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantUnstructuredDataShareSwitchover",
    description: "Start file share switchover.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/unstructuredData/${args.mountId}/switchover`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetUnstructuredDataShareIRSwitchoverSettings",
    description: "Get file share switchover settings.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/unstructuredData/${args.mountId}/switchoverSettings`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateUnstructuredDataShareIRSwitchoverSettings",
    description: "Update file share switchover settings.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/restore/instantRecovery/unstructuredData/${args.mountId}/switchoverSettings`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartUnstructuredDataFlrMount",
    description: "Start a file-level restore session from an unstructured data backup.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/flr/unstructuredData", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopUnstructuredDataFLRMount",
    description: "Unmount unstructured data FLR volumes.",
    inputSchema: { type: "object", properties: { sessionId: { type: "string" }, body: { type: "object" } }, required: ["sessionId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/unstructuredData/${args.sessionId}/unmount`, args.body ?? {})).data ?? "Unmounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  // VMware vSphere Instant Recovery
  {
    name: "GetAllInstantViVMRecoveryMounts",
    description: "Get all active instant recovery mount points for VMware vSphere VMs.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/restore/instantRecovery/vSphere/vm", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantViVMRecoveryMount",
    description: "Start Instant Recovery of a VMware vSphere VM.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/instantRecovery/vSphere/vm", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetInstantViVMRecoveryMount",
    description: "Get a specific VMware VM instant recovery mount point.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/vSphere/vm/${args.mountId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantViVMRecoveryUnmount",
    description: "Stop publishing a VMware vSphere VM (unmount).",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/vSphere/vm/${args.mountId}/unmount`, args.body ?? {})).data ?? "Unmounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantViVMRecoveryMigrate",
    description: "Start finalizing/migrating an instant-recovered VMware vSphere VM.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/vSphere/vm/${args.mountId}/migrate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // Hyper-V Instant Recovery
  {
    name: "GetAllInstantHvVMRecoveryMounts",
    description: "Get all active instant recovery mount points for Microsoft Hyper-V VMs.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/restore/instantRecovery/hyperV/vm", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantHvVMRecoveryMount",
    description: "Start Instant Recovery of a Microsoft Hyper-V VM.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/instantRecovery/hyperV/vm", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetInstantHvVMRecoveryMount",
    description: "Get a specific Hyper-V VM instant recovery mount point.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/hyperV/vm/${args.mountId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantHvVMRecoveryUnmount",
    description: "Stop publishing a Hyper-V VM (unmount).",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/hyperV/vm/${args.mountId}/unmount`, args.body ?? {})).data ?? "Unmounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantHvVMRecoveryMigrate",
    description: "Start migrating a Hyper-V instant recovery VM.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/hyperV/vm/${args.mountId}/migrate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // Azure Instant Recovery
  {
    name: "GetAllAzureInstantVMRecoveryMounts",
    description: "Get all active instant recovery mount points for Azure VMs.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/restore/instantRecovery/azure/vm", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "AzureInstantVMRecoveryMount",
    description: "Start Instant Recovery to Microsoft Azure.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/instantRecovery/azure/vm", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAzureInstantVMRecoveryMount",
    description: "Get a specific Azure instant recovery mount point.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/azure/vm/${args.mountId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllAzureInstantVMRecoveryMountSessions",
    description: "Get all mount sessions for Azure instant recovery.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/azure/vm/${args.mountId}/sessions`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "AzureInstantVMRecoveryUnmount",
    description: "Stop publishing a machine to Azure (unmount).",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/azure/vm/${args.mountId}/unmount`, args.body ?? {})).data ?? "Unmounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "AzureInstantVMRecoveryMigrate",
    description: "Start migrating a machine to Azure permanently.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/azure/vm/${args.mountId}/migrate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAzureInstantVMRecoverySwitchoverSettings",
    description: "Get settings for switchover to Azure.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/azure/vm/${args.mountId}/switchoverSettings`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateAzureInstantVMRecoverySwitchoverSettings",
    description: "Update settings for switchover to Azure.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/restore/instantRecovery/azure/vm/${args.mountId}/switchoverSettings`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "AzureInstantVMRecoverySwitchover",
    description: "Start switchover to Azure.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/azure/vm/${args.mountId}/switchover`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // Entire VM Restore
  {
    name: "EntireVmRestoreVmware",
    description: "Restore an entire VMware vSphere VM.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/vmRestore/vSphere", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EntireVmRestoreCloudDirector",
    description: "Restore an entire VMware Cloud Director VM.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/vmRestore/cloudDirector", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "EntireVmRestoreHv",
    description: "Restore an entire Microsoft Hyper-V VM.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/vmRestore/hyperV", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // FCD Instant Recovery
  {
    name: "GetAllVmwareFcdInstantRecoveryMountModels",
    description: "Get all FCD (First Class Disk) instant recovery mount points.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/restore/instantRecovery/vSphere/fcd", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantRecoveryVmwareFcdMountWithSession",
    description: "Start instant FCD recovery.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/instantRecovery/vSphere/fcd", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetVmwareFcdInstantRecoveryMountModel",
    description: "Get a specific FCD instant recovery mount point.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().get(`/restore/instantRecovery/vSphere/fcd/${args.mountId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantRecoveryVmwareFcdDismountWithSession",
    description: "Stop FCD publishing (dismount).",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/vSphere/fcd/${args.mountId}/dismount`, args.body ?? {})).data ?? "Dismounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InstantRecoveryVmwareFcdMigrateWithSession",
    description: "Start FCD disk migration.",
    inputSchema: { type: "object", properties: { mountId: { type: "string" }, body: { type: "object" } }, required: ["mountId", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/instantRecovery/vSphere/fcd/${args.mountId}/migrate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // File Level Restore
  {
    name: "StartFlrMount",
    description: "Start a file restore session (mount backup for file-level restore).",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/flr", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopFlrMount",
    description: "Unmount a file restore session.",
    inputSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/flr/${args.sessionId}/unmount`)).data ?? "Unmounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  // Entra ID Restore
  {
    name: "GetEntraIdTenantRestoreDeviceCode",
    description: "Get a user code for delegated restore of Microsoft Entra ID items.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/entraId/tenant/deviceCode", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetEntraIdTenantRestoreDeviceCodeState",
    description: "Get credentials after device code authorization for Entra ID restore.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/entraId/tenant/deviceCode/state", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartEntraIDTenantRestore",
    description: "Mount a Microsoft Entra ID tenant for restore operations.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/entraId/tenant", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartEntraIDTenantRestoreFromCopy",
    description: "Start Microsoft Entra ID tenant restore from a copy backup.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/entraId/tenant/fromCopy", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopEntraIDTenantRestore",
    description: "Unmount a Microsoft Entra ID tenant restore session.",
    inputSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/entraId/tenant/${args.sessionId}/stop`)).data ?? "Stopped."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartEntraIDAuditLogMount",
    description: "Start Microsoft Entra ID audit log restore.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/restore/entraId/auditLog", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StopEntraIDAuditLogMount",
    description: "Unmount Microsoft Entra ID audit log restore session.",
    inputSchema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"] },
    handler: async (args) => { try { return ok((await api().post(`/restore/entraId/auditLog/${args.sessionId}/unmount`)).data ?? "Unmounted."); } catch (e) { return err(toErrMsg(e)); } },
  },
];
