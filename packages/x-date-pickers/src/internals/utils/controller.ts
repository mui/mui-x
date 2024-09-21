import { MuiPickersAdapterContextValue } from '../../LocalizationProvider/LocalizationProvider';
import { PickersFieldRoot } from '../../PickersField/index.barrel';
import { FieldValueType, InferFieldSection, PickerValidDate } from '../../models';
import type { Validator } from '../../validation';
import { FieldValueManager } from '../hooks/useField';
import { PickerValueManager } from '../hooks/usePicker';

type GetDefaultInternalProps<TInternalProps extends {}, TDefaultizedInternalProps extends {}> = (
  adapter: MuiPickersAdapterContextValue<any>,
  inputProps: TInternalProps,
) => TDefaultizedInternalProps;

type InferErrorFromValidator<TValidator extends Validator<any, any, any, any>> =
  TValidator extends Validator<any, any, infer TError, any> ? TError : never;

type InferInternalPropsFromDefaultPropsGetter<
  TDefaultPropsGetter extends GetDefaultInternalProps<any, any>,
> =
  TDefaultPropsGetter extends GetDefaultInternalProps<infer TInternalProps, any>
    ? TInternalProps
    : never;

type InferDefaultizedInternalPropsFromDefaultPropsGetter<
  TDefaultPropsGetter extends GetDefaultInternalProps<any, any>,
> =
  TDefaultPropsGetter extends GetDefaultInternalProps<any, infer TDefaultizedInternalProps>
    ? TDefaultizedInternalProps
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
    InferInternalPropsFromDefaultPropsGetter<TDefaultPropsGetter>,
    InferDefaultizedInternalPropsFromDefaultPropsGetter<TDefaultPropsGetter>
  > => ({
    valueType,
    validator,
    valueManager,
    fieldValueManager,
    getDefaultInternalProps,
  });
}
