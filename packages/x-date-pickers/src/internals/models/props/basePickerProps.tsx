import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { UsePickerBaseProps } from '../../hooks/usePicker';
import { PickerStateProps } from '../../hooks/usePickerState';
import { CalendarOrClockPickerView } from '../views';
import { PickersInputComponentLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export interface BasePickerProps<TValue, TDate> extends PickerStateProps<TValue> {
  /**
   * className applied to the root component.
   */
  className?: string;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
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
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, show the toolbar even in desktop mode.
   */
  showToolbar?: boolean;
  /**
   * Locale for components texts
   */
  localeText?: PickersInputComponentLocaleText<TDate>;
}

/**
 * Props common to all pickers.
 */
export interface BaseNextPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends UsePickerBaseProps<TValue, TView> {
  /**
   * Class name applied to the root element.
   */
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * If `true`, the toolbar will be visible.
   * @default `true` for mobile, `false` for desktop
   */
  showToolbar?: boolean;
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText?: PickersInputComponentLocaleText<TDate>;
}

/**
 * Props common to all non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseNextNonStaticPickerProps {
  /**
   * Format of the date when rendered in the input(s).
   */
  inputFormat?: string;
}

/**
 * Props common to all non-static pickers.
 * These props are handled by each component, not by the headless wrappers.
 */
export interface BaseNextNonStaticPickerExternalProps {
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
}
