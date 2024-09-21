import { MuiPickersAdapterContextValue } from '../../LocalizationProvider/LocalizationProvider';
import { PickersFieldRoot } from '../../PickersField/index.barrel';
import { FieldValueType, InferFieldSection, PickerValidDate } from '../../models';
import type { Validator } from '../../validation';
import { FieldValueManager } from '../hooks/useField';
import { PickerValueManager } from '../hooks/usePicker';

type GetDefaultInternalProps<TInputInternalProps extends {}, TInternalProps extends {}> = (
  adapter: MuiPickersAdapterContextValue<any>,
  inputProps: TInputInternalProps,
) => TInternalProps;

type InferErrorFromValidator<TValidator extends Validator<any, any, any, any>> =
  TValidator extends Validator<any, any, infer TError, any> ? TError : never;

type InferInputInternalPropsFromDefaultPropsGetter<
  TDefaultPropsGetter extends GetDefaultInternalProps<any, any>,
> =
  TDefaultPropsGetter extends GetDefaultInternalProps<infer TInputInternalProps, any>
    ? TInputInternalProps
    : never;

type InferInternalPropsFromDefaultPropsGetter<
  TDefaultPropsGetter extends GetDefaultInternalProps<any, any>,
> =
  TDefaultPropsGetter extends GetDefaultInternalProps<any, infer TInternalProps>
    ? TInternalProps
    : never;

interface BuildFieldControllerGetterParams<
  TValueType extends FieldValueType,
  TIsRange extends boolean,
  TValidator extends Validator<any, any, any, any>,
  TDefaultPropsGetter extends GetDefaultInternalProps<any, any>,
> {
  isRange: TIsRange;
  valueType: TValueType;
  validator: TValidator;
  valueManager: PickerValueManager<any, any, InferErrorFromValidator<TValidator>>;
  fieldValueManager: FieldValueManager<any, any, InferFieldSection<TIsRange>>;
  getDefaultInternalProps: TDefaultPropsGetter;
}

export function buildFieldControllerGetter<
  TValueType extends FieldValueType,
  TIsRange extends boolean,
  TValidator extends Validator<any, any, any, any>,
  TDefaultPropsGetter extends GetDefaultInternalProps<any, any>,
>(params: BuildFieldControllerGetterParams<TValueType, TIsRange, TValidator, TDefaultPropsGetter>) {
  const { valueType, validator, valueManager, fieldValueManager, getDefaultInternalProps } = params;

  return <TDate extends PickerValidDate>(): PickersFieldRoot.Controller<
    TDate,
    TIsRange,
    InferErrorFromValidator<TValidator>,
    InferInputInternalPropsFromDefaultPropsGetter<TDefaultPropsGetter>,
    InferInternalPropsFromDefaultPropsGetter<TDefaultPropsGetter>
  > => ({
    valueType,
    validator,
    valueManager,
    fieldValueManager,
    getDefaultInternalProps,
  });
}
