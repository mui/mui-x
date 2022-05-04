import * as React from 'react';
import { BaseToolbarProps } from './baseToolbarProps';
import { PickerStateProps } from '../../hooks/usePickerState';

export interface BasePickerProps<TInputValue, TDate, TValue>
  extends PickerStateProps<TInputValue, TValue> {
  /**
   * className applied to the root component.
   */
  className?: string;
  /**
   * If `true`, the picker and text field are disabled.
   */
  disabled?: boolean;
  /**
   * Format string.
   */
  inputFormat?: string;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
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
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate, TValue>>;
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
}
