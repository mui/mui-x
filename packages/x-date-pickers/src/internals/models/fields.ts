import { SxProps } from '@mui/material/styles';
import { MakeRequired } from '@mui/x-internals/types';
import type {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlotProps,
  UseClearableFieldSlots,
} from '../../hooks/useClearableField';
import type { FieldSection, PickerOwnerState } from '../../models';
import type { UseFieldInternalProps } from '../hooks/useField';

export interface BaseForwardedSingleInputFieldProps extends ExportedUseClearableFieldProps {
  className: string | undefined;
  sx: SxProps<any> | undefined;
  label: React.ReactNode | undefined;
  name: string | undefined;
  id?: string;
  focused?: boolean;
  onKeyDown?: React.KeyboardEventHandler;
  onBlur?: React.FocusEventHandler;
  ref?: React.Ref<HTMLDivElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  inputProps?: {
    'aria-label'?: string;
  };
  slots?: UseClearableFieldSlots;
  slotProps?: UseClearableFieldSlotProps & {
    textField?: {};
  };
  ownerState: PickerOwnerState;
}

/**
 * Props the single input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export type BaseSingleInputFieldProps<
  TValue,
  TSection extends FieldSection,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> = MakeRequired<
  Pick<
    UseFieldInternalProps<TValue, TSection, TEnableAccessibleFieldDOMStructure, TError>,
    | 'readOnly'
    | 'disabled'
    | 'format'
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
    | 'timezone'
    | 'value'
    | 'onChange'
    | 'unstableFieldRef'
    | 'autoFocus'
  >,
  'format' | 'value' | 'onChange' | 'timezone'
> &
  BaseForwardedSingleInputFieldProps;
