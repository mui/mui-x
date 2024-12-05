import { MakeOptional } from '@mui/x-internals/types';
import { PickerRangeValue, UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { PickerManager } from '@mui/x-date-pickers/models';
import type { RangeFieldSeparatorProps } from '../../models';

export type PickerAnyRangeManager = PickerManager<
  PickerRangeValue,
  any,
  any,
  MakeOptional<UseFieldInternalProps<PickerRangeValue, true, string>, 'format'> &
    RangeFieldSeparatorProps & { [key: string]: any },
  UseFieldInternalProps<PickerRangeValue, true, string> &
    RangeFieldSeparatorProps & { [key: string]: any }
>;
