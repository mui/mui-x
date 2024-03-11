import * as React from 'react';
import createDescribe from '@mui-internal/test-utils/createDescribe';
import { createRenderer } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  DescribeTreeViewTestRunner,
  DescribeTreeViewNodesRenderer,
} from './describeTreeView.types';

const innerDescribeTreeView = (message: string, testRunner: DescribeTreeViewTestRunner): void => {
  const { render } = createRenderer();

  describe(message, () => {
    const renderNodes: DescribeTreeViewNodesRenderer = ({ items }) => {
      render(<RichTreeView items={items} />);
    };

    testRunner({ renderNodes });
  });
};

export const describeTreeView = createDescribe('describeTreeView', innerDescribeTreeView);
