import type { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import type { Validator } from '../validation';
import type { FieldValueType } from './fields';

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
  /**
   * Object containing basic methods to interact with the value of the picker or field.
   * The properties of this object will be inlined inside the main `PickerValueManagerV8` object once every object using it is compatible with the new API.
   */
  legacyValueManager: PickerValueManager<TIsRange, TError>;
  /**
   * Object containing all the necessary methods to interact with the value of the field.
   * The properties of this object will be inlined inside the main `PickerValueManagerV8` object once every object using it is compatible with the new API.
   */
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
