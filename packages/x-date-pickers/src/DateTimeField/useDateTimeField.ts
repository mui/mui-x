import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { validateDateTime } from '../internals/utils/validation/validateDateTime';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection, PickerValidDate } from '../models';
import { useDefaultizedDateTimeField } from '../internals/hooks/defaultizedFieldProps';

export const useDateTimeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseDateTimeFieldProps<any, TEnableAccessibleFieldDOMStructure>
  >(props, 'date-time');

  return useField<
    TDate | null,
    TDate,
    FieldSection,
    TEnableAccessibleFieldDOMStructure,
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
