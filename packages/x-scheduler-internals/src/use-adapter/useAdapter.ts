import * as React from 'react';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import type { DateLocale } from './useAdapter.types';

const DEFAULT_ADAPTER = new TemporalAdapterDateFns();

// TODO: Replace with Base UI adapter when available.
export function useAdapter(dateLocale?: DateLocale) {
  return React.useMemo(
    () => (dateLocale ? new TemporalAdapterDateFns({ locale: dateLocale }) : DEFAULT_ADAPTER),
    [dateLocale],
  );
}
