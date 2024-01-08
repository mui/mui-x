import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
} from '@mui/x-date-pickers/DateField';
import {
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
  useControlledValueWithTimezone,
  useDefaultizedDateField,
} from '@mui/x-date-pickers/internals';
import { DateValidationError, FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import {
  UseMultiInputDateRangeFieldParams,
  UseMultiInputDateRangeFieldProps,
} from '../../../MultiInputDateRangeField/MultiInputDateRangeField.types';
import {
  DateRangeComponentValidationProps,
  validateDateRange,
} from '../../utils/validation/validateDateRange';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { DateRangeValidationError, DateRange } from '../../../models';
import { excludeProps } from './shared';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';

export const useMultiInputDateRangeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TTextFieldSlotProps extends {},
>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputDateRangeFieldParams<
  TDate,
  TTextFieldVersion,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TTextFieldVersion, TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedDateField<
    TDate,
    UseMultiInputDateRangeFieldProps<TDate, TTextFieldVersion>,
    typeof inSharedProps
  >(inSharedProps);

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
    textFieldVersion,
    autoFocus,
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

  const selectedSectionsResponse = useMultiInputFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startFieldProps: UseDateFieldComponentProps<TDate, TTextFieldVersion, typeof sharedProps> =
    {
      error: !!validationError[0],
      ...startTextFieldProps,
      ...selectedSectionsResponse.start,
      disabled,
      readOnly,
      format,
      formatDensity,
      shouldRespectLeadingZeros,
      timezone,
      value: valueProp === undefined ? undefined : valueProp[0],
      defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
      onChange: handleStartDateChange,
      textFieldVersion,
      autoFocus, // Do not add on end field.
    };

  const endFieldProps: UseDateFieldComponentProps<TDate, TTextFieldVersion, typeof sharedProps> = {
    error: !!validationError[1],
    ...endTextFieldProps,
    ...selectedSectionsResponse.end,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
    textFieldVersion,
  };

  const startDateResponse = useDateField<TDate, TTextFieldVersion, typeof startFieldProps>(
    startFieldProps,
  ) as UseFieldResponse<TTextFieldVersion, TTextFieldSlotProps>;

  const endDateResponse = useDateField<TDate, TTextFieldVersion, typeof endFieldProps>(
    endFieldProps,
  ) as UseFieldResponse<TTextFieldVersion, TTextFieldSlotProps>;

  /* TODO: Undo this change when a clearable behavior for multiple input range fields is implemented */
  return {
    startDate: excludeProps(startDateResponse, ['clearable', 'onClear']),
    endDate: excludeProps(endDateResponse, ['clearable', 'onClear']),
  };
};
