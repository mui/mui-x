import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import {
  RichTreeViewPro,
  richTreeViewProClasses as classes,
} from '@mui/x-tree-view-pro/RichTreeViewPro';
import { describeConformance } from 'test/utils/describeConformance';
// eslint-disable-next-line import/order
import packageJson from '@mui/material/package.json';

// eslint-disable-next-line no-console
console.log(`@mui/x-tree-view-pro: @mui/material version`, packageJson.version);

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
