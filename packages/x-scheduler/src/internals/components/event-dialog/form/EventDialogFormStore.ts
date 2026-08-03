import { Store, createSelector } from '@base-ui/utils/store';

export interface EventDialogFormState {
  /**
   * Current form values, keyed by field name (built-in and custom keys alike).
   */
  values: Record<string, unknown>;
  /**
   * Values the form was seeded with, used to detect edited fields.
   */
  initialValues: Record<string, unknown>;
  /**
   * Validation errors, keyed by field name.
   */
  errors: Record<string, string | string[]>;
}

export type EventDialogFormValidator = (
  value: unknown,
  allValues: Record<string, unknown>,
) => string | string[] | null;

export interface EventDialogFormStoreOptions {
  /**
   * Called synchronously after each write with the new values and the written keys.
   */
  onValuesChange?: (values: Record<string, unknown>, changedKeys: string[]) => void;
}

/**
 * Ephemeral draft store backing the event dialog form.
 * Seeded from the event when the dialog opens and discarded when it closes,
 * it holds the edited values until they are committed to the scheduler store on save.
 */
export class EventDialogFormStore extends Store<EventDialogFormState> {
  private validators = new Map<string, Set<EventDialogFormValidator>>();

  private options: EventDialogFormStoreOptions;

  constructor(initialValues: Record<string, unknown>, options: EventDialogFormStoreOptions = {}) {
    super({ values: initialValues, initialValues, errors: {} });
    this.options = options;
  }

  public setValue = (key: string, value: unknown) => {
    this.setValues({ [key]: value });
  };

  public setValues = (changes: Record<string, unknown>) => {
    const changedKeys = Object.keys(changes);
    const values = { ...this.state.values, ...changes };

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
    this.options.onValuesChange?.(values, changedKeys);
  };

  public clearErrors = () => {
    if (Object.keys(this.state.errors).length > 0) {
      this.set('errors', {});
    }
  };

  public registerValidator = (key: string, validator: EventDialogFormValidator) => {
    let validators = this.validators.get(key);
    if (!validators) {
      validators = new Set();
      this.validators.set(key, validators);
    }
    validators.add(validator);
  };

  public unregisterValidator = (key: string, validator: EventDialogFormValidator) => {
    const validators = this.validators.get(key);
    validators?.delete(validator);
    if (validators?.size === 0) {
      this.validators.delete(key);
    }
  };

  /**
   * Runs every registered validator and stores the failures (first error per field wins).
   * Returns whether the form is valid.
   */
  public validateAll = (): boolean => {
    const { values } = this.state;
    const errors: Record<string, string | string[]> = {};
    for (const [key, validators] of this.validators) {
      for (const validator of validators) {
        const result = validator(values[key], values);
        if (result != null && !(Array.isArray(result) && result.length === 0)) {
          errors[key] = result;
          break;
        }
      }
    }
    this.set('errors', errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Returns the values that changed since seeding, minus `excludeKeys`.
   */
  public getDirtyValues = (excludeKeys?: ReadonlySet<string>): Record<string, unknown> => {
    const { values, initialValues } = this.state;
    const dirty: Record<string, unknown> = {};
    for (const key of Object.keys(values)) {
      if (!excludeKeys?.has(key) && !Object.is(values[key], initialValues[key])) {
        dirty[key] = values[key];
      }
    }
    return dirty;
  };

  public reset = () => {
    this.update({ values: this.state.initialValues, errors: {} });
  };
}

export const eventDialogFormSelectors = {
  value: createSelector((state: EventDialogFormState, key: string) => state.values[key]),
  error: createSelector((state: EventDialogFormState, key: string) => state.errors[key]),
};
