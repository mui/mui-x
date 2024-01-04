import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { validateDate } from '../internals/utils/validation/validateDate';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection, FieldTextFieldVersion } from '../models';
import { useDefaultizedDateField } from '../internals/hooks/defaultizedFieldProps';

export const useDateField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TAllProps extends UseDateFieldProps<TDate, TTextFieldVersion>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateField<
    TDate,
    UseDateFieldProps<TDate, TTextFieldVersion>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseDateFieldProps<TDate, TTextFieldVersion>
  >(props, 'date');

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
    validator: validateDate,
    valueType: 'date',
  });
};
