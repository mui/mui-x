import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { validateDateTime } from '../internals/utils/validation/validateDateTime';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection, FieldTextFieldVersion } from '../models';
import { useDefaultizedDateTimeField } from '../internals/hooks/defaultizedFieldProps';

export const useDateTimeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TAllProps extends UseDateTimeFieldProps<TDate, TTextFieldVersion>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseDateTimeFieldProps<TDate, TTextFieldVersion>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseDateTimeFieldProps<any, TTextFieldVersion>
  >(props, 'date-time');

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
    validator: validateDateTime,
    valueType: 'date-time',
  });
};
