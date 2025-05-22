import { AdapterLuxon } from './AdapterLuxon';

// TODO: Decide if we want to support several date libraries. If so, create a provider to avoid creating several instances of the adapter.
export function getAdapter() {
  return new AdapterLuxon();
}
