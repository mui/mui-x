import { SlotComponentProps } from '@mui/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { PickerOwnerState } from '@mui/x-date-pickers/models';
import {
  PickerAnyRangeManager,
  PickerManagerFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { MultiInputFieldRefs, RangeFieldSeparatorProps, RangePosition } from '../../../models';
import { MultiInputRangeFieldClasses } from './multiInputRangeFieldClasses';

export type ExportedMultiInputRangeFieldProps<TManager extends PickerAnyRangeManager> =
  MultiInputFieldRefs &
    RangeFieldSeparatorProps &
    Omit<PickerManagerFieldInternalProps<TManager>, 'unstableFieldRef' | 'clearable' | 'onClear'> &
    Omit<StackProps, 'position' | keyof PickerManagerFieldInternalProps<TManager>> & {
      autoFocus?: boolean;
      /**
       * Override or extend the styles applied to the component.
       */
      classes?: Partial<MultiInputRangeFieldClasses>;
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: MultiInputRangeFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: MultiInputRangeFieldSlotProps;
    };

export type MultiInputRangeFieldProps<TManager extends PickerAnyRangeManager> =
  ExportedMultiInputRangeFieldProps<TManager> & {
    /**
     * The manager for the used value type.
     */
    manager: TManager;
  };

export interface MultiInputRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a date.
   * It is rendered twice: once for the start date and once for the end date.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputRangeFieldSlotProps {
  root?: SlotComponentProps<typeof Stack, {}, PickerOwnerState>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    PickerOwnerState & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, PickerOwnerState>;
}
