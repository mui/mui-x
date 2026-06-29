/** API-key -> JWT exchange client. In-memory cache, 30s refresh window, concurrent-call dedup. */

export const DEFAULT_REFRESH_THRESHOLD_MS = 30_000;
export const RECIPES_API_KEY_ENV = 'MUI_RECIPES_API_KEY';
export const CLI_TOKEN_PATH = '/api/auth/tokens';

export type CliJwtClientOptions = {
  /** Base URL of mui-backend (no trailing slash). */
  muiBackendBaseUrl: string;
  /** Override the API key resolved from `MUI_RECIPES_API_KEY`. Useful for tests. */
  apiKey?: string;
  /** Refresh the token this many ms before `expiresAt`. Defaults to 30 s. */
  refreshThresholdMs?: number;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
};

export class CliJwtClientError extends Error {
  public readonly code:
    | 'missing_api_key'
    | 'api_key_invalid'
    | 'api_key_forbidden'
    | 'token_exchange_failed';

  public readonly status?: number;

  public readonly cause?: unknown;

  public constructor(
    code: CliJwtClientError['code'],
    message: string,
    options: { status?: number; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'CliJwtClientError';
    this.code = code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

type TokenExchangeResponse = {
  token: string;
  expiresAt: string;
};

export class CliJwtClient {
  private readonly muiBackendBaseUrl: string;

  private readonly apiKeyOverride: string | undefined;

  private readonly refreshThresholdMs: number;

  private readonly fetcher: typeof fetch;

  private cachedToken: string | null = null;

  private cachedExpiresAt: Date | null = null;

  private inflight: Promise<string> | null = null;

  public constructor(options: CliJwtClientOptions) {
    if (!options.muiBackendBaseUrl) {
      throw new CliJwtClientError(
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
   * Returns a JWT valid for at least `refreshThresholdMs` from now. Refreshes via the
   * exchange endpoint if the cache is empty or near expiry. Concurrent callers during a
   * refresh share the same in-flight promise.
   */
  public async getToken(): Promise<string> {
    if (this.isCachedTokenFresh()) {
      return this.cachedToken!;
    }
    if (this.inflight) {
      return this.inflight;
    }
    this.inflight = this.refresh().finally(() => {
      this.inflight = null;
    });
    return this.inflight;
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
      throw new CliJwtClientError(
        'missing_api_key',
        `MUI X Agent Tools: Missing API key. Set the ${RECIPES_API_KEY_ENV} env var (or pass apiKey to CliJwtClient). Create a key at console.mui.com/products/recipes/api-keys.`,
      );
    }
    return key;
  }

  private async refresh(): Promise<string> {
    const apiKey = this.resolveApiKey();
    const url = `${this.muiBackendBaseUrl}${CLI_TOKEN_PATH}`;

    let response: Response;
    try {
      response = await this.fetcher(url, {
        method: 'POST',
        headers: { 'x-api-key': apiKey, accept: 'application/json' },
      });
    } catch (cause) {
      throw new CliJwtClientError(
        'token_exchange_failed',
        `MUI X Agent Tools: Token exchange failed: ${cause instanceof Error ? cause.message : String(cause)}. Retry shortly.`,
        { cause },
      );
    }

    if (response.status === 401) {
      this.invalidate();
      throw new CliJwtClientError(
        'api_key_invalid',
        'MUI X Agent Tools: API key invalid or revoked. Create a new one at console.mui.com/products/recipes/api-keys.',
        { status: 401 },
      );
    }
    if (response.status === 403) {
      this.invalidate();
      throw new CliJwtClientError(
        'api_key_forbidden',
        "MUI X Agent Tools: API key is not authorized to mint a JWT (organization membership may have been lost). Verify the key's owner and try again.",
        { status: 403 },
      );
    }
    if (!response.ok) {
      throw new CliJwtClientError(
        'token_exchange_failed',
        `MUI X Agent Tools: Token exchange failed with HTTP ${response.status}. Retry shortly.`,
        { status: response.status },
      );
    }

    let data: Partial<TokenExchangeResponse>;
    try {
      data = (await response.json()) as Partial<TokenExchangeResponse>;
    } catch (cause) {
      throw new CliJwtClientError(
        'token_exchange_failed',
        'MUI X Agent Tools: Token exchange returned a non-JSON response. Check that MUI_BACKEND_BASE_URL points at the API backend (not a proxy or error page), then retry.',
        { cause },
      );
    }
    if (!data?.token || !data.expiresAt) {
      throw new CliJwtClientError(
        'token_exchange_failed',
        'MUI X Agent Tools: Token exchange succeeded but the response was missing token/expiresAt. Check that MUI_BACKEND_BASE_URL points at the API backend (not the wrong route or a proxy), then retry.',
      );
    }

    this.cachedToken = data.token;
    this.cachedExpiresAt = new Date(data.expiresAt);
    return data.token;
  }
}
