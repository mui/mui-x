import * as React from 'react';
import { BaseToolbarProps } from './baseToolbarProps';

export interface BasePickerProps<TInputValue, TDate, TValue> {
  /**
   * className applied to the root component.
   */
  className?: string;
  /**
   * If `true` the popup or dialog will immediately close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: boolean;
  /**
   * If `true`, the picker and text field are disabled.
   */
  disabled?: boolean;
  /**
   * Format string.
   */
  inputFormat?: string;
  /**
   * Callback fired when date is accepted @DateIOType.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept?: (value: TValue) => void;
  /**
   * Callback fired when the value (the selected date) changes @DateIOType.
   * @template TValue
   * @param {TValue} value The new parsed value.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (value: TValue, keyboardInputValue?: string) => void;
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see open).
   */
  onClose?: () => void;
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see open).
   */
  onOpen?: () => void;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * Control the popup or dialog open state.
   */
  open?: boolean;
  /**
   * Make picker read only.
   */
  readOnly?: boolean;
  /**
   * If `true`, show the toolbar even in desktop mode.
   */
  showToolbar?: boolean;
  /**
   * Component that will replace default toolbar renderer.
   */
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate>>;
  /**
   * Date format, that is displaying in toolbar.
   */
  toolbarFormat?: string;
  /**
   * Mobile picker date value placeholder, displaying if `value` === `null`.
   * @default '–'
   */
  toolbarPlaceholder?: React.ReactNode;
  /**
   * Prop forwarded to the ToolbarComponent.
   */
  toolbarTitle?: React.ReactNode;
  /**
   * The value of the picker.
   */
  value: TInputValue;
}
