import * as React from 'react';
import { createRenderer } from '@mui-internal/test-utils';
import {
  RichTreeViewPro,
  richTreeViewClasses as classes,
} from '@mui/x-tree-view-pro/RichTreeViewPro';
import { describeConformance } from 'test/utils/describeConformance';

describe('<RichTreeViewPro />', () => {
  const { render } = createRenderer();

  describeConformance(<RichTreeViewPro items={[]} />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiRichTreeViewPro',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});
