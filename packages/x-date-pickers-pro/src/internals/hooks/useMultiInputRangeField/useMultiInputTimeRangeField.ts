import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useTimeField as useTimeField,
  UseTimeFieldComponentProps,
  UseTimeFieldProps,
  UseTimeFieldDefaultizedProps,
} from '@mui/x-date-pickers/TimeField';
import {
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
  useControlledValueWithTimezone,
} from '@mui/x-date-pickers/internals';
import { TimeValidationError } from '@mui/x-date-pickers/models';
import { DateRange } from '../../models/range';
import {
  validateTimeRange,
  TimeRangeComponentValidationProps,
} from '../../utils/validation/validateTimeRange';
import { TimeRangeValidationError } from '../../../models';
import type { UseMultiInputTimeRangeFieldParams } from '../../../MultiInputTimeRangeField/MultiInputTimeRangeField.types';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { excludeProps } from './shared';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';
import { useDefaultizedTimeRangeFieldProps } from '../../../SingleInputTimeRangeField/useSingleInputTimeRangeField';

export const useMultiInputTimeRangeField = <
  TDate,
  TUseV6TextField extends boolean,
  TTextFieldSlotProps extends {},
>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputTimeRangeFieldParams<
  TDate,
  TUseV6TextField,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TUseV6TextField, TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedTimeRangeFieldProps<
    TDate,
    TUseV6TextField,
    UseTimeFieldProps<TDate, TUseV6TextField>
  >(inSharedProps);
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
    selectedSections,
    onSelectedSectionsChange,
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

  const startFieldProps: UseTimeFieldComponentProps<
    TDate,
    TUseV6TextField,
    UseTimeFieldDefaultizedProps<TTextFieldSlotProps, TUseV6TextField>
  > = {
    error: !!validationError[0],
    ...startTextFieldProps,
    ...selectedSectionsResponse.start,
    format,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
    autoFocus, // Do not add on end field.
  };

  const endFieldProps: UseTimeFieldComponentProps<
    TDate,
    TUseV6TextField,
    UseTimeFieldDefaultizedProps<TTextFieldSlotProps, TUseV6TextField>
  > = {
    error: !!validationError[1],
    ...endTextFieldProps,
    ...selectedSectionsResponse.end,
    format,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const startDateResponse = useTimeField(startFieldProps) as UseFieldResponse<
    TUseV6TextField,
    TTextFieldSlotProps
  >;

  const endDateResponse = useTimeField(endFieldProps) as UseFieldResponse<
    TUseV6TextField,
    TTextFieldSlotProps
  >;

  /* TODO: Undo this change when a clearable behavior for multiple input range fields is implemented */
  return {
    startDate: excludeProps(startDateResponse, ['clearable', 'onClear']),
    endDate: excludeProps(endDateResponse, ['clearable', 'onClear']),
  };
};
