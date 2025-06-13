import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { TimeRangeManagerFieldInternalProps } from '../managers/useTimeRangeManager';

export interface UseSingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    // TODO v8: Remove once the range fields open with a button.
    Omit<ExportedPickerFieldUIProps, 'openPickerButtonPosition'> {}

export type SingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure> & {
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
