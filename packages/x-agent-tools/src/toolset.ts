import { createCodegenTool } from './codegen/build';
import { createDocsTools, type DocsTools } from './docs/build';
import type { GenerateReactCodeTool } from './codegen/tools';
import type { AgentToolsConfig } from './config';
import type { Logger } from './types';

export interface CreateMuiAgentToolsetOptions {
  /** Surfaces swallowed failures (catalog retries, onProgress bugs). Silent by default. */
  logger?: Logger;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
  /** Retry backoff for the catalog fetch. Defaults to a ~63s ramp; override in tests. */
  retryDelaysMs?: number[];
  /** Override the `fetchDocs` tool description (its default lives in the tool factory). */
  fetchDocsDescription?: string;
}

export interface MuiAgentToolset {
  /** Ready immediately: needs no network at startup. */
  codegenTool: GenerateReactCodeTool;
  /** The docs tools, once the catalog fetch settles. Never rejects (fail-soft). */
  docsToolsReady: Promise<DocsTools>;
}

/**
 * Assemble MUI's full agent toolset from backend config by composing the codegen and docs builders.
 * A host only wires transport, registration, and rendering on top.
 */
export function createMuiAgentToolset(
  config: AgentToolsConfig,
  options: CreateMuiAgentToolsetOptions = {},
): MuiAgentToolset {
  const { logger, fetcher, retryDelaysMs, fetchDocsDescription } = options;

  const codegenTool = createCodegenTool({
    muiBackendBaseUrl: config.muiBackendBaseUrl,
    recipesBackendBaseUrl: config.recipesBackendBaseUrl,
    logger,
    fetcher,
  });

  const docsToolsReady = createDocsTools({
    docsBaseUrl: config.docsBaseUrl,
    logger,
    fetcher,
    retryDelaysMs,
    fetchDocsDescription,
  });

  return { codegenTool, docsToolsReady };
}
