import { describe, expect, it, vi } from 'vitest';
import { createUseMuiDocsTool, createFetchDocTool } from './docs';
import { LRUCache } from './cache';
import { compareVersions } from './utils';

const ok = (body: string): Response => new Response(body, { status: 200 });

const samplePackages = [
  {
    name: '@mui/material',
    version: '6.0.0',
    llmsUrl: 'https://llms.example/material',
    llmsFullUrl: 'https://llms.example/material/full',
  },
];

// Mirrors the real catalog: several versions of the same package, deliberately not in ascending
// order, so tests can prove version selection isn't just "first/last entry wins".
const multiVersionPackages = [
  {
    name: '@mui/material',
    version: '5.18.0',
    llmsUrl: 'https://llms.example/material/5.18.0',
    llmsFullUrl: 'https://llms.example/material/5.18.0/full',
  },
  {
    name: '@mui/material',
    version: '9.1.2',
    llmsUrl: 'https://llms.example/material/9.1.2',
    llmsFullUrl: 'https://llms.example/material/9.1.2/full',
  },
  {
    name: '@mui/x-data-grid',
    version: '8.29.0',
    llmsUrl: 'https://llms.example/x-data-grid/8.29.0',
    llmsFullUrl: 'https://llms.example/x-data-grid/8.29.0/full',
  },
];

describe('createUseMuiDocsTool', () => {
  it('builds a tool with the expected identity and schema metadata', async () => {
    const tool = await createUseMuiDocsTool({ getPackagesList: async () => samplePackages });

    expect(tool.name).toBe('use_mui_docs');
    expect(tool.publicName).toBe('useMuiDocs');
  });

  it('embeds the available package list (name@version + llms URL) in the description', async () => {
    const tool = await createUseMuiDocsTool({ getPackagesList: async () => samplePackages });

    expect(tool.description).toContain('[@mui/material@6.0.0](https://llms.example/material)');
  });

  it('fetches the requested URLs on execute', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('the docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => samplePackages,
      fetcher,
    });

    const result = await tool.execute({ sources: ['https://llms.example/material'] });

    expect(result).toBe('the docs');
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/material');
  });

  it('resolves a bare package name to its llms.txt URL', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('the docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => samplePackages,
      fetcher,
    });

    const result = await tool.execute({ sources: ['@mui/material'] });

    expect(result).toBe('the docs');
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/material');
  });

  it("resolves a `name@version` shorthand to that version's llms.txt URL", async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('material-ui 9.1.2 docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => multiVersionPackages,
      fetcher,
    });

    const result = await tool.execute({ sources: ['@mui/material@9.1.2'] });

    expect(result).toContain('material-ui 9.1.2');
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/material/9.1.2');
  });

  it('resolves a `name@version` shorthand per package (no cross-package regression)', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('x-data-grid 8.29.0 docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => multiVersionPackages,
      fetcher,
    });

    const result = await tool.execute({ sources: ['@mui/x-data-grid@8.29.0'] });

    expect(result).toContain('x-data-grid 8.29.0');
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/x-data-grid/8.29.0');
  });

  it('resolves a bare package name to its highest-semver entry, not the last listed', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('the docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => multiVersionPackages,
      fetcher,
    });

    // Compute the expected URL dynamically so the assertion tracks the fixture, not a hardcode.
    const materialVersions = multiVersionPackages.filter((it) => it.name === '@mui/material');
    const latest = materialVersions.reduce((a, b) =>
      compareVersions(a.version, b.version) >= 0 ? a : b,
    );

    await tool.execute({ sources: ['@mui/material'] });

    expect(fetcher).toHaveBeenCalledWith(latest.llmsUrl);
    expect(latest.version).toBe('9.1.2');
  });

  it('rewrites site-absolute links in the response to absolute URLs', async () => {
    const llms = '# Docs\n- [Row selection](/x/react-data-grid/row-selection.md)';
    const fetcher = vi.fn().mockResolvedValue(ok(llms));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => samplePackages,
      fetcher,
    });

    const result = await tool.execute({ sources: ['https://llms.example/material'] });

    expect(result).toContain('](https://llms.example/x/react-data-grid/row-selection.md)');
    expect(result).not.toContain('](/x/react-data-grid/row-selection.md)');
  });

  it('applies name and description overrides', async () => {
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => samplePackages,
      overrides: { name: 'custom_name', description: 'custom description' },
    });

    expect(tool.name).toBe('custom_name');
    expect(tool.description).toBe('custom description');
  });

  it('enforces the injected isUrlAllowed guard before fetching', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('secret'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => samplePackages,
      fetcher,
      isUrlAllowed: (url) => url.startsWith('https://llms.example/'),
    });

    const result = await tool.execute({ sources: ['http://169.254.169.254/latest/meta-data/'] });

    expect(result).toContain('blocked for security');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('passes a direct llms.txt URL through the allowlist guard', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('material-ui 9.1.2 docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => multiVersionPackages,
      fetcher,
      isUrlAllowed: (url) => url.startsWith('https://llms.example/'),
    });

    const result = await tool.execute({ sources: ['https://llms.example/material/9.1.2'] });

    expect(result).toContain('material-ui 9.1.2');
    // The guarded path follows redirects manually, so the fetcher gets a `{ redirect: 'manual' }` arg.
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/material/9.1.2', expect.anything());
  });

  it('resolves a `name@version` shorthand to a URL that clears the allowlist guard', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('material-ui 9.1.2 docs'));
    const tool = await createUseMuiDocsTool({
      getPackagesList: async () => multiVersionPackages,
      fetcher,
      isUrlAllowed: (url) => url.startsWith('https://llms.example/'),
    });

    const result = await tool.execute({ sources: ['@mui/material@9.1.2'] });

    expect(result).toContain('material-ui 9.1.2');
    expect(result).not.toContain('blocked for security');
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/material/9.1.2', expect.anything());
  });
});

