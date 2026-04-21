import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LineChartPro } from '../LineChartPro';

describe('<ChartsToolbarRangeButtonTrigger />', () => {
  const { render } = createRenderer();

  const baselineProps = {
    series: [{ data: [10, 20, 30, 40] }],
    xAxis: [
      {
        id: 'x',
        scaleType: 'point',
        data: ['A', 'B', 'C', 'D'],
        zoom: true,
        height: 30,
      },
    ],
    yAxis: [{ position: 'none' }],
    width: 200,
    height: 130,
    showToolbar: true,
  } as const;

  const rangeButtons = [
    { label: 'Last quarter', value: () => ({ start: 75, end: 100 }) },
    { label: 'Last half', value: () => ({ start: 50, end: 100 }) },
    { label: 'All', value: null },
  ];

  it('selects the range button whose range matches `initialZoom` on first render', () => {
    render(
      <LineChartPro
        {...baselineProps}
        initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
        slotProps={{ toolbar: { rangeButtons } }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Last quarter' })).to.have.attribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Last half' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'All' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
  });

  it('selects the null-value button when `initialZoom` covers the full range', () => {
    render(<LineChartPro {...baselineProps} slotProps={{ toolbar: { rangeButtons } }} />);

    expect(screen.getByRole('button', { name: 'All' })).to.have.attribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Last quarter' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
  });

  it('selects no button when `initialZoom` does not match any button range', () => {
    render(
      <LineChartPro
        {...baselineProps}
        initialZoom={[{ axisId: 'x', start: 10, end: 60 }]}
        slotProps={{ toolbar: { rangeButtons } }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Last quarter' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Last half' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'All' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
  });

});
