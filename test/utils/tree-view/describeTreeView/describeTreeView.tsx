import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer, ErrorBoundary } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewAnyPluginSignature, TreeViewPublicAPI } from '@mui/x-tree-view/internals/models';
import { MuiRenderResult } from '@mui-internal/test-utils/createRenderer';
import {
  DescribeTreeViewTestRunner,
  DescribeTreeViewRenderer,
  DescribeTreeViewRendererReturnValue,
  DescribeTreeViewItem,
} from './describeTreeView.types';

const innerDescribeTreeView = <TPlugins extends TreeViewAnyPluginSignature[]>(
  message: string,
  testRunner: DescribeTreeViewTestRunner<TPlugins>,
): void => {
  const { render } = createRenderer();

  const getUtils = (
    result: MuiRenderResult,
  ): Omit<DescribeTreeViewRendererReturnValue<TPlugins>, 'setProps' | 'setItems' | 'apiRef'> => {
    const getRoot = () => result.getByRole('tree');

    const getAllItemRoots = () => result.queryAllByRole('treeitem');

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

    const getItemLabel = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.label}`)!;

    const getItemIconContainer = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.iconContainer}`)!;

    const isItemExpanded = (id: string) => getItemRoot(id).getAttribute('aria-expanded') === 'true';

    const isItemSelected = (id: string) => getItemRoot(id).getAttribute('aria-selected') === 'true';

    return {
      getRoot,
      getAllItemRoots,
      getFocusedItemId,
      getItemRoot,
      getItemContent,
      getItemLabel,
      getItemIconContainer,
      isItemExpanded,
      isItemSelected,
    };
  };

  const createRendererForComponentWithItemsProp = (
    TreeViewComponent: typeof RichTreeView,
    TreeItemComponent: typeof TreeItem | typeof TreeItem2,
  ) => {
    const wrappedRenderer: DescribeTreeViewRenderer<TPlugins> = ({
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
          getItemLabel={(item) => item.label ?? item.id}
          isItemDisabled={(item) => !!item.disabled}
          {...other}
        />
      );

      const result = render(withErrorBoundary ? <ErrorBoundary>{jsx}</ErrorBoundary> : jsx);

      return {
        setProps: result.setProps,
        setItems: (newItems) => result.setProps({ items: newItems }),
        apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
        ...getUtils(result),
      };
    };

    return wrappedRenderer;
  };

  const createRendererForComponentWithJSXItems = (
    TreeViewComponent: typeof SimpleTreeView,
    TreeItemComponent: typeof TreeItem | typeof TreeItem2,
  ) => {
    const wrappedRenderer: DescribeTreeViewRenderer<TPlugins> = ({
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
        apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
        ...getUtils(result),
      };
    };

    return wrappedRenderer;
  };

  describe(message, () => {
    describe('RichTreeView + TreeItem', () => {
      testRunner({
        render: createRendererForComponentWithItemsProp(RichTreeView, TreeItem),
        setup: 'RichTreeView + TreeItem',
        treeViewComponent: 'RichTreeView',
        treeItemComponent: 'TreeItem',
      });
    });

    describe('RichTreeView + TreeItem2', () => {
      testRunner({
        render: createRendererForComponentWithItemsProp(RichTreeView, TreeItem2),
        setup: 'RichTreeView + TreeItem2',
        treeViewComponent: 'RichTreeView',
        treeItemComponent: 'TreeItem2',
      });
    });

    describe('RichTreeViewPro + TreeItem', () => {
      testRunner({
        render: createRendererForComponentWithItemsProp(RichTreeViewPro, TreeItem),
        setup: 'RichTreeViewPro + TreeItem',
        treeViewComponent: 'RichTreeViewPro',
        treeItemComponent: 'TreeItem',
      });
    });

    describe('RichTreeViewPro + TreeItem2', () => {
      testRunner({
        render: createRendererForComponentWithItemsProp(RichTreeViewPro, TreeItem2),
        setup: 'RichTreeViewPro + TreeItem2',
        treeViewComponent: 'RichTreeViewPro',
        treeItemComponent: 'TreeItem2',
      });
    });

    describe('SimpleTreeView + TreeItem', () => {
      testRunner({
        render: createRendererForComponentWithJSXItems(SimpleTreeView, TreeItem),
        setup: 'SimpleTreeView + TreeItem',
        treeViewComponent: 'SimpleTreeView',
        treeItemComponent: 'TreeItem',
      });
    });

    describe('SimpleTreeView + TreeItem2', () => {
      testRunner({
        render: createRendererForComponentWithJSXItems(SimpleTreeView, TreeItem2),
        setup: 'SimpleTreeView + TreeItem2',
        treeViewComponent: 'SimpleTreeView',
        treeItemComponent: 'TreeItem2',
      });
    });
  });
};

type Params<TPlugins extends TreeViewAnyPluginSignature[]> = [
  string,
  DescribeTreeViewTestRunner<TPlugins>,
];

type DescribeTreeView = {
  <TPlugins extends TreeViewAnyPluginSignature[]>(...args: Params<TPlugins>): void;
  skip: <TPlugins extends TreeViewAnyPluginSignature[]>(...args: Params<TPlugins>) => void;
  only: <TPlugins extends TreeViewAnyPluginSignature[]>(...args: Params<TPlugins>) => void;
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
