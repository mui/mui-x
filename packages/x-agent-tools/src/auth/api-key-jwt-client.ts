/** API-key -> JWT exchange client. In-memory cache, 30s refresh window, concurrent-call dedup. */

export const DEFAULT_REFRESH_THRESHOLD_MS = 30_000;
export const RECIPES_API_KEY_ENV = 'MUI_RECIPES_API_KEY';
export const TOKEN_EXCHANGE_PATH = '/api/auth/tokens';
// Cap the exchange so a hung endpoint can't wedge the shared refresh.
const TOKEN_EXCHANGE_TIMEOUT_MS = 30_000;

export type ApiKeyJwtClientOptions = {
  /** Base URL of mui-backend (no trailing slash). */
  muiBackendBaseUrl: string;
  /** Override the API key resolved from `MUI_RECIPES_API_KEY`. Useful for tests. */
  apiKey?: string;
  /** Refresh the token this many ms before `expiresAt`. Defaults to 30 s. */
  refreshThresholdMs?: number;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
};

export class ApiKeyJwtClientError extends Error {
  public readonly code:
    | 'missing_api_key'
    | 'api_key_invalid'
    | 'api_key_forbidden'
    | 'token_exchange_failed';

  public readonly status?: number;

  public readonly cause?: unknown;

  public constructor(
    code: ApiKeyJwtClientError['code'],
    message: string,
    options: { status?: number; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'ApiKeyJwtClientError';
    this.code = code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

type TokenExchangeResponse = {
  token: string;
  expiresAt: string;
};

export class ApiKeyJwtClient {
  private readonly muiBackendBaseUrl: string;

  private readonly apiKeyOverride: string | undefined;

  private readonly refreshThresholdMs: number;

  private readonly fetcher: typeof fetch;

  private cachedToken: string | null = null;

  private cachedExpiresAt: Date | null = null;

  private inflight: Promise<string> | null = null;

  public constructor(options: ApiKeyJwtClientOptions) {
    if (!options.muiBackendBaseUrl) {
      throw new ApiKeyJwtClientError(
        'token_exchange_failed',
        'MUI X Agent Tools: muiBackendBaseUrl is required to exchange the API key for a JWT.',
      );
    }
    this.muiBackendBaseUrl = options.muiBackendBaseUrl.replace(/\/+$/, '');
    this.apiKeyOverride = options.apiKey;
    this.refreshThresholdMs = options.refreshThresholdMs ?? DEFAULT_REFRESH_THRESHOLD_MS;
    this.fetcher = options.fetcher ?? globalThis.fetch;
  }

  /**
   * Returns a JWT that's fresh for at least `refreshThresholdMs`, refreshing if the cache is empty
   * or near expiry. Concurrent callers share the one in-flight refresh.
   */
  public async getToken(options: { signal?: AbortSignal } = {}): Promise<string> {
    if (this.isCachedTokenFresh()) {
      return this.cachedToken!;
    }
    if (!this.inflight) {
      // Shared by all callers, so it's not tied to one caller's signal: cancelling just drops that
      // caller's wait (below); the exchange keeps going and caches the token.
      this.inflight = this.refresh().finally(() => {
        this.inflight = null;
      });
    }
    return waitForToken(this.inflight, options.signal);
  }

  /** Clears the cache. The next `getToken()` will refresh. */
  public invalidate(): void {
    this.cachedToken = null;
    this.cachedExpiresAt = null;
  }

  private isCachedTokenFresh(): boolean {
    if (!this.cachedToken || !this.cachedExpiresAt) {
      return false;
    }
    return Date.now() + this.refreshThresholdMs < this.cachedExpiresAt.getTime();
  }

  private resolveApiKey(): string {
    const key = this.apiKeyOverride ?? process.env[RECIPES_API_KEY_ENV];
    if (!key) {
      throw new ApiKeyJwtClientError(
        'missing_api_key',
        `MUI X Agent Tools: Missing API key. Set the ${RECIPES_API_KEY_ENV} env var (or pass apiKey to ApiKeyJwtClient). Create a key at console.mui.com/products/recipes/api-keys.`,
      );
    }
    return key;
  }

  private async refresh(): Promise<string> {
    const apiKey = this.resolveApiKey();
    const url = `${this.muiBackendBaseUrl}${TOKEN_EXCHANGE_PATH}`;

    // Internal timeout so a dead endpoint can't wedge `inflight`; covers the body read too, since
    // the fetch signal also aborts a stalled response stream.
    const timeoutController = new AbortController();
    const timeout = setTimeout(() => timeoutController.abort(), TOKEN_EXCHANGE_TIMEOUT_MS);

    try {
      let response: Response;
      try {
        response = await this.fetcher(url, {
          method: 'POST',
          headers: { 'x-api-key': apiKey, accept: 'application/json' },
          // Fail on redirects so the API key can't be resent to another origin.
          redirect: 'error',
          signal: timeoutController.signal,
        });
      } catch (cause) {
        throw new ApiKeyJwtClientError(
          'token_exchange_failed',
          `MUI X Agent Tools: Token exchange failed: ${cause instanceof Error ? cause.message : String(cause)}. Retry shortly.`,
          { cause },
        );
      }

      if (response.status === 401) {
        this.invalidate();
        throw new ApiKeyJwtClientError(
          'api_key_invalid',
          'MUI X Agent Tools: API key invalid or revoked. Create a new one at console.mui.com/products/recipes/api-keys.',
          { status: 401 },
        );
      }
      if (response.status === 403) {
        this.invalidate();
        throw new ApiKeyJwtClientError(
          'api_key_forbidden',
          "MUI X Agent Tools: API key is not authorized to mint a JWT (organization membership may have been lost). Verify the key's owner and try again.",
          { status: 403 },
        );
      }
      if (!response.ok) {
        throw new ApiKeyJwtClientError(
          'token_exchange_failed',
          `MUI X Agent Tools: Token exchange failed with HTTP ${response.status}. Retry shortly.`,
          { status: response.status },
        );
      }

      let data: Partial<TokenExchangeResponse>;
      try {
        data = (await response.json()) as Partial<TokenExchangeResponse>;
      } catch (cause) {
        throw new ApiKeyJwtClientError(
          'token_exchange_failed',
          'MUI X Agent Tools: Token exchange returned a non-JSON response. Check that MUI_BACKEND_BASE_URL points at the API backend (not a proxy or error page), then retry.',
          { cause },
        );
      }
      if (!data?.token || !data.expiresAt) {
        throw new ApiKeyJwtClientError(
          'token_exchange_failed',
          'MUI X Agent Tools: Token exchange succeeded but the response was missing token/expiresAt. Check that MUI_BACKEND_BASE_URL points at the API backend (not the wrong route or a proxy), then retry.',
        );
      }

      const expiresAt = new Date(data.expiresAt);
      if (Number.isNaN(expiresAt.getTime())) {
        // Otherwise `isCachedTokenFresh` is always false and every call re-exchanges silently.
        throw new ApiKeyJwtClientError(
          'token_exchange_failed',
          "MUI X Agent Tools: Token exchange returned an unparseable expiresAt, so the JWT can't be cached. Check that MUI_BACKEND_BASE_URL points at the API backend (not a proxy), then retry.",
        );
      }
      this.cachedToken = data.token;
      this.cachedExpiresAt = expiresAt;
      return data.token;
    } finally {
      clearTimeout(timeout);
    }
  }
}

// Wait on the shared refresh, but let a cancelled caller drop its own wait without killing the
// exchange the other callers are still awaiting.
function waitForToken(inflight: Promise<string>, signal?: AbortSignal): Promise<string> {
  if (!signal) {
    return inflight;
  }
  if (signal.aborted) {
    return Promise.reject(abortReason(signal));
  }
  return new Promise<string>((resolve, reject) => {
    const onAbort = () => reject(abortReason(signal));
    signal.addEventListener('abort', onAbort, { once: true });
    inflight.then(
      (token) => {
        signal.removeEventListener('abort', onAbort);
        resolve(token);
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}

function abortReason(signal: AbortSignal): unknown {
  return signal.reason ?? new DOMException('The token request was aborted.', 'AbortError');
}
