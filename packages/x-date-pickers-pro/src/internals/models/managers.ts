import { PickerRangeValue } from '@mui/x-date-pickers/internals';
import { PickerManager } from '@mui/x-date-pickers/models';
import {
  UseDateRangeManagerReturnValue,
  UseDateTimeRangeManagerReturnValue,
  UseTimeRangeManagerReturnValue,
} from '../../managers';

export type PickerAnyRangeManager = PickerManager<PickerRangeValue, any, any, any, any>;

export type PickerPossibleRangeManager =
  | UseDateRangeManagerReturnValue<true>
  | UseDateRangeManagerReturnValue<false>
  | UseTimeRangeManagerReturnValue<true>
  | UseTimeRangeManagerReturnValue<false>
  | UseDateTimeRangeManagerReturnValue<true>
  | UseDateTimeRangeManagerReturnValue<false>;
