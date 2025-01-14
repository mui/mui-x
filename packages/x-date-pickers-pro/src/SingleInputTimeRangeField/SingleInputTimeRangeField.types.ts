import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlots,
  PickerFieldUISlotProps,
  PickerRangeValue,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import { UseTimeRangeFieldProps } from '../internals/models';
import { TimeRangeValidationError } from '../models';

export interface UseSingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    Pick<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        TimeRangeValidationError
      >,
      'unstableFieldRef'
    >,
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
