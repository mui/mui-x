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
});
