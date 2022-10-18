import { FieldValueManager } from '@mui/x-date-pickers/internals-fields';
import { DateRange, DateRangeFieldSection } from '../../models/range';
import {
  TimeRangeValidationError,
  isSameTimeRangeError,
} from '../validation/useTimeRangeValidation';
import { rangeFieldValueManager } from './common';

export const timeRangeFieldValueManager: FieldValueManager<
  DateRange<any>,
  any,
  DateRangeFieldSection,
  TimeRangeValidationError
> = {
  ...rangeFieldValueManager,
  isSameError: isSameTimeRangeError,
};
