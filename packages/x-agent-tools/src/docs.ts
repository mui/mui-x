import { z } from 'zod';
import { LRUCache } from './cache';
import { PackageData, QueueOptions, ToolOverrides } from './types';
import { wrapTool, urlListFetcher, type Logger } from './utils';

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
    // p-queue v8 rejects an explicit `undefined`; fall back to its unbounded default.
    concurrency: options.queue?.concurrency ?? Number.POSITIVE_INFINITY,
    throwOnTimeout: options.queue?.throwOnTimeout ?? true,
    timeout: options.queue?.timeout,
  });
  const fetcher = options.fetcher ?? fetch;
  // The cache lives for the lifetime of this tool; the host owns it, not a module-level singleton.
  const cache = options.cache ? new LRUCache() : undefined;
  const { logger, isUrlAllowed } = options;
  const availablePackagesText = await options.getPackagesList().then((packages) => {
    return packages.map((it) => `[${it.name}@${it.version}](${it.llmsUrl})`).join('\n');
  });

  return wrapTool({
    name: 'use_mui_docs',
    publicName: 'useMuiDocs',
    description: `
      You must use this tool to answer any questions related to MUI components or documentation.

      The description of the tool contains links to llms.txt files or local file paths that the user has made available.

      ${availablePackagesText}

      1. Pick the most suitable URL from the above list, and use that as the "urlList" argument for this tool's execution, to get the docs content. If it's just one, let it be an array with one URL.
      2. Analyze the URLs listed in the llms.txt file
      3. Then fetch specific documentation pages relevant to the user's question with the subsequent tool call.
    `,
    ...options.overrides,
    inputSchema: z.object({
      urlList: z.array(z.string()).describe('The list of urls to fetch the documentation from'),
    }),
    outputSchema: z.string().describe('A string containing the fetched documentation content'),
    execute: async (input) => {
      return urlListFetcher(queue, fetcher, input.urlList, { cache, logger, isUrlAllowed });
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
    concurrency: options.queue?.concurrency ?? 1,
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

Use this tool after list_mui_doc_sources to:
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
