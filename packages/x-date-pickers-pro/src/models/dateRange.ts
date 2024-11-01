import { MakeOptional } from '@mui/x-internals/types';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { RangeFieldSection, RangeFieldSeparatorProps } from './fields';
import { DateRangeValidationError } from './validation';
import { DateRange } from './range';
import type { ExportedValidateDateRangeProps } from '../validation/validateDateRange';

export interface UseDateRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          DateRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps<TDate> {}
