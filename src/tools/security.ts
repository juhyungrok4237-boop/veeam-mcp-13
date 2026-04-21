/**
 * Tools: Security & Compliance, Malware Detection, Users & Roles, Global Exclusions
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const securityTools: ToolDefinition[] = [
  {
    name: "StartSecurityAnalyzer",
    description: "Start the Security & Compliance Analyzer to check the backup infrastructure against best practices.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().post("/securityAnalyzer/start")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetSecurityAnalyzerSession",
    description: "Get the last run of the Security & Compliance Analyzer.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/securityAnalyzer/lastRun")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetSecurityAnalyzerSchedule",
    description: "Get the Security & Compliance Analyzer schedule.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/securityAnalyzer/schedule")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ModifySecurityAnalyzerSchedule",
    description: "Modify the Security & Compliance Analyzer schedule.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/securityAnalyzer/schedule", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ResetAllBestPracticesComplianceStatuses",
    description: "Reset all Security & Compliance Analyzer statuses.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().post("/securityAnalyzer/bestPractices/resetAll")).data ?? "Reset."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetBestPracticesComplianceResult",
    description: "Get Security & Compliance Analyzer results (best practices compliance).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/securityAnalyzer/bestPractices", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "SuppressBestPracticesComplianceAlert",
    description: "Suppress a specific Security & Compliance Analyzer best practice alert.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/securityAnalyzer/bestPractices/${args.id}/suppress`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ResetBestPracticesComplianceStatus",
    description: "Reset the status of a specific Security & Compliance Analyzer best practice check.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/securityAnalyzer/bestPractices/${args.id}/reset`)).data ?? "Reset."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllAuthorizationEvents",
    description: "Get all four-eyes authorization events.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/authorization/events", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAuthorizationEvent",
    description: "Get a specific authorization event by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/authorization/events/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const malwareDetectionTools: ToolDefinition[] = [
  {
    name: "ViewSuspiciousActivityEvents",
    description: "Get all malware/ransomware events detected in backup data.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, stateFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/security/malwareEvents", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateSuspiciousActivityEvent",
    description: "Create a manual malware event entry.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/security/malwareEvents", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetSuspiciousActivityEvent",
    description: "Get a specific malware event by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/security/malwareEvents/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetScanSessionLog",
    description: "Get logs for a SureBackup scan task session.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/security/malwareEvents/${args.id}/logs`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "MarkBackupObjectsAsClean",
    description: "Mark specific backup objects as clean (no malware).",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/security/malwareEvents/markAsClean", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetYaraRules",
    description: "Get YARA rules available for backup scanning.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/security/yaraRules", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "StartMalwareBackupScan",
    description: "Scan backup data with antivirus software or YARA rules.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/security/malwareScan", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const usersAndRolesTools: ToolDefinition[] = [
  {
    name: "ViewAllUsers",
    description: "Get all users and groups with access to Veeam Backup & Replication.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/security/users", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateUser",
    description: "Add a new user or group to Veeam Backup & Replication.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/security/users", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetUser",
    description: "Get a specific user or group by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/security/users/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteUser",
    description: "Remove a user or group from Veeam Backup & Replication.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/security/users/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetUserRoles",
    description: "Get roles assigned to a specific user or group.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/security/users/${args.id}/roles`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateUserRoles",
    description: "Edit roles assigned to a user or group.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/security/users/${args.id}/roles`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeServiceAccountMode",
    description: "Change service account mode for a user.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/security/users/${args.id}/changeServiceAccountMode`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ResetUserMfa",
    description: "Reset MFA for a specific user.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().post(`/security/users/${args.id}/resetMFA`)).data ?? "MFA reset."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViewAllUserRoles",
    description: "Get all available roles in Veeam Backup & Replication.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/security/roles")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViewUserRole",
    description: "Get details of a specific role by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/security/roles/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViewUserRolePermissions",
    description: "Get permissions associated with a specific role.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/security/roles/${args.id}/permissions`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ViewUsersSettings",
    description: "Get MFA (multi-factor authentication) settings.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => { try { return ok((await api().get("/security/settings")).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateUsersSettings",
    description: "Edit MFA settings.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().put("/security/settings", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const globalExclusionTools: ToolDefinition[] = [
  {
    name: "GetAllGlobalVMExclusions",
    description: "Get all global VM exclusions (VMs excluded from all jobs).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/globalExclusions/vm", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateGlobalVMExclusion",
    description: "Add a VM to the global exclusion list.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/globalExclusions/vm", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetGlobalVMExclusion",
    description: "Get a specific global VM exclusion by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/globalExclusions/vm/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteGlobalVMExclusion",
    description: "Remove a VM from the global exclusion list.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/globalExclusions/vm/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateGlobalVMExclusionNote",
    description: "Edit the note for a global VM exclusion.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/globalExclusions/vm/${args.id}/note`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
