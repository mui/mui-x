import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { MuiEvent } from '@mui/x-internals/types';
import { PickersSectionListProps } from '../../PickersSectionList';
import { PickerTextFieldOwnerState } from '../../models/fields';

export interface PickersInputPropsUsedByField extends Pick<
  PickersSectionListProps,
  'elements' | 'sectionListRef' | 'contentEditable' | 'tabIndex'
> {
  /**
   * Is `true` if the current values equals the empty value.
   * For a single item value, it means that `value === null`
   * For a range value, it means that `value === [null, null]`
   */
  areAllSectionsEmpty: boolean;

  onClick: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown: React.EventHandler<MuiEvent<React.KeyboardEvent<HTMLDivElement>>>;
  onInput: React.FormEventHandler<HTMLDivElement>;
  onPaste: React.ClipboardEventHandler<HTMLDivElement>;

  /**
   * End `InputAdornment` for this component.
   */
  endAdornment?: React.ReactNode;
  /**
   * Start `InputAdornment` for this component.
   */
  startAdornment?: React.ReactNode;

  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * The id of the `input` element.
   */
  id?: string;
  /**
   * If `true`, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  readOnly?: boolean;
  /**
   * Name attribute of the `input` element.
   */
  name?: string;

  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface PickersInputBaseSlots {
  root?: React.ElementType;
  input?: React.ElementType;
  htmlInput?: React.ElementType;
}

export interface PickersInputBaseRootSlotProps extends React.ComponentPropsWithRef<'div'> {
  /**
   * Variant-specific. Forwarded by `PickersFilledInput` / `PickersInput` to render an underline.
   */
  disableUnderline?: boolean;
  ownerState?: PickerTextFieldOwnerState;
}

export interface PickersInputBaseInputSlotProps extends React.ComponentPropsWithRef<'div'> {
  /**
   * Variant-specific. Forwarded by `PickersFilledInput` to hide the label.
   */
  hiddenLabel?: boolean;
  ownerState?: PickerTextFieldOwnerState;
}

export interface PickersInputBaseSlotProps {
  root?: PickersInputBaseRootSlotProps;
  input?: PickersInputBaseInputSlotProps;
  htmlInput?: React.ComponentPropsWithRef<'input'>;
}

export interface PickersInputBaseProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, keyof PickersInputPropsUsedByField>,
    PickersInputPropsUsedByField {
  ownerState?: PickerTextFieldOwnerState;
  className?: string;
  classes?: Record<string, string>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  margin?: 'dense' | 'none' | 'normal';
  renderSuffix?: (state: {
    disabled?: boolean;
    error?: boolean;
    filled?: boolean;
    focused?: boolean;
    margin?: 'dense' | 'none' | 'normal';
    required?: boolean;
    adornedStart?: boolean;
  }) => React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The components used for each slot inside.
   *
   * @default {}
   */
  slots?: PickersInputBaseSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersInputBaseSlotProps;
  'data-multi-input'?: string;
}
