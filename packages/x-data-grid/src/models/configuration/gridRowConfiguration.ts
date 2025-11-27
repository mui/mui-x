import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridTreeNode } from '../gridRows';
import { GridRowProApi } from '../api';

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

/**
 * Overridable row methods interface, these methods could be overriden in a higher plan package.
 */
export interface GridRowsOverridableMethodsInternalHook<Api, Props> {
  useGridRowsOverridableMethods: (
    apiRef: RefObject<Api>,
    props: Props,
  ) => {
    setRowIndex: GridRowProApi['setRowIndex'];
    setRowPosition: GridRowProApi['setRowPosition'];
  };
}
