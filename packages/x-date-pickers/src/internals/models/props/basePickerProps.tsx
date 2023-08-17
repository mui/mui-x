import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { UsePickerBaseProps } from '../../hooks/usePicker';
import { PickersInputComponentLocaleText } from '../../../locales/utils/pickersLocaleTextApi';
import type { UsePickerViewsProps } from '../../hooks/usePicker/usePickerViews';
import { MakeOptional } from '../helpers';
import { DateOrTimeViewWithMeridiem } from '../common';

/**
 * Props common to all pickers after applying the default props on each picker.
 */
export interface BasePickerProps<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerBaseProps<TValue, TView, TError, TExternalProps, TAdditionalProps> {
  /**
   * Class name applied to the root element.
   */
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText?: PickersInputComponentLocaleText<TDate>;
}

/**
 * Props common to all pickers before applying the default props on each picker.
 */
export interface BasePickerInputProps<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends Omit<
    MakeOptional<BasePickerProps<TValue, TDate, TView, TError, any, any>, 'openTo' | 'views'>,
    'viewRenderers'
  > {}

/**
 * Props common to all non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseNonStaticPickerProps {
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format?: string;
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity?: 'dense' | 'spacious';
}

/**
 * Props common to all non-range non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseNonRangeNonStaticPickerProps {
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * Props common to all root level responsive pickers (i.e. `DatePicker`).
 */
export interface BaseResponsivePickerProps {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (hover: hover) and (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
}
