import type * as React from 'react';
import { createSelector, Store } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ResourceSelectionMode } from '@mui/x-scheduler-internals/internals';
import type { EventDialogFormValues } from '../utils';

export interface EventDialogFormState<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> {
  /**
   * Current form values, keyed by field name (built-in and custom keys alike).
   */
  values: TValues;
  /**
   * Validation errors, keyed by field name. Always non-empty arrays.
   */
  errors: Record<string, React.ReactNode[]>;
}

/**
 * Error message(s) for a field, or `null` when the value is valid
 * (an empty string or array also counts as valid). An array is a list
 * of messages, not a single node.
 */
export type EventDialogFormValidatorResult = React.ReactNode | React.ReactNode[] | null;

export type EventDialogFormValidator<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> = (
  value: unknown,
  allValues: TValues,
) => EventDialogFormValidatorResult | Promise<EventDialogFormValidatorResult>;

function normalizeValidatorResult(
  result: EventDialogFormValidatorResult,
): React.ReactNode[] | null {
  if (result == null || result === '') {
    return null;
  }
  if (Array.isArray(result)) {
    const messages = result.filter((message) => message != null && message !== '');
    return messages.length > 0 ? messages : null;
  }
  return [result];
}

export interface EventDialogFormParameters<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> {
  /**
   * The occurrence the editing session targets. Captured when the dialog opens.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * Whether the resource picker of the editing session is single- or multi-select.
   * Captured when the dialog opens.
   */
  resourceSelectionMode: ResourceSelectionMode;
  /**
   * Called synchronously after each write with the new values and the written keys.
   */
  onValuesChange?: (values: TValues, changedKeys: string[]) => void;
}

export const eventDialogFormSelectors = {
  value: createSelector((state: EventDialogFormState, key: string) => state.values[key]),
  hasValue: createSelector((state: EventDialogFormState, key: string) => key in state.values),
  error: createSelector((state: EventDialogFormState, key: string) => state.errors[key]),
};

/**
 * Ephemeral draft store backing the event dialog form.
 * Seeded from the event when the dialog opens and discarded when it closes,
 * it holds the edited values until they are committed to the scheduler store on save,
 * along with the constants of the editing session (`occurrence`, `resourceSelectionMode`).
 *
 * Deliberately not built on Base UI's `Form`/`Field`: every input in the dialog is
 * MUI Material, and the store holds non-DOM values (`rruleDraft`, `recurrenceSelection`)
 * that `Field` cannot represent.
 */
export class EventDialogFormStore<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> extends Store<EventDialogFormState<TValues>> {
  private validators = new Map<string, Set<EventDialogFormValidator<TValues>>>();

  private parameters: EventDialogFormParameters<TValues>;

  /**
   * Values the form was seeded with, used to detect edited fields.
   */
  private readonly initialValues: TValues;

  /**
   * The occurrence the editing session targets. Constant for the lifetime of the store.
   */
  public readonly occurrence: SchedulerRenderableEventOccurrence;

  /**
   * Whether the resource picker of the editing session is single- or multi-select.
   * Constant for the lifetime of the store: the resource Select and the submit
   * logic must read the same value.
   */
  public readonly resourceSelectionMode: ResourceSelectionMode;

  constructor(initialValues: TValues, parameters: EventDialogFormParameters<TValues>) {
    super({ values: { ...initialValues }, errors: {} });
    this.initialValues = { ...initialValues };
    this.parameters = parameters;
    this.occurrence = parameters.occurrence;
    this.resourceSelectionMode = parameters.resourceSelectionMode;
  }

  /**
   * Writes a single field and clears its error.
   */
  public setValue = (key: string, value: unknown) => {
    this.setValues({ [key]: value } as Partial<TValues>);
  };

