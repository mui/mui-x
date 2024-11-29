import {
  ExportedPickerFieldUISlots,
  PickerFieldUISlotProps,
  PickerRangeValue,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { ExportedUseClearableFieldProps } from '@mui/x-date-pickers/hooks';
import { UseTimeRangeFieldProps } from '../internals/models';
import { TimeRangeValidationError } from '../models';

export interface UseSingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        TimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

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

export interface SingleInputTimeRangeFieldSlots extends ExportedPickerFieldUISlots {}

export interface SingleInputTimeRangeFieldSlotProps extends PickerFieldUISlotProps {}
