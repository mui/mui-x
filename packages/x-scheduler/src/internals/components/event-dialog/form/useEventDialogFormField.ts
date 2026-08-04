'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { warnOnce } from '@mui/x-internals/warning';
import { isBuiltInEventProperty } from '@mui/x-scheduler-internals/internals';
import type { EventDialogBuiltInFormValues, EventDialogFormValues } from '../utils';
import { BUILT_IN_FORM_KEYS } from '../utils';
import { eventDialogFormSelectors } from './EventDialogFormStore';
import type {
  EventDialogFormValidator,
  EventDialogFormValidatorResult,
} from './EventDialogFormStore';
import { useEventDialogFormContext } from './EventDialogFormContext';

/**
 * Built-in form keys get autocompleted, any other string is a custom field.
 */
export type EventDialogFormFieldKey = keyof EventDialogBuiltInFormValues | (string & {});

export interface UseEventDialogFormFieldParameters<T> {
  /**
   * Runs during submit while the calling component is mounted.
   * Returns the error message(s) for the field, or `null` when the value is valid
   * (an empty string or array also counts as valid). Can be async.
   */
  validate?: (
    value: T,
    allValues: EventDialogFormValues,
  ) => EventDialogFormValidatorResult | Promise<EventDialogFormValidatorResult>;
  /**
   * Seeds the field when the key is not present in the form values
   * (e.g. a custom field absent from the event model). Seeding does not
   * mark the field dirty, so an untouched default is not submitted.
   */
  defaultValue?: T;
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
   * First error message of the field, or `undefined` when it has none.
   */
  error: React.ReactNode | undefined;
  /**
   * All the error messages of the field, empty when it has none.
   */
  errors: React.ReactNode[];
}

const NO_ERRORS: React.ReactNode[] = [];

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
  const { defaultValue } = parameters;

  const storedValue = useStore(store, eventDialogFormSelectors.value, key) as T | undefined;
  // The store is only seeded in an effect, so fall back for the first render.
  const value = (storedValue === undefined ? defaultValue : storedValue) as T;
  const errorList = useStore(store, eventDialogFormSelectors.error, key);

  const setValue = useStableCallback((newValue: T) => store.setValue(key, newValue));

  const hasValidator = parameters.validate != null;
  const validate: EventDialogFormValidator = useStableCallback((fieldValue, allValues) =>
    parameters.validate ? parameters.validate(fieldValue as T, allValues) : null,
  );

  React.useEffect(() => {
    if (defaultValue !== undefined) {
      store.seedDefault(key, defaultValue);
    }
  }, [store, key, defaultValue]);

  React.useEffect(() => {
    if (!hasValidator) {
      return undefined;
    }
    store.registerValidator(key, validate);
    return () => store.unregisterValidator(key, validate);
  }, [store, key, hasValidator, validate]);

  return { value, setValue, error: errorList?.[0], errors: errorList ?? NO_ERRORS };
}
