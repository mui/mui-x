import { PickersFieldRoot } from '../../PickersField/index.barrel';
import { FieldValueType, InferFieldSection, PickerValidDate } from '../../models';
import type { Validator } from '../../validation';
import { FieldValueManager } from '../hooks/useField';
import { PickerValueManager } from '../hooks/usePicker';

type InferErrorFromValidator<TValidator extends Validator<any, any, any, any>> =
  TValidator extends Validator<any, any, infer TError, any> ? TError : never;

interface BuildFieldControllerGetterParams<
  TValueType extends FieldValueType,
  TIsRange extends boolean,
  TValidator extends Validator<any, any, any, any>,
> {
  isRange: TIsRange;
  valueType: TValueType;
  validator: TValidator;
  valueManager: PickerValueManager<any, any, InferErrorFromValidator<TValidator>>;
  fieldValueManager: FieldValueManager<any, any, InferFieldSection<TIsRange>>;
}

export function buildFieldControllerGetter<
  TValueType extends FieldValueType,
  TIsRange extends boolean,
  TValidator extends Validator<any, any, any, any>,
>(params: BuildFieldControllerGetterParams<TValueType, TIsRange, TValidator>) {
  const { valueType, validator, valueManager, fieldValueManager } = params;

  return <TDate extends PickerValidDate>(): PickersFieldRoot.Controller<
    TDate,
    TIsRange,
    InferErrorFromValidator<TValidator>,
    // TODO: Correctly type the internal props.
    any
  > => ({
    valueType,
    validator,
    valueManager,
    fieldValueManager,
  });
}
