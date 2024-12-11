import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChartsLabelGradient } from '@mui/x-charts/ChartsLabel/ChartsLabelGradient';
import { labelGradientClasses } from '@mui/x-charts/ChartsLabel/labelGradientClasses';

describe('<ChartsLabelGradient />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsLabelGradient gradientId="ChartsLabelGradient.test-id" />, () => ({
    classes: labelGradientClasses,
    inheritComponent: 'div',
    render: (node) =>
      render(node, {
        wrapper: ({ children }) => (
          <React.Fragment>
            {children}
            <Gradient id="ChartsLabelGradient.test-id" />
          </React.Fragment>
        ),
      }),
    muiName: 'MuiChartsLabelGradient',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));
});

function Gradient({ id }: any) {
  return (
    <svg width="0" height="0" viewBox="0 0 0 0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#CAD4EE" />
          <stop offset="0.5" stopColor="#4254FB" />
          <stop offset="1" stopColor="#091159" />
        </linearGradient>
      </defs>
    </svg>
  );
}
