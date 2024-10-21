import * as React from 'react';
import {
  MergeSignaturesProperty,
  TreeViewAnyPluginSignature,
  TreeViewExperimentalFeatures,
  TreeViewPublicAPI,
} from '@mui/x-tree-view/internals/models';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';

export type DescribeTreeViewTestRunner<TSignatures extends TreeViewAnyPluginSignature[]> = (
  params: DescribeTreeViewTestRunnerParams<TSignatures>,
) => void;

export interface TreeViewItemIdTreeElement {
  id: TreeViewItemId;
  children?: TreeViewItemIdTreeElement[];
}

export interface DescribeTreeViewRendererUtils {
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
   * Returns the `labelInput` slot of the item with the given id.
   * @param {string} id The id of the item to retrieve.
   * @returns {HTMLElement} `labelInput` slot of the item with the given id.
   */
  getItemLabelInput: (id: string) => HTMLInputElement;
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
  getItemIdTree: () => TreeViewItemIdTreeElement[];
}

export interface DescribeTreeViewRendererReturnValue<
  TSignatures extends TreeViewAnyPluginSignature[],
> extends DescribeTreeViewRendererUtils {
  /**
   * The ref object that allows Tree View manipulation.
   */
  apiRef: { current: TreeViewPublicAPI<TSignatures> };
  /**
   * Passes new props to the Tree View.
   * @param {Partial<TreeViewUsedParams<TSignatures>>} props A subset of the props accepted by the Tree View.
   */
  setProps: (props: Partial<MergeSignaturesProperty<TSignatures, 'params'>>) => void;
  /**
   * Passes new items to the Tree View.
   * @param {readyonly DescribeTreeViewItem[]} items The new items.
   */
  setItems: (items: readonly DescribeTreeViewItem[]) => void;
}

export type DescribeTreeViewRenderer<TSignatures extends TreeViewAnyPluginSignature[]> = <
  R extends DescribeTreeViewItem,
>(
  params: {
    items: readonly R[];
    /**
     * If `true`, the Tree View will be wrapped with an error boundary.
     */
    withErrorBoundary?: boolean;
  } & Omit<MergeSignaturesProperty<TSignatures, 'params'>, 'slots' | 'slotProps'> & {
      slots?: MergeSignaturesProperty<TSignatures, 'slots'> & {
        item?: React.ElementType<TreeItemProps | TreeItem2Props>;
      };
      slotProps?: MergeSignaturesProperty<TSignatures, 'slotProps'> & {
        item?: Partial<TreeItemProps> | Partial<TreeItem2Props>;
      };
      experimentalFeatures?: TreeViewExperimentalFeatures<TSignatures>;
    },
) => DescribeTreeViewRendererReturnValue<TSignatures>;

export type DescribeTreeViewJSXRenderer = (
  element: React.ReactElement,
) => DescribeTreeViewRendererUtils;

type TreeViewComponentName = 'RichTreeView' | 'RichTreeViewPro' | 'SimpleTreeView';
type TreeItemComponentName = 'TreeItem' | 'TreeItem2';

interface DescribeTreeViewTestRunnerParams<TSignatures extends TreeViewAnyPluginSignature[]> {
  /**
   * Render the Tree View with its props and items defined as parameters of the "render" function as follows:
   *
   * ```ts
   * const response = render({
   *   items: [{ id: '1', children: [] }],
   *   defaultExpandedItems: ['1'],
   * });
   * ```
   */
  render: DescribeTreeViewRenderer<TSignatures>;
  /**
   * Render the Tree View by passing the JSX element to the renderFromJSX function as follows:
   *
   * ```tsx
   * const response = renderFromJSX(
   *   <TreeViewComponent defaultExpandedItems={['1']}>
   *     <TreeItemComponent itemId={'1'} label={'1'} data-testid={'1'}>
   *   </TreeViewComponent>
   * );
   * ```
   *
   * `TreeViewComponent` and `TreeItemComponent` are passed as parameters to the `describeTreeView` function.
   * The JSX should be adapted depending on the component being rendered.
   *
   * Warning: This method should only be used if `render` is not compatible with the test being written
   * (most likely to advanced testing of the children rendering aspect on the SimpleTreeView)
   *
   * Warning: If you want to use the utils returned by the `renderFromJSX` function,
   * each item should receive a `label` and a `data-testid` equal to its `id`.
   */
  renderFromJSX: DescribeTreeViewJSXRenderer;
  setup: `${TreeViewComponentName} + ${TreeItemComponentName}`;
  treeViewComponentName: TreeViewComponentName;
  treeItemComponentName: TreeItemComponentName;
  TreeViewComponent: React.ElementType<any>;
  TreeItemComponent: React.ElementType<any>;
}

export interface DescribeTreeViewItem {
  id: string;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: readonly DescribeTreeViewItem[];
}
