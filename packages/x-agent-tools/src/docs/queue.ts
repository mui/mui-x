import PQueue from 'p-queue';

/** Default docs-fetch parallelism. */
export const DEFAULT_DOCS_CONCURRENCY = 10;

/**
 * A bounded docs-fetch queue; `createDocsTools` shares one across both tools. Per-request timeouts
 * live at the fetch (`urlListFetcher`), which aborts the connection, not just the queue slot.
 * @param {number} concurrency Max parallel fetches. Defaults to `DEFAULT_DOCS_CONCURRENCY`.
 * @returns {PQueue} A new bounded queue.
 */
export function createDocsQueue(concurrency: number = DEFAULT_DOCS_CONCURRENCY): PQueue {
  return new PQueue({ concurrency });
}
