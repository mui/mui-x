import {
  PickerRangeValue,
  UseFieldInternalProps,
  ExportedPickerFieldUIProps,
  ExportedPickerFieldUISlots,
  PickerFieldUISlotProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import type { DateRangeValidationError, UseDateRangeFieldProps } from '../models';

export interface UseSingleInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    Pick<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        DateRangeValidationError
      >,
      'unstableFieldRef'
    >,
    ExportedPickerFieldUIProps {}

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

export interface SingleInputDateRangeFieldSlots extends ExportedPickerFieldUISlots {}

export interface SingleInputDateRangeFieldSlotProps extends PickerFieldUISlotProps {}
