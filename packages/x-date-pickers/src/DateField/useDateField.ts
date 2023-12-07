import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { validateDate } from '../internals/utils/validation/validateDate';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';
import { BaseDateValidationProps } from '../internals/models/validation';
import { DefaultizedProps } from '../internals/models/helpers';

interface UseDefaultizedDateFieldBaseProps<TDate> extends BaseDateValidationProps<TDate> {
  format?: string;
}

export const useDefaultizedDateField = <
  TDate,
  TKnownProps extends UseDefaultizedDateFieldBaseProps<TDate>,
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedDateFieldBaseProps<TDate>> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  };
};

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
