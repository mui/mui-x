export interface AuthedFetchOptions {
  fetcher: typeof fetch;
  getToken: (options?: { signal?: AbortSignal }) => Promise<string>;
  invalidateToken?: () => void;
  signal?: AbortSignal;
}

/**
 * Build a JWT-authed fetch: attaches a Bearer token via `buildInit(token)`, and on a 401 (token
 * expired mid-flight) refreshes the token and retries once. Fetches the token once and reuses it
 * across requests, so it doesn't assume `getToken` caches. Make one per operation.
 */
export function createAuthedFetch(options: AuthedFetchOptions) {
  let token: string | undefined;
  return async (url: string, buildInit: (jwt: string) => RequestInit): Promise<Response> => {
    if (token === undefined) {
      token = await options.getToken({ signal: options.signal });
    }
    const response = await sendGuarded(options.fetcher, url, buildInit(token));
    if (response.status !== 401) {
      return response;
    }
    options.invalidateToken?.();
    token = await options.getToken({ signal: options.signal });
    return sendGuarded(options.fetcher, url, buildInit(token));
  };
}

// Turn a fetch rejection (unreachable host, TLS/proxy failure) into a prefixed error, not a raw TypeError.
async function sendGuarded(
  fetcher: typeof fetch,
  url: string,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetcher(url, init);
  } catch (cause) {
    throw new Error(
      `MUI X Agent Tools: Request to ${hostOf(url)} failed: ${cause instanceof Error ? cause.message : String(cause)}. Check that the backend URL is reachable, then retry.`,
    );
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
