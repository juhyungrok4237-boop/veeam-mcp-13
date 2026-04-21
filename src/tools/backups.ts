/**
 * Tools: Backups & Backup Objects & Restore Points
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const backupTools: ToolDefinition[] = [
  // Backups
  {
    name: "GetAllBackups",
    description: "Get all backup datasets created on or imported to the Veeam Backup server.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, platformFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backups", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetBackup",
    description: "Get details of a specific backup dataset by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backups/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteBackup",
    description: "Delete a backup dataset from the Veeam Backup server.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, deleteFromDisk: { type: "boolean", description: "Also delete files from disk." } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/backups/${args.id}`, { params: { deleteFromDisk: args.deleteFromDisk } })).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetBackupObjectsWithFiltering",
    description: "Get objects (VMs, servers) contained in a specific backup.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backups/${args.id}/objects`, { params: { skip: args.skip, limit: args.limit, nameFilter: args.nameFilter } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteBackupObject",
    description: "Delete a specific object from a backup.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, objectId: { type: "string" } }, required: ["id", "objectId"] },
    handler: async (args) => { try { return ok((await api().delete(`/backups/${args.id}/objects/${args.objectId}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DownloadBackupMeta",
    description: "Download the backup metadata file for a backup.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/backups/${args.id}/downloadBackupMeta`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllBackupFiles",
    description: "Get all .VBK and .VIB files associated with a backup.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backups/${args.id}/backupFiles`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetBackupFile",
    description: "Get a specific backup file by its ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, backupFileId: { type: "string" } }, required: ["id", "backupFileId"] },
    handler: async (args) => { try { return ok((await api().get(`/backups/${args.id}/backupFiles/${args.backupFileId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartHealthCheckBackup",
    description: "Run a health check and repair operation on backups.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "Health check spec." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backups/runHealthcheck", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CopyBackups",
    description: "Copy backups to another repository.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "Copy spec with source backup IDs and target repository." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/backups/copyTo", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const backupObjectTools: ToolDefinition[] = [
  {
    name: "GetAllBackupObjects",
    description: "Get all backup objects (VMs, servers) across all backups.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, platformFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/backupObjects", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetBackupObject",
    description: "Get a specific backup object by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupObjects/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateRecoveryMediaForBackupObject",
    description: "Create recovery media for a specific backup object.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupObjects/${args.id}/createRecoveryMedia`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetBackupObjectRestorePointsWithFiltering",
    description: "Get all restore points for a specific backup object.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/backupObjects/${args.id}/restorePoints`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const restorePointTools: ToolDefinition[] = [
  {
    name: "GetAllObjectRestorePoints",
    description: "Get all available restore points across the entire Veeam infrastructure.",
    inputSchema: {
      type: "object",
      properties: {
        skip: { type: "number" }, limit: { type: "number" },
        nameFilter: { type: "string" }, platformFilter: { type: "string" },
        backupIdFilter: { type: "string" }, objectIdFilter: { type: "string" },
        createdAfterFilter: { type: "string" }, createdBeforeFilter: { type: "string" },
      },
    },
    handler: async (args) => { try { return ok((await api().get("/restorePoints", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetObjectRestorePoint",
    description: "Get a specific restore point by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/restorePoints/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetObjectRestorePointDisksWithFiltering",
    description: "Get the disks included in a specific restore point.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/restorePoints/${args.id}/disks`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
