'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { eventDialogFormSelectors } from './eventDialogFormSelectors';
import type { EventDialogFormValidator } from './EventDialogFormStore';
import { useEventDialogFormContext } from './EventDialogFormContext';

export interface EventDialogFormFieldOptions<T> {
  /**
   * Runs during submit while the calling component is mounted.
   * Returns the error(s) for the field, or `null` when the value is valid.
   */
  validate?: (value: T, allValues: Record<string, unknown>) => string | string[] | null;
}

/**
 * Binds a component to one field of the event dialog form.
 * Writing the field through `setValue` is all it takes for the value to be saved on submit.
 */
export function useField<T = unknown>(key: string, options: EventDialogFormFieldOptions<T> = {}) {
  const store = useEventDialogFormContext();
  const value = useStore(store, eventDialogFormSelectors.value, key) as T;
  const error = useStore(store, eventDialogFormSelectors.error, key);

  const setValue = useStableCallback((newValue: T) => store.setValue(key, newValue));

  const hasValidator = options.validate != null;
  const validate: EventDialogFormValidator = useStableCallback((fieldValue, allValues) =>
    options.validate ? options.validate(fieldValue as T, allValues) : null,
  );

  React.useEffect(() => {
    if (!hasValidator) {
      return undefined;
    }
    store.registerValidator(key, validate);
    return () => store.unregisterValidator(key, validate);
  }, [store, key, hasValidator, validate]);

  return { value, setValue, error };
}
