import { describe, expect, it, vi } from 'vitest';
import { createMuiAgentToolset } from './toolset';
import { LRUCache } from './utils/cache';
import type { AgentToolsConfig } from './config';

const config: AgentToolsConfig = {
  docsBaseUrl: 'https://chat-backend.mui.com',
  muiBackendBaseUrl: 'https://api.mui.com',
  recipesBackendBaseUrl: 'https://chat-backend.mui.com',
};

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

describe('createMuiAgentToolset', () => {
  it('exposes codegen + fetchDocs immediately and resolves useMuiDocs after the catalog settles', async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse(catalog));

    const toolset = await createMuiAgentToolset(config, { fetcher, retryDelaysMs: [] });

    expect(toolset.codegenTool.name).toBe('generateReactCode');
    expect(toolset.fetchDocsTool.name).toBe('fetchDocs');
    const useMuiDocsTool = await toolset.useMuiDocsReady;
    expect(useMuiDocsTool?.name).toBe('useMuiDocs');
  });

  it('exposes dispose() that tears down the docs resources', async () => {
    const cacheDispose = vi.spyOn(LRUCache.prototype, 'dispose');
    const fetcher = vi.fn().mockResolvedValue(jsonResponse(catalog));

    const toolset = await createMuiAgentToolset(config, { fetcher, retryDelaysMs: [] });
    await toolset.useMuiDocsReady;

    toolset.dispose();

    expect(cacheDispose).toHaveBeenCalledTimes(1);
    cacheDispose.mockRestore();
  });
});
