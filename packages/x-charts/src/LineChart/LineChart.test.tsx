import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { LineChart } from '@mui/x-charts/LineChart';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';

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
});
