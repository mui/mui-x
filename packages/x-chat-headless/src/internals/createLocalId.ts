let _counter = 0;

export function createLocalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  _counter += 1;
  return `local-${Date.now()}-${_counter}`;
}
