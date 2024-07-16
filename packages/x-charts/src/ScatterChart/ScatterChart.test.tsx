import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

describe('<ScatterChart />', () => {
  const { render } = createRenderer();

  describeConformance(
    <ScatterChart
      height={100}
      width={100}
      series={[
        {
          data: [
            { id: 'A', x: 100, y: 10 },
            { id: 'B', x: 200, y: 20 },
          ],
        },
      ]}
    />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiScatterChart',
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
