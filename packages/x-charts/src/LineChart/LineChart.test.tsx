import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { LineChart } from '@mui/x-charts/LineChart';
import { screen } from '@mui/internal-test-utils';
import * as React from 'react';

describe('<LineChart />', () => {
  const { render } = createRenderer();
  describeConformance(
    <LineChart height={100} width={100} series={[{ data: [100, 200] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'div',
      render,
      muiName: 'MuiLineChart',
      testComponentPropWith: 'div',
      refInstanceof: window.HTMLDivElement,
      skip: [
        'componentProp',
        'componentsProp',
        'slotPropsProp',
        'slotPropsCallback',
        'slotsProp',
        'themeStyleOverrides',
        'themeVariants',
        'themeCustomPalette',
        'themeDefaultProps',
      ],
    }),
  );

  it('should render "No data to display" when axes are empty arrays', () => {
    render(<LineChart series={[]} width={100} height={100} xAxis={[]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });
  it('should support dataset with missing values', async () => {
    const dataset = [
      {
        version: 'data-0',
        a1: 500,
        a2: 100,
        unusedProp: 'test',
      },
      {
        version: 'data-1',
        a1: 600,
        a2: 200,
        unusedProp: ['test'],
      },
      {
        version: 'data-2',
        // Item with missing x-values
        // a1: 500,
        a2: 250,
        unusedProp: { test: 'value' },
      },
      {
        version: 'data-3',
        a1: null,
        // Missing y-value,
      },
      {
        version: 'data-4',
        a1: undefined,
        a2: null,
      },
    ];

    render(
      <LineChart
        dataset={dataset}
        xAxis={[{ dataKey: 'a1' }]}
        series={[{ dataKey: 'a2', label: 'Series A' }]}
        width={500}
        height={300}
      />,
    );

    const labelX = await screen.findByText('500');
    expect(labelX).toBeVisible();

    const labelY = await screen.findByText('250');
    expect(labelY).toBeVisible();
  });
});
