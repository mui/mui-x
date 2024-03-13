import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewAnyPluginSignature } from '@mui/x-tree-view/internals/models';
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
  ): Omit<DescribeTreeViewRendererReturnValue<TPlugin>, 'setProps'> => {
    const getRoot = () => result.getByRole('tree');

    const getAllItemRoots = () => result.queryAllByRole('treeitem');

    const getItemRoot = (id: string) => result.getByTestId(id);

    const getItemContent = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.content}`)!;

    return {
      getRoot,
      getAllItemRoots,
      getItemRoot,
      getItemContent,
    };
  };

  describe(message, () => {
    describe('RichTreeView + TreeItem', () => {
      const renderRichTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const result = render(
          <RichTreeView
            {...other}
            items={items}
            slotProps={{
              item: (ownerState) =>
                ({
                  'data-testid': ownerState.nodeId,
                }) as any,
            }}
            getItemLabel={(item) => item.label ?? item.id}
            isItemDisabled={(item) => !!item.disabled}
          />,
        );

        return {
          setProps: result.setProps,
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeView });
    });

    describe('RichTreeView + TreeItem2', () => {
      const renderRichTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const result = render(
          <RichTreeView
            {...other}
            items={items}
            slots={{ item: TreeItem2 }}
            slotProps={{
              item: (ownerState) =>
                ({
                  'data-testid': ownerState.nodeId,
                }) as any,
            }}
            getItemLabel={(item) => item.label ?? item.id}
            isItemDisabled={(item) => !!item.disabled}
          />,
        );

        return {
          setProps: result.setProps,
          ...getUtils(result),
        };
      };

      testRunner({ render: renderRichTreeView });
    });

    describe('SimpleTreeView + TreeItem', () => {
      const renderSimpleTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const renderItem = (item: DescribeTreeViewItem) => (
          <TreeItem
            nodeId={item.id}
            label={item.label ?? item.id}
            disabled={item.disabled}
            data-testid={item.id}
            key={item.id}
          >
            {item.children?.map(renderItem)}
          </TreeItem>
        );

        const result = render(<SimpleTreeView {...other}>{items.map(renderItem)}</SimpleTreeView>);

        return {
          setProps: result.setProps,
          ...getUtils(result),
        };
      };

      testRunner({ render: renderSimpleTreeView });
    });

    describe('SimpleTreeView + TreeItem2', () => {
      const renderSimpleTreeView: DescribeTreeViewRenderer<TPlugin> = ({
        items: rawItems,
        ...other
      }) => {
        const items = rawItems as readonly DescribeTreeViewItem[];
        const renderItem = (item: DescribeTreeViewItem) => (
          <TreeItem2
            nodeId={item.id}
            label={item.label ?? item.id}
            disabled={item.disabled}
            data-testid={item.id}
            key={item.id}
          >
            {item.children?.map(renderItem)}
          </TreeItem2>
        );

        const result = render(<SimpleTreeView {...other}>{items.map(renderItem)}</SimpleTreeView>);

        return {
          setProps: result.setProps,
          ...getUtils(result),
        };
      };

      testRunner({ render: renderSimpleTreeView });
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
 *
 * The `render` function returns an object with the following properties:
 * - `getRoot`: Returns the `root slot of the Tree View
 * - `getItemRoot`: Returns the `root` slot of the item with the given id (useful to simulate focus)
 * - `getItemContent`: Returns the `content` slot of the item with the given id (useful to simulate clicks)
 * - `setProps`: Updates the props of the Tree View
 */
export const describeTreeView = createDescribe(
  'describeTreeView',
  innerDescribeTreeView,
) as DescribeTreeView;
