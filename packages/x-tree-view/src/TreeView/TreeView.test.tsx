import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { TreeView, treeViewClasses as classes } from '@mui/x-tree-view/TreeView';
import { describeConformance } from 'test/utils/describeConformance';

describe('<TreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeView />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiTreeView',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});
