import * as React from 'react';

/**
 * Props common to all range non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseRangeNonStaticPickerProps {
  /**
   * The label content.
   * Ignored if the field has several inputs.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   * Ignored if the field has several inputs.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * The `name` attribute used on the `field` component.
   * It serves as a `shortcut` for applying the `name` attribute on the `input` HTML element.
   * Ignored if the field has several inputs.
   */
  name?: string;
}
