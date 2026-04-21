/**
 * Tools: Encryption & KMS Servers
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const encryptionTools: ToolDefinition[] = [
  {
    name: "GetAllEncryptionPasswords",
    description: "Get all encryption passwords configured on the Veeam Backup server.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } } },
    handler: async (args) => { try { return ok((await api().get("/encryptionPasswords", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateEncryptionPassword",
    description: "Add a new encryption password.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/encryptionPasswords", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetEncryptionPassword",
    description: "Get a specific encryption password by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/encryptionPasswords/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateEncryptionPassword",
    description: "Edit the hint of an encryption password.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/encryptionPasswords/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteEncryptionPassword",
    description: "Remove an encryption password.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/encryptionPasswords/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeEncryptionPassword",
    description: "Change an encryption password value.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/encryptionPasswords/${args.id}/changepassword`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "VerifyEncryptionPassword",
    description: "Verify that an encryption password is correct.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/encryptionPasswords/${args.id}/verify`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  // KMS Servers
  {
    name: "GetAllKMSServers",
    description: "Get all KMS (Key Management System) servers.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/kmsServers", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateKMSServer",
    description: "Add a new KMS server.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/kmsServers", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetKMSServer",
    description: "Get a specific KMS server by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/kmsServers/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateKMSServer",
    description: "Edit a KMS server configuration.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/kmsServers/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteKMSServer",
    description: "Remove a KMS server.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/kmsServers/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "ChangeKMServerCertificate",
    description: "Change the certificate for a KMS server.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().post(`/kmsServers/${args.id}/changeCertificate`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
