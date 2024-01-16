import * as React from 'react';
import { createRenderer, describeConformance } from '@mui-internal/test-utils';
import { RichTreeView, richTreeViewClasses as classes } from '@mui/x-tree-view/RichTreeView';

describe('<RichTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<RichTreeView items={[]} />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiRichTreeView',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});
