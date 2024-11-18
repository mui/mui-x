import type { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import type { PickerValidValue } from '../internals/models';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import type { Validator } from '../validation';
import type { PickerValueType } from './common';

/**
 * Object that contains all the necessary methods and properties to adapter a picker or a field for a given value type.
 * You should never create your own manager.
 * Instead, use the ones provided exported from '@mui/x-date-pickers/managers' and '@mui/x-date-pickers-pro/managers'.
 */
export interface PickerManager<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TFieldInternalProps extends {},
  TFieldInternalPropsWithDefaults extends UseFieldInternalProps<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TError
  >,
> {
  /**
   * Object containing basic methods to interact with the value of the picker or field.
   */
  valueManager: PickerValueManager<TValue, TError>;
  /**
   * Object containing all the necessary methods to interact with the value of the field.
   */
  fieldValueManager: FieldValueManager<TValue>;
  /**
   * Checks if a value is valid and returns an error code otherwise.
   */
  validator: Validator<TValue, TError, TFieldInternalPropsWithDefaults>;
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
  valueType: PickerValueType;
  /**
   * `true` if the field is using the accessible DOM structure.
   * `false` if the field is using the non-accessible legacy DOM structure (which will be deprecated and removed in the future).
   */
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
}

interface ApplyDefaultsToFieldInternalPropsParameters<TFieldInternalProps extends {}>
  extends MuiPickersAdapterContextValue {
  internalProps: TFieldInternalProps;
}