describe('createFetchDocTool', () => {
  it('builds a tool with the expected identity', async () => {
    const tool = await createFetchDocTool({});

    expect(tool.name).toBe('fetch_docs');
    expect(tool.publicName).toBe('fetchDocs');
  });

  it('fetches and joins the requested URLs on execute', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(ok('doc-1')).mockResolvedValueOnce(ok('doc-2'));
    const tool = await createFetchDocTool({ fetcher });

    const result = await tool.execute({ urls: ['u1', 'u2'] });

    expect(result).toBe('doc-1\ndoc-2');
  });

  it('applies name and description overrides', async () => {
    const tool = await createFetchDocTool({
      overrides: { name: 'custom_fetch', description: 'custom description' },
    });

    expect(tool.name).toBe('custom_fetch');
    expect(tool.description).toBe('custom description');
  });

  it('reports fetch failures through the injected logger', async () => {
    const logger = vi.fn();
    const fetcher = vi.fn().mockRejectedValue(new Error('network down'));
    const tool = await createFetchDocTool({ fetcher, logger });

    const result = await tool.execute({ urls: ['u1'] });

    expect(result).toBe('Could not fetch u1: network down');
    expect(logger).toHaveBeenCalledWith('Failed to fetch u1:', expect.any(Error));
  });

  it('enforces the injected isUrlAllowed guard before fetching', async () => {
    const fetcher = vi.fn().mockResolvedValue(ok('secret'));
    const tool = await createFetchDocTool({
      fetcher,
      isUrlAllowed: (url) => url.startsWith('https://allowed/'),
    });

    const result = await tool.execute({ urls: ['http://localhost:5002/admin'] });

    expect(result).toContain('blocked for security');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('forwards the abort signal from the call context to the underlying fetch', async () => {
    const controller = new AbortController();
    const fetcher = vi.fn().mockResolvedValue(ok('docs'));
    const tool = await createFetchDocTool({ fetcher });

    await tool.execute({ urls: ['https://llms.example/a'] }, { signal: controller.signal });

    expect(fetcher).toHaveBeenCalledWith(
      'https://llms.example/a',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('reuses a shared LRUCache across tools so the second tool serves from cache', async () => {
    const cache = new LRUCache();
    const fetcher = vi.fn().mockResolvedValue(ok('shared docs'));

    const toolA = await createFetchDocTool({ fetcher, cache });
    await toolA.execute({ urls: ['https://llms.example/a'] });
    // Let the queued microtask that writes the cache flush before the second read.
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const toolB = await createFetchDocTool({ fetcher, cache });
    const result = await toolB.execute({ urls: ['https://llms.example/a'] });

    expect(result).toBe('shared docs');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
