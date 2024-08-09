import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { BarChart } from '@mui/x-charts/BarChart';
import packageJson from '@mui/material/package.json';

// eslint-disable-next-line no-console
console.log(`@mui/x-charts: @mui/material version`, packageJson.version);

describe('<BarChart />', () => {
  const { render } = createRenderer();

  describeConformance(
    <BarChart height={100} width={100} series={[{ data: [100, 200] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiBarChart',
      testComponentPropWith: 'div',
      refInstanceof: window.SVGSVGElement,
      skip: [
        'componentProp',
        'componentsProp',
        'slotPropsProp',
        'slotPropsCallback',
        'slotsProp',
        'themeDefaultProps',
        'themeStyleOverrides',
        'themeVariants',
        'themeCustomPalette',
      ],
    }),
  );
});
