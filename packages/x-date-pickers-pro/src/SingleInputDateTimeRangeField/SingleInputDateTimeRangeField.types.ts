import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { DateTimeRangeManagerFieldInternalProps } from '../managers/useDateTimeRangeManager';

export interface UseSingleInputDateTimeRangeFieldProps
  extends
    DateTimeRangeManagerFieldInternalProps,
    // TODO v8: Remove once the range fields open with a button.
    Omit<ExportedPickerFieldUIProps, 'openPickerButtonPosition'> {}

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
