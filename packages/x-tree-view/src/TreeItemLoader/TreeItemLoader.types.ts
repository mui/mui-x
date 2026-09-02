import type * as React from 'react';
import type { TreeItemLoaderClasses } from './treeItemLoaderClasses';

export interface TreeItemLoaderOwnerState {
  /**
   * Index of the loading row inside its group.
   */
  index: number;
  /**
   * Number of loading rows rendered in the group.
   */
  itemsCount: number;
  /**
   * Depth of the loading rows.
   */
  itemDepth: number;
  /**
   * Whether each row renders a checkbox placeholder.
   */
  isCheckboxSelectionEnabled: boolean;
}

export interface TreeItemLoaderProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * The content of the loading row.
   * When not provided, the default skeleton placeholders are rendered.
   */
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TreeItemLoaderClasses>;
  /**
   * State of the loading row, forwarded by the `itemLoader` slot.
   * The component does not render it.
   */
  ownerState?: TreeItemLoaderOwnerState;
}
