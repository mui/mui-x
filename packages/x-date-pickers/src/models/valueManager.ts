import { InferNonNullablePickerValue, InferPickerValue } from '../internals/models/value';
import type { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import type { Validator } from '../validation';
import type { InferFieldSection, FieldValueType } from './fields';

// TODO: Rename PickerValueManager when the legacyValueManager object will be inlined.
/**
 * Object that contains all the necessary methods and properties to control the value of a picker.
 * You should never create your own value manager.
 * Instead, use the ones provided exported from '@mui/x-date-pickers/valueManagers' and '@mui/x-date-pickers-pro/valueManagers'.
 */
export interface PickerValueManagerV8<
  TIsRange extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TFieldInternalProps extends {},
  TFieldInternalPropsWithDefaults extends UseFieldInternalProps<
    TIsRange,
    TEnableAccessibleFieldDOMStructure,
    TError
  >,
> {
  // The v7 value manager object.
  // This will be inlined inside the main `PickerValueManagerV8` object once every object using it is compatible with the new API.
  legacyValueManager: PickerValueManager<TIsRange, TError>;
  fieldValueManager: FieldValueManager<TIsRange>;
  /**
   * Checks if a value is valid and returns an error code otherwise.
   */
  validator: Validator<TIsRange, TError, TFieldInternalPropsWithDefaults>;
  /**
   * Applies the default values to the field internal props.
   * This usually includes:
   * - a default format to display the value in the field
   * - some default validation props that are needed to validate the value (e.g: minDate, maxDate)
   * @param {ApplyDefaultsToFieldInternalPropsParameters} parameters The parameters to apply the defaults.
   * @returns {TFieldInternalPropsWithDefaults} The field internal props with the defaults applied.
   */
  applyDefaultsToFieldInternalProps: (
    parameters: ApplyDefaultsToFieldInternalPropsParameters<TFieldInternalProps>,
  ) => TFieldInternalPropsWithDefaults;
  /**
   * The type of the value (e.g. 'date', 'date-time', 'time').
   */
  valueType: FieldValueType;
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
}

interface ApplyDefaultsToFieldInternalPropsParameters<TFieldInternalProps extends {}>
  extends MuiPickersAdapterContextValue {
  internalProps: TFieldInternalProps;
}

export type PickerAnyValueManagerV8 = PickerValueManagerV8<any, any, any, any, any>;

export type PickerAnyAccessibleValueManagerV8 = PickerValueManagerV8<any, true, any, any, any>;

/**
 * Infer all the usual generic in the picker packages from a `PickerValueManager` interface.
 */
export type PickerManagerProperties<TManager extends PickerAnyValueManagerV8> =
  TManager extends PickerValueManagerV8<
    infer TIsRange,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TFieldInternalProps,
    infer TFieldInternalPropsWithDefaults
  >
    ? {
        // Generics
        isRange: TIsRange;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        fieldInternalProps: TFieldInternalProps;
        fieldInternalPropsWithDefaults: TFieldInternalPropsWithDefaults;

        // Derived properties
        value: InferPickerValue<TIsRange>;
        nonNullableValue: InferNonNullablePickerValue<TIsRange>;
        section: InferFieldSection<TIsRange>;
      }
    : never;
