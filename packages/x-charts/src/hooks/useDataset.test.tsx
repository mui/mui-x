import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { useDataset } from './useDataset';
import { ChartProvider } from '../context/ChartProvider';
import { defaultSeriesConfig } from '../internals/plugins/utils/defaultSeriesConfig';

function UseDataset() {
  const dataset = useDataset();
  return <div>{dataset ? dataset.length : 'no-dataset'}</div>;
}

describe('useDataset', () => {
  const { render } = createRenderer();

  it('should return undefined when no dataset is provided', () => {
    render(
      <ChartProvider<'bar'>
        pluginParams={{
          series: [{ type: 'bar', id: 'test-id', data: [1, 2] }],
          width: 200,
          height: 200,
          seriesConfig: defaultSeriesConfig,
        }}
      >
        <UseDataset />
      </ChartProvider>,
    );

    expect(screen.getByText('no-dataset')).toBeVisible();
  });

  it('should return the dataset when provided', () => {
    const dataset = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 30 },
    ];

    render(
      <ChartProvider<'line'>
        pluginParams={{
          dataset,
          series: [
            {
              type: 'line',
              id: 'test-id',
              dataKey: 'y',
            },
          ],
          width: 200,
          height: 200,
          seriesConfig: defaultSeriesConfig,
        }}
      >
        <UseDataset />
      </ChartProvider>,
    );

    expect(screen.getByText('3')).toBeVisible();
  });
});
