import {
  type ExportedPickerFieldUIProps,
  type PickerFieldUISlots,
  type PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { type BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { type DateRangeManagerFieldInternalProps } from '../managers/useDateRangeManager';

export interface UseSingleInputDateRangeFieldProps
  extends DateRangeManagerFieldInternalProps, ExportedPickerFieldUIProps {}

export type SingleInputDateRangeFieldProps = Omit<
  BuiltInFieldTextFieldProps,
  keyof UseSingleInputDateRangeFieldProps
> &
  UseSingleInputDateRangeFieldProps & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateRangeFieldSlotProps;
  };

export interface SingleInputDateRangeFieldSlots extends PickerFieldUISlots {}

export interface SingleInputDateRangeFieldSlotProps extends PickerFieldUISlotProps {}
