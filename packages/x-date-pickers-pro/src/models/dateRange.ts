import { MakeOptional } from '@mui/x-internals/types';
import { PickerRangeValue, UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { RangeFieldSeparatorProps } from './fields';
import { DateRangeValidationError } from './validation';
import type { ExportedValidateDateRangeProps } from '../validation/validateDateRange';

export interface UseDateRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          PickerRangeValue,
          TEnableAccessibleFieldDOMStructure,
          DateRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps {}
