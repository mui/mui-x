import { describe, expect, it, vi } from 'vitest';
import { withRetry } from './retry';

describe('withRetry', () => {
  it('returns the first success without retrying', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    expect(await withRetry(fn, [0, 0])).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on rejection, then resolves, reporting each retry', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('a'))
      .mockRejectedValueOnce(new Error('b'))
      .mockResolvedValue('ok');
    const onRetry = vi.fn();

    expect(await withRetry(fn, [0, 0, 0], onRetry)).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it('rethrows the last error after exhausting the delays', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always'));
    await expect(withRetry(fn, [0])).rejects.toThrow(/always/);
    expect(fn).toHaveBeenCalledTimes(2); // initial + one retry
  });

  it('does not retry when no delays are given', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('x'));
    await expect(withRetry(fn, [])).rejects.toThrow(/x/);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('stops retrying and rejects with the abort reason when the signal fires mid-backoff', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    const controller = new AbortController();

    const promise = withRetry(fn, [1000, 1000], undefined, controller.signal);
    // Let the first attempt fail and enter the backoff sleep, then abort it.
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    controller.abort(new DOMException('stop', 'AbortError'));

    await expect(promise).rejects.toThrow(/stop/);
    expect(fn).toHaveBeenCalledTimes(1); // aborted during the first backoff, no second attempt
  });
});
