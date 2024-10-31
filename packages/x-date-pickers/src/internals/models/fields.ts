import { SxProps } from '@mui/material/styles';
import { MakeRequired } from '@mui/x-internals/types';
import type {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlotProps,
  UseClearableFieldSlots,
} from '../../hooks/useClearableField';
import type { FieldSection, PickerOwnerState, PickerValidDate } from '../../models';
import type { UseFieldInternalProps } from '../hooks/useField';

interface BaseForwardedCommonSingleInputFieldProps extends ExportedUseClearableFieldProps {
  className: string | undefined;
  sx: SxProps<any> | undefined;
  label: React.ReactNode | undefined;
  name: string | undefined;
  id?: string;
  focused?: boolean;
  onKeyDown?: React.KeyboardEventHandler;
  onBlur?: React.FocusEventHandler;
  ref?: React.Ref<HTMLDivElement>;
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

interface BaseForwardedV6SingleInputFieldProps {
  inputRef?: React.Ref<HTMLInputElement>;
}

interface BaseForwardedV7SingleInputFieldProps {}

export type BaseForwardedSingleInputFieldProps<TEnableAccessibleFieldDOMStructure extends boolean> =
  BaseForwardedCommonSingleInputFieldProps &
    (TEnableAccessibleFieldDOMStructure extends false
      ? BaseForwardedV6SingleInputFieldProps
      : BaseForwardedV7SingleInputFieldProps);

/**
 * Props the single input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field,
 * not what users can pass using the `props.slotProps.field`.
 */
export type BaseSingleInputFieldProps<
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> = MakeRequired<
  Pick<
    UseFieldInternalProps<TValue, TDate, TSection, TEnableAccessibleFieldDOMStructure, TError>,
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
  BaseForwardedSingleInputFieldProps<TEnableAccessibleFieldDOMStructure>;
