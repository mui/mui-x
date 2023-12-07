import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateTimeField as useDateTimeField,
  UseDateTimeFieldComponentProps,
  UseDateTimeFieldProps,
  UseDateTimeFieldDefaultizedProps,
} from '@mui/x-date-pickers/DateTimeField';
import {
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
  useControlledValueWithTimezone,
} from '@mui/x-date-pickers/internals';
import { DateTimeValidationError } from '@mui/x-date-pickers/models';
import { DateRange } from '../../models/range';
import type { UseMultiInputDateTimeRangeFieldParams } from '../../../MultiInputDateTimeRangeField/MultiInputDateTimeRangeField.types';
import { DateTimeRangeValidationError } from '../../../models';
import {
  DateTimeRangeComponentValidationProps,
  validateDateTimeRange,
} from '../../utils/validation/validateDateTimeRange';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { excludeProps } from './shared';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';
import { useDefaultizedDateTimeRangeFieldProps } from '../../../SingleInputDateTimeRangeField/useSingleInputDateTimeRangeField';

export const useMultiInputDateTimeRangeField = <
  TDate,
  TUseV6TextField extends boolean,
  TTextFieldSlotProps extends {},
>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputDateTimeRangeFieldParams<
  TDate,
  TUseV6TextField,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TUseV6TextField, TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedDateTimeRangeFieldProps<
    TDate,
    TUseV6TextField,
    UseDateTimeFieldProps<TDate, TUseV6TextField>
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
  ): FieldChangeHandler<TDate | null, DateTimeValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<DateTimeRangeValidationError> = {
        ...rawContext,
        validationError: validateDateTimeRange({
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
    DateTimeRangeValidationError,
    DateTimeRangeComponentValidationProps<TDate>
  >(
    { ...sharedProps, value, timezone },
    validateDateTimeRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const selectedSectionsResponse = useMultiInputFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startFieldProps: UseDateTimeFieldComponentProps<
    TDate,
    TUseV6TextField,
    UseDateTimeFieldDefaultizedProps<TTextFieldSlotProps, TUseV6TextField>
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

  const endFieldProps: UseDateTimeFieldComponentProps<
    TDate,
    TUseV6TextField,
    UseDateTimeFieldDefaultizedProps<TTextFieldSlotProps, TUseV6TextField>
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

  const startDateResponse = useDateTimeField(startFieldProps) as UseFieldResponse<
    TUseV6TextField,
    TTextFieldSlotProps
  >;

  const endDateResponse = useDateTimeField(endFieldProps) as UseFieldResponse<
    TUseV6TextField,
    TTextFieldSlotProps
  >;

  /* TODO: Undo this change when a clearable behavior for multiple input range fields is implemented */
  return {
    startDate: excludeProps(startDateResponse, ['clearable', 'onClear']),
    endDate: excludeProps(endDateResponse, ['clearable', 'onClear']),
  };
};
