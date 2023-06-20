import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateTimeField as useDateTimeField,
  UseDateTimeFieldComponentProps,
  UseDateTimeFieldProps,
  UseDateTimeFieldDefaultizedProps,
} from '@mui/x-date-pickers/DateTimeField';
import {
  applyDefaultDate,
  useDefaultDates,
  useLocalizationContext,
  useUtils,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
  useControlledValueWithTimezone,
} from '@mui/x-date-pickers/internals';
import { DateTimeValidationError } from '@mui/x-date-pickers/models';
import { DateRange } from '../../models/range';
import type {
  UseMultiInputDateTimeRangeFieldDefaultizedProps,
  UseMultiInputDateTimeRangeFieldParams,
  UseMultiInputDateTimeRangeFieldProps,
} from '../../../MultiInputDateTimeRangeField/MultiInputDateTimeRangeField.types';
import { DateTimeRangeValidationError } from '../../../models';
import {
  DateTimeRangeComponentValidationProps,
  validateDateTimeRange,
} from '../../utils/validation/validateDateTimeRange';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';

export const useDefaultizedDateTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseMultiInputDateTimeRangeFieldProps<TDate>,
): UseMultiInputDateTimeRangeFieldDefaultizedProps<TDate, AdditionalProps> => {
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

export const useMultiInputDateTimeRangeField = <TDate, TTextFieldSlotProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  startInputRef,
  unstableStartFieldRef,
  endTextFieldProps,
  endInputRef,
  unstableEndFieldRef,
}: UseMultiInputDateTimeRangeFieldParams<
  TDate,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedDateTimeRangeFieldProps<TDate, UseDateTimeFieldProps<TDate>>(
    inSharedProps,
  );
  const adapter = useLocalizationContext<TDate>();

  const {
    value: valueProp,
    defaultValue,
    format,
    shouldRespectLeadingZeros,
    timezone: timezoneProp,
    onChange,
    disabled,
    readOnly,
  } = sharedProps;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'useMultiInputDateRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: rangeValueManager,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<TDate | null, DateTimeValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<DateTimeRangeValidationError> = {
        ...rawContext,
        validationError: validateDateTimeRange({
          adapter,
          value: newDateRange,
          props: { ...sharedProps, timezone },
        }),
      };

      handleValueChange(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const validationError = useValidation<
    DateRange<TDate>,
    TDate,
    DateTimeRangeValidationError,
    DateTimeRangeComponentValidationProps<TDate>
  >(
    { ...sharedProps, value, timezone },
    validateDateTimeRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const startFieldProps: UseDateTimeFieldComponentProps<
    TDate,
    UseDateTimeFieldDefaultizedProps<TTextFieldSlotProps>
  > = {
    error: !!validationError[0],
    ...startTextFieldProps,
    format,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    unstableFieldRef: unstableStartFieldRef,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endFieldProps: UseDateTimeFieldComponentProps<
    TDate,
    UseDateTimeFieldDefaultizedProps<TTextFieldSlotProps>
  > = {
    error: !!validationError[1],
    ...endTextFieldProps,
    format,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    unstableFieldRef: unstableEndFieldRef,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const startDateResponse = useDateTimeField({
    props: startFieldProps,
    inputRef: startInputRef,
  }) as UseFieldResponse<TTextFieldSlotProps>;

  const endDateResponse = useDateTimeField({
    props: endFieldProps,
    inputRef: endInputRef,
  }) as UseFieldResponse<TTextFieldSlotProps>;

  return { startDate: startDateResponse, endDate: endDateResponse };
};
