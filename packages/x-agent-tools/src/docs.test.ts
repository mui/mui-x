import { describe, expect, it, vi } from 'vitest';
import { createUseMuiDocsTool, createFetchDocTool } from './docs';

const ok = (body: string): Response => new Response(body, { status: 200 });

const samplePackages = [
  {
    name: '@mui/material',
    version: '6.0.0',
    llmsUrl: 'https://llms.example/material',
    llmsFullUrl: 'https://llms.example/material/full',
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

    const result = await tool.execute({ urlList: ['https://llms.example/material'] });

    expect(result).toBe('the docs');
    expect(fetcher).toHaveBeenCalledWith('https://llms.example/material');
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

    const result = await tool.execute({ urlList: ['http://169.254.169.254/latest/meta-data/'] });

    expect(result).toContain('blocked for security');
    expect(fetcher).not.toHaveBeenCalled();
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
});
