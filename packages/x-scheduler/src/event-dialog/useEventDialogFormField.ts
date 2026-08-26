'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { warnOnce } from '@mui/x-internals/warning';
import { isBuiltInEventProperty } from '@mui/x-scheduler-internals/internals';
import type {
  EventDialogBuiltInFormValues,
  EventDialogFormValues,
} from '../internals/components/event-dialog/utils';
import { BUILT_IN_FORM_KEYS } from '../internals/components/event-dialog/utils';
import { eventDialogFormSelectors } from '../internals/components/event-dialog/form/EventDialogFormStore';
import type {
  EventDialogFormErrorMessage,
  EventDialogFormValidator,
  EventDialogFormValidatorResult,
} from '../internals/components/event-dialog/form/EventDialogFormStore';
import { useEventDialogFormContext } from '../internals/components/event-dialog/form/EventDialogFormContext';

/**
 * Built-in form keys get autocompleted, any other string is a custom field.
 */
export type EventDialogFormFieldKey = keyof EventDialogBuiltInFormValues | (string & {});

export interface UseEventDialogFormFieldParameters<T> {
  /**
   * Runs during submit while the calling component is mounted.
   * Returns the error message(s) for the field, or `null` when the value is valid
   * (an empty string or an empty array also counts as valid; booleans are ignored). Can be async.
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

export interface UseEventDialogFormFieldReturnValue<T, TWrite = T> {
  /**
   * Current value of the field.
   */
  value: T;
  /**
   * Writes the field and clears its error.
   * Custom fields also accept `undefined`; the write is submitted as-is.
   */
  setValue: (value: TWrite) => void;
  /**
   * First error message of the field, or `undefined` when it has none.
   */
  error: EventDialogFormErrorMessage | undefined;
  /**
   * All the error messages of the field, empty when it has none.
   */
  errors: EventDialogFormErrorMessage[];
}

const NO_ERRORS: EventDialogFormErrorMessage[] = [];

// Rejects built-in key literals so a mistyped parameter cannot silently fall
// through from the built-in overload to the custom-key ones.
type CustomFieldKey<K extends string> = K &
  (K extends keyof EventDialogBuiltInFormValues ? never : unknown);

/**
 * Binds a component to one field of the event dialog form.
 * Writing the field through `setValue` is all it takes for the value to be saved on submit.
 */
export function useEventDialogFormField<K extends keyof EventDialogBuiltInFormValues>(
  key: K,
  parameters?: UseEventDialogFormFieldParameters<EventDialogBuiltInFormValues[K]>,
): UseEventDialogFormFieldReturnValue<EventDialogBuiltInFormValues[K]>;
// A custom field with a `defaultValue` always has a value.
export function useEventDialogFormField<T, K extends string = string>(
  key: CustomFieldKey<K>,
  parameters: UseEventDialogFormFieldParameters<T> & { defaultValue: T },
): UseEventDialogFormFieldReturnValue<T, T | undefined>;
// A custom field without a `defaultValue` is `undefined` when the event does not have it.
export function useEventDialogFormField<T = unknown, K extends string = string>(
  key: CustomFieldKey<K>,
  parameters?: UseEventDialogFormFieldParameters<T | undefined>,
): UseEventDialogFormFieldReturnValue<T | undefined>;
export function useEventDialogFormField(
  key: EventDialogFormFieldKey,
  parameters: UseEventDialogFormFieldParameters<unknown> = {},
): UseEventDialogFormFieldReturnValue<unknown> {
  if (process.env.NODE_ENV !== 'production') {
    if (!BUILT_IN_FORM_KEYS.has(key) && isBuiltInEventProperty(key)) {
      warnOnce([
        `MUI X Scheduler: useEventDialogFormField() received the key "${key}", which is a built-in event property.`,
        'Writing it from the form would silently overwrite the property managed by the built-in submit logic.',
        'Use a custom key that does not collide with the event model.',
      ]);
    }
    if (BUILT_IN_FORM_KEYS.has(key) && parameters.defaultValue !== undefined) {
      warnOnce([
        `MUI X Scheduler: useEventDialogFormField() received a \`defaultValue\` for the built-in key "${key}".`,
        'Built-in keys are always seeded from the event being edited, so the default is never applied.',
        'Remove the `defaultValue`, or use a custom key if you meant to add a field of your own.',
      ]);
    }
  }

  const store = useEventDialogFormContext();
  const { defaultValue } = parameters;

  const storedValue = useStore(store, eventDialogFormSelectors.value, key);
  const isSeeded = useStore(store, eventDialogFormSelectors.hasValue, key);
  // The store is only seeded in an effect, so fall back until the key exists.
  // Once seeded, an explicit `undefined` write must not resurrect the default.
  const value = storedValue === undefined && !isSeeded ? defaultValue : storedValue;
  const errorList = useStore(store, eventDialogFormSelectors.error, key);

  const setValue = useStableCallback((newValue: unknown) => store.setValue(key, newValue));

  const hasValidator = parameters.validate != null;
  const validate: EventDialogFormValidator = useStableCallback((fieldValue, allValues) =>
    parameters.validate ? parameters.validate(fieldValue, allValues) : null,
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
