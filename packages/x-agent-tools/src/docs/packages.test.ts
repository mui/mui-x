import { describe, expect, it, vi } from 'vitest';
import { compareVersions, fetchRemotePackages } from './packages';

const DOCS_BASE_URL = 'https://chat-backend.mui.com';
const LIST_PATH = '/v1/public/packages/list';

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

describe('fetchRemotePackages', () => {
  it('composes the list path against the docs base URL it is given', async () => {
    const fetcher = vi.fn().mockResolvedValue(json([{ name: '@mui/material' }]));
    const result = await fetchRemotePackages(DOCS_BASE_URL, fetcher);
    expect(fetcher).toHaveBeenCalledWith(`${DOCS_BASE_URL}${LIST_PATH}`);
    expect(result).toEqual([{ name: '@mui/material' }]);
  });

  it('composes the list path against a local dev base URL', async () => {
    const fetcher = vi.fn().mockResolvedValue(json([{ name: '@mui/material' }]));
    await fetchRemotePackages('http://localhost:5003', fetcher);
    expect(fetcher).toHaveBeenCalledWith(`http://localhost:5003${LIST_PATH}`);
  });

  it('throws an actionable MUI X error when the response is an empty array', async () => {
    const fetcher = vi.fn().mockResolvedValue(json([]));
    await expect(fetchRemotePackages(DOCS_BASE_URL, fetcher)).rejects.toThrow(
      /MUI X Agent Tools: .*returned no packages/,
    );
  });

  it('throws an actionable MUI X error when the response is not an array', async () => {
    const fetcher = vi.fn().mockResolvedValue(json({ unexpected: 'shape' }));
    await expect(fetchRemotePackages(DOCS_BASE_URL, fetcher)).rejects.toThrow(
      /MUI X Agent Tools: .*returned no packages/,
    );
  });

  it('propagates network errors from the fetcher (host can decide to retry)', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(fetchRemotePackages(DOCS_BASE_URL, fetcher)).rejects.toThrow(/ECONNREFUSED/);
  });

  it('wraps a non-JSON 200 body in an actionable MUI X error', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('not valid json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    await expect(fetchRemotePackages(DOCS_BASE_URL, fetcher)).rejects.toThrow(
      /MUI X Agent Tools: .*non-JSON response/,
    );
  });

  it('throws an actionable MUI X error on a non-ok response (e.g. a 502 proxy page)', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('<html>502 Bad Gateway</html>', {
        status: 502,
        headers: { 'content-type': 'text/html' },
      }),
    );
    await expect(fetchRemotePackages(DOCS_BASE_URL, fetcher)).rejects.toThrow(
      /MUI X Agent Tools: .*HTTP 502/,
    );
  });
});

describe('compareVersions', () => {
  it('orders by major, then minor, then patch', () => {
    expect(compareVersions('9.1.2', '5.18.0')).toBeGreaterThan(0);
    expect(compareVersions('5.18.0', '9.1.2')).toBeLessThan(0);
    expect(compareVersions('8.29.0', '8.30.0')).toBeLessThan(0);
    expect(compareVersions('8.29.1', '8.29.0')).toBeGreaterThan(0);
  });

  it('does not compare version parts as strings', () => {
    // "18" > "9" numerically, even though "18" < "9" lexically.
    expect(compareVersions('5.18.0', '5.9.0')).toBeGreaterThan(0);
  });

  it('treats equal versions as equal', () => {
    expect(compareVersions('9.1.2', '9.1.2')).toBe(0);
  });

  it('ranks a prerelease below its release', () => {
    expect(compareVersions('9.1.2-beta.1', '9.1.2')).toBeLessThan(0);
    expect(compareVersions('9.1.2', '9.1.2-beta.1')).toBeGreaterThan(0);
    expect(compareVersions('9.1.2-beta.2', '9.1.2-beta.1')).toBeGreaterThan(0);
  });
});
