import { describe, expect, it } from 'vitest';
import { combineAbortSignals } from './abort-signal';

describe('combineAbortSignals', () => {
  it('returns undefined when no signals are present', () => {
    expect(combineAbortSignals()).toBeUndefined();
    expect(combineAbortSignals(undefined, undefined)).toBeUndefined();
  });

  it('returns the single signal unchanged when only one is present', () => {
    const controller = new AbortController();
    expect(combineAbortSignals(undefined, controller.signal)).toBe(controller.signal);
  });

  it('aborts the combined signal when any input aborts', () => {
    const a = new AbortController();
    const b = new AbortController();

    const combined = combineAbortSignals(a.signal, b.signal);

    expect(combined?.aborted).toBe(false);
    b.abort();
    expect(combined?.aborted).toBe(true);
  });
});
