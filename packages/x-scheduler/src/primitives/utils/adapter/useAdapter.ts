import { getAdapter } from './getAdapter';

export function useAdapter() {
  // Temporary hook that mimics the behavior of a future `useAdapter` hook,
  // to ease migration once the provider setup is ready.
  return getAdapter();
}
