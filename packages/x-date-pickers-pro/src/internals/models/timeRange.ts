import { MakeOptional } from '@mui/x-internals/types';
import { UseFieldInternalProps, AmPmProps } from '@mui/x-date-pickers/internals';
import {
  TimeRangeValidationError,
  RangeFieldSection,
  DateRange,
  RangeFieldSeparatorProps,
} from '../../models';
import type { ExportedValidateTimeRangeProps } from '../../validation/validateTimeRange';

export interface UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          TimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateTimeRangeProps,
    AmPmProps {}
