import { MakeOptional } from '@mui/x-internals/types';
import { UseFieldInternalProps, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { RangeFieldSection, RangeFieldSeparatorProps } from './fields';
import { DateRangeValidationError } from './validation';
import type { ExportedValidateDateRangeProps } from '../validation/validateDateRange';

export interface UseDateRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          PickerRangeValue,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          DateRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateRangeProps {}
