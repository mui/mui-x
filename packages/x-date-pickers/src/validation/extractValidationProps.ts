import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  DayValidationProps,
  MonthValidationProps,
  TimeValidationProps,
  YearValidationProps,
} from '../internals/models/validation';

export const DATE_VALIDATION_PROP_NAMES: (
  | keyof BaseDateValidationProps
  | keyof YearValidationProps
  | keyof MonthValidationProps
  | keyof DayValidationProps
)[] = [
  'disablePast',
  'disableFuture',
  'minDate',
  'maxDate',
  'shouldDisableDate',
  'shouldDisableMonth',
  'shouldDisableYear',
];

export const TIME_VALIDATION_PROP_NAMES: (
  | keyof BaseTimeValidationProps
  | keyof TimeValidationProps
  | 'ampm'
)[] = [
  'disablePast',
  'disableFuture',
  'minTime',
  'maxTime',
  'shouldDisableTime',
  'minutesStep',
  'ampm',
  'disableIgnoringDatePartForTimeValidation',
];

export const DATE_TIME_VALIDATION_PROP_NAMES: (keyof DateTimeValidationProps)[] = [
  'minDateTime',
  'maxDateTime',
];

const VALIDATION_PROP_NAMES = [
  ...DATE_VALIDATION_PROP_NAMES,
  ...TIME_VALIDATION_PROP_NAMES,
  ...DATE_TIME_VALIDATION_PROP_NAMES,
];

type ValidationPropNames = (typeof VALIDATION_PROP_NAMES)[number];

/**
 * Extract the validation props for the props received by a component.
 * Limit the risk of forgetting some of them and reduce the bundle size.
 */
export const extractValidationProps = <Props extends { [key: string]: any }>(props: Props) =>
  VALIDATION_PROP_NAMES.reduce(
    (extractedProps, propName) => {
      if (props.hasOwnProperty(propName)) {
        extractedProps[propName] = props[propName];
      }
      return extractedProps;
    },
    {} as Pick<Props, ValidationPropNames>,
  );
