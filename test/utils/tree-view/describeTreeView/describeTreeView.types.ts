import * as React from 'react';
import {
  MergePluginsProperty,
  TreeViewAnyPluginSignature,
  TreeViewPublicAPI,
} from '@mui/x-tree-view/internals/models';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';

export type DescribeTreeViewTestRunner<TPlugins extends TreeViewAnyPluginSignature[]> = (
  params: DescribeTreeViewTestRunnerParams<TPlugins>,
) => void;

export interface DescribeTreeViewRendererReturnValue<
  TPlugins extends TreeViewAnyPluginSignature[],
> {
  /**
   * Passes new props to the Tree View.
   * @param {Partial<TreeViewUsedParams<TPlugin>>} props A subset of the props accepted by the Tree View.
   */
  setProps: (props: Partial<MergePluginsProperty<TPlugins, 'params'>>) => void;
  /**
   * Passes new items to the Tree View.
   * @param {readyonly DescribeTreeViewItem[]} items The new items.
   */
  setItems: (items: readonly DescribeTreeViewItem[]) => void;
  /**
   * The ref object that allows Tree View manipulation.
   */
  apiRef: { current: TreeViewPublicAPI<TPlugins> };
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
   * Returns the item id of all the items currently rendered.
   * @returns {HTMLElement[]} List of the item id of all the items currently rendered.
   */
  getAllTreeItemIds: () => string[];
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
   * Returns the `checkbox` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLElement} `checkbox` slot of the item with the given id.
   */
  getItemCheckbox: (id: string) => HTMLElement;
  /**
   * Returns the input element inside the `checkbox` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLInputElement} input element inside the `checkbox` slot of the item with the given id.
   */
  getItemCheckboxInput: (id: string) => HTMLInputElement;
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
  /**
   * Returns the item id of all the items currently selected.
   * @returns {HTMLElement[]} List of the item id of all the items currently selected.
   */
  getSelectedTreeItems: () => string[];
}

export type DescribeTreeViewRenderer<TPlugins extends TreeViewAnyPluginSignature[]> = <
  R extends DescribeTreeViewItem,
>(
  params: {
    items: readonly R[];
    /**
     * If `true`, the Tree View will be wrapped with an error boundary.
     */
    withErrorBoundary?: boolean;
  } & Omit<MergePluginsProperty<TPlugins, 'params'>, 'slots' | 'slotProps'> & {
      slots?: MergePluginsProperty<TPlugins, 'slots'> & {
        item?: React.ElementType<TreeItemProps | TreeItem2Props>;
      };
      slotProps?: MergePluginsProperty<TPlugins, 'slotProps'> & {
        item?: Partial<TreeItemProps> | Partial<TreeItem2Props>;
      };
    },
) => DescribeTreeViewRendererReturnValue<TPlugins>;

type TreeViewComponent = 'RichTreeView' | 'RichTreeViewPro' | 'SimpleTreeView';
type TreeItemComponent = 'TreeItem' | 'TreeItem2';

interface DescribeTreeViewTestRunnerParams<TPlugins extends TreeViewAnyPluginSignature[]> {
  render: DescribeTreeViewRenderer<TPlugins>;
  setup: `${TreeViewComponent} + ${TreeItemComponent}`;
  treeViewComponent: TreeViewComponent;
  treeItemComponent: TreeItemComponent;
}

export interface DescribeTreeViewItem {
  id: string;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: readonly DescribeTreeViewItem[];
}
