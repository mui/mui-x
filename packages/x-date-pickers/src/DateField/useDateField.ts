import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import {
  UseDateFieldProps,
  UseDateFieldDefaultizedProps,
  UseDateFieldComponentProps,
} from './DateField.types';
import { validateDate } from '../internals/utils/validation/validateDate';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';

const useDefaultizedDateField = <
  TDate,
  TUseV6TextField extends boolean,
  AdditionalProps extends {},
>(
  props: UseDateFieldProps<TDate, TUseV6TextField>,
): AdditionalProps & UseDateFieldDefaultizedProps<TDate, TUseV6TextField> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  } as any;
};

export const useDateField = <TDate, TUseV6TextField extends boolean, TChildProps extends {}>(
  inProps: UseDateFieldComponentProps<TDate, TUseV6TextField, TChildProps>,
) => {
  const props = useDefaultizedDateField<TDate, TUseV6TextField, TChildProps>(inProps);

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
