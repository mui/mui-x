import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { LineChart } from '@mui/x-charts/LineChart';

describe('<LineChart />', () => {
  const { render } = createRenderer();
  describeConformance(
    <LineChart height={100} width={100} series={[{ data: [100, 200] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiLineChart',
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
