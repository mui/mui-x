import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { validateTime } from '../internals/utils/validation/validateTime';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { PickerValidDate, FieldSection } from '../models';
import { useDefaultizedTimeField } from '../internals/hooks/defaultizedFieldProps';

export const useTimeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseTimeFieldProps<any, TEnableAccessibleFieldDOMStructure>
  >(props, 'time');

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
    validator: validateTime,
    valueType: 'time',
  });
};
