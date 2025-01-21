import type { FieldSection, PickerOwnerState } from '../../models';
import type { UseFieldInternalProps } from '../hooks/useField';
import { RangePosition } from './pickers';
import { PickerValidValue } from './value';

export interface FieldRangeSection extends FieldSection {
  dateName: RangePosition;
}

export interface BaseForwardedSingleInputFieldProps {
  id?: string;
  focused?: boolean;
  onKeyDown?: React.KeyboardEventHandler;
  onBlur?: React.FocusEventHandler;
  ref?: React.Ref<HTMLDivElement>;
  ownerState: PickerOwnerState;
}

/**
 * Props the single input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export type BaseSingleInputFieldProps<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> = Pick<
  UseFieldInternalProps<TValue, TEnableAccessibleFieldDOMStructure, TError>,
  'readOnly' | 'unstableFieldRef' | 'autoFocus'
> &
  BaseForwardedSingleInputFieldProps;
