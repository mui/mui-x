import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { validateTime } from '../internals/utils/validation/validateTime';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection, FieldTextFieldVersion } from '../models';
import { useDefaultizedTimeField } from '../internals/hooks/defaultizedFieldProps';

export const useTimeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TAllProps extends UseTimeFieldProps<TDate, TTextFieldVersion>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseTimeFieldProps<TDate, TTextFieldVersion>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseTimeFieldProps<any, TTextFieldVersion>
  >(props, 'time');

  return useField<
    TDate | null,
    TDate,
    FieldSection,
    TTextFieldVersion,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateTime,
    valueType: 'time',
  });
};
