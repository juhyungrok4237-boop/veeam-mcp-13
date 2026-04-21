/**
 * Tools: Inventory Browser, Cloud Browser
 */
import { getVeeamClient } from "../veeamClient.js";
import { ok, err, toErrMsg, ToolDefinition } from "../types/index.js";

const api = () => getVeeamClient().api;

export const inventoryBrowserTools: ToolDefinition[] = [
  {
    name: "GetAllInventoryVmwareHosts",
    description: "Get all VMware vSphere servers (vCenter, ESXi hosts) in the inventory.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/inventory/vmware/hosts", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetVmwareHostObject",
    description: "Get VMware vSphere server objects (data centers, clusters, VMs, etc.) by server name.",
    inputSchema: { type: "object", properties: { name: { type: "string" }, skip: { type: "number" }, limit: { type: "number" }, hierarchyRootId: { type: "string" }, objectIdFilter: { type: "string" } }, required: ["name"] },
    handler: async (args) => { try { return ok((await api().get(`/inventory/vmware/hosts/${args.name}`, { params: { skip: args.skip, limit: args.limit, hierarchyRootId: args.hierarchyRootId, objectIdFilter: args.objectIdFilter } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "RescanInventoryObjects",
    description: "Rescan inventory objects on a specific host.",
    inputSchema: { type: "object", properties: { hostname: { type: "string" }, body: { type: "object" } }, required: ["hostname"] },
    handler: async (args) => { try { return ok((await api().post(`/inventory/${args.hostname}/rescan`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllInventoryHosts",
    description: "Get all servers available for inventory browsing.",
    inputSchema: { type: "object", properties: { body: { type: "object" } } },
    handler: async (args) => { try { return ok((await api().post("/inventory", args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetInventoryObjects",
    description: "Get inventory objects (VMs, containers) for a specific host.",
    inputSchema: { type: "object", properties: { hostname: { type: "string" }, body: { type: "object" } }, required: ["hostname"] },
    handler: async (args) => { try { return ok((await api().post(`/inventory/${args.hostname}`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllInventoryPGs",
    description: "Get all protection groups.",
    inputSchema: { type: "object", properties: { body: { type: "object" } } },
    handler: async (args) => { try { return ok((await api().post("/inventory/physical", args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetInventoryForPG",
    description: "Get inventory objects for a specific protection group.",
    inputSchema: { type: "object", properties: { protectionGroupId: { type: "string" }, body: { type: "object" } }, required: ["protectionGroupId"] },
    handler: async (args) => { try { return ok((await api().post(`/inventory/physical/${args.protectionGroupId}`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllUnstructuredDataServers",
    description: "Get all unstructured data sources (file servers, NAS).",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/inventory/unstructuredDataServers", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateUnstructuredDataServer",
    description: "Add a new unstructured data source.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/inventory/unstructuredDataServers", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetUnstructuredDataServer",
    description: "Get a specific unstructured data source by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/inventory/unstructuredDataServers/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateUnstructuredDataServers",
    description: "Edit an unstructured data source.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/inventory/unstructuredDataServers/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteUnstructuredDataServers",
    description: "Remove an unstructured data source.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/inventory/unstructuredDataServers/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetAllEntraIDTenants",
    description: "Get all Microsoft Entra ID (Azure AD) tenants.",
    inputSchema: { type: "object", properties: { skip: { type: "number" }, limit: { type: "number" } } },
    handler: async (args) => { try { return ok((await api().get("/inventory/entraId/tenants", { params: args })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateEntraIDTenant",
    description: "Add a new Microsoft Entra ID tenant.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/inventory/entraId/tenants", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetEntraIDTenants",
    description: "Get a specific Microsoft Entra ID tenant by ID.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/inventory/entraId/tenants/${args.id}`)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "UpdateEntraIDTenants",
    description: "Edit a Microsoft Entra ID tenant.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, body: { type: "object" } }, required: ["id", "body"] },
    handler: async (args) => { try { return ok((await api().put(`/inventory/entraId/tenants/${args.id}`, args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "DeleteEntraIDTenants",
    description: "Remove a Microsoft Entra ID tenant.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().delete(`/inventory/entraId/tenants/${args.id}`)).data ?? "Deleted."); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "GetADDomainObject",
    description: "Get Active Directory objects from a specific domain.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, skip: { type: "number" }, limit: { type: "number" }, nameFilter: { type: "string" } }, required: ["id"] },
    handler: async (args) => { try { return ok((await api().get(`/inventory/activeDirectory/domains/${args.id}`, { params: { skip: args.skip, limit: args.limit, nameFilter: args.nameFilter } })).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];

export const cloudBrowserTools: ToolDefinition[] = [
  {
    name: "BrowseCloudEntity",
    description: "Get the cloud storage hierarchy (AWS S3, Azure Blob, GCP buckets, etc.).",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudBrowser", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "BrowseCloudEntityVirtualMachines",
    description: "Get cloud virtual machines from a cloud entity.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudBrowser/virtualMachines", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "CreateNewCloudFolder",
    description: "Create a new folder in cloud storage.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudBrowser/newFolder", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "InitializeVeeamCloudVault",
    description: "Add and initialize a Veeam Data Cloud Vault.",
    inputSchema: { type: "object", properties: { body: { type: "object" } }, required: ["body"] },
    handler: async (args) => { try { return ok((await api().post("/cloudBrowser/initializeVault", args.body)).data); } catch (e) { return err(toErrMsg(e)); } },
  },
  {
    name: "BrowseCloudVaultEntity",
    description: "Browse the contents of a Veeam Data Cloud Vault.",
    inputSchema: { type: "object", properties: { vaultId: { type: "string" }, body: { type: "object" } }, required: ["vaultId"] },
    handler: async (args) => { try { return ok((await api().post(`/cloudBrowser/${args.vaultId}`, args.body ?? {})).data); } catch (e) { return err(toErrMsg(e)); } },
  },
];
