import { afterEach, describe, expect, it, vi } from 'vitest';
import PQueue from 'p-queue';
import { z } from 'zod';
import { LRUCache } from './cache';
import { wrapTool, urlListFetcher, isPrivateHostname, createDocsUrlGuard } from './utils';

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

  it('blocks a disallowed URL without fetching it', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockResolvedValue(ok('secret'));
    const logger = vi.fn();
    const isUrlAllowed = (url: string) => url.startsWith('https://allowed/');

    const result = await urlListFetcher(queue, fetcher, ['http://localhost:5002/admin'], {
      logger,
      isUrlAllowed,
    });

    expect(result).toBe(
      'Could not fetch http://localhost:5002/admin: URL is not an allowed docs source (blocked for security).',
    );
    expect(fetcher).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalled();
  });

  it('still fetches allowed URLs when a guard is set', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockResolvedValue(ok('doc'));
    const isUrlAllowed = (url: string) => url.startsWith('https://allowed/');

    const result = await urlListFetcher(queue, fetcher, ['https://allowed/page'], { isUrlAllowed });

    expect(result).toBe('doc');
    expect(fetcher).toHaveBeenCalledWith('https://allowed/page');
  });
});

describe('isPrivateHostname', () => {
  it.each(['localhost', 'app.localhost', 'foo.local', 'svc.internal'])(
    'treats %s as private',
    (host) => {
      expect(isPrivateHostname(host)).toBe(true);
    },
  );

  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '192.168.0.1',
    '169.254.169.254',
    '172.16.0.1',
    '::1',
    'fe80::1',
  ])('treats IP %s as private', (host) => {
    expect(isPrivateHostname(host)).toBe(true);
  });

  it.each(['mui.com', 'llms.mui.com', 'example.com', '8.8.8.8'])('treats %s as public', (host) => {
    expect(isPrivateHostname(host)).toBe(false);
  });
});

describe('createDocsUrlGuard', () => {
  it('allows public http(s) URLs', () => {
    const guard = createDocsUrlGuard([]);
    expect(guard('https://llms.mui.com/material-ui/llms.txt')).toBe(true);
    expect(guard('http://mui.com/x')).toBe(true);
  });

  it('blocks private/internal hosts not in the allowlist', () => {
    const guard = createDocsUrlGuard([]);
    expect(guard('http://localhost:5002/')).toBe(false);
    expect(guard('http://169.254.169.254/latest/meta-data/')).toBe(false);
  });

  it('allows an explicitly configured origin even when it is localhost (dev backend)', () => {
    const guard = createDocsUrlGuard(['http://localhost:5003']);
    expect(guard('http://localhost:5003/v1/public/packages/list')).toBe(true);
    // A different localhost port is still blocked.
    expect(guard('http://localhost:9999/')).toBe(false);
  });

  it('rejects non-HTTP(S) schemes and malformed URLs', () => {
    const guard = createDocsUrlGuard([]);
    expect(guard('file:///etc/passwd')).toBe(false);
    expect(guard('not a url')).toBe(false);
  });
});
