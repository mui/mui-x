import * as React from 'react';
import { GridTreeNode } from '../gridRows';

/**
 * Get the ARIA attributes for a row
 * @param {GridTreeNode} rowNode The row node
 * @param {number} index The position index of the row
 * @returns {React.HTMLAttributes<HTMLElement>} The ARIA attributes
 */
export type GetRowAriaAttributesFn = (
  rowNode: GridTreeNode,
  index: number,
) => React.HTMLAttributes<HTMLElement>;

export interface GridRowAriaAttributesInternalHook {
  useGridRowAriaAttributes: () => GetRowAriaAttributesFn;
}
