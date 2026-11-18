import type * as React from 'react';
import { Store } from '@base-ui/utils/store';
import { warnOnce } from '@mui/x-internals/warning';

export interface SchedulerFormState<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * Current form values, keyed by field name.
   */
  values: TValues;
  /**
   * Validation errors, keyed by field name. Always non-empty arrays.
   */
  errors: Record<string, SchedulerFormErrorMessage[]>;
  /**
   * Whether a submission is pending. Lives in the store so only its subscribers
   * (the action buttons) re-render on submit: re-rendering the fields would
   * churn their inline validator identities mid-validation.
   */
  isSubmitting: boolean;
}

/**
 * Message(s) that can be rendered for a failing field: any React node except
 * booleans, which are excluded so a `condition && 'message'` shorthand is a
 * type error instead of a silently stored `false`.
 */
export type SchedulerFormErrorMessage = Exclude<React.ReactNode, boolean>;

/**
 * Error message(s) for a field, or `null` when the value is valid
 * (an empty string or array also counts as valid). An array is a list
 * of messages, not a single node.
 */
export type SchedulerFormValidatorResult =
  SchedulerFormErrorMessage | SchedulerFormErrorMessage[] | null;

export type SchedulerFormValidator<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = (
  value: unknown,
  allValues: TValues,
) => SchedulerFormValidatorResult | Promise<SchedulerFormValidatorResult>;

// Wider than `SchedulerFormValidatorResult` on purpose: this is the runtime net
// for what JS consumers (and awaited results) can actually pass.
function normalizeValidatorResult(
  result: React.ReactNode | React.ReactNode[] | null,
): SchedulerFormErrorMessage[] | null {
  const list = Array.isArray(result) ? result : [result];
  // Booleans are excluded from the type but reachable from JS (`condition && 'message'`).
  if (process.env.NODE_ENV !== 'production') {
    if (list.some((message) => typeof message === 'boolean')) {
      warnOnce(
        [
          'MUI X Scheduler: A form field validator returned a boolean.',
          'Booleans are ignored: return the error message(s) when the value is invalid, or `null` when it is valid.',
        ].join('\n'),
      );
    }
  }
  const messages = list.filter(
    (message) => message != null && message !== '' && typeof message !== 'boolean',
  ) as SchedulerFormErrorMessage[];
  return messages.length > 0 ? messages : null;
}

export interface SchedulerFormParameters<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
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

export const schedulerFormSelectors = {
  value: (state: SchedulerFormState, key: string) => getOwn(state.values, key),
  hasValue: (state: SchedulerFormState, key: string) => hasOwn(state.values, key),
  error: (state: SchedulerFormState, key: string) => getOwn(state.errors, key),
  isSubmitting: (state: SchedulerFormState) => state.isSubmitting,
};

/**
 * Ephemeral draft store backing a scheduler form (values, errors, validators and the
 * submission state). Seeded when the form opens and discarded when it closes, it holds
 * the edited values until they are committed on save.
 *
 * Deliberately not built on Base UI's `Form`/`Field`: the scheduler forms use MUI
 * Material inputs, and the values are not always DOM values.
 */
export class SchedulerFormStore<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> extends Store<SchedulerFormState<TValues>> {
  private validators = new Map<string, Set<SchedulerFormValidator<TValues>>>();

  /**
   * Keys seeded from a `defaultValue` and written afterwards: an explicit pick of
   * the default must submit, unlike a model value reverted to its seed.
   */
  private writtenDefaultKeys = new Set<string>();

  private defaultSeededKeys = new Set<string>();

  /**
   * Bumped on every registration change so a pending `validateAll` can detect it.
   */
  private validatorsRevision = 0;

  declare private formParameters: SchedulerFormParameters<TValues>;

  /**
   * Values the form was seeded with, used to detect edited fields.
   */
  declare private readonly initialValues: TValues;

