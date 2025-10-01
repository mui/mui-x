import { AdapterLuxon } from './AdapterLuxon';

export function useAdapter() {
  // Temporary hook that mimics the behavior of a future `useAdapter` hook,
  // to ease migration once (the provider setup is ready.
  const adapter = getAdapter();

  return adapter;
}

// TODO: Decide if we want to support several date libraries. If so, create a provider to avoid creating several instances of the adapter.
export function getAdapter() {
  return new AdapterLuxon();
}
