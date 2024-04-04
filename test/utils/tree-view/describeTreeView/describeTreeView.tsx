import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
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

const innerDescribeTreeView = <TPlugin extends TreeViewAnyPluginSignature>(
  message: string,
  testRunner: DescribeTreeViewTestRunner<TPlugin>,
): void => {
  const { render } = createRenderer();

  const getUtils = (
    result: MuiRenderResult,
  ): Omit<DescribeTreeViewRendererReturnValue<TPlugin>, 'setProps' | 'apiRef'> => {
    const getRoot = () => result.getByRole('tree');

    const getAllItemRoots = () => result.queryAllByRole('treeitem');

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
      getItemRoot,
      getItemContent,
      getItemLabel,
      getItemIconContainer,
      isItemExpanded,
      isItemSelected,
    };
  };

  describe(message, () => {
    describe('RichTreeView + TreeItem', () => {
      const renderRichTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        slotProps,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const apiRef = { current: undefined };
        const result = render(
          <RichTreeView
            items={items}
            apiRef={apiRef}
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
          />,
        );

        return {
          setProps: result.setProps,
          apiRef: apiRef as { current: TreeViewPublicAPI<[TPlugin]> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeView, setup: 'RichTreeView + TreeItem' });
    });

    describe('RichTreeView + TreeItem2', () => {
      const renderRichTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        slots,
        slotProps,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const apiRef = { current: undefined };
        const result = render(
          <RichTreeView
            items={items}
            apiRef={apiRef}
            slots={{ item: TreeItem2, ...slots }}
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
          />,
        );

        return {
          setProps: result.setProps,
          apiRef: apiRef as { current: TreeViewPublicAPI<[TPlugin]> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeView, setup: 'RichTreeView + TreeItem2' });
    });

    describe('SimpleTreeView + TreeItem', () => {
      const renderSimpleTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        slots,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const Item = slots?.item ?? TreeItem;
        const apiRef = { current: undefined };

        const renderItem = (item: DescribeTreeViewItem) => (
          <Item
            itemId={item.id}
            label={item.label ?? item.id}
            disabled={item.disabled}
            data-testid={item.id}
            key={item.id}
          >
            {item.children?.map(renderItem)}
          </Item>
        );

        const result = render(
          <SimpleTreeView slots={slots} apiRef={apiRef} {...other}>
            {items.map(renderItem)}
          </SimpleTreeView>,
        );

        return {
          setProps: result.setProps,
          apiRef: apiRef as { current: TreeViewPublicAPI<[TPlugin]> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderSimpleTreeView, setup: 'SimpleTreeView + TreeItem' });
    });

    describe('SimpleTreeView + TreeItem2', () => {
      const renderSimpleTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        slots,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const Item = slots?.item ?? TreeItem2;
        const apiRef = { current: undefined };

        const renderItem = (item: DescribeTreeViewItem) => (
          <Item
            itemId={item.id}
            label={item.label ?? item.id}
            disabled={item.disabled}
            data-testid={item.id}
            key={item.id}
          >
            {item.children?.map(renderItem)}
          </Item>
        );

        const result = render(
          <SimpleTreeView slots={slots} apiRef={apiRef} {...other}>
            {items.map(renderItem)}
          </SimpleTreeView>,
        );

        return {
          setProps: result.setProps,
          apiRef: apiRef as { current: TreeViewPublicAPI<[TPlugin]> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderSimpleTreeView, setup: 'SimpleTreeView + TreeItem2' });
    });
  });
};

type Params<TPlugin extends TreeViewAnyPluginSignature> = [
  string,
  DescribeTreeViewTestRunner<TPlugin>,
];

type DescribeTreeView = {
  <P extends TreeViewAnyPluginSignature>(...args: Params<P>): void;
  skip: <P extends TreeViewAnyPluginSignature>(...args: Params<P>) => void;
  only: <P extends TreeViewAnyPluginSignature>(...args: Params<P>) => void;
};

/**
 * Describe tests for the Tree View that will be executed with the following setups:
 * - RichTreeView + TreeItem
 * - RichTreeView + TreeItem2
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
