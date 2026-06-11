/**
 * Module-level external store backing the all-components gallery filter.
 *
 * The six section grids are independent React roots (each embedded from
 * markdown), so they can't share a React context. A tiny external store keeps
 * the filter query in sync across every root via `useSyncExternalStore`.
 */

let query = '';
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): string {
  return query;
}

/**
 * The server render and the first client render must agree to avoid a
 * hydration mismatch — both start from the empty query.
 */
export function getServerSnapshot(): string {
  return '';
}

export function setQuery(next: string): void {
  if (next === query) {
    return;
  }
  query = next;
  emit();
}
