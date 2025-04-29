import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { DateRangeManagerFieldInternalProps } from '../managers/useDateRangeManager';

export interface UseSingleInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    // TODO v8: Remove once the range fields open with a button.
    Omit<ExportedPickerFieldUIProps, 'openPickerButtonPosition'> {}

export type SingleInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure> & {
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
