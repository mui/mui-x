'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { warnOnce } from '@mui/x-internals/warning';
import { isBuiltInEventProperty } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type {
  EventDialogBuiltInFormValues,
  EventDialogFormValues,
} from '../internals/components/event-dialog/utils';
import {
  BUILT_IN_FORM_KEYS,
  FORM_KEY_TO_EVENT_PROPERTY,
} from '../internals/components/event-dialog/utils';
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
   * (an empty string or an empty array also counts as valid; booleans are ignored
   * with a dev warning). When several components validate the same key, they run
   * in registration order and the first failure provides the message — the later
   * validators of the key do not run. Can be async.
   */
  validate?: (
    value: T,
    allValues: EventDialogFormValues,
  ) => EventDialogFormValidatorResult | Promise<EventDialogFormValidatorResult>;
  /**
   * Seeds the field when the key is not present in the form values
   * (e.g. a custom field absent from the event model). Seeding does not
   * mark the field dirty, so an untouched default is not submitted — but any
   * written value is, including the default itself when explicitly re-picked.
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
   * On a seeded custom field, writing `undefined` submits the removal of the stored property.
   */
  setValue: (value: T) => void;
  /**
   * First error message of the field, or `undefined` when it has none.
   */
  error: EventDialogFormErrorMessage | undefined;
  /**
   * All the error messages of the field, empty when it has none.
   */
  errors: EventDialogFormErrorMessage[];
  /**
   * Whether the event property backing the key is read-only
   * (a getter without a setter in `eventModelStructure`).
   * Always `false` for custom keys.
   */
  readOnly: boolean;
}

const NO_ERRORS: EventDialogFormErrorMessage[] = [];

// Rejects built-in form keys, so a mistyped parameter cannot silently fall
// through from the built-in overload to the custom-key one, and the reserved
// `SchedulerEvent` properties, whose writes are dropped on save. `Extract`
// catches any overlapping member of a union key, while the wide `string` stays
// accepted for dynamic keys.
type CustomFieldKey<K extends string> = K &
  (Extract<K, keyof EventDialogBuiltInFormValues | keyof SchedulerEvent> extends never
    ? unknown
    : never);

/**
 * Binds a component to one field of the event dialog form.
 * Writing the field through `setValue` is all it takes for the value to be saved on submit.
 */
export function useEventDialogFormField<K extends keyof EventDialogBuiltInFormValues>(
  key: K,
  // Built-in keys are always seeded from the event, so a `defaultValue` would never apply.
  parameters?: Omit<
    UseEventDialogFormFieldParameters<EventDialogBuiltInFormValues[K]>,
    'defaultValue'
  >,
): UseEventDialogFormFieldReturnValue<EventDialogBuiltInFormValues[K]>;
// A custom field can always be `undefined`: when the event does not have it and no
// `defaultValue` seeds it, or after a `setValue(undefined)` submitting its removal.
// The key generic comes first so an explicit value type cannot bypass the key
// guard: supplying one argument fills the key slot, keeping the literal visible.
export function useEventDialogFormField<K extends string = string, T = unknown>(
  key: CustomFieldKey<K>,
  parameters?: UseEventDialogFormFieldParameters<T | undefined> & { defaultValue?: T },
): UseEventDialogFormFieldReturnValue<T | undefined>;
export function useEventDialogFormField(
  key: EventDialogFormFieldKey,
  parameters: UseEventDialogFormFieldParameters<unknown> = {},
): UseEventDialogFormFieldReturnValue<unknown> {
  if (process.env.NODE_ENV !== 'production') {
    if (!BUILT_IN_FORM_KEYS.has(key) && isBuiltInEventProperty(key)) {
      warnOnce([
        `MUI X Scheduler: useEventDialogFormField() received the key "${key}", which is a built-in event property.`,
        'The edit is dropped on save, so the field cannot be persisted.',
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
  const schedulerStore = useSchedulerStoreContext();
  const { defaultValue } = parameters;

  const isPropertyReadOnly = useStore(
    schedulerStore,
    schedulerEventSelectors.isPropertyReadOnly,
    store.occurrence.id,
  );
  const readOnly = BUILT_IN_FORM_KEYS.has(key)
    ? isPropertyReadOnly(FORM_KEY_TO_EVENT_PROPERTY[key as keyof EventDialogBuiltInFormValues])
    : false;

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

  return { value, setValue, error: errorList?.[0], errors: errorList ?? NO_ERRORS, readOnly };
}
