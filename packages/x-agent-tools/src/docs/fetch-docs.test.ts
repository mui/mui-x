import { afterEach, describe, expect, it, vi } from 'vitest';
import PQueue from 'p-queue';
import { LRUCache } from '../utils/cache';
import { absolutizeDocLinks, urlListFetcher } from './fetch-docs';

const ok = (body: string): Response => new Response(body, { status: 200 });

const redirectTo = (location: string): Response =>
  new Response(null, { status: 302, headers: { location } });

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

  it('caches raw text and rewrites links per call, so one cache serves both the raw and rewritten views', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const cache = makeCache();
    const url = 'https://mui.com/x/llms.txt';
    const fetcher = vi.fn().mockResolvedValue(ok('see [a](/x/foo.md)'));

    // The raw view (fetchDocs) populates the cache with unmodified text.
    const raw = await urlListFetcher(queue, fetcher, [url], { cache });
    expect(raw).toBe('see [a](/x/foo.md)');

    // Flush the queued cache write before reading it back.
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    // The rewritten view (useMuiDocs) reads the same cached raw entry and absolutizes on the way out.
    const rewritten = await urlListFetcher(queue, fetcher, [url], { cache, resolveDocLinks: true });
    expect(rewritten).toBe('see [a](https://mui.com/x/foo.md)');
    expect(fetcher).toHaveBeenCalledTimes(1); // served from cache, not refetched
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
    // The guard follows redirects manually, so it fetches with `redirect: 'manual'`.
    expect(fetcher).toHaveBeenCalledWith('https://allowed/page', { redirect: 'manual' });
  });

  it('blocks a redirect that points at a disallowed host (redirect SSRF)', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockResolvedValueOnce(redirectTo('http://localhost:5002/admin'));
    const isUrlAllowed = (url: string) => url.startsWith('https://allowed/');

    const result = await urlListFetcher(queue, fetcher, ['https://allowed/start'], {
      isUrlAllowed,
    });

    expect(result).toContain('blocked for security');
    // The redirect target (localhost) is never fetched.
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('https://allowed/start', { redirect: 'manual' });
  });

  it('follows a redirect to an allowed host', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(redirectTo('https://allowed/final'))
      .mockResolvedValueOnce(ok('final doc'));
    const isUrlAllowed = (url: string) => url.startsWith('https://allowed/');

    const result = await urlListFetcher(queue, fetcher, ['https://allowed/start'], {
      isUrlAllowed,
    });

    expect(result).toBe('final doc');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('gives up after too many redirects', async () => {
    const queue = new PQueue({ concurrency: 1 });
    const fetcher = vi.fn().mockResolvedValue(redirectTo('https://allowed/next'));
    const isUrlAllowed = (url: string) => url.startsWith('https://allowed/');

    const result = await urlListFetcher(queue, fetcher, ['https://allowed/start'], {
      isUrlAllowed,
    });

    expect(result).toMatch(/Could not fetch .*redirects/i);
  });
});

describe('absolutizeDocLinks', () => {
  it('rewrites site-absolute markdown links against the source origin', () => {
    const md = '- [Row selection](/x/react-data-grid/row-selection.md)';
    expect(absolutizeDocLinks(md, 'https://mui.com/x/react-data-grid/llms.txt')).toBe(
      '- [Row selection](https://mui.com/x/react-data-grid/row-selection.md)',
    );
  });

  it('leaves already-absolute URLs, anchors, and mailto links untouched', () => {
    const md = '[a](https://mui.com/x/a.md) [b](#section) [c](mailto:x@mui.com)';
    expect(absolutizeDocLinks(md, 'https://mui.com/x/llms.txt')).toBe(md);
  });

  it('returns the markdown unchanged when the base URL is invalid', () => {
    const md = '[a](/x/a.md)';
    expect(absolutizeDocLinks(md, 'not a url')).toBe(md);
  });
});
