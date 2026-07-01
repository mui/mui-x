import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRemotePackages } from './packages';

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
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/MUI MCP: .*returned no packages/);
  });

  it('throws an actionable MUI X error when the response is not an array', async () => {
    const fetcher = vi.fn().mockResolvedValue(json({ unexpected: 'shape' }));
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/MUI MCP: .*returned no packages/);
  });

  it('propagates network errors from the fetcher (host can decide to retry)', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/ECONNREFUSED/);
  });

  it('wraps a non-JSON 200 body in an actionable MUI MCP error', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('not valid json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/MUI MCP: .*non-JSON response/);
  });

  it('throws an actionable MUI MCP error on a non-ok response (e.g. a 502 proxy page)', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('<html>502 Bad Gateway</html>', {
        status: 502,
        headers: { 'content-type': 'text/html' },
      }),
    );
    await expect(fetchRemotePackages(fetcher)).rejects.toThrow(/MUI MCP: .*HTTP 502/);
  });
});