  /**
   * Merges the changes into the values and clears the errors of the written keys only.
   * Accepts a functional updater to compute the changes from the current values.
   */
  public setValues = (changes: Partial<TValues> | ((prev: TValues) => Partial<TValues>)) => {
    const resolvedChanges = typeof changes === 'function' ? changes(this.state.values) : changes;
    const changedKeys = Object.keys(resolvedChanges);
    if (changedKeys.length === 0) {
      return;
    }
    const values = { ...this.state.values, ...resolvedChanges };

    let errors = this.state.errors;
    for (const key of changedKeys) {
      if (key in errors) {
        if (errors === this.state.errors) {
          errors = { ...errors };
        }
        delete errors[key];
      }
    }

    this.update({ values, errors });
    this.parameters.onValuesChange?.(values, changedKeys);
  };

  /**
   * Writes the error message(s) of a single field, replacing any existing ones.
   * Clears the field's error when the messages normalize to none.
   */
  public setError = (key: string, error: EventDialogFormValidatorResult) => {
    const messages = normalizeValidatorResult(error);
    if (messages === null) {
      this.clearErrors([key]);
      return;
    }
    this.set('errors', { ...this.state.errors, [key]: messages });
  };

  /**
   * Removes the errors of the provided keys, or every error when no keys are provided.
   */
  public clearErrors = (keys?: readonly string[]) => {
    const { errors } = this.state;
    if (keys === undefined) {
      if (Object.keys(errors).length > 0) {
        this.set('errors', {});
      }
      return;
    }
    if (keys.some((key) => key in errors)) {
      const nextErrors = { ...errors };
      for (const key of keys) {
        delete nextErrors[key];
      }
      this.set('errors', nextErrors);
    }
  };

  // The validator registry lives on the instance rather than in the state on purpose:
  // registering a validator must not notify subscribers.
  public registerValidator = (key: string, validator: EventDialogFormValidator<TValues>) => {
    let validators = this.validators.get(key);
    if (!validators) {
      validators = new Set();
      this.validators.set(key, validators);
    }
    validators.add(validator);
  };

  public unregisterValidator = (key: string, validator: EventDialogFormValidator<TValues>) => {
    const validators = this.validators.get(key);
    validators?.delete(validator);
    if (validators?.size === 0) {
      this.validators.delete(key);
    }
  };

  /**
   * Whether at least one validator is currently registered for `key`.
   */
  public hasValidator = (key: string): boolean => this.validators.has(key);

  /**
   * Seeds a key that is not present in the values yet, without marking it dirty
   * or notifying `onValuesChange`. No-op when the key is already present.
   */
  public seedDefault = (key: string, value: unknown) => {
    if (key in this.state.values) {
      return;
    }
    (this.initialValues as Record<string, unknown>)[key] = value;
    this.set('values', { ...this.state.values, [key]: value });
  };

  /**
   * Runs every registered validator and stores the failures (first error per field wins).
   * Restarts when a value is written while an async validator is pending, so the stored
   * errors and the resolved verdict always describe the values current at resolution time.
   * Resolves with whether the form is valid.
   */
  public validateAll = async (): Promise<boolean> => {
    while (true) {
      // `setValues` replaces the values object on every write, so its identity
      // doubles as a revision check.
      const { values } = this.state;
      const errors: Record<string, React.ReactNode[]> = {};
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        Array.from(this.validators, async ([key, validators]) => {
          const results = await Promise.all(
            Array.from(validators, (validator) => validator(values[key], values)),
          );
          for (const result of results) {
            const messages = normalizeValidatorResult(result);
            if (messages !== null) {
              errors[key] = messages;
              break;
            }
          }
        }),
      );
      if (this.state.values === values) {
        this.set('errors', errors);
        return Object.keys(errors).length === 0;
      }
    }
  };

  /**
   * Returns the values that changed since seeding, minus `excludeKeys`.
   */
  public getDirtyValues = (excludeKeys?: ReadonlySet<string>): Record<string, unknown> => {
    const { values } = this.state;
    const dirty: Record<string, unknown> = {};
    for (const key of Object.keys(values)) {
      if (!excludeKeys?.has(key) && !Object.is(values[key], this.initialValues[key])) {
        dirty[key] = values[key];
      }
    }
    return dirty;
  };
}
