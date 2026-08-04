'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { warnOnce } from '@mui/x-internals/warning';
import { isBuiltInEventProperty } from '@mui/x-scheduler-internals/internals';
import type { EventDialogBuiltInFormValues, EventDialogFormValues } from '../utils';
import { BUILT_IN_FORM_KEYS } from '../utils';
import { eventDialogFormSelectors } from './EventDialogFormStore';
import type { EventDialogFormValidator } from './EventDialogFormStore';
import { useEventDialogFormContext } from './EventDialogFormContext';

/**
 * Built-in form keys get autocompleted, any other string is a custom field.
 */
export type EventDialogFormFieldKey = keyof EventDialogBuiltInFormValues | (string & {});

export interface UseEventDialogFormFieldParameters<T> {
  /**
   * Runs during submit while the calling component is mounted.
   * Returns the error(s) for the field, or `null` when the value is valid
   * (an empty string or array also counts as valid).
   */
  validate?: (value: T, allValues: EventDialogFormValues) => string | string[] | null;
}

export interface UseEventDialogFormFieldReturnValue<T> {
  /**
   * Current value of the field.
   */
  value: T;
  /**
   * Writes the field and clears its error.
   */
  setValue: (value: T) => void;
  /**
   * Error(s) of the field, or `undefined` when it has none.
   */
  error: string | string[] | undefined;
}

/**
 * Binds a component to one field of the event dialog form.
 * Writing the field through `setValue` is all it takes for the value to be saved on submit.
 */
export function useEventDialogFormField<T = unknown>(
  key: EventDialogFormFieldKey,
  parameters: UseEventDialogFormFieldParameters<T> = {},
): UseEventDialogFormFieldReturnValue<T> {
  if (process.env.NODE_ENV !== 'production') {
    if (!BUILT_IN_FORM_KEYS.has(key) && isBuiltInEventProperty(key)) {
      warnOnce([
        `MUI X Scheduler: useEventDialogFormField() received the key "${key}", which is a built-in event property.`,
        'Writing it from the form would silently overwrite the property managed by the built-in submit logic.',
        'Use a custom key that does not collide with the event model.',
      ]);
    }
  }

  const store = useEventDialogFormContext();
  const value = useStore(store, eventDialogFormSelectors.value, key) as T;
  const error = useStore(store, eventDialogFormSelectors.error, key);

  const setValue = useStableCallback((newValue: T) => store.setValue(key, newValue));

  const hasValidator = parameters.validate != null;
  const validate: EventDialogFormValidator = useStableCallback((fieldValue, allValues) =>
    parameters.validate ? parameters.validate(fieldValue as T, allValues) : null,
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
