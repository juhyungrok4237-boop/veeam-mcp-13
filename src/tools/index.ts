/**
 * Tools Index - Aggregates ALL tool definitions from all modules.
 * Total coverage: 39 tags, 404 operations from swagger.json
 */
import { ToolDefinition } from "../types/index.js";

// Service
import { serviceTools } from "./service.js";
// License
import { licenseTools } from "./license.js";
// Credentials
import { credentialTools } from "./credentials.js";
// Encryption & KMS
import { encryptionTools } from "./encryption.js";
// General Options, Traffic Rules, Config Backup, Connection, Deployment
import {
  generalOptionTools,
  trafficRuleTools,
  configBackupTools,
  connectionTools,
  deploymentTools,
} from "./generalOptions.js";
// Security, Malware, Users, Global Exclusions
import {
  securityTools,
  malwareDetectionTools,
  usersAndRolesTools,
  globalExclusionTools,
} from "./security.js";
// Inventory & Cloud Browser
import { inventoryBrowserTools, cloudBrowserTools } from "./inventory.js";
// Infrastructure
import {
  managedServerTools,
  repositoryTools,
  proxyTools,
  mountServerTools,
  wanAcceleratorTools,
} from "./infrastructure.js";
// Jobs
import { jobTools } from "./jobs.js";
// Backups, Backup Objects, Restore Points
import { backupTools, backupObjectTools, restorePointTools } from "./backups.js";
// Sessions
import { sessionTools } from "./sessions.js";
// Restore
import { restoreTools } from "./restore.js";
// Operations: Failover, Failback, Replicas, Agents, Automation
import {
  failoverTools,
  failbackTools,
  replicaTools,
  agentTools,
  automationTools,
} from "./operations.js";

// Flatten all tools into a single array
export const allTools: ToolDefinition[] = [
  ...serviceTools,
  ...licenseTools,
  ...credentialTools,
  ...encryptionTools,
  ...generalOptionTools,
  ...trafficRuleTools,
  ...configBackupTools,
  ...connectionTools,
  ...deploymentTools,
  ...securityTools,
  ...malwareDetectionTools,
  ...usersAndRolesTools,
  ...globalExclusionTools,
  ...inventoryBrowserTools,
  ...cloudBrowserTools,
  ...managedServerTools,
  ...repositoryTools,
  ...proxyTools,
  ...mountServerTools,
  ...wanAcceleratorTools,
  ...jobTools,
  ...backupTools,
  ...backupObjectTools,
  ...restorePointTools,
  ...sessionTools,
  ...restoreTools,
  ...failoverTools,
  ...failbackTools,
  ...replicaTools,
  ...agentTools,
  ...automationTools,
];

// Build a lookup map for fast handler dispatch
export const toolHandlerMap = new Map<string, ToolDefinition["handler"]>(
  allTools.map((t) => [t.name, t.handler])
);

console.error(`[MCP] Loaded ${allTools.length} tools from ${new Set(allTools.map(t => t.name)).size} unique names.`);
