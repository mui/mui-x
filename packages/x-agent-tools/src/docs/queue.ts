import PQueue from 'p-queue';

/** Default docs-fetch parallelism. */
export const DEFAULT_DOCS_CONCURRENCY = 10;

// A bounded docs-fetch queue; `createDocsTools` shares one across both tools. `throwOnTimeout` so a
// timeout rejects (folded into the per-URL error) instead of resolving `undefined`.
export function createDocsQueue(concurrency: number = DEFAULT_DOCS_CONCURRENCY): PQueue {
  return new PQueue({ concurrency, throwOnTimeout: true });
}
