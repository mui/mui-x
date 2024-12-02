import { MakeOptional } from '@mui/x-internals/types';
import { UseFieldInternalProps, AmPmProps, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { TimeRangeValidationError, RangeFieldSeparatorProps } from '../../models';
import type { ExportedValidateTimeRangeProps } from '../../validation/validateTimeRange';

export interface UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          PickerRangeValue,
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
