export const SHARED_VALIDATION_PROP_NAMES = ['disablePast', 'disableFuture'] as const;

export const DATE_VALIDATION_PROP_NAMES = [
  'minDate',
  'maxDate',
  'shouldDisableDate',
  'shouldDisableMonth',
  'shouldDisableYear',
] as const;

export const TIME_VALIDATION_PROP_NAMES = [
  'minTime',
  'maxTime',
  'shouldDisableClock',
  'shouldDisableTime',
  'minuteStep',
  'ampm',
] as const;

export const DATE_TIME_VALIDATION_PROP_NAMES = [
  'minDateTime',
  'maxDateTime',
  'disableIgnoringDatePartForTimeValidation',
] as const;

const VALIDATION_PROP_NAMES = [
  ...SHARED_VALIDATION_PROP_NAMES,
  ...DATE_VALIDATION_PROP_NAMES,
  ...TIME_VALIDATION_PROP_NAMES,
  ...DATE_TIME_VALIDATION_PROP_NAMES,
] as const;

type ValidationPropNames = (typeof VALIDATION_PROP_NAMES)[number];

/**
 * Extract the validation props for the props received by a component.
 * Limit the risk of forgetting some of them and reduce the bundle size.
 */
export const extractValidationProps = <Props extends { [key: string]: any }>(props: Props) =>
  VALIDATION_PROP_NAMES.reduce((extractedProps, propName) => {
    if (props.hasOwnProperty(propName)) {
      extractedProps[propName] = props[propName];
    }
    return extractedProps;
  }, {} as Pick<Props, ValidationPropNames>);
