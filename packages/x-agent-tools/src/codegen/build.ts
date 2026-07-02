import { ApiKeyJwtClient } from '../auth/api-key-jwt-client';
import { createGenerateReactCodeTool, type GenerateReactCodeTool } from './tools';
import type { Logger } from '../types';

export interface CreateCodegenToolOptions {
  /** mui-backend base URL, where the API key is exchanged for a JWT. */
  muiBackendBaseUrl: string;
  /** recipes-backend base URL, where codegen runs. */
  recipesBackendBaseUrl: string;
  /** Surfaces swallowed failures (e.g. `onProgress` bugs). Silent by default. */
  logger?: Logger;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
}

/**
 * Wire the API-key JWT client to the codegen tool. Needs no network at startup: the JWT client is
 * eager but the API key is only resolved on the first `getToken()`.
 */
export function createCodegenTool(options: CreateCodegenToolOptions): GenerateReactCodeTool {
  const jwtClient = new ApiKeyJwtClient({
    muiBackendBaseUrl: options.muiBackendBaseUrl,
    fetcher: options.fetcher,
  });
  return createGenerateReactCodeTool({
    recipesBackendBaseUrl: options.recipesBackendBaseUrl,
    getToken: (opts) => jwtClient.getToken(opts),
    invalidateToken: () => jwtClient.invalidate(),
    logger: options.logger,
    fetcher: options.fetcher,
  });
}
