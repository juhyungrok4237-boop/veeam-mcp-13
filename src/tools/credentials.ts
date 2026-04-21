/**
 * Tools: Credentials & Cloud Credentials
 * 21 operations for managing standard and cloud credentials on the backup server.
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;
const p = (args: Record<string, unknown>) => ({
  skip: args.skip, limit: args.limit, orderColumn: args.orderColumn,
  orderAsc: args.orderAsc, nameFilter: args.nameFilter, typeFilter: args.typeFilter,
});

export const credentialTools: ToolDefinition[] = [
  // Standard Credentials
  {
    name: "GetAllCreds",
    description: "Get all credentials records stored on the Veeam Backup server.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, typeFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/credentials", { params: p(args) })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateCreds",
    description: "Add a new credentials record to the Veeam Backup server.",
    inputSchema: { type: "object", properties: { body: { type: "object", description: "Credentials spec (type, username, password, etc.)." } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/credentials", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetCreds",
    description: "Get a specific credentials record by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Credentials record ID." } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/credentials/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateCreds",
    description: "Edit an existing credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/credentials/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteCreds",
    description: "Remove a credentials record from the Veeam Backup server.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/credentials/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangePasswordForCreds",
    description: "Change the password for a credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object", description: "New password spec." } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/credentials/${args.id}/changepassword`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangePrivateKeyForCreds",
    description: "Change the Linux private key for a credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/credentials/${args.id}/changeprivatekey`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeRootPasswordForCreds",
    description: "Change the Linux root password for a credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/credentials/${args.id}/changerootpassword`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // Cloud Credentials
  {
    name: "GetAllCloudCreds",
    description: "Get all cloud credentials records (AWS, Azure, GCP, etc.).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" }, typeFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/cloudCredentials", { params: p(args) })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateCloudCreds",
    description: "Add a new cloud credentials record.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudCredentials", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RequestAppRegistrationByDeviceCode",
    description: "Get Microsoft Entra ID device verification code for app registration.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudCredentials/appRegistration", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "FinishAppRegistrationByDeviceCode",
    description: "Register a Microsoft Entra ID application using device code flow.",
    inputSchema: { type: "object", properties: { verificationCode: { type: "string" }, body: { type: "object" } }, required: ["verificationCode", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/cloudCredentials/appRegistration/${args.verificationCode}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RequestAuthentication",
    description: "Get Google Cloud authentication information.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudCredentials/authenticate", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetCloudCreds",
    description: "Get a specific cloud credentials record by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/cloudCredentials/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateCloudCreds",
    description: "Edit a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/cloudCredentials/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteCloudCreds",
    description: "Remove a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/cloudCredentials/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeCloudCredsSecretKey",
    description: "Change the secret key for a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/cloudCredentials/${args.id}/changeSecretKey`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeAccount",
    description: "Change the Google service account for a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/cloudCredentials/${args.id}/changeAccount`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeCloudCertificate",
    description: "Change the certificate for a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/cloudCredentials/${args.id}/changeCertificate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllCredsHelperAppliancesWithFiltering",
    description: "Get all helper appliances for a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/cloudCredentials/${args.id}/helperAppliances`, { params: { skip: args.skip, limit: args.limit } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateCloudCredsHelperAppliance",
    description: "Add or edit a helper appliance for a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/cloudCredentials/${args.id}/helperAppliances`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetCloudCredsHelperAppliance",
    description: "Get a specific helper appliance for a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, applianceId: { type: "string" } }, required: ["id", "applianceId"] },
    handler: async (args) => { try { return ok((await api().get(`/cloudCredentials/${args.id}/helperAppliances/${args.applianceId}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteCloudCredsHelperApplianceAsync",
    description: "Remove a helper appliance from a cloud credentials record.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, applianceId: { type: "string" } }, required: ["id", "applianceId"] },
    handler: async (args) => { try { return ok((await api().delete(`/cloudCredentials/${args.id}/helperAppliances/${args.applianceId}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
];
