import {
  BaseDateValidationProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { RangeFieldSection, RangeFieldSeparatorProps } from './fields';
import { DateRangeValidationError } from './validation';
import { DateRange } from './range';
import { DayRangeValidationProps } from '../internals/models/dateRange';

export interface UseDateRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          DateRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    DayRangeValidationProps,
    BaseDateValidationProps {}
