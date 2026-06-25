import { version } from '../package.json';

export const SERVER_NAME = 'mui-mcp';
export const SERVER_VERSION = version;

export const DEFAULT_DOCS_BASE_URL = 'https://chat-backend.mui.com';
export const PACKAGES_LIST_PATH = '/v1/public/packages/list';
export const DOCS_FETCH_CONCURRENCY = 10;

// Token exchange (mui-backend) + codegen (recipes-backend); override per host via env vars.
// `api.mui.com` is the public alias for mui-backend.
export const DEFAULT_MUI_BACKEND_BASE_URL = 'https://api.mui.com';
// Same host as DEFAULT_DOCS_BASE_URL today (recipes-backend serves both); kept separate so
// each tool keeps its own env-var override.
export const DEFAULT_RECIPES_BACKEND_BASE_URL = 'https://chat-backend.mui.com';

export const MUI_BACKEND_BASE_URL_ENV = 'MUI_BACKEND_BASE_URL';
export const RECIPES_BACKEND_BASE_URL_ENV = 'MUI_RECIPES_BACKEND_BASE_URL';
export const DOCS_BASE_URL_ENV = 'MUI_DOCS_BASE_URL';

export const FETCH_DOCS_DESCRIPTION = `Fetch documentation for one or more URLs extracted from previous tool calls responses. The URLs should be passed as an array in the "urls" argument.`;

export const STARTUP_ERROR_MESSAGE =
  '\n\x1b[1mAn error was encountered while starting the MCP server.\x1b[0m\n\nPlease share the error details and your setup information in the "docs-feedback" channel of the official Discord server: \x1b[1mhttps://mui.com/r/discord\x1b[0m.\n';
