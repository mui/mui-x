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
   * Name attribute used by the `input` element in the Field.
   * Ignored if the field has several inputs.
   */
  name?: string;
}
