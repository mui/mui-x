import type * as React from 'react';
import { Store } from '@base-ui/utils/store';
import { warnOnce } from '@mui/x-internals/warning';
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
  errors: Record<string, EventDialogFormErrorMessage[]>;
}

/**
 * Message(s) that can be rendered for a failing field: any React node except
 * booleans, which are excluded so a `condition && 'message'` shorthand is a
 * type error instead of a silently stored `false`.
 */
export type EventDialogFormErrorMessage = Exclude<React.ReactNode, boolean>;

/**
 * Error message(s) for a field, or `null` when the value is valid
 * (an empty string or array also counts as valid). An array is a list
 * of messages, not a single node.
 */
export type EventDialogFormValidatorResult =
  EventDialogFormErrorMessage | EventDialogFormErrorMessage[] | null;

export type EventDialogFormValidator<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> = (
  value: unknown,
  allValues: TValues,
) => EventDialogFormValidatorResult | Promise<EventDialogFormValidatorResult>;

// Wider than `EventDialogFormValidatorResult` on purpose: this is the runtime net
// for what JS consumers (and awaited results) can actually pass.
function normalizeValidatorResult(
  result: React.ReactNode | React.ReactNode[] | null,
): EventDialogFormErrorMessage[] | null {
  const list = Array.isArray(result) ? result : [result];
  // Booleans are excluded from the type but reachable from JS (`condition && 'message'`).
  if (process.env.NODE_ENV !== 'production') {
    if (list.some((message) => typeof message === 'boolean')) {
      warnOnce([
        'MUI X Scheduler: A form field validator returned a boolean.',
        'Booleans are ignored: return the error message(s) when the value is invalid, or `null` when it is valid.',
      ]);
    }
  }
  const messages = list.filter(
    (message) => message != null && message !== '' && typeof message !== 'boolean',
  ) as EventDialogFormErrorMessage[];
  return messages.length > 0 ? messages : null;
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

// The key is an arbitrary consumer string, so reads and writes must stay on own
// properties: a plain access on a key like `__proto__` would hit the prototype accessor.
// The `call` form keeps the package's Node 14 support.
function hasOwn(record: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function getOwn<T>(record: Record<string, T>, key: string): T | undefined {
  return hasOwn(record, key) ? record[key] : undefined;
}

function setOwn<T>(record: Record<string, T>, key: string, value: T) {
  Object.defineProperty(record, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

export const eventDialogFormSelectors = {
  value: (state: EventDialogFormState<Record<string, unknown>>, key: string) =>
    getOwn(state.values, key),
  hasValue: (state: EventDialogFormState<Record<string, unknown>>, key: string) =>
    hasOwn(state.values, key),
  error: (state: EventDialogFormState<Record<string, unknown>>, key: string) =>
    getOwn(state.errors, key),
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

  /**
   * Bumped on every registration change so a pending `validateAll` can detect it.
   */
  private validatorsRevision = 0;

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
      if (hasOwn(errors, key)) {
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
    if (keys.some((key) => hasOwn(errors, key))) {
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
    this.validatorsRevision += 1;
  };

  public unregisterValidator = (key: string, validator: EventDialogFormValidator<TValues>) => {
    const validators = this.validators.get(key);
    validators?.delete(validator);
    if (validators?.size === 0) {
      this.validators.delete(key);
    }
    this.validatorsRevision += 1;
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
    if (hasOwn(this.state.values, key)) {
      return;
    }
    setOwn(this.initialValues as Record<string, unknown>, key, value);
    this.set('values', { ...this.state.values, [key]: value });
  };

  /**
   * Runs every registered validator and stores the failures (first error per field wins).
   * Restarts when a value is written or a validator is (un)registered while an async
   * validator is pending, so the stored errors and the resolved verdict always describe
   * the values and validators current at resolution time.
   * Resolves with whether the form is valid.
   */
  public validateAll = async (): Promise<boolean> => {
    // Safety valve for a validator that writes values while validating: without
    // the cap the loop restarts forever and the submit never settles.
    const maxRestarts = 20;
    for (let restarts = 0; ; restarts += 1) {
      // `setValues` replaces the values object on every write, so its identity
      // doubles as a revision check.
      const { values } = this.state;
      const { validatorsRevision } = this;
      const errors: Record<string, EventDialogFormErrorMessage[]> = {};
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        Array.from(this.validators, async ([key, validators]) => {
          const fieldValue = getOwn(values, key);
          const results = await Promise.all(
            Array.from(validators, (validator) => validator(fieldValue, values)),
          );
          for (const result of results) {
            const messages = normalizeValidatorResult(result);
            if (messages !== null) {
              setOwn(errors, key, messages);
              break;
            }
          }
        }),
      );
      const isSettled =
        this.state.values === values && this.validatorsRevision === validatorsRevision;
      if (isSettled || restarts >= maxRestarts) {
        if (process.env.NODE_ENV !== 'production' && !isSettled) {
          warnOnce([
            'MUI X Scheduler: A form field validator kept writing values while the validation was running.',
            'The validation settled with the last computed errors, which may not reflect the newest values.',
            'Avoid calling setValue from a validator.',
          ]);
        }
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
      if (!excludeKeys?.has(key) && !Object.is(values[key], getOwn(this.initialValues, key))) {
        setOwn(dirty, key, values[key]);
      }
    }
    return dirty;
  };
}
