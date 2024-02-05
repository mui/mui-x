import { applyDefaultDate } from '../utils/date-utils';
import { useUtils, useDefaultDates } from './useUtils';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  TimeValidationProps,
} from '../models/validation';
import { DefaultizedProps } from '../models/helpers';
import { PickerValidDate } from '../../models';

export interface UseDefaultizedDateFieldBaseProps<TDate extends PickerValidDate>
  extends BaseDateValidationProps<TDate> {
  format?: string;
}

export const useDefaultizedDateField = <
  TDate extends PickerValidDate,
  TKnownProps extends UseDefaultizedDateFieldBaseProps<TDate>,
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedDateFieldBaseProps<any>> => {
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

export interface UseDefaultizedTimeFieldBaseProps extends BaseTimeValidationProps {
  format?: string;
}

export const useDefaultizedTimeField = <
  TDate extends PickerValidDate,
  TKnownProps extends UseDefaultizedTimeFieldBaseProps & { ampm?: boolean },
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedTimeFieldBaseProps> => {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
  };
};

export interface UseDefaultizedDateTimeFieldBaseProps<TDate extends PickerValidDate>
  extends BaseDateValidationProps<TDate>,
    BaseTimeValidationProps {
  format?: string;
}

export const useDefaultizedDateTimeField = <
  TDate extends PickerValidDate,
  TKnownProps extends UseDefaultizedDateTimeFieldBaseProps<TDate> &
    DateTimeValidationProps<TDate> &
    TimeValidationProps<TDate> & { ampm?: boolean },
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedDateTimeFieldBaseProps<any>> => {
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
