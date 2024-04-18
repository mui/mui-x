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
   * The ref object that allows Tree View manipulation.
   */
  apiRef: { current: TreeViewPublicAPI<TPlugins> };
  /**
   * Returns the `root` slot of the Tree View.
   * @returns {HTMLElement} `root` slot of the Tree View.
   */
  getRoot: () => HTMLElement;
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
  label?: string;
  disabled?: boolean;
  children?: readonly DescribeTreeViewItem[];
}
