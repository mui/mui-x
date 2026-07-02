export type {
  AgentTool,
  Logger,
  ToolExecutionContext,
  ToolProgressEvent,
  PackageData,
  ToolOverrides,
  QueueOptions,
} from './types';

// Composition layer: the recommended entry point for a host (MCP, CLI, ACP).
export { resolveAgentToolsConfig, type AgentToolsConfig } from './config';
export {
  createMuiAgentToolset,
  type CreateMuiAgentToolsetOptions,
  type MuiAgentToolset,
} from './toolset';
export {
  ApiKeyJwtClient,
  ApiKeyJwtClientError,
  type ApiKeyJwtClientOptions,
} from './auth/api-key-jwt-client';

// Per-domain low-level tool factories, for a host that assembles its own toolset.
export {
  createGenerateReactCodeTool,
  formatCodegenText,
  type CreateGenerateReactCodeToolOptions,
  type CodegenProgressEvent,
  type GenerateReactCodeResult,
  type GenerateReactCodeTool,
} from './codegen/tools';
export { createUseMuiDocsTool, createFetchDocTool } from './docs/tools';

// Per-domain config-driven builders, for a host that wants only codegen or only docs.
export { createCodegenTool, type CreateCodegenToolOptions } from './codegen/build';
export { createDocsTools, type CreateDocsToolsOptions, type DocsTools } from './docs/build';
export { fetchRemotePackages } from './docs/packages';
export { createDocsUrlGuard } from './docs/url-guard';

export { LRUCache, type CacheEntry } from './utils/cache';
export { buildCombinedLogger, MAX_LOG_BYTES } from './utils/logger';
