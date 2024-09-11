import * as React from 'react';
import createDescribe from '@mui/internal-test-utils/createDescribe';
import { createRenderer, ErrorBoundary } from '@mui/internal-test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { TreeViewAnyPluginSignature, TreeViewPublicAPI } from '@mui/x-tree-view/internals/models';
import { MuiRenderResult } from '@mui/internal-test-utils/createRenderer';
import {
  DescribeTreeViewTestRunner,
  DescribeTreeViewRenderer,
  DescribeTreeViewJSXRenderer,
  DescribeTreeViewItem,
  DescribeTreeViewRendererUtils,
  TreeViewItemIdTreeElement,
} from './describeTreeView.types';

const innerDescribeTreeView = <TSignatures extends TreeViewAnyPluginSignature[]>(
  message: string,
  testRunner: DescribeTreeViewTestRunner<TSignatures>,
): void => {
  const { render } = createRenderer();

  const getUtils = (
    result: MuiRenderResult,
    apiRef?: { current: TreeViewPublicAPI<TSignatures> },
  ): DescribeTreeViewRendererUtils => {
    const getRoot = () => result.getByRole('tree');

    const getAllTreeItemIds = () =>
      result.queryAllByRole('treeitem').map((item) => item.dataset.testid!);

    const getItemIdTree = (): TreeViewItemIdTreeElement[] => {
      if (!apiRef) {
        throw new Error(
          'Cannot use getItemIdTree in renderFromJSX because the apiRef is not defined',
        );
      }

      const cleanItem = (item: TreeViewBaseItem) => {
        if (item.children) {
          return { id: item.id, children: item.children.map(cleanItem) };
        }

        return { id: item.id };
      };

      // @ts-ignore
      return apiRef.current!.getItemTree().map(cleanItem);
    };

    const getFocusedItemId = () => {
      const activeElement = document.activeElement;
      if (!activeElement || !activeElement.classList.contains(treeItemClasses.root)) {
        return null;
      }

      return (activeElement as HTMLElement).dataset.testid!;
    };

    const getItemRoot = (id: string) => result.getByTestId(id);

    const getItemContent = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.content}`)!;

    const getItemCheckbox = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.checkbox}`)!;

    const getItemLabelInput = (id: string) =>
      getItemRoot(id).querySelector<HTMLInputElement>(`.${treeItemClasses.labelInput}`)!;

    const getItemCheckboxInput = (id: string) =>
      getItemCheckbox(id).querySelector<HTMLInputElement>(`input`)!;

    const getItemLabel = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.label}`)!;

    const getItemIconContainer = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.iconContainer}`)!;

    const isItemExpanded = (id: string) => getItemRoot(id).getAttribute('aria-expanded') === 'true';

    const isItemSelected = (id: string) => getItemRoot(id).getAttribute('aria-selected') === 'true';

    const getSelectedTreeItems = () =>
      result
        .queryAllByRole('treeitem')
        .filter((item) => item.getAttribute('aria-selected') === 'true')
        .map((item) => item.dataset.testid!);

    return {
      getRoot,
      getAllTreeItemIds,
      getFocusedItemId,
      getItemRoot,
      getItemContent,
      getItemCheckbox,
      getItemCheckboxInput,
      getItemLabel,
      getItemIconContainer,
      isItemExpanded,
      isItemSelected,
      getSelectedTreeItems,
      getItemLabelInput,
      getItemIdTree,
    };
  };

  const jsxRenderer: DescribeTreeViewJSXRenderer = (element) => {
    const result = render(element);
    return getUtils(result);
  };

  const createRendererForComponentWithItemsProp = (
    TreeViewComponent: typeof RichTreeView,
    TreeItemComponent: typeof TreeItem | typeof TreeItem2,
  ) => {
    const objectRenderer: DescribeTreeViewRenderer<TSignatures> = ({
      items: rawItems,
      withErrorBoundary,
      slotProps,
      ...other
    }) => {
      const items = rawItems as readonly DescribeTreeViewItem[];
      const apiRef = { current: undefined };

      const jsx = (
        <TreeViewComponent
          items={items}
          apiRef={apiRef}
          slots={{ item: TreeItemComponent }}
          slotProps={{
            ...slotProps,
            item: (ownerState) =>
              ({
                ...slotProps?.item,
                'data-testid': ownerState.itemId,
              }) as any,
          }}
          getItemLabel={(item) => {
            if (item.label) {
              if (typeof item.label !== 'string') {
                throw new Error('Only use string labels when testing RichTreeView(Pro)');
              }

              return item.label;
            }

            return item.id;
          }}
          isItemDisabled={(item) => !!item.disabled}
          {...other}
        />
      );

      const result = render(withErrorBoundary ? <ErrorBoundary>{jsx}</ErrorBoundary> : jsx);

      return {
        setProps: result.setProps,
        setItems: (newItems) => result.setProps({ items: newItems }),
        apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TSignatures> },
        ...getUtils(result, apiRef as unknown as { current: TreeViewPublicAPI<TSignatures> }),
      };
    };

    return {
      render: objectRenderer,
      renderFromJSX: jsxRenderer,
    };
  };

  const createRenderersForComponentWithJSXItems = (
    TreeViewComponent: typeof SimpleTreeView,
    TreeItemComponent: typeof TreeItem | typeof TreeItem2,
  ) => {
    const objectRenderer: DescribeTreeViewRenderer<TSignatures> = ({
      items: rawItems,
      withErrorBoundary,
      slots,
      slotProps,
      ...other
    }) => {
      const items = rawItems as readonly DescribeTreeViewItem[];
      const Item = slots?.item ?? TreeItemComponent;
      const apiRef = { current: undefined };

      const renderItem = (item: DescribeTreeViewItem) => (
        <Item
          itemId={item.id}
          label={item.label ?? item.id}
          disabled={item.disabled}
          data-testid={item.id}
          key={item.id}
          {...slotProps?.item}
        >
          {item.children?.map(renderItem)}
        </Item>
      );

      const jsx = (
        <TreeViewComponent slots={slots} slotProps={slotProps} apiRef={apiRef} {...other}>
          {items.map(renderItem)}
        </TreeViewComponent>
      );

      const result = render(withErrorBoundary ? <ErrorBoundary>{jsx}</ErrorBoundary> : jsx);

      return {
        setProps: result.setProps,
        setItems: (newItems) => result.setProps({ children: newItems.map(renderItem) }),
        apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TSignatures> },
        ...getUtils(result),
      };
    };

    return {
      render: objectRenderer,
      renderFromJSX: jsxRenderer,
    };
  };

  describe(message, () => {
    describe('RichTreeView + TreeItem', () => {
      testRunner({
        ...createRendererForComponentWithItemsProp(RichTreeView, TreeItem),
        setup: 'RichTreeView + TreeItem',
        treeViewComponentName: 'RichTreeView',
        treeItemComponentName: 'TreeItem',
        TreeViewComponent: RichTreeView,
        TreeItemComponent: TreeItem,
      });
    });

    describe('RichTreeView + TreeItem2', () => {
      testRunner({
        ...createRendererForComponentWithItemsProp(RichTreeView, TreeItem2),
        setup: 'RichTreeView + TreeItem2',
        treeViewComponentName: 'RichTreeView',
        treeItemComponentName: 'TreeItem2',
        TreeViewComponent: RichTreeView,
        TreeItemComponent: TreeItem2,
      });
    });

    describe('RichTreeViewPro + TreeItem', () => {
      testRunner({
        ...createRendererForComponentWithItemsProp(RichTreeViewPro, TreeItem),
        setup: 'RichTreeViewPro + TreeItem',
        treeViewComponentName: 'RichTreeViewPro',
        treeItemComponentName: 'TreeItem',
        TreeViewComponent: RichTreeViewPro,
        TreeItemComponent: TreeItem,
      });
    });

    describe('RichTreeViewPro + TreeItem2', () => {
      testRunner({
        ...createRendererForComponentWithItemsProp(RichTreeViewPro, TreeItem2),
        setup: 'RichTreeViewPro + TreeItem2',
        treeViewComponentName: 'RichTreeViewPro',
        treeItemComponentName: 'TreeItem2',
        TreeViewComponent: RichTreeViewPro,
        TreeItemComponent: TreeItem2,
      });
    });

    describe('SimpleTreeView + TreeItem', () => {
      testRunner({
        ...createRenderersForComponentWithJSXItems(SimpleTreeView, TreeItem),
        setup: 'SimpleTreeView + TreeItem',
        treeViewComponentName: 'SimpleTreeView',
        treeItemComponentName: 'TreeItem',
        TreeViewComponent: SimpleTreeView,
        TreeItemComponent: TreeItem,
      });
    });

    describe('SimpleTreeView + TreeItem2', () => {
      testRunner({
        ...createRenderersForComponentWithJSXItems(SimpleTreeView, TreeItem2),
        setup: 'SimpleTreeView + TreeItem2',
        treeViewComponentName: 'SimpleTreeView',
        treeItemComponentName: 'TreeItem2',
        TreeViewComponent: SimpleTreeView,
        TreeItemComponent: TreeItem2,
      });
    });
  });
};

