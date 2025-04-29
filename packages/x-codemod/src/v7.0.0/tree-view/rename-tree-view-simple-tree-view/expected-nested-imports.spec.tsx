// @ts-nocheck
import * as React from 'react';
import {
  SimpleTreeView,
  SimpleTreeViewProps,
  SimpleTreeViewClasses,
  SimpleTreeViewClassKey,
  simpleTreeViewClasses,
  getSimpleTreeViewUtilityClass,
} from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

function App() {
  getSimpleTreeViewUtilityClass('root');

  // prettier-ignore
  return (
    (<SimpleTreeView>
      <TreeItem nodeId="1" label="Item 1" />
    </SimpleTreeView>)
  );
}
