/**
 * Combine optional abort signals into one that fires when any of them do (via `AbortSignal.any`).
 * Returns the single signal when only one is present, or `undefined` when none are, so callers can
 * skip passing a `signal` at all.
 */
export function combineAbortSignals(
  ...signals: (AbortSignal | undefined)[]
): AbortSignal | undefined {
  const present = signals.filter((signal): signal is AbortSignal => signal != null);
  if (present.length === 0) {
    return undefined;
  }
  return present.length === 1 ? present[0] : AbortSignal.any(present);
}
