import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ScatterChart } from './ScatterChart';

describe('<ScatterChart />', () => {
  const { render } = createRenderer();

  describeConformance(
    <ScatterChart
      height={100}
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
      muiName: 'MuiBarChart',
      testComponentPropWith: 'div',
      refInstanceof: window.HTMLDivElement,
      only: ['mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer', 'rootClass'],
    }),
  );
});
