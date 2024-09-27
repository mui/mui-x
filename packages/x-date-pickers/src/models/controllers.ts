import type { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import type { Validator } from '../validation';
import type { InferValueFromDate, InferFieldSection, FieldValueType } from './fields';
import { PickerValidDate } from './pickers';

/**
 * Object that contains all the necessary methods and properties to control a picker.
 * You should never create your own controller.
 * Instead, use the ones provided exported from '@mui/x-date-pickers/controllers' and '@mui/x-date-pickers-pro/controllers'.
 */
export interface PickerController<
  TDate extends PickerValidDate,
  TIsRange extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TInternalProps extends Partial<
    UseFieldInternalProps<any, any, any, TEnableAccessibleFieldDOMStructure, any>
  >,
  TInternalPropsWithDefaults extends UseFieldInternalProps<
    any,
    any,
    any,
    TEnableAccessibleFieldDOMStructure,
    any
  >,
> {
  valueManager: PickerValueManager<InferValueFromDate<TDate, TIsRange>, TDate, TError>;
  fieldValueManager: FieldValueManager<
    InferValueFromDate<TDate, TIsRange>,
    TDate,
    InferFieldSection<TIsRange>
  >;
  validator: Validator<
    InferValueFromDate<TDate, TIsRange>,
    TDate,
    TError,
    TInternalPropsWithDefaults
  >;
  applyDefaultsToFieldInternalProps: (params: {
    adapter: MuiPickersAdapterContextValue<TDate>;
    internalProps: TInternalProps;
  }) => TInternalPropsWithDefaults;
  valueType: FieldValueType;
}

export type PickerAnyController = PickerController<any, any, any, any, any, any>;

/**
 * Infer all the usual generic in the picker packages from a `PickerConroller` interface.
 */
export type PickerControllerProperties<TController extends PickerAnyController> =
  TController extends PickerController<
    infer TDate,
    infer TIsRange,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TInternalProps,
    infer TInternalPropsWithDefaults
  >
    ? {
        // Generics
        date: TDate;
        isRange: TIsRange;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        internalProps: TInternalProps;
        internalPropsWithDefaults: TInternalPropsWithDefaults;

        // Derived properties
        value: InferValueFromDate<TDate, TIsRange>;
        section: InferFieldSection<TIsRange>;
      }
    : never;
