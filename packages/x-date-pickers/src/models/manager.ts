import type { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import type { PickerValidValue } from '../internals/models';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import type { Validator } from '../validation';
import type { PickerValueType } from './common';

/**
 * Object that contains all the necessary methods and properties to adapter a picker or a field for a given value type.
 * You should never create your own manager.
 * Instead, use the hooks exported from '@mui/x-date-pickers/managers' and '@mui/x-date-pickers-pro/managers'.
 *
 * ```tsx
 * import { useDateManager } from '@mui/x-date-pickers/managers';
 * import { useValidation } from '@mui/x-date-pickers/validation';
 *
 * const manager = useDateManager();
 * const { hasValidationError } = useValidation({
 *   validator: manager.validator,
 *   value,
 *   timezone,
 *   props,
 * });
 * ```
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
   * The type of the value (e.g. 'date', 'date-time', 'time').
   */
  valueType: PickerValueType;
  /**
   * Checks if a value is valid and returns an error code otherwise.
   * It can be passed to the `useValidation` hook to validate a value:
   *
   * ```tsx
   * import { useDateManager } from '@mui/x-date-pickers/managers';
   * import { useValidation } from '@mui/x-date-pickers/validation';
   *
   * const manager = useDateManager();
   * const { hasValidationError } = useValidation({
   *   validator: manager.validator,
   *   value,
   *   timezone,
   *   props,
   * });
   * ```
   */
  validator: Validator<TValue, TError, TFieldInternalPropsWithDefaults>;
  /**
   * Object containing basic methods to interact with the value of the picker or field.
   * This property is not part of the public API and should not be used directly.
   */
  internal_valueManager: PickerValueManager<TValue, TError>;
  /**
   * Object containing all the necessary methods to interact with the value of the field.
   * This property is not part of the public API and should not be used directly.
   */
  internal_fieldValueManager: FieldValueManager<TValue>;
  /**
   * `true` if the field is using the accessible DOM structure.
   * `false` if the field is using the non-accessible DOM structure.
   * This property is not part of the public API and should not be used directly.
   */
  internal_enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
  /**
   * Applies the default values to the field internal props.
   * This usually includes:
   * - a default format to display the value in the field
   * - some default validation props that are needed to validate the value (e.g: minDate, maxDate)
   * This property is not part of the public API and should not be used directly.
   * @param {ApplyDefaultsToFieldInternalPropsParameters} parameters The parameters to apply the defaults.
   * @returns {TFieldInternalPropsWithDefaults} The field internal props with the defaults applied.
   */
  internal_applyDefaultsToFieldInternalProps: (
    parameters: ApplyDefaultsToFieldInternalPropsParameters<TFieldInternalProps>,
  ) => TFieldInternalPropsWithDefaults;
}

interface ApplyDefaultsToFieldInternalPropsParameters<TFieldInternalProps extends {}>
  extends MuiPickersAdapterContextValue {
  internalProps: TFieldInternalProps;
}
