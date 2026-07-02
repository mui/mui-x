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

    const { fetchDocsTool, useMuiDocsTool } = await createDocsTools({
      docsBaseUrl,
      fetcher,
      retryDelaysMs: [],
    });

    expect(fetchDocsTool.name).toBe('fetchDocs');
    expect(useMuiDocsTool?.name).toBe('useMuiDocs');
  });

  it('keeps fetchDocs but leaves useMuiDocs null (and logs) when the catalog is unreachable', async () => {
    const logger = vi.fn();
    const fetcher = vi.fn().mockResolvedValue(jsonResponse('<html>502</html>', 502));

    const { fetchDocsTool, useMuiDocsTool } = await createDocsTools({
      docsBaseUrl,
      fetcher,
      logger,
      retryDelaysMs: [0],
    });

    expect(fetchDocsTool.name).toBe('fetchDocs');
    expect(useMuiDocsTool).toBeNull();
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

    const { useMuiDocsTool } = await createDocsTools({ docsBaseUrl, fetcher, retryDelaysMs: [0] });

    expect(useMuiDocsTool?.name).toBe('useMuiDocs');
    expect(fetcher).toHaveBeenCalledTimes(2); // failed once, retried once
  });
});
