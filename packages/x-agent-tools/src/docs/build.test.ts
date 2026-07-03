import { describe, expect, it, vi } from 'vitest';
import { createDocsTools } from './build';

const docsBaseUrl = 'https://chat-backend.mui.com';

const catalog = [
  {
    name: '@mui/material',
    version: '9.1.2',
    llmsUrl: 'https://llms.mui.com/material-ui/9.1.2/llms.txt',
    llmsFullUrl: 'https://llms.mui.com/material-ui/9.1.2/llms-full.txt',
  },
];

const jsonResponse = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

describe('createDocsTools', () => {
  it('resolves both docs tools when the catalog is reachable', async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse(catalog));

    const { fetchDocsTool, useMuiDocsReady } = await createDocsTools({
      docsBaseUrl,
      fetcher,
      retryDelaysMs: [],
    });

    expect(fetchDocsTool.name).toBe('fetchDocs');
    expect((await useMuiDocsReady)?.name).toBe('useMuiDocs');
  });

  it('keeps fetchDocs but settles useMuiDocs to null (and logs) when the catalog is unreachable', async () => {
    const logger = vi.fn();
    const fetcher = vi.fn().mockResolvedValue(jsonResponse('<html>502</html>', 502));

    const { fetchDocsTool, useMuiDocsReady } = await createDocsTools({
      docsBaseUrl,
      fetcher,
      logger,
      retryDelaysMs: [0],
    });

    expect(fetchDocsTool.name).toBe('fetchDocs');
    expect(await useMuiDocsReady).toBeNull();
    expect(logger).toHaveBeenCalledWith(
      expect.stringContaining('useMuiDocs is unavailable'),
      expect.any(Error),
    );
  });

  it('retries the catalog fetch before giving up (recovers from a cold start)', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('cold start'))
      .mockResolvedValueOnce(jsonResponse(catalog));

    const { useMuiDocsReady } = await createDocsTools({ docsBaseUrl, fetcher, retryDelaysMs: [0] });

    expect((await useMuiDocsReady)?.name).toBe('useMuiDocs');
    expect(fetcher).toHaveBeenCalledTimes(2); // failed once, retried once
  });

  it('returns fetchDocs immediately without waiting on the catalog (a hung backend never blocks it)', async () => {
    // A catalog fetch that never settles: the old bundled design would hang here forever.
    const fetcher = vi.fn((): Promise<Response> => new Promise(() => {}));

    const { fetchDocsTool, useMuiDocsReady } = await createDocsTools({
      docsBaseUrl,
      fetcher,
      retryDelaysMs: [],
    });

    expect(fetchDocsTool.name).toBe('fetchDocs');
    // useMuiDocsReady stays pending; it must not have been awaited to get here.
    void useMuiDocsReady;
  });

  it('times out a hung catalog connection so useMuiDocsReady settles to null', async () => {
    const logger = vi.fn();
    // Connection accepted but never answered; only the timeout's abort signal ends it.
    const fetcher = vi.fn(
      (_url: string | URL | Request, init?: RequestInit): Promise<Response> =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );

    const { fetchDocsTool, useMuiDocsReady } = await createDocsTools({
      docsBaseUrl,
      fetcher,
      logger,
      retryDelaysMs: [0],
      catalogTimeoutMs: 5,
    });

    expect(fetchDocsTool.name).toBe('fetchDocs');
    expect(await useMuiDocsReady).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(2); // first attempt aborted, one retry, also aborted
    expect(logger).toHaveBeenCalledWith(
      expect.stringContaining('useMuiDocs is unavailable'),
      expect.any(Error),
    );
  });
});
