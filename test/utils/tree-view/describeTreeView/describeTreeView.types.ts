import * as React from 'react';
import {
  TreeViewAnyPluginSignature,
  TreeViewPublicAPI,
  TreeViewUsedParams,
} from '@mui/x-tree-view/internals/models';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';

export type DescribeTreeViewTestRunner<TPlugin extends TreeViewAnyPluginSignature> = (
  params: DescribeTreeViewTestRunnerParams<TPlugin>,
) => void;

export interface DescribeTreeViewRendererReturnValue<TPlugin extends TreeViewAnyPluginSignature> {
  /**
   * Passes new props to the Tree View.
   * @param {Partial<TreeViewUsedParams<TPlugin>>} props A subset of the props accepted by the Tree View.
   */
  setProps: (props: Partial<TreeViewUsedParams<TPlugin>>) => void;
  /**
   * Passes new items to the Tree View.
   * @param {readyonly DescribeTreeViewItem[]} items The new items.
   */
  setItems: (items: readonly DescribeTreeViewItem[]) => void;
  /**
   * The ref object that allows Tree View manipulation.
   */
  apiRef: { current: TreeViewPublicAPI<[TPlugin]> };
  /**
   * Returns the `root` slot of the Tree View.
   * @returns {HTMLElement} `root` slot of the Tree View.
   */
  getRoot: () => HTMLElement;
  /**
   * Returns the itemId of the focused item.
   * If the focused element is not an item, returns `null`.
   * @returns {string | null} The itemId of the focused item.
   */
  getFocusedItemId: () => string | null;
  /**
   * Returns the `root` slot of all the items.
   * @returns {HTMLElement[]} List of the `root` slot of all the items.
   */
  getAllItemRoots: () => HTMLElement[];
  /**
   * Returns the `root` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLElement} `root` slot of the item with the given id.
   */
  getItemRoot: (id: string) => HTMLElement;
  /**
   * Returns the `content` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLElement} `content` slot of the item with the given id.
   */
  getItemContent: (id: string) => HTMLElement;
  /**
   * Returns the `label` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLElement} `label` slot of the item with the given id.
   */
  getItemLabel: (id: string) => HTMLElement;
  /**
   * Returns the `iconContainer` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLElement} `iconContainer` slot of the item with the given id.
   */
  getItemIconContainer: (id: string) => HTMLElement;
  /**
   * Checks if an item is expanded.
   * Uses the `aria-expanded` attribute to check the expansion.
   * @param {string} id The id of the item to check.
   * @returns {boolean} `true` if the item is expanded, `false` otherwise.
   */
  isItemExpanded: (id: string) => boolean;
  /**
   * Checks if an item is selected.
   * Uses the `aria-selected` attribute to check the selected.
   * @param {string} id The id of the item to check.
   * @returns {boolean} `true` if the item is selected, `false` otherwise.
   */
  isItemSelected: (id: string) => boolean;
}

export type DescribeTreeViewRenderer<TPlugin extends TreeViewAnyPluginSignature> = <
  R extends DescribeTreeViewItem,
>(
  params: {
    items: readonly R[];
  } & Omit<TreeViewUsedParams<TPlugin>, 'slots' | 'slotProps'> & {
      slots?: TreeViewUsedParams<TPlugin>['slots'] & { item?: React.ElementType };
      slotProps?: TreeViewUsedParams<TPlugin>['slots'] & { item?: TreeItemProps | TreeItem2Props };
    },
) => DescribeTreeViewRendererReturnValue<TPlugin>;

interface DescribeTreeViewTestRunnerParams<TPlugin extends TreeViewAnyPluginSignature> {
  render: DescribeTreeViewRenderer<TPlugin>;
  setup:
    | 'SimpleTreeView + TreeItem'
    | 'SimpleTreeView + TreeItem2'
    | 'RichTreeView + TreeItem'
    | 'RichTreeView + TreeItem2'
    | 'RichTreeViewPro + TreeItem'
    | 'RichTreeViewPro + TreeItem2';
}

export interface DescribeTreeViewItem {
  id: string;
  label?: string;
  disabled?: boolean;
  children?: readonly DescribeTreeViewItem[];
}
