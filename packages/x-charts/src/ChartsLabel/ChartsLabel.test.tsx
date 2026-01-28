import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { ChartsLabel, labelClasses } from '@mui/x-charts/ChartsLabel';
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
    skip: [
      'themeVariants',
      'themeStyleOverrides',
      'themeCustomPalette',
      'themeDefaultProps',
      'componentProp',
      'componentsProp',
    ],
  }));
});
