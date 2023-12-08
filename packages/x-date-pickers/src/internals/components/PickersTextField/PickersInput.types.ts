import * as React from 'react';
import { BoxProps } from '@mui/material/Box';
import { PickersSectionElement } from '../../../PickersSectionsList';

export interface PickersInputPropsUsedByField {
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PickersSectionElement[];
  /**
   * Is `true` if the current values equals the empty value.
   * For a single item value, it means that `value === null`
   * For a range value, it means that `value === [null, null]`
   */
  areAllSectionsEmpty: boolean;

  onClick: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  onInput: React.FormEventHandler<HTMLDivElement>;
  onPaste: React.ClipboardEventHandler<HTMLDivElement>;

  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;

  tabIndex: number | undefined;
  contentEditable: boolean;

  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  label?: React.ReactNode;
  id?: string;
  fullWidth?: boolean;
  readOnly?: boolean;

  inputProps?: React.HTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
  inputRef?: React.Ref<HTMLInputElement>;

  sectionsContainerRef?: React.Ref<HTMLDivElement>;
}

export interface PickersInputOtherProps extends Omit<BoxProps, keyof PickersInputPropsUsedByField> {
  ref?: React.Ref<HTMLDivElement>;
}

export interface PickersInputProps extends PickersInputPropsUsedByField, PickersInputOtherProps {}
