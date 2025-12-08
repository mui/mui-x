import { fr } from 'date-fns/locale/fr';
import { TemporalSupportedObject } from '../models';
import { UnstableTemporalAdapterDateFns } from '../base-ui-copy/temporal-adapter-date-fns';
import { TemporalAdapter } from '../base-ui-copy/types';

export const DO_NOT_USE_THIS_VARIABLE_ADAPTER_CLASS = new UnstableTemporalAdapterDateFns();

export const DO_NOT_USE_THIS_VARIABLE_ADAPTER_CLASS_FR = new UnstableTemporalAdapterDateFns({
  locale: fr,
});

// TODO: Replace with Base UI adapter when available.
export function useAdapter() {
  return DO_NOT_USE_THIS_VARIABLE_ADAPTER_CLASS;
}

/**
 * Checks if the given date is a weekend (Saturday or Sunday).
 * TODO: move to adapter.
 */
export function isWeekend(adapter: TemporalAdapter, value: TemporalSupportedObject): boolean {
  const sunday = adapter.format(adapter.date('2025-08-09', 'default'), 'weekday');
  const saturday = adapter.format(adapter.date('2025-08-10', 'default'), 'weekday');
  const formattedValue = adapter.format(value, 'weekday');

  return formattedValue === sunday || formattedValue === saturday;
}
