import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { validateDateTime } from '../internals/utils/validation/validateDateTime';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  TimeValidationProps,
} from '../internals/models/validation';
import { DefaultizedProps } from '../internals/models/helpers';

interface UseDefaultizedDateTimeFieldBaseProps<TDate>
  extends BaseDateValidationProps<TDate>,
    BaseTimeValidationProps {
  format?: string;
}

export const useDefaultizedDateTimeField = <
  TDate,
  TKnownProps extends UseDefaultizedDateTimeFieldBaseProps<TDate> &
    DateTimeValidationProps<TDate> &
    TimeValidationProps<TDate> & { ampm?: boolean },
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedDateTimeFieldBaseProps<TDate>> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm
    ? utils.formats.keyboardDateTime12h
    : utils.formats.keyboardDateTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
    disableIgnoringDatePartForTimeValidation: Boolean(props.minDateTime || props.maxDateTime),
    minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
    minTime: props.minDateTime ?? props.minTime,
    maxTime: props.maxDateTime ?? props.maxTime,
  };
};

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
