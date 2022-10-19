const VALIDATION_PROP_NAMES = [
  'disablePast',
  'disableFuture',
  'minDate',
  'maxDate',
  'minTime',
  'maxTime',
  'minDateTime',
  'maxDateTime',
  'shouldDisableDate',
  'shouldDisableMonth',
  'shouldDisableYear',
  'shouldDisableTime',
  'minuteStep',
] as const;

type ValidationPropNames = typeof VALIDATION_PROP_NAMES[number];

/**
 * Extract the validation props for the props received by a component.
 * Limit the risk of forgetting some of them and reduce the bundle size.
 */
export const extractValidationProps = <Props extends { [key: string]: any }>(props: Props) => {
  const validationProps = {} as Pick<Props, ValidationPropNames>;

  VALIDATION_PROP_NAMES.forEach((propName) => {
    if (props.hasOwnProperty(propName)) {
      validationProps[propName] = props[propName];
    }
  });

  return validationProps;
};
