import { InferPickerValue } from '../internals/models/value';
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
  validator: Validator<TIsRange, TError, TFieldInternalPropsWithDefaults>;
  applyDefaultsToFieldInternalProps: (
    params: MuiPickersAdapterContextValue & {
      internalProps: TFieldInternalProps;
    },
  ) => TFieldInternalPropsWithDefaults;
  valueType: FieldValueType;
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
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
        section: InferFieldSection<TIsRange>;
      }
    : never;
