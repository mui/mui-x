import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { pieArcClasses, PieChart } from '@mui/x-charts/PieChart';
import { expect } from 'chai';
import { waitForElementToBeRemoved } from '@mui/internal-test-utils';

describe('<PieChart />', () => {
  const { render } = createRenderer();
  describeConformance(
    <PieChart
      height={100}
      width={100}
      series={[
        {
          data: [
            { id: 'A', value: 100 },
            { id: 'B', value: 200 },
          ],
        },
      ]}
    />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiPieChart',
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

  it('should render "No Data" overlay when series prop is an empty array', () => {
    render(<PieChart height={100} width={100} series={[]} />);

    const noDataOverlay = screen.getByText('No data to display');
    expect(noDataOverlay).toBeVisible();
  });

  it('should hide tooltip if the item the tooltip was showing is removed', async () => {
    const { rerender, user } = render(
      <PieChart height={100} width={100} series={[{ data: [{ id: 0, value: 10 }] }]} hideLegend />,
    );

    const pieArc = document.querySelector(`.${pieArcClasses.root}`)!;
    await user.hover(pieArc);

    expect(await screen.findByRole('tooltip')).toBeVisible();
    const tooltip = screen.getByRole('tooltip');

    rerender(<PieChart height={100} width={100} series={[{ data: [] }]} hideLegend />);

    await waitForElementToBeRemoved(tooltip);
  });

  it('should hide tooltip if the series of the item the tooltip was showing is removed', async () => {
    const { rerender, user } = render(
      <PieChart height={100} width={100} series={[{ data: [{ id: 0, value: 10 }] }]} hideLegend />,
    );

    const pieArc = document.querySelector(`.${pieArcClasses.root}`)!;
    await user.hover(pieArc);

    expect(await screen.findByRole('tooltip')).toBeVisible();
    const tooltip = screen.getByRole('tooltip');

    rerender(<PieChart height={100} width={100} series={[]} hideLegend />);

    await waitForElementToBeRemoved(tooltip);
  });
});
