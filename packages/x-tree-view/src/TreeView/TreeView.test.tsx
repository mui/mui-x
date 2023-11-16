import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  act,
  createRenderer,
  ErrorBoundary,
  fireEvent,
  screen,
  describeConformance,
} from '@mui-internal/test-utils';
import Portal from '@mui/material/Portal';
import { TreeView, treeViewClasses as classes } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

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
