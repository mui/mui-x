// @ts-nocheck
import * as React from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { PieChart } from '@mui/x-charts/PieChart';

const className = treeViewClasses.root;

// prettier-ignore
<React.Fragment>
  <SimpleTreeView>
    <TreeItem nodeId="1" label="Item 1" />
  </SimpleTreeView>
  <PieChart
    slotProps={{
      legend: { hidden: true }
    }} />
</React.Fragment>
