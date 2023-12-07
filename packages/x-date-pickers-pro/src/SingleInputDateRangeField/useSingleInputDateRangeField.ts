import {
  useUtils,
  useDefaultDates,
  applyDefaultDate,
  useField,
  splitFieldInternalAndForwardedProps,
} from '@mui/x-date-pickers/internals';
import {
  UseSingleInputDateRangeFieldComponentProps,
  UseSingleInputDateRangeFieldDefaultizedProps,
  UseSingleInputDateRangeFieldProps,
} from './SingleInputDateRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../internals/utils/validation/validateDateRange';

export const useDefaultizedDateRangeFieldProps = <
  TDate,
  TUseV6TextField extends boolean,
  AdditionalProps extends {},
>(
  props: UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField>,
): UseSingleInputDateRangeFieldDefaultizedProps<TDate, TUseV6TextField, AdditionalProps> => {
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

export const useSingleInputDateRangeField = <
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
>(
  inProps: UseSingleInputDateRangeFieldComponentProps<TDate, TUseV6TextField, TChildProps>,
) => {
  const props = useDefaultizedDateRangeFieldProps<TDate, TUseV6TextField, TChildProps>(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseSingleInputDateRangeFieldProps<any, any>
  >(props, 'date');

  return useField({
    forwardedProps,
    internalProps,
    valueManager: rangeValueManager,
    fieldValueManager: rangeFieldValueManager,
    validator: validateDateRange,
    valueType: 'date',
  });
};
