export interface AuthedFetchOptions {
  fetcher: typeof fetch;
  getToken: (options?: { signal?: AbortSignal }) => Promise<string>;
  invalidateToken?: () => void;
  signal?: AbortSignal;
}

/**
 * Build a fetch that attaches a Bearer JWT via `buildInit(token)` and, on a 401 (token expired
 * mid-flight), invalidates the cached token, mints a fresh one, and retries the request once. The
 * token is fetched lazily and reused across calls, so create one per logical operation.
 */
export function createAuthedFetch(options: AuthedFetchOptions) {
  let token: string | undefined;
  return async (url: string, buildInit: (jwt: string) => RequestInit): Promise<Response> => {
    if (token === undefined) {
      token = await options.getToken({ signal: options.signal });
    }
    const response = await options.fetcher(url, buildInit(token));
    if (response.status !== 401) {
      return response;
    }
    options.invalidateToken?.();
    token = await options.getToken({ signal: options.signal });
    return options.fetcher(url, buildInit(token));
  };
}
