import { DefaultizedProps } from '@mui/x-internals/types';
import { applyDefaultDate } from '../utils/date-utils';
import { useUtils, useDefaultDates } from './useUtils';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  TimeValidationProps,
} from '../models/validation';

export interface UseDefaultizedDateFieldBaseProps extends BaseDateValidationProps {
  format?: string;
}

export const useDefaultizedDateField = <
  TKnownProps extends UseDefaultizedDateFieldBaseProps,
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedDateFieldBaseProps> => {
  const utils = useUtils();
  const defaultDates = useDefaultDates();

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
  TKnownProps extends UseDefaultizedTimeFieldBaseProps & { ampm?: boolean },
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedTimeFieldBaseProps> => {
  const utils = useUtils();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
  };
};

export interface UseDefaultizedDateTimeFieldBaseProps
  extends BaseDateValidationProps,
    BaseTimeValidationProps {
  format?: string;
}

export const useDefaultizedDateTimeField = <
  TKnownProps extends UseDefaultizedDateTimeFieldBaseProps &
    DateTimeValidationProps &
    TimeValidationProps & { ampm?: boolean },
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedDateTimeFieldBaseProps> => {
  const utils = useUtils();
  const defaultDates = useDefaultDates();

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
