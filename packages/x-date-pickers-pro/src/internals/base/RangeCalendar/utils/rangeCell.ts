import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
import { useRangeCell } from './useRangeCell';

export const rangeCellStyleHookMapping: CustomStyleHookMapping<RangeCellState> = {
  selected(value) {
    return value ? { 'data-selected': '' } : null;
  },
  selectionStart(value) {
    return value ? { 'data-selection-start': '' } : null;
  },
  selectionEnd(value) {
    return value ? { 'data-selection-end': '' } : null;
  },
  insideSelection(value) {
    return value ? { 'data-inside-selection': '' } : null;
  },
  previewed(value) {
    return value ? { 'data-previewed': '' } : null;
  },
  previewStart(value) {
    return value ? { 'data-preview-start': '' } : null;
  },
  previewEnd(value) {
    return value ? { 'data-preview-end': '' } : null;
  },
  insidePreview(value) {
    return value ? { 'data-inside-preview': '' } : null;
  },
  disabled(value) {
    return value ? { 'data-disabled': '' } : null;
  },
  invalid(value) {
    return value ? { 'data-invalid': '' } : null;
  },
  current(value) {
    return value ? { 'data-current': '' } : null;
  },
};

export function useRangeCellState(
  ctx: useRangeCell.Context & { isDisabled: boolean; isInvalid: boolean; isCurrent: boolean },
): RangeCellState {
  return React.useMemo(
    () => ({
      selected: ctx.isSelected,
      selectionStart: ctx.isSelectionStart,
      selectionEnd: ctx.isSelectionEnd,
      insideSelection: ctx.isSelected && !ctx.isSelectionStart && !ctx.isSelectionEnd,
      previewed: ctx.isPreviewed,
      previewStart: ctx.isPreviewStart,
      previewEnd: ctx.isPreviewEnd,
      insidePreview: ctx.isPreviewed && !ctx.isPreviewStart && !ctx.isPreviewEnd,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: ctx.isCurrent,
    }),
    [
      ctx.isSelected,
      ctx.isSelectionStart,
      ctx.isSelectionEnd,
      ctx.isPreviewed,
      ctx.isPreviewStart,
      ctx.isPreviewEnd,
      ctx.isDisabled,
      ctx.isInvalid,
      ctx.isCurrent,
    ],
  );
}

export interface RangeCellState {
  /**
   * Whether the cell is within the selected range.
   */
  selected: boolean;
  /**
   * Whether the cell is the first cell of the selected range.
   */
  selectionStart: boolean;
  /**
   * Whether the cell is the last cell of the selected range.
   */
  selectionEnd: boolean;
  /**
   * Whether the cell is within the selected range and is not its first or last cell.
   */
  insideSelection: boolean;
  /**
   * Whether the cell is within the preview range and is not its first or last cell.
   */
  previewed: boolean;
  /**
   * Whether the cell is the first cell of the preview range.
   */
  previewStart: boolean;
  /**
   * Whether the cell is the last cell of the preview range.
   */
  previewEnd: boolean;
  /**
   * Whether the cell is within the preview range and is not its first or last cell.
   */
  insidePreview: boolean;
  /**
   * Whether the cell is disabled.
   */
  disabled: boolean;
  /**
   * Whether the cell is invalid.
   */
  invalid: boolean;
  /**
   * Whether the cell contains the current date.
   */
  current: boolean;
}
