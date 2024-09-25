import { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import { PickerValueManager } from '../internals/hooks/usePicker';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import { Validator } from '../validation';
import { InferValueFromDate, InferFieldSection, FieldValueType } from './fields';
import { PickerValidDate } from './pickers';

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
  applyDefaultFieldInternalProps: (params: {
    adapter: MuiPickersAdapterContextValue<TDate>;
    inputProps: TInternalProps;
  }) => TDefaultizedInternalProps;
  valueType: FieldValueType;
}
