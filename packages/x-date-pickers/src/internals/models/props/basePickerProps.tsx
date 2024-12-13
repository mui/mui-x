import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { MakeOptional } from '@mui/x-internals/types';
import { UsePickerBaseProps } from '../../hooks/usePicker';
import { PickersInputComponentLocaleText } from '../../../locales/utils/pickersLocaleTextApi';
import type { UsePickerViewsProps } from '../../hooks/usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem } from '../common';
import { UseFieldInternalProps } from '../../hooks/useField';
import { PickerValidValue } from '../value';

/**
 * Props common to all pickers after applying the default props on each picker.
 */
export interface BasePickerProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerBaseProps<TValue, TView, TError, TExternalProps, TAdditionalProps> {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText?: PickersInputComponentLocaleText;
}

/**
 * Props common to all pickers before applying the default props on each picker.
 */
export interface BasePickerInputProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends Omit<
    MakeOptional<BasePickerProps<TValue, TView, TError, any, any>, 'openTo' | 'views'>,
    'viewRenderers'
  > {}

// We don't take the `format` prop from `UseFieldInternalProps` to have a custom JSDoc description.
/**
 * Props common to all non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseNonStaticPickerProps
  extends Pick<
    UseFieldInternalProps<any, any, any>,
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
  > {
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format?: string;
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
  /**
   * Name attribute used by the `input` element in the Field.
   */
  name?: string;
}
