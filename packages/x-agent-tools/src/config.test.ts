import { describe, expect, it } from 'vitest';
import { resolveAgentToolsConfig } from './config';

describe('resolveAgentToolsConfig', () => {
  it('falls back to the production defaults with no env', () => {
    expect(resolveAgentToolsConfig({})).toEqual({
      docsBaseUrl: 'https://chat-backend.mui.com',
      muiBackendBaseUrl: 'https://api.mui.com',
      recipesBackendBaseUrl: 'https://chat-backend.mui.com',
    });
  });

  it('honors env overrides', () => {
    expect(
      resolveAgentToolsConfig({
        MUI_DOCS_BASE_URL: 'http://localhost:5003',
        MUI_BACKEND_BASE_URL: 'http://localhost:5002',
        MUI_RECIPES_BACKEND_BASE_URL: 'http://localhost:5003',
      }),
    ).toEqual({
      docsBaseUrl: 'http://localhost:5003',
      muiBackendBaseUrl: 'http://localhost:5002',
      recipesBackendBaseUrl: 'http://localhost:5003',
    });
  });
});
