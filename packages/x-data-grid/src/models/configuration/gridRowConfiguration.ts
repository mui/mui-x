import { GridTreeNode } from '../gridRows';

/**
 * Get the ARIA attributes for a row
 * @param {GridTreeNode} rowNode The row node
 * @param {number} index The position index of the row
 * @returns {Record<string, string | number | boolean>} The ARIA attributes
 */
type GetAriaAttributesFn = (
  rowNode: GridTreeNode,
  index: number,
) => Record<string, string | number | boolean>;

export type GridRowInternalHook = () => GetAriaAttributesFn;
