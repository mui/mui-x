import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { ChartsLabel } from '@mui/x-charts/ChartsLabel/ChartsLabel';
import { labelClasses } from '@mui/x-charts/ChartsLabel/labelClasses';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<ChartsLabel />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsLabel />, () => ({
    classes: labelClasses,
    inheritComponent: 'div',
    render,
    muiName: 'MuiChartsLabel',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLSpanElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));
});
