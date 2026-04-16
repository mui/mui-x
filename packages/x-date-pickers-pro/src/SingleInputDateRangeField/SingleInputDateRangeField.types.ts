import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { DateRangeManagerFieldInternalProps } from '../managers/useDateRangeManager';

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
