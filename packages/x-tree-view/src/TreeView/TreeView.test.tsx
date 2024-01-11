import * as React from 'react';
import { createRenderer, describeConformance } from '@mui-internal/test-utils';
import { TreeView, treeViewClasses as classes } from '@mui/x-tree-view/TreeView';

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
