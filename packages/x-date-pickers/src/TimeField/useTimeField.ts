import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { validateTime } from '../internals/utils/validation/validateTime';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';
import { useDefaultizedTimeField } from '../internals/hooks/defaultizedFieldProps';

export const useTimeField = <
  TDate,
  TUseV6TextField extends boolean,
  TAllProps extends UseTimeFieldProps<TDate, TUseV6TextField>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseTimeFieldProps<TDate, TUseV6TextField>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseTimeFieldProps<any, TUseV6TextField>
  >(props, 'time');

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
    validator: validateTime,
    valueType: 'time',
  });
};
