import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { TimeRangeManagerFieldInternalProps } from '../managers/useTimeRangeManager';

export interface UseSingleInputTimeRangeFieldProps
  extends TimeRangeManagerFieldInternalProps, ExportedPickerFieldUIProps {}

export type SingleInputTimeRangeFieldProps = Omit<
  BuiltInFieldTextFieldProps,
  keyof UseSingleInputTimeRangeFieldProps
> &
  UseSingleInputTimeRangeFieldProps & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputTimeRangeFieldSlotProps;
  };

export interface SingleInputTimeRangeFieldSlots extends PickerFieldUISlots {}

export interface SingleInputTimeRangeFieldSlotProps extends PickerFieldUISlotProps {}
