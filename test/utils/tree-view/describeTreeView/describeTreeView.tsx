import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeViewAnyPluginSignature } from '@mui/x-tree-view/internals/models';
import {
  DescribeTreeViewTestRunner,
  DescribeTreeViewItemsRenderer,
} from './describeTreeView.types';

const innerDescribeTreeView = <TPlugin extends TreeViewAnyPluginSignature>(
  message: string,
  testRunner: DescribeTreeViewTestRunner<TPlugin>,
): void => {
  const { render } = createRenderer();

  const renderNodes: DescribeTreeViewItemsRenderer<TPlugin> = ({ items, ...other }) => {
    const { getByTestId, getByRole, setProps } = render(
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

    const getRoot = () => getByRole('tree');

    const getItemRoot = (id: string) => getByTestId(id);

    const getItemContent = (id: string) =>
      getItemRoot(id).querySelector<HTMLElement>(`.${treeItemClasses.content}`)!;

    return {
      getRoot,
      getItemRoot,
      getItemContent,
      setProps,
    };
  };

  describe(message, () => {
    testRunner({ renderItems: renderNodes });
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
