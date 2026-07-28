import { describe, expect, it, vi } from 'vitest';
import { createCodegenTool } from './build';

describe('createCodegenTool', () => {
  it('returns the codegen tool wired to the API-key JWT client, with no network at startup', () => {
    const fetcher = vi.fn();

    const tool = createCodegenTool({
      muiBackendBaseUrl: 'https://api.mui.com',
      recipesBackendBaseUrl: 'https://chat-backend.mui.com',
      fetcher,
    });

    expect(tool.name).toBe('generateReactCode');
    expect(fetcher).not.toHaveBeenCalled(); // eager client, token minted lazily
  });
});
