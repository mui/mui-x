import {
  MakeOptional,
  UseFieldInternalProps,
  DateOrTimeViewWithMeridiem,
  AmPmProps,
} from '@mui/x-date-pickers/internals';
import {
  DateTimeRangeValidationError,
  RangeFieldSection,
  DateRange,
  RangeFieldSeparatorProps,
} from '../../models';
import { ExportedValidateDateTimeRangeProps } from '../../validation/validateDateTimeRange';

export interface UseDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          DateTimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateTimeRangeProps,
    AmPmProps {}

export type DateTimeRangePickerView = Exclude<DateOrTimeViewWithMeridiem, 'month' | 'year'>;

export type DateTimeRangePickerViewExternal = Exclude<DateTimeRangePickerView, 'meridiem'>;
