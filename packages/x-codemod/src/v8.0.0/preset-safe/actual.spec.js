// @ts-nocheck
import * as React from 'react';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { PieChart } from '@mui/x-charts/PieChart';

const className = treeViewClasses.root;

// prettier-ignore
<React.Fragment>
  <SimpleTreeView>
    <TreeItem2 nodeId="1" label="Item 1" />
  </SimpleTreeView>
  <PieChart legend={{ hidden: true }} />
</React.Fragment>
