import { describe, expect, it, vi } from 'vitest';
import { createMuiAgentToolset } from './toolset';
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
  it('composes the codegen tool (immediate) and the docs tools (async)', async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse(catalog));

    const toolset = createMuiAgentToolset(config, { fetcher, retryDelaysMs: [] });

    expect(toolset.codegenTool.name).toBe('generateReactCode');
    const { fetchDocsTool, useMuiDocsTool } = await toolset.docsToolsReady;
    expect(fetchDocsTool.name).toBe('fetchDocs');
    expect(useMuiDocsTool?.name).toBe('useMuiDocs');
  });
});
