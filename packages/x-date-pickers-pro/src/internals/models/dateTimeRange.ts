import { MakeOptional } from '@mui/x-internals/types';
import {
  UseFieldInternalProps,
  DateOrTimeViewWithMeridiem,
  AmPmProps,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { DateTimeRangeValidationError, RangeFieldSeparatorProps } from '../../models';
import { ExportedValidateDateTimeRangeProps } from '../../validation/validateDateTimeRange';

export interface UseDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          PickerRangeValue,
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
