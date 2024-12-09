import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { ChartsLabelMark, labelMarkClasses } from '@mui/x-charts/ChartsLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<ChartsLabelMark />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsLabelMark />, () => ({
    classes: labelMarkClasses,
    inheritComponent: 'div',
    render,
    muiName: 'MuiChartsLabelMark',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['componentProp', 'componentsProp'],
  }));
});
