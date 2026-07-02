import { z } from 'zod';
import { LRUCache, resolveCache } from '../utils/cache';
import type { Logger, PackageData, QueueOptions, ToolOverrides } from '../types';
import { wrapTool } from '../utils/wrap-tool';
import { urlListFetcher } from './fetch-docs';
import { compareVersions } from './packages';

const DEFAULT_DOCS_CONCURRENCY = 10;

interface DocsToolOptions {
  fetcher?: typeof fetch;
  overrides?: ToolOverrides;
  queue?: QueueOptions;
  // `true`: fresh cache; `LRUCache`: share one (host owns its lifecycle); omit: no cache.
  cache?: boolean | LRUCache;
  logger?: Logger;
  isUrlAllowed?: (url: string) => boolean;
}

/** Shared queue + fetcher + cache setup for both docs tools, so their defaults can't drift apart. */
async function createDocsToolRuntime(options: DocsToolOptions) {
  const PQueue = await import('p-queue').then((m) => m.default);
  const queue = new PQueue({
    // Bounded default so omitting queue config can't fire unbounded parallel fetches.
    concurrency: options.queue?.concurrency ?? DEFAULT_DOCS_CONCURRENCY,
    throwOnTimeout: options.queue?.throwOnTimeout ?? true,
    timeout: options.queue?.timeout,
  });
  const fetcher = options.fetcher ?? fetch;
  return { queue, fetcher, cache: resolveCache(options.cache) };
}

export async function createUseMuiDocsTool(
  options: DocsToolOptions & { getPackagesList: () => Promise<PackageData[]> },
) {
  const { queue, fetcher, cache } = await createDocsToolRuntime(options);
  const { logger, isUrlAllowed } = options;
  const packages = await options.getPackagesList();
  const availablePackagesText = packages
    .map((it) => `[${it.name}@${it.version}](${it.llmsUrl})`)
    .join('\n');
  // Index each `name@version` exactly and each bare name to its latest version, so a source can be
  // an llms.txt URL, a `name@version` shorthand, or a bare name (which gets the latest).
  const llmsUrlByNameVersion = new Map<string, string>();
  const latestByName = new Map<string, PackageData>();
  for (const pkg of packages) {
    llmsUrlByNameVersion.set(`${pkg.name}@${pkg.version}`, pkg.llmsUrl);
    const latest = latestByName.get(pkg.name);
    if (!latest || compareVersions(pkg.version, latest.version) > 0) {
      latestByName.set(pkg.name, pkg);
    }
  }

  return wrapTool({
    name: 'use_mui_docs',
    publicName: 'useMuiDocs',
    description: `
      You must use this tool to answer any questions related to MUI components or documentation.

      The description of the tool contains links to llms.txt files or local file paths that the user has made available.

      ${availablePackagesText}

      1. Pick the most suitable entry from the above list and use it as the "sources" argument. You can pass either the llms.txt URL or just the package name (e.g. "@mui/x-data-grid"); both resolve to the same docs. If it's just one, let it be an array with one entry.
      2. Analyze the URLs listed in the llms.txt file. They are returned as absolute URLs, ready to pass to the next tool call.
      3. Then fetch specific documentation pages relevant to the user's question with the subsequent tool call.
    `,
    ...options.overrides,
    inputSchema: z.object({
      sources: z
        .array(z.string())
        .describe(
          'The documentation sources to fetch: each entry is either an llms.txt URL from the list above or a package name (e.g. "@mui/x-data-grid"), which resolves to that package\'s llms.txt.',
        ),
    }),
    outputSchema: z.string().describe('A string containing the fetched documentation content'),
    execute: async (input, context) => {
      // Accept package names and `name@version` shorthands as well as URLs.
      const urls = input.sources.map(
        (entry) => llmsUrlByNameVersion.get(entry) ?? latestByName.get(entry)?.llmsUrl ?? entry,
      );
      return urlListFetcher(queue, fetcher, urls, {
        cache,
        logger,
        isUrlAllowed,
        resolveDocLinks: true,
        signal: context?.signal,
      });
    },
  });
}

export async function createFetchDocTool(options: DocsToolOptions) {
  const { queue, fetcher, cache } = await createDocsToolRuntime(options);
  const { logger, isUrlAllowed } = options;

  return wrapTool({
    name: 'fetch_docs',
    publicName: 'fetchDocs',
    description: `Fetch and parse documentation from a given URL or local file.

Use this tool after useMuiDocs to:
1. First fetch the llms.txt file from a documentation source
2. Analyze the URLs listed in the llms.txt file
3. Then fetch specific documentation pages relevant to the user's question`,
    ...options.overrides,
    inputSchema: z.object({
      urls: z.array(z.string()).describe('The list of URLs to fetch documentation from'),
    }),
    outputSchema: z
      .string()
      .describe(
        'The concatenated list of all fetched documentation content converted to markdown, or an error message if the request fails or the URL is blocked (only MUI documentation origins are allowed).',
      ),
    execute: async (input, context) => {
      return urlListFetcher(queue, fetcher, input.urls, {
        cache,
        logger,
        isUrlAllowed,
        signal: context?.signal,
      });
    },
  });
}
