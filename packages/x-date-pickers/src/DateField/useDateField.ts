import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { validateDate } from '../internals/utils/validation/validateDate';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';
import { useDefaultizedDateField } from '../internals/hooks/defaultizedFieldProps';

export const useDateField = <
  TDate,
  TUseV6TextField extends boolean,
  TAllProps extends UseDateFieldProps<TDate, TUseV6TextField>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateField<
    TDate,
    UseDateFieldProps<TDate, TUseV6TextField>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseDateFieldProps<TDate, TUseV6TextField>
  >(props, 'date');

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
    validator: validateDate,
    valueType: 'date',
  });
};
