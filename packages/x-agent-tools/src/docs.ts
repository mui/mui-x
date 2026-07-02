import { z } from 'zod';
import { LRUCache } from './cache';
import { PackageData, QueueOptions, ToolOverrides } from './types';
import { wrapTool, urlListFetcher, compareVersions, type Logger } from './utils';

const DEFAULT_DOCS_CONCURRENCY = 10;

export async function createUseMuiDocsTool(options: {
  getPackagesList: () => Promise<PackageData[]>;
  fetcher?: typeof fetch;
  overrides?: {
    name?: string;
    description?: string;
  };
  queue?: {
    throwOnTimeout?: boolean;
    concurrency?: number;
    timeout?: number;
  };
  cache?: boolean;
  logger?: Logger;
  isUrlAllowed?: (url: string) => boolean;
}) {
  const PQueue = await import('p-queue').then((m) => m.default);
  const queue = new PQueue({
    // Bounded default so a caller omitting queue config can't fire unbounded parallel fetches.
    concurrency: options.queue?.concurrency ?? DEFAULT_DOCS_CONCURRENCY,
    throwOnTimeout: options.queue?.throwOnTimeout ?? true,
    timeout: options.queue?.timeout,
  });
  const fetcher = options.fetcher ?? fetch;
  // The cache lives for the lifetime of this tool; the host owns it, not a module-level singleton.
  const cache = options.cache ? new LRUCache() : undefined;
  const { logger, isUrlAllowed } = options;
  const packages = await options.getPackagesList();
  const availablePackagesText = packages
    .map((it) => `[${it.name}@${it.version}](${it.llmsUrl})`)
    .join('\n');
  // Index every `name@version` exactly, and each bare name to its highest-semver entry, so a source
  // entry can be an llms.txt URL, a `name@version` shorthand, or a bare name (which gets the latest).
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
    execute: async (input) => {
      // Accept package names and `name@version` shorthands as well as URLs.
      const urls = input.sources.map(
        (entry) => llmsUrlByNameVersion.get(entry) ?? latestByName.get(entry)?.llmsUrl ?? entry,
      );
      return urlListFetcher(queue, fetcher, urls, {
        cache,
        logger,
        isUrlAllowed,
        resolveDocLinks: true,
      });
    },
  });
}

export async function createFetchDocTool(options: {
  fetcher?: typeof fetch;
  overrides?: ToolOverrides;
  queue?: QueueOptions;
  cache?: boolean;
  logger?: Logger;
  isUrlAllowed?: (url: string) => boolean;
}) {
  const fetcher = options.fetcher ?? fetch;
  const PQueue = await import('p-queue').then((m) => m.default);
  const queue = new PQueue({
    concurrency: options.queue?.concurrency ?? DEFAULT_DOCS_CONCURRENCY,
    throwOnTimeout: options.queue?.throwOnTimeout ?? true,
    timeout: options.queue?.timeout,
  });

  // The cache lives for the lifetime of this tool; the host owns it, not a module-level singleton.
  const cache = options.cache ? new LRUCache() : undefined;
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
    execute: async (input) => {
      return urlListFetcher(queue, fetcher, input.urls, { cache, logger, isUrlAllowed });
    },
  });
}
