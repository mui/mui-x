import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { SimpleTreeView, simpleTreeViewClasses as classes } from '@mui/x-tree-view/SimpleTreeView';
import { describeConformance } from 'test/utils/describeConformance';

describe('<SimpleTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<SimpleTreeView />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiSimpleTreeView',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});
