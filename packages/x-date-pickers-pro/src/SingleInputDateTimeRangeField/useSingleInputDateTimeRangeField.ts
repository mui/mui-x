import {
  useUtils,
  useField,
  applyDefaultDate,
  useDefaultDates,
  splitFieldInternalAndForwardedProps,
} from '@mui/x-date-pickers/internals';
import {
  UseSingleInputDateTimeRangeFieldComponentProps,
  UseSingleInputDateTimeRangeFieldDefaultizedProps,
  UseSingleInputDateTimeRangeFieldProps,
} from './SingleInputDateTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../internals/utils/validation/validateDateTimeRange';

export const useDefaultizedDateTimeRangeFieldProps = <
  TDate,
  TUseV6TextField extends boolean,
  AdditionalProps extends {},
>(
  props: UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>,
): UseSingleInputDateTimeRangeFieldDefaultizedProps<TDate, TUseV6TextField, AdditionalProps> => {
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
    minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
    minTime: props.minDateTime ?? props.minTime,
    maxTime: props.maxDateTime ?? props.maxTime,
    disableIgnoringDatePartForTimeValidation: Boolean(props.minDateTime || props.maxDateTime),
  } as any;
};

export const useSingleInputDateTimeRangeField = <
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
>(
  inProps: UseSingleInputDateTimeRangeFieldComponentProps<TDate, TUseV6TextField, TChildProps>,
) => {
  const props = useDefaultizedDateTimeRangeFieldProps<TDate, TUseV6TextField, TChildProps>(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseSingleInputDateTimeRangeFieldProps<any, any>
  >(props, 'date-time');

  return useField({
    forwardedProps,
    internalProps,
    valueManager: rangeValueManager,
    fieldValueManager: rangeFieldValueManager,
    validator: validateDateTimeRange,
    valueType: 'date-time',
  });
};
