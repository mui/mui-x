import type { TypographyProps } from '@mui/material/Typography';
import type { StackProps } from '@mui/material/Stack';
import type { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import {
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import {
  FieldType,
  MultiInputFieldRefs,
  RangeFieldSeparatorProps,
  RangePosition,
} from '../../../models';
import { PickerAnyRangeManager } from '../../models/managers';

export type MultiInputRangeFieldProps<TManager extends PickerAnyRangeManager> =
  MultiInputFieldRefs &
    RangeFieldSeparatorProps &
    Omit<
      PickerManagerFieldInternalProps<TManager>,
      'unstableFieldRef' | 'clearable' | 'onClear' | 'focused'
    > &
    Omit<StackProps, 'position' | keyof PickerManagerFieldInternalProps<TManager>> & {
      /**
       * If `true`, the field is focused during the first mount.
       * @default false
       */
      autoFocus?: boolean;
      className?: string;
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

export interface MultiInputRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a date.
   * It is rendered twice: once for the start date and once for the end date.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputRangeFieldSlotProps {
  root?: SlotComponentPropsFromProps<StackProps, {}, FieldOwnerState>;
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentPropsFromProps<TypographyProps, {}, FieldOwnerState>;
}

export interface MultiInputRangeFieldClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the separator element. */
  separator: string;
}

export interface CreateMultiInputRangeFieldParameters<TManager extends PickerAnyRangeManager> {
  name: string;
  getUtilityClass: (slot: string) => string;
  useManager: (
    params: RangeFieldSeparatorProps & {
      enableAccessibleFieldDOMStructure: PickerManagerEnableAccessibleFieldDOMStructure<TManager>;
    },
  ) => TManager;
}

export type CreateMultiInputRangeFieldReturnValue<TManager extends PickerAnyRangeManager> = ((
  props: MultiInputRangeFieldProps<TManager> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { fieldType?: FieldType };
