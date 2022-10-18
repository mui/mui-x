import { FieldValueManager } from '@mui/x-date-pickers/internals-fields';
import { DateRange, DateRangeFieldSection } from '../../models/range';
import {
  DateTimeRangeValidationError,
  isSameDateTimeRangeError,
} from '../validation/useDateTimeRangeValidation';
import { rangeFieldValueManager } from './common';

export const dateTimeRangeFieldValueManager: FieldValueManager<
  DateRange<any>,
  any,
  DateRangeFieldSection,
  DateTimeRangeValidationError
> = {
  ...rangeFieldValueManager,
  isSameError: isSameDateTimeRangeError,
};
