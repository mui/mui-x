import { afterEach, describe, expect, it, vi } from 'vitest';
import PQueue from 'p-queue';
import { z } from 'zod';
import { LRUCache } from './cache';
import { wrapTool, urlListFetcher } from './utils';

const ok = (body: string): Response => new Response(body, { status: 200 });

describe('wrapTool', () => {
  it('returns the tool object unchanged (it only carries type inference)', () => {
    const tool = {
      name: 'sample',
      publicName: 'sample',
      description: 'sample',
      inputSchema: z.object({ q: z.string() }),
      outputSchema: z.string(),
      execute: async () => 'ok',
    };
    expect(wrapTool(tool)).toBe(tool);
  });
});

describe('urlListFetcher', () => {
  const caches: LRUCache[] = [];
  const makeCache = () => {
    const cache = new LRUCache();
    caches.push(cache);
    return cache;
  };

  afterEach(() => {
    // Dispose any cache created so its cleanup interval doesn't linger.
    caches.splice(0).forEach((cache) => cache.dispose());
  });

  it('fetches a single URL and returns its body', async () => {
    const queue = new PQueue({ concurrency: 2 });
    const fetcher = vi.fn().mockResolvedValue(ok('doc body'));

    const result = await urlListFetcher(queue, fetcher, ['https://docs/a']);

    expect(result).toBe('doc body');
    expect(fetcher).toHaveBeenCalledWith('https://docs/a');
  });

  it('joins multiple docs with newlines, preserving input order', async () => {
    const queue = new PQueue({ concurrency: 2 });
    const fetcher = vi.fn().mockResolvedValueOnce(ok('first')).mockResolvedValueOnce(ok('second'));

    const result = await urlListFetcher(queue, fetcher, ['u1', 'u2']);

    expect(result).toBe('first\nsecond');
  });

  it('returns a fallback string and reports via the injected logger when a response is not ok', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }));
    const logger = vi.fn();

    const result = await urlListFetcher(queue, fetcher, ['u1'], { logger });

    expect(result).toBe('Could not fetch u1: HTTP error! status: 500');
    expect(logger).toHaveBeenCalled();
  });

  it('returns a fallback string when the fetcher rejects', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));
    const logger = vi.fn();

    const result = await urlListFetcher(queue, fetcher, ['u1'], { logger });

    expect(result).toBe('Could not fetch u1: network down');
    expect(logger).toHaveBeenCalledWith('Failed to fetch u1:', expect.any(Error));
  });

  it('stays silent (no throw) when no logger is provided', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));

    await expect(urlListFetcher(queue, fetcher, ['u1'])).resolves.toBe(
      'Could not fetch u1: network down',
    );
  });

  it('serves a cached body on the second call without re-fetching when a cache is provided', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const cache = makeCache();
    const fetcher = vi.fn().mockResolvedValue(ok('cached body'));

    const first = await urlListFetcher(queue, fetcher, ['https://docs/x'], { cache });
    expect(first).toBe('cached body');

    // The cache write is scheduled via queueMicrotask; flush the task queue.
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const second = await urlListFetcher(queue, fetcher, ['https://docs/x'], { cache });
    expect(second).toBe('cached body');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('does not cache when no cache is provided (default)', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockResolvedValue(ok('body'));

    await urlListFetcher(queue, fetcher, ['https://docs/y']);
    await urlListFetcher(queue, fetcher, ['https://docs/y']);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