type Params<TSignatures extends TreeViewAnyPluginSignature[]> = [
  string,
  DescribeTreeViewTestRunner<TSignatures>,
];

type DescribeTreeView = {
  <TSignatures extends TreeViewAnyPluginSignature[]>(...args: Params<TSignatures>): void;
  skip: <TSignatures extends TreeViewAnyPluginSignature[]>(...args: Params<TSignatures>) => void;
  only: <TSignatures extends TreeViewAnyPluginSignature[]>(...args: Params<TSignatures>) => void;
};

/**
 * Describe tests for the Tree View that will be executed with the following setups:
 * - RichTreeView + TreeItem
 * - RichTreeView + TreeItem2
 * - RichTreeViewPro + TreeItem
 * - RichTreeViewPro + TreeItem2
 * - SimpleTreeView + TreeItem
 * - SimpleTreeView + TreeItem2
 *
 * Is used as follows:
 *
 * ```
 * describeTreeView('Title of the suite', ({ render }) => {
 *   it('should do something', () => {
 *     const { getItemRoot } = render({
 *       items: [{ id: '1', children: [{ id: '1.1' }] }],
 *       defaultExpandedItems: ['1'],
 *     });
 *   });
 * });
 * ```
 *
 * Several things to note:
 * - The `render` function takes an array of items, even for `SimpleTreeView`
 * - Except for `items`, all the other properties passed to `render` will be forwarded to the Tree View as props
 * - If an item has no label, its `id` will be used as the label
 */
export const describeTreeView = createDescribe(
  'describeTreeView',
  innerDescribeTreeView,
) as DescribeTreeView;
