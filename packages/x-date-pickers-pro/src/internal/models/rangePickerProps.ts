import * as React from 'react';

/**
 * Props common to all range non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseRangeNonStaticPickerProps {
  /**
   * The label content.
   * Will be ignored on multi input pickers.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   * Will be ignored on multi input pickers.
   */
  inputRef?: React.Ref<HTMLInputElement>;
}
