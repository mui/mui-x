import { AdapterLuxon } from './AdapterLuxon';

export const DO_NOT_USE_ADAPTER_CLASS = new AdapterLuxon();

// TODO: Replace with Base UI adapter when available.
export function useAdapter() {
  return DO_NOT_USE_ADAPTER_CLASS;
}
