import {
  MakeOptional,
  UseFieldInternalProps,
  DateOrTimeViewWithMeridiem,
  AmPmProps,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DateTimeRangeValidationError,
  RangeFieldSection,
  DateRange,
  RangeFieldSeparatorProps,
} from '../../models';
import { ExportedValidateDateTimeRangeProps } from '../../validation/validateDateTimeRange';

export interface UseDateTimeRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          DateTimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateTimeRangeProps<TDate>,
    AmPmProps {}

export type DateTimeRangePickerView = Exclude<DateOrTimeViewWithMeridiem, 'month' | 'year'>;

export type DateTimeRangePickerViewExternal = Exclude<DateTimeRangePickerView, 'meridiem'>;
