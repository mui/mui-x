'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { schedulerFormSelectors } from './SchedulerFormStore';
import type {
  SchedulerFormErrorMessage,
  SchedulerFormStore,
  SchedulerFormValidator,
  SchedulerFormValidatorResult,
} from './SchedulerFormStore';

export interface UseSchedulerFormFieldParameters<
  T,
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * Runs during submit while the calling component is mounted.
   * Returns the error message(s) for the field, or `null` when the value is valid.
   * Can be async.
   */
  validate?: (
    value: T,
    allValues: TValues,
  ) => SchedulerFormValidatorResult | Promise<SchedulerFormValidatorResult>;
  /**
   * Seeds the field when the key is not present in the form values.
   * Seeding does not mark the field dirty.
   */
  defaultValue?: T;
}

export interface UseSchedulerFormFieldReturnValue<T> {
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
  error: SchedulerFormErrorMessage | undefined;
  /**
   * All the error messages of the field, empty when it has none.
   */
  errors: SchedulerFormErrorMessage[];
}

const NO_ERRORS: SchedulerFormErrorMessage[] = [];

/**
 * Binds a component to one field of a scheduler form store.
 */
export function useSchedulerFormField<TValues extends Record<string, unknown>, T = unknown>(
  store: SchedulerFormStore<TValues>,
  key: string,
  parameters: UseSchedulerFormFieldParameters<T, TValues> = {},
): UseSchedulerFormFieldReturnValue<T> {
  const { defaultValue } = parameters;

  const storedValue = useStore(store, schedulerFormSelectors.value, key) as T | undefined;
  const isSeeded = useStore(store, schedulerFormSelectors.hasValue, key);
  // The store is only seeded in an effect, so fall back until the key exists.
  // Once seeded, an explicit `undefined` write must not resurrect the default.
  const value = (storedValue === undefined && !isSeeded ? defaultValue : storedValue) as T;
  const errorList = useStore(store, schedulerFormSelectors.error, key);

  const setValue = useStableCallback((newValue: T) => store.setValue(key, newValue));

  const hasValidator = parameters.validate != null;
  const validate: SchedulerFormValidator<TValues> = useStableCallback((fieldValue, allValues) =>
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

  // A new closure over new props changes the rule behind the stable wrapper's
  // identity, so a pending validateAll must restart to resolve against it.
  const lastValidateRef = React.useRef(parameters.validate);
  React.useEffect(() => {
    if (lastValidateRef.current !== parameters.validate) {
      lastValidateRef.current = parameters.validate;
      store.touchValidators();
    }
  });

  return { value, setValue, error: errorList?.[0], errors: errorList ?? NO_ERRORS };
}
