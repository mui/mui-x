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
  /** Per-attempt catalog-fetch timeout. Defaults to 30s; override in tests. */
  catalogTimeoutMs?: number;
  /** Cancels the background catalog load (e.g. on host shutdown), so a pending backoff can't linger. */
  signal?: AbortSignal;
  /** Override the `fetchDocs` tool description (its default lives in the tool factory). */
  fetchDocsDescription?: string;
}

/**
 * `codegenTool` and `fetchDocsTool` are ready immediately (no catalog needed); `useMuiDocsReady`
 * resolves after the catalog settles, so a slow or hung catalog never blocks the other two.
 */
export interface MuiAgentToolset extends DocsTools {
  /** Ready immediately: needs no network at startup. */
  codegenTool: GenerateReactCodeTool;
}

/**
 * Assemble MUI's full agent toolset from backend config by composing the codegen and docs builders.
 * Resolves once `codegen` + `fetchDocs` are ready; the catalog-dependent `useMuiDocs` loads in the
 * background (`useMuiDocsReady`). A host only wires transport, registration, and rendering on top.
 */
export async function createMuiAgentToolset(
  config: AgentToolsConfig,
  options: CreateMuiAgentToolsetOptions = {},
): Promise<MuiAgentToolset> {
  const { logger, fetcher, retryDelaysMs, catalogTimeoutMs, signal, fetchDocsDescription } =
    options;

  const codegenTool = createCodegenTool({
    muiBackendBaseUrl: config.muiBackendBaseUrl,
    recipesBackendBaseUrl: config.recipesBackendBaseUrl,
    logger,
    fetcher,
  });

  const docsTools = await createDocsTools({
    docsBaseUrl: config.docsBaseUrl,
    logger,
    fetcher,
    retryDelaysMs,
    catalogTimeoutMs,
    signal,
    fetchDocsDescription,
  });

  return { codegenTool, ...docsTools };
}
