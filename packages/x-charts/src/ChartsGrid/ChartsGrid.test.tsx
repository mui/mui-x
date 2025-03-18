import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

describe('<ChartsGrid />', () => {
  const { render } = createRenderer();

  it('should render grid at millisecond level without warnings', () => {
    render(
      <ChartContainer
        series={[]}
        width={500}
        height={500}
        xAxis={[
          {
            scaleType: 'time',
            min: new Date(2022, 1, 1, 12, 30, 30, 100),
            max: new Date(2022, 1, 1, 12, 30, 30, 500),
          },
        ]}
        yAxis={[
          {
            scaleType: 'time',
            min: new Date(2022, 1, 1, 12, 30, 30, 100),
            max: new Date(2022, 1, 1, 12, 30, 30, 500),
          },
        ]}
      >
        <ChartsGrid vertical horizontal />
      </ChartContainer>,
    );
  });
});
