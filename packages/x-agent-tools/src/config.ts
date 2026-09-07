// Env var names + backend defaults. Product contract (which service to reach), not MCP protocol, so
// they live here where every host (MCP, CLI, ACP) resolves config the same way.
export const DOCS_BASE_URL_ENV = 'MUI_DOCS_BASE_URL';
export const MUI_BACKEND_BASE_URL_ENV = 'MUI_BACKEND_BASE_URL';
export const RECIPES_BACKEND_BASE_URL_ENV = 'MUI_RECIPES_BACKEND_BASE_URL';
// `api.mui.com` is the public alias for mui-backend; chat-backend serves both docs and codegen today
// but each keeps its own override so they can diverge.
export const DEFAULT_DOCS_BASE_URL = 'https://chat-backend.mui.com';
export const DEFAULT_MUI_BACKEND_BASE_URL = 'https://api.mui.com';
export const DEFAULT_RECIPES_BACKEND_BASE_URL = 'https://chat-backend.mui.com';

export interface AgentToolsConfig {
  docsBaseUrl: string;
  muiBackendBaseUrl: string;
  recipesBackendBaseUrl: string;
}

/** Resolve the backend config from env vars, falling back to the production defaults. */
export function resolveAgentToolsConfig(
  env: Record<string, string | undefined> = process.env,
): AgentToolsConfig {
  return {
    docsBaseUrl: env[DOCS_BASE_URL_ENV] ?? DEFAULT_DOCS_BASE_URL,
    muiBackendBaseUrl: env[MUI_BACKEND_BASE_URL_ENV] ?? DEFAULT_MUI_BACKEND_BASE_URL,
    recipesBackendBaseUrl: env[RECIPES_BACKEND_BASE_URL_ENV] ?? DEFAULT_RECIPES_BACKEND_BASE_URL,
  };
}
