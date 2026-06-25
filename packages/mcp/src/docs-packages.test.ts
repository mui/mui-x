import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRemotePackages } from './docs-packages';

const PROD_DEFAULT = 'https://chat-backend.mui.com';
const LIST_PATH = '/v1/public/packages/list';

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

describe('fetchRemotePackages', () => {
  beforeEach(() => {
    delete process.env.MUI_DOCS_BASE_URL;
  });
  afterEach(() => {
    delete process.env.MUI_DOCS_BASE_URL;
  });

  it('hits the production docs URL by default', async () => {
    const fetcher = vi.fn().mockResolvedValue(json([{ name: '@mui/material' }]));
    const result = await fetchRemotePackages(fetcher);
    expect(fetcher).toHaveBeenCalledWith(`${PROD_DEFAULT}${LIST_PATH}`);
    expect(result).toEqual([{ name: '@mui/material' }]);
  });

  it('honors the MUI_DOCS_BASE_URL env override for local dev', async () => {
    process.env.MUI_DOCS_BASE_URL = 'http://localhost:5003';
    const fetcher = vi.fn().mockResolvedValue(json([{ name: '@mui/material' }]));
    await fetchRemotePackages(fetcher);
    expect(fetcher).toHaveBeenCalledWith(`http://localhost:5003${LIST_PATH}`);
  });

  it('throws an actionable MUI X error when the response is an empty array', async () => {
    const fetcher = vi.fn().mockResolvedValue(json([]));
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/MUI X MCP: .*returned no packages/);
  });

  it('throws an actionable MUI X error when the response is not an array', async () => {
    const fetcher = vi.fn().mockResolvedValue(json({ unexpected: 'shape' }));
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/MUI X MCP: .*returned no packages/);
  });

  it('propagates network errors from the fetcher (host can decide to retry)', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/ECONNREFUSED/);
  });

  it('propagates JSON parse errors (malformed body from upstream)', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('not valid json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow();
  });

  it('throws when the response body is HTML (e.g. proxy error page on non-200)', async () => {
    // Even with non-200 status, current behavior is to read the body and try to parse as
    // JSON. HTML body throws on `.json()`, which we propagate. This locks the contract.
    const fetcher = vi.fn().mockResolvedValue(
      new Response('<html>502 Bad Gateway</html>', {
        status: 502,
        headers: { 'content-type': 'text/html' },
      }),
    );
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow();
  });
});
