import * as React from 'react';
import { UnstableTemporalAdapterDateFns } from '../base-ui-copy/temporal-adapter-date-fns';
import type { DateLocale } from './useAdapter.types';

const DEFAULT_ADAPTER = new UnstableTemporalAdapterDateFns();

// TODO: Replace with Base UI adapter when available.
export function useAdapter(dateLocale?: DateLocale) {
  return React.useMemo(
    () =>
      dateLocale ? new UnstableTemporalAdapterDateFns({ locale: dateLocale }) : DEFAULT_ADAPTER,
    [dateLocale],
  );
}
