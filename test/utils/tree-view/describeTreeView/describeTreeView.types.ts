import { TreeViewAnyPluginSignature, TreeViewUsedParams } from '@mui/x-tree-view/internals/models';

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
   * Checks if an item is expanded.
   * Uses the `aria-expanded` attribute to check the expansion.
   * @param {string} id The id of the item to check.
   * @returns {boolean} `true` if the item is expanded, `false` otherwise.
   */
  isItemExpanded: (id: string) => boolean;
}

export type DescribeTreeViewRenderer<TPlugin extends TreeViewAnyPluginSignature> = <
  R extends DescribeTreeViewItem,
>(
  params: {
    items: readonly R[];
  } & TreeViewUsedParams<TPlugin>,
) => DescribeTreeViewRendererReturnValue<TPlugin>;

interface DescribeTreeViewTestRunnerParams<TPlugin extends TreeViewAnyPluginSignature> {
  render: DescribeTreeViewRenderer<TPlugin>;
  setup:
    | 'SimpleTreeView + TreeItem'
    | 'SimpleTreeView + TreeItem2'
    | 'RichTreeView + TreeItem'
    | 'RichTreeView + TreeItem2';
}

export interface DescribeTreeViewItem {
  id: string;
  label?: string;
  disabled?: boolean;
  children?: readonly DescribeTreeViewItem[];
}
