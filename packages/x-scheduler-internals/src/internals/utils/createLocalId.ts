let counter = 0;

/**
 * Generates a locally-unique id, falling back to a counter-based id when
 * `crypto.randomUUID` is unavailable (non-secure contexts or older browsers).
 */
export function createLocalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  counter += 1;
  return `local-${Date.now()}-${counter}`;
}
