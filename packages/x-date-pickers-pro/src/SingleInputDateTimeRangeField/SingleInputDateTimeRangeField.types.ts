import type {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import type { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import type { DateTimeRangeManagerFieldInternalProps } from '../managers/useDateTimeRangeManager';

export interface UseSingleInputDateTimeRangeFieldProps
  extends DateTimeRangeManagerFieldInternalProps, ExportedPickerFieldUIProps {}

export type SingleInputDateTimeRangeFieldProps = Omit<
  BuiltInFieldTextFieldProps,
  keyof UseSingleInputDateTimeRangeFieldProps
> &
  UseSingleInputDateTimeRangeFieldProps & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateTimeRangeFieldSlotProps;
  };

export interface SingleInputDateTimeRangeFieldSlots extends PickerFieldUISlots {}

export interface SingleInputDateTimeRangeFieldSlotProps extends PickerFieldUISlotProps {}
