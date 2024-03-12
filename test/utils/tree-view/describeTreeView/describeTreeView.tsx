import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeViewAnyPluginSignature } from '@mui/x-tree-view/internals/models';
import { MuiRenderResult } from '@mui-internal/test-utils/createRenderer';
import {
  DescribeTreeViewTestRunner,
  DescribeTreeViewItemsRenderer,
  DescribeTreeViewTestRunnerReturnValue,
} from './describeTreeView.types';

const innerDescribeTreeView = <TPlugin extends TreeViewAnyPluginSignature>(
  message: string,
  testRunner: DescribeTreeViewTestRunner<TPlugin>,
): void => {
  const { render } = createRenderer();

  const getUtils = (
    result: MuiRenderResult,
  ): Omit<DescribeTreeViewTestRunnerReturnValue<TPlugin>, 'setProps'> => {
    const getRoot = () => result.getByRole('tree');

    const getItemRoot = (id: string) => result.getByTestId(id);

    const getItemContent = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.content}`)!;

    return {
      getRoot,
      getItemRoot,
      getItemContent,
    };
  };

  describe(message, () => {
    describe('RichTreeView', () => {
      const renderItemsInRichTreeView: DescribeTreeViewItemsRenderer<TPlugin> = ({
        items,
        ...other
      }) => {
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
            getItemLabel={(item) => (item as any).label ?? (item as any).id}
          />,
        );

        return {
          setProps: result.setProps,
          ...getUtils(result),
        };
      };

      testRunner({ renderItems: renderItemsInRichTreeView });
    });

    describe('SimpleTreeView', () => {
      const renderItemsInSimpleTreeView: DescribeTreeViewItemsRenderer<TPlugin> = ({
        items,
        ...other
      }) => {
        const renderItem = (item: any) => (
          <TreeItem
            nodeId={item.id}
            label={item.label ?? item.id}
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

      testRunner({ renderItems: renderItemsInSimpleTreeView });
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

export const describeTreeView = createDescribe(
  'describeTreeView',
  innerDescribeTreeView,
) as DescribeTreeView;