  constructor(initialValues: TValues, parameters: SchedulerFormParameters<TValues> = {}) {
    super({ values: { ...initialValues }, errors: {}, isSubmitting: false });
    this.initialValues = { ...initialValues };
    this.formParameters = parameters;
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
    // The values identity doubles as the revision `validateAll` restarts on, so a
    // same-value write (e.g. an idempotent normalizer) must keep the object. Error
    // clearing and dirty marking below still apply to it.
    const hasValueChange = changedKeys.some(
      (key) =>
        !hasOwn(this.state.values, key) ||
        !Object.is(
          getOwn(resolvedChanges as Record<string, unknown>, key),
          getOwn(this.state.values, key),
        ),
    );
    const values = hasValueChange
      ? { ...this.state.values, ...resolvedChanges }
      : this.state.values;

    let errors = this.state.errors;
    for (const key of changedKeys) {
      if (hasOwn(errors, key)) {
        if (errors === this.state.errors) {
          errors = { ...errors };
        }
        delete errors[key];
      }
    }

    for (const key of changedKeys) {
      if (this.defaultSeededKeys.has(key)) {
        this.writtenDefaultKeys.add(key);
      }
    }
    this.update({ values, errors });
    this.formParameters.onValuesChange?.(values, changedKeys);
  };

  /**
   * Writes the error message(s) of a single field, replacing any existing ones.
   * Clears the field's error when the messages normalize to none.
   */
  public setError = (key: string, error: SchedulerFormValidatorResult) => {
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
  public registerValidator = (key: string, validator: SchedulerFormValidator<TValues>) => {
    let validators = this.validators.get(key);
    if (!validators) {
      validators = new Set();
      this.validators.set(key, validators);
    }
    validators.add(validator);
    this.validatorsRevision += 1;
  };

  public unregisterValidator = (key: string, validator: SchedulerFormValidator<TValues>) => {
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
   * Signals that the behavior of a registered validator changed behind a stable
   * identity (e.g. a new closure over new props), so a pending `validateAll`
   * restarts and resolves against the current rules.
   */
  public touchValidators = () => {
    this.validatorsRevision += 1;
  };

  /**
   * Marks a submission as pending or settled, for the action buttons.
   */
  public setSubmitting = (value: boolean) => {
    this.set('isSubmitting', value);
  };

  /**
   * Seeds a key that is not present in the values yet, without marking it dirty
   * or notifying `onValuesChange`. No-op when the key is already present.
   */
  public seedDefault = (key: string, value: unknown) => {
    if (hasOwn(this.state.values, key)) {
      return;
    }
    this.defaultSeededKeys.add(key);
    setOwn(this.initialValues as Record<string, unknown>, key, value);
    this.set('values', { ...this.state.values, [key]: value });
  };

  /**
   * Runs the validators of every field in registration order, stopping at the
   * field's first failure and storing it.
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
      const errors: Record<string, SchedulerFormErrorMessage[]> = {};
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        Array.from(this.validators, async ([key, validators]) => {
          const fieldValue = getOwn(values, key);
          // Registration order, stopping at the first failure: a later (possibly
          // slow) validator must not delay or override an already-known verdict.
          for (const validator of validators) {
            // eslint-disable-next-line no-await-in-loop
            const messages = normalizeValidatorResult(await validator(fieldValue, values));
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
          warnOnce(
            [
              'MUI X Scheduler: The form values or validators kept changing while the validation was running (for example a validator calling setValue).',
              'The submit stays blocked; the stored errors describe the last completed pass.',
              'Avoid writing values or (un)registering validators from a validator.',
            ].join('\n'),
          );
        }
        this.set('errors', errors);
        // Failing closed on the cap: never resolve valid over values no validator saw.
        return isSettled && Object.keys(errors).length === 0;
      }
    }
  };

  /**
   * Returns the values written or changed since seeding.
   */
  public getDirtyValues = (): Record<string, unknown> => {
    const { values } = this.state;
    const dirty: Record<string, unknown> = {};
    for (const key of Object.keys(values)) {
      const isDirty =
        this.writtenDefaultKeys.has(key) ||
        !Object.is(values[key], getOwn(this.initialValues, key));
      if (isDirty) {
        setOwn(dirty, key, values[key]);
      }
    }
    return dirty;
  };
}
