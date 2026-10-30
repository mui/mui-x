import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';

const DEFAULT_ADAPTER = new TemporalAdapterDateFns();

// TODO: Replace with Base UI adapter when available.
export function useAdapter() {
  return DEFAULT_ADAPTER;
}
