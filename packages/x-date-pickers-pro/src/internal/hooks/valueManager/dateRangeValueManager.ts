import { FieldValueManager } from '@mui/x-date-pickers/internals-fields';
import { DateRange, DateRangeFieldSection } from '../../models/range';
import {
  DateRangeValidationError,
  isSameDateRangeError,
} from '../validation/useDateRangeValidation';
import { rangeFieldValueManager } from './common';

export const dateRangeFieldValueManager: FieldValueManager<
  DateRange<any>,
  any,
  DateRangeFieldSection,
  DateRangeValidationError
> = {
  ...rangeFieldValueManager,
  isSameError: isSameDateRangeError,
};
