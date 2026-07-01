import { describe, expect, it, vi } from 'vitest';
import { createAuthedFetch } from './authed-fetch';

const ok = (): Response => new Response('ok', { status: 200 });
const unauthorized = (): Response => new Response('nope', { status: 401 });

const buildInit = (jwt: string): RequestInit => ({
  method: 'GET',
  headers: { authorization: `Bearer ${jwt}` },
});

describe('createAuthedFetch', () => {
  it('fetches the token once and reuses it across calls', async () => {
    const getToken = vi.fn().mockResolvedValue('jwt-1');
    const fetcher = vi.fn().mockResolvedValue(ok());
    const authedFetch = createAuthedFetch({ fetcher, getToken });

    await authedFetch('https://api/a', buildInit);
    await authedFetch('https://api/b', buildInit);

    expect(getToken).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      'https://api/a',
      expect.objectContaining({ headers: { authorization: 'Bearer jwt-1' } }),
    );
  });

  it('on a 401, invalidates, mints a fresh token, and retries once', async () => {
    const getToken = vi.fn().mockResolvedValueOnce('stale').mockResolvedValueOnce('fresh');
    const invalidateToken = vi.fn();
    const fetcher = vi.fn().mockResolvedValueOnce(unauthorized()).mockResolvedValueOnce(ok());
    const authedFetch = createAuthedFetch({ fetcher, getToken, invalidateToken });

    const res = await authedFetch('https://api/a', buildInit);

    expect(res.status).toBe(200);
    expect(invalidateToken).toHaveBeenCalledTimes(1);
    expect(getToken).toHaveBeenCalledTimes(2);
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      'https://api/a',
      expect.objectContaining({ headers: { authorization: 'Bearer fresh' } }),
    );
  });

  it('returns a non-401 error response without retrying', async () => {
    const getToken = vi.fn().mockResolvedValue('jwt');
    const fetcher = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }));
    const authedFetch = createAuthedFetch({ fetcher, getToken });

    const res = await authedFetch('https://api/a', buildInit);

    expect(res.status).toBe(500);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('wraps a fetch rejection (unreachable backend) in a prefixed Agent Tools error', async () => {
    const getToken = vi.fn().mockResolvedValue('jwt');
    const fetcher = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    const authedFetch = createAuthedFetch({ fetcher, getToken });

    await expect(authedFetch('https://chat-backend.mui.com/v1/x', buildInit)).rejects.toThrow(
      /MUI X Agent Tools: Request to chat-backend\.mui\.com failed: fetch failed/,
    );
  });

  it('forwards the signal to getToken', async () => {
    const { signal } = new AbortController();
    const getToken = vi.fn().mockResolvedValue('jwt');
    const fetcher = vi.fn().mockResolvedValue(ok());
    const authedFetch = createAuthedFetch({ fetcher, getToken, signal });

    await authedFetch('https://api/a', buildInit);

    expect(getToken).toHaveBeenCalledWith({ signal });
  });
});
