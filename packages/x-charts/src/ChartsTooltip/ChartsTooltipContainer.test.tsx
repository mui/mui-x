import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { BarChart } from '@mui/x-charts/BarChart';
import { clearWarningsCache } from '@mui/x-internals/warning';

describe('ChartsTooltipContainer', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    clearWarningsCache();
  });

  it('should warn when tooltipItem is controlled but trigger is axis', () => {
    const expectedError = [
      "MUI X Charts: The `tooltipItem` prop is provided, but the tooltip trigger is set to 'axis'.",
      "The `tooltipItem` prop only has an effect when the tooltip trigger is 'item'.",
    ].join('\n');

    expect(() =>
      render(
        <BarChart
          series={[{ data: [1, 2, 3], id: 'A' }]}
          xAxis={[{ data: ['a', 'b', 'c'], position: 'none' }]}
          yAxis={[{ position: 'none' }]}
          height={100}
          width={100}
          hideLegend
          tooltipItem={{ seriesId: 'A', dataIndex: 0 }}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />,
      ),
    ).toErrorDev(expectedError);
  });

  it('should warn when tooltipAxis is controlled but trigger is item', () => {
    const expectedError = [
      "MUI X Charts: The `tooltipAxis` prop is provided, but the tooltip trigger is set to 'item'.",
      "The `tooltipAxis` prop only has an effect when the tooltip trigger is 'axis'.",
    ].join('\n');

    expect(() =>
      render(
        <BarChart
          series={[{ data: [1, 2, 3], id: 'A' }]}
          xAxis={[{ id: 'x-axis', data: ['a', 'b', 'c'], position: 'none' }]}
          yAxis={[{ position: 'none' }]}
          height={100}
          width={100}
          hideLegend
          tooltipAxis={[{ axisId: 'x-axis', dataIndex: 0 }]}
          slotProps={{ tooltip: { trigger: 'item' } }}
        />,
      ),
    ).toErrorDev(expectedError);
  });

  it('should not warn when tooltipItem is controlled and trigger is item', () => {
    expect(() =>
      render(
        <BarChart
          series={[{ data: [1, 2, 3], id: 'A' }]}
          xAxis={[{ data: ['a', 'b', 'c'], position: 'none' }]}
          yAxis={[{ position: 'none' }]}
          height={100}
          width={100}
          hideLegend
          tooltipItem={{ seriesId: 'A', dataIndex: 0 }}
          slotProps={{ tooltip: { trigger: 'item' } }}
        />,
      ),
    ).not.toErrorDev();
  });

  it('should not warn when tooltipAxis is controlled and trigger is axis', () => {
    expect(() =>
      render(
        <BarChart
          series={[{ data: [1, 2, 3], id: 'A' }]}
          xAxis={[{ id: 'x-axis', data: ['a', 'b', 'c'], position: 'none' }]}
          yAxis={[{ position: 'none' }]}
          height={100}
          width={100}
          hideLegend
          tooltipAxis={[{ axisId: 'x-axis', dataIndex: 0 }]}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />,
      ),
    ).not.toErrorDev();
  });
});
