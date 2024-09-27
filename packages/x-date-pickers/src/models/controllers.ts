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
  TError,
  TInternalProps extends Partial<UseFieldInternalProps<any, any, any, true, any>>,
  TDefaultizedInternalProps extends UseFieldInternalProps<any, any, any, true, any>,
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
    TDefaultizedInternalProps
  >;
  applyDefaultsToFieldInternalProps: (params: {
    adapter: MuiPickersAdapterContextValue<TDate>;
    internalProps: TInternalProps;
  }) => TDefaultizedInternalProps;
  valueType: FieldValueType;
}
