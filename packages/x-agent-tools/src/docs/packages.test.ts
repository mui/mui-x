import { describe, expect, it, vi } from 'vitest';
import {
  compareVersions,
  fetchRemotePackages,
  formatUnknownSourceError,
  normalizePackageName,
  suggestPackageNames,
} from './packages';

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

describe('normalizePackageName', () => {
  it('lowercases and strips non-alphanumerics', () => {
    expect(normalizePackageName('@mui/X-Data-Grid')).toBe('muixdatagrid');
    expect(normalizePackageName('@mui/x-data-grid')).toBe('muixdatagrid');
  });

  it('returns an empty string for input with no alphanumerics', () => {
    expect(normalizePackageName('@/-')).toBe('');
  });
});

describe('suggestPackageNames', () => {
  const known = ['@mui/material', '@mui/x-data-grid', '@mui/x-charts', '@mui/x-tree-view'];

  it('matches despite case and punctuation differences (dash typo)', () => {
    expect(suggestPackageNames('@mui/X-DataGrid', known)).toContain('@mui/x-data-grid');
  });

  it('matches when the query is contained in a known name', () => {
    expect(suggestPackageNames('material', known)).toContain('@mui/material');
  });

  it('returns an empty array when nothing is close', () => {
    expect(suggestPackageNames('@acme/widget', known)).toEqual([]);
  });

  it('returns an empty array for a query with no alphanumerics', () => {
    expect(suggestPackageNames('@/-', known)).toEqual([]);
  });

  it('caps suggestions at 5', () => {
    const many = Array.from({ length: 8 }, (_, i) => `@mui/x-thing-${i}`);
    // Each name contains the normalized query, so all match, but the result is capped.
    expect(suggestPackageNames('@mui/x-thing', many)).toHaveLength(5);
  });
});

describe('formatUnknownSourceError', () => {
  const versionsByName = new Map<string, string[]>([
    ['@mui/x-data-grid', ['8.29.1', '9.7.0']],
    ['@mui/material', ['5.18.0', '9.1.2']],
  ]);
  const knownNames = ['@mui/material', '@mui/x-data-grid'];

  it('lists available versions when the package is known but the version is not', () => {
    const msg = formatUnknownSourceError('@mui/x-data-grid@8.29.0', versionsByName, knownNames);
    expect(msg).toBe(
      'Unknown package or version: "@mui/x-data-grid@8.29.0". Available versions of @mui/x-data-grid: 8.29.1, 9.7.0.',
    );
  });

  it('suggests a near match for a typo in the package name', () => {
    const msg = formatUnknownSourceError('@mui/x-datagrid', versionsByName, knownNames); // missing dash
    expect(msg).toBe('Unknown package: "@mui/x-datagrid". Did you mean one of: @mui/x-data-grid?');
  });

  it('falls back to listing all packages when there is no near match', () => {
    const msg = formatUnknownSourceError('@mui/nonexistent', versionsByName, knownNames);
    expect(msg).toBe(
      'Unknown package: "@mui/nonexistent". Available packages: @mui/material, @mui/x-data-grid.',
    );
  });

  it('treats the scope `@` as part of the name, not a version separator', () => {
    const msg = formatUnknownSourceError('@mui/unknown', versionsByName, knownNames);
    expect(msg).toContain('Unknown package: "@mui/unknown"');
    expect(msg).not.toContain('Unknown package or version');
  });

  it('reports an unknown package (not version) when the package itself is not shipped', () => {
    const msg = formatUnknownSourceError('@mui/ghost@1.0.0', versionsByName, knownNames);
    expect(msg).toContain('Unknown package: "@mui/ghost"');
    expect(msg).not.toContain('1.0.0');
  });
});
