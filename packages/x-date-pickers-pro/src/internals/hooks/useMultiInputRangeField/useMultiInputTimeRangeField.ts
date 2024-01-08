import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useTimeField as useTimeField,
  UseTimeFieldComponentProps,
} from '@mui/x-date-pickers/TimeField';
import {
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
  useControlledValueWithTimezone,
  useDefaultizedTimeField,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion, TimeValidationError } from '@mui/x-date-pickers/models';
import {
  validateTimeRange,
  TimeRangeComponentValidationProps,
} from '../../utils/validation/validateTimeRange';
import { TimeRangeValidationError, DateRange } from '../../../models';
import type {
  UseMultiInputTimeRangeFieldParams,
  UseMultiInputTimeRangeFieldProps,
} from '../../../MultiInputTimeRangeField/MultiInputTimeRangeField.types';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { excludeProps } from './shared';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';

export const useMultiInputTimeRangeField = <
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TTextFieldSlotProps extends {},
>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputTimeRangeFieldParams<
  TDate,
  TTextFieldVersion,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TTextFieldVersion, TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedTimeField<
    TDate,
    UseMultiInputTimeRangeFieldProps<TDate, TTextFieldVersion>,
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
  ): FieldChangeHandler<TDate | null, TimeValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<TimeRangeValidationError> = {
        ...rawContext,
        validationError: validateTimeRange({
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
    TimeRangeValidationError,
    TimeRangeComponentValidationProps
  >(
    { ...sharedProps, value, timezone },
    validateTimeRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const selectedSectionsResponse = useMultiInputFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startFieldProps: UseTimeFieldComponentProps<TDate, TTextFieldVersion, typeof sharedProps> =
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

  const endFieldProps: UseTimeFieldComponentProps<TDate, TTextFieldVersion, typeof sharedProps> = {
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

  const startDateResponse = useTimeField<TDate, TTextFieldVersion, typeof startFieldProps>(
    startFieldProps,
  ) as UseFieldResponse<TTextFieldVersion, TTextFieldSlotProps>;

  const endDateResponse = useTimeField<TDate, TTextFieldVersion, typeof endFieldProps>(
    endFieldProps,
  ) as UseFieldResponse<TTextFieldVersion, TTextFieldSlotProps>;

  /* TODO: Undo this change when a clearable behavior for multiple input range fields is implemented */
  return {
    startDate: excludeProps(startDateResponse, ['clearable', 'onClear']),
    endDate: excludeProps(endDateResponse, ['clearable', 'onClear']),
  };
};
