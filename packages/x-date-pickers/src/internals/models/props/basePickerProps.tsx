import * as React from 'react';
import { BaseToolbarProps } from './baseToolbarProps';

export interface BasePickerProps<TInputValue, TDateValue> {
  /**
   * className applied to the root component.
   */
  className?: string;
  /**
   * If `true` the popup or dialog will immediately close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  disableCloseOnSelect?: boolean;
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
   * @template TDateValue
   * @param {TDateValue} date The date that was just accepted.
   */
  onAccept?: (date: TDateValue) => void;
  /**
   * Callback fired when the value (the selected date) changes @DateIOType.
   * @template TDate
   * @param {DateRange<TDate>} date The new parsed date.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: TDateValue, keyboardInputValue?: string) => void;
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
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDateValue>>;
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
