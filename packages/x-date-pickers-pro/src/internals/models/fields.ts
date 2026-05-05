import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickerRangeValue, UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import type {
  MultiInputFieldRefs,
  MultiInputFieldSlotRootProps,
  RangePosition,
} from '../../models';

/**
 * Props the multi input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export interface BaseMultiInputFieldProps
  extends
    Pick<UseFieldInternalProps<PickerRangeValue, unknown>, 'readOnly' | 'autoFocus'>,
    MultiInputFieldRefs {
  slots?: {
    root?: React.ElementType;
    separator?: React.ElementType;
    textField?: React.ElementType;
  };
  slotProps?: {
    root?: SlotComponentPropsFromProps<
      React.ElementType<MultiInputFieldSlotRootProps>,
      {},
      FieldOwnerState
    >;
    textField?: SlotComponentPropsFromProps<
      typeof PickersTextField,
      {},
      FieldOwnerState & { position?: RangePosition }
    >;
  };
}
