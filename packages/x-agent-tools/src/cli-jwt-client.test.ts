import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CliJwtClient, CliJwtClientError } from './cli-jwt-client';

function makeOkResponse(token: string, expiresAtIso: string): Response {
  return new Response(JSON.stringify({ token, expiresAt: expiresAtIso }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function makeErrorResponse(status: number, body: unknown = { error: 'nope' }): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('CliJwtClient', () => {
  const baseUrl = 'http://localhost:5002';
  const apiKey = 'mui_recipes_test_key';

  beforeEach(() => {
    delete process.env.MUI_RECIPES_API_KEY;
  });

  it('constructor throws when muiBackendBaseUrl is missing', () => {
    expect(() => new CliJwtClient({ muiBackendBaseUrl: '', apiKey })).toThrow(CliJwtClientError);
  });

  it('fetches and caches a token on the first call', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const fetcher = vi.fn().mockResolvedValue(makeOkResponse('jwt-1', expiresAt));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    const token = await client.getToken();

    expect(token).toBe('jwt-1');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      `${baseUrl}/api/auth/tokens`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-api-key': apiKey }),
      }),
    );
  });

  it('wraps a non-JSON token response (e.g. an HTML error page) as a CliJwtClientError', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('<html>Bad Gateway</html>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      }),
    );
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toThrow(
      /MUI X Agent Tools: Token exchange returned a non-JSON response/,
    );
  });

  it('throws on a non-ok token exchange status (e.g. HTTP 500)', async () => {
    const fetcher = vi.fn().mockResolvedValue(makeErrorResponse(500));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toThrow(
      /MUI X Agent Tools: Token exchange failed with HTTP 500/,
    );
  });

  it('wraps a token response missing token/expiresAt with recovery guidance', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ somethingElse: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toThrow(
      /Token exchange succeeded but the response was missing token\/expiresAt/,
    );
  });

  it('returns the cached token without a second network call', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const fetcher = vi.fn().mockResolvedValue(makeOkResponse('jwt-1', expiresAt));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await client.getToken();
    const second = await client.getToken();

    expect(second).toBe('jwt-1');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('refreshes when the cached token is within the refresh threshold', async () => {
    const expiresAt = new Date(Date.now() + 10_000).toISOString(); // 10s away
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeOkResponse('jwt-old', expiresAt))
      .mockResolvedValueOnce(
        makeOkResponse('jwt-new', new Date(Date.now() + 10 * 60 * 1000).toISOString()),
      );
    const client = new CliJwtClient({
      muiBackendBaseUrl: baseUrl,
      apiKey,
      refreshThresholdMs: 30_000, // refresh anything <30s out
      fetcher,
    });

    await client.getToken();
    const second = await client.getToken();

    expect(second).toBe('jwt-new');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('coalesces concurrent refresh callers on a single in-flight fetch', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    let resolveFetch: (response: Response) => void = () => {};
    const fetcher = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    const [p1, p2, p3] = [client.getToken(), client.getToken(), client.getToken()];
    resolveFetch(makeOkResponse('jwt-shared', expiresAt));
    const [t1, t2, t3] = await Promise.all([p1, p2, p3]);

    expect(t1).toBe('jwt-shared');
    expect(t2).toBe('jwt-shared');
    expect(t3).toBe('jwt-shared');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('reads the API key from MUI_RECIPES_API_KEY when no override is passed', async () => {
    process.env.MUI_RECIPES_API_KEY = 'mui_recipes_env_key';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const fetcher = vi.fn().mockResolvedValue(makeOkResponse('jwt-1', expiresAt));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, fetcher });

    await client.getToken();

    expect(fetcher).toHaveBeenCalledWith(
      `${baseUrl}/api/auth/tokens`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': 'mui_recipes_env_key' }),
      }),
    );
  });

  it('throws missing_api_key when neither override nor env is set', async () => {
    const fetcher = vi.fn();
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, fetcher });

    await expect(client.getToken()).rejects.toMatchObject({
      name: 'CliJwtClientError',
      code: 'missing_api_key',
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('throws api_key_invalid and clears the cache on 401', async () => {
    const fetcher = vi.fn().mockResolvedValue(makeErrorResponse(401));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toMatchObject({
      code: 'api_key_invalid',
      status: 401,
    });

    // A subsequent call should re-attempt (cache cleared).
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    fetcher.mockResolvedValueOnce(makeOkResponse('jwt-recovered', expiresAt));
    const next = await client.getToken();
    expect(next).toBe('jwt-recovered');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('throws api_key_forbidden on 403', async () => {
    const fetcher = vi.fn().mockResolvedValue(makeErrorResponse(403));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toMatchObject({
      code: 'api_key_forbidden',
      status: 403,
    });
  });

  it('throws token_exchange_failed on network error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toMatchObject({
      code: 'token_exchange_failed',
    });
  });

  it('throws token_exchange_failed when the response shape is unexpected', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ unexpected: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await expect(client.getToken()).rejects.toBeInstanceOf(CliJwtClientError);
  });

  it('invalidate() clears the cache so the next getToken() refetches', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeOkResponse('jwt-1', expiresAt))
      .mockResolvedValueOnce(makeOkResponse('jwt-2', expiresAt));
    const client = new CliJwtClient({ muiBackendBaseUrl: baseUrl, apiKey, fetcher });

    await client.getToken();
    client.invalidate();
    const next = await client.getToken();

    expect(next).toBe('jwt-2');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('strips trailing slashes from the base URL', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const fetcher = vi.fn().mockResolvedValue(makeOkResponse('jwt-1', expiresAt));
    const client = new CliJwtClient({
      muiBackendBaseUrl: `${baseUrl}/`,
      apiKey,
      fetcher,
    });

    await client.getToken();
    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/api/auth/tokens`, expect.anything());
  });
});
