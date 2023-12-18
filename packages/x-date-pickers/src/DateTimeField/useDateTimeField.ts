import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { validateDateTime } from '../internals/utils/validation/validateDateTime';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';
import { useDefaultizedDateTimeField } from '../internals/hooks/defaultizedFieldProps';

export const useDateTimeField = <
  TDate,
  TUseV6TextField extends boolean,
  TAllProps extends UseDateTimeFieldProps<TDate, TUseV6TextField>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseDateTimeFieldProps<TDate, TUseV6TextField>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseDateTimeFieldProps<any, TUseV6TextField>
  >(props, 'date-time');

  return useField<
    TDate | null,
    TDate,
    FieldSection,
    TUseV6TextField,
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
