import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
  UseDateFieldProps,
  UseDateFieldDefaultizedProps,
} from '@mui/x-date-pickers/DateField';
import {
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
  useControlledValueWithTimezone,
} from '@mui/x-date-pickers/internals';
import { DateValidationError } from '@mui/x-date-pickers/models';
import { useDefaultizedDateRangeFieldProps } from '../../../SingleInputDateRangeField/useSingleInputDateRangeField';
import { UseMultiInputDateRangeFieldParams } from '../../../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { DateRange } from '../../models/range';
import {
  DateRangeComponentValidationProps,
  validateDateRange,
} from '../../utils/validation/validateDateRange';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { DateRangeValidationError } from '../../../models';

export const useMultiInputDateRangeField = <TDate, TTextFieldSlotProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  startInputRef,
  unstableStartFieldRef,
  endTextFieldProps,
  endInputRef,
  unstableEndFieldRef,
}: UseMultiInputDateRangeFieldParams<
  TDate,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TDate, UseDateFieldProps<TDate>>(
    inSharedProps,
  );
  const adapter = useLocalizationContext<TDate>();

  const {
    value: valueProp,
    defaultValue,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
    timezone: timezoneProp,
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
  ): FieldChangeHandler<TDate | null, DateValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<DateRangeValidationError> = {
        ...rawContext,
        validationError: validateDateRange({
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
    DateRangeValidationError,
    DateRangeComponentValidationProps<TDate>
  >(
    { ...sharedProps, value, timezone },
    validateDateRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const startFieldProps: UseDateFieldComponentProps<
    TDate,
    UseDateFieldDefaultizedProps<TTextFieldSlotProps>
  > = {
    error: !!validationError[0],
    ...startTextFieldProps,
    disabled,
    readOnly,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    timezone,
    unstableFieldRef: unstableStartFieldRef,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
    selectedSections,
    onSelectedSectionsChange,
  };

  const endFieldProps: UseDateFieldComponentProps<
    TDate,
    UseDateFieldDefaultizedProps<TTextFieldSlotProps>
  > = {
    error: !!validationError[1],
    ...endTextFieldProps,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    unstableFieldRef: unstableEndFieldRef,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
    selectedSections,
    onSelectedSectionsChange,
  };

  const startDateResponse = useDateField({
    props: startFieldProps,
    inputRef: startInputRef,
  }) as UseFieldResponse<TTextFieldSlotProps>;

  const endDateResponse = useDateField({
    props: endFieldProps,
    inputRef: endInputRef,
  }) as UseFieldResponse<TTextFieldSlotProps>;

  return { startDate: startDateResponse, endDate: endDateResponse };
};
