import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer } from '@mui-internal/test-utils';
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
  ): Omit<DescribeTreeViewRendererReturnValue<TPlugins>, 'setProps' | 'apiRef'> => {
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
      const renderRichTreeView: DescribeTreeViewRenderer<TPlugins> = ({
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
          apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeView, setup: 'RichTreeView + TreeItem' });
    });

    describe('RichTreeView + TreeItem2', () => {
      const renderRichTreeView: DescribeTreeViewRenderer<TPlugins> = ({
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
          apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeView, setup: 'RichTreeView + TreeItem2' });
    });

    describe('RichTreeViewPro + TreeItem', () => {
      const renderRichTreeViewPro: DescribeTreeViewRenderer<TPlugins> = ({
        items: rawItems,
        slotProps,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const apiRef = { current: undefined };
        const result = render(
          <RichTreeViewPro
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
          apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeViewPro, setup: 'RichTreeView + TreeItem' });
    });

    describe('RichTreeViewPro + TreeItem2', () => {
      const renderRichTreeViewPro: DescribeTreeViewRenderer<TPlugins> = ({
        items: rawItems,
        slots,
        slotProps,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const apiRef = { current: undefined };
        const result = render(
          <RichTreeViewPro
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
          apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeViewPro, setup: 'RichTreeView + TreeItem2' });
    });

    describe('SimpleTreeView + TreeItem', () => {
      const renderSimpleTreeView: DescribeTreeViewRenderer<TPlugins> = ({
        items: rawItems,
        slots,
        slotProps,
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
            {...slotProps?.item}
          >
            {item.children?.map(renderItem)}
          </Item>
        );

        const result = render(
          <SimpleTreeView slots={slots} slotProps={slotProps} apiRef={apiRef} {...other}>
            {items.map(renderItem)}
          </SimpleTreeView>,
        );

        return {
          setProps: result.setProps,
          apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderSimpleTreeView, setup: 'SimpleTreeView + TreeItem' });
    });

    describe('SimpleTreeView + TreeItem2', () => {
      const renderSimpleTreeView: DescribeTreeViewRenderer<TPlugins> = ({
        items: rawItems,
        slots,
        slotProps,
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
            {...slotProps?.item}
          >
            {item.children?.map(renderItem)}
          </Item>
        );

        const result = render(
          <SimpleTreeView slots={slots} slotProps={slotProps} apiRef={apiRef} {...other}>
            {items.map(renderItem)}
          </SimpleTreeView>,
        );

        return {
          setProps: result.setProps,
          apiRef: apiRef as unknown as { current: TreeViewPublicAPI<TPlugins> },
          ...getUtils(result),
        };
      };

      testRunner({ render: renderSimpleTreeView, setup: 'SimpleTreeView + TreeItem2' });
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
