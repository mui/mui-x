import { createRenderer, screen } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/describeConformance';
import { pieArcClasses, PieChart } from '@mui/x-charts/PieChart';
import { isJSDOM } from 'test/utils/skipIf';
import { CHART_SELECTOR } from '../tests/constants';

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

    rerender(<PieChart height={100} width={100} series={[{ data: [] }]} hideLegend />);

    expect(screen.queryByRole('tooltip')).to.equal(null);
  });

  it('should hide tooltip if the series of the item the tooltip was showing is removed', async () => {
    const { rerender, user } = render(
      <PieChart height={100} width={100} series={[{ data: [{ id: 0, value: 10 }] }]} hideLegend />,
    );

    const pieArc = document.querySelector(`.${pieArcClasses.root}`)!;
    await user.hover(pieArc);

    expect(await screen.findByRole('tooltip')).toBeVisible();

    rerender(<PieChart height={100} width={100} series={[]} hideLegend />);

    expect(screen.queryByRole('tooltip')).to.equal(null);
  });

  it.skipIf(isJSDOM)('should show focus indicator when navigating with keyboard', async () => {
    const { container, user } = render(
      <PieChart
        enableKeyboardNavigation
        data-testid="chart-keyboard-navigation"
        height={100}
        width={100}
        series={[
          {
            data: [
              { id: 0, value: 10 },
              { id: 1, value: 20 },
            ],
          },
        ]}
        hideLegend
      />,
    );

    const svg = container.querySelector<SVGSVGElement>(CHART_SELECTOR)!;

    // by default does not show focus indicator
    expect(container.querySelector(`.${pieArcClasses.focusIndicator}`)).not.toBeTruthy();

    // focus the chart
    await user.click(svg);

    // Focus the first arc
    await user.keyboard('{ArrowRight}');
    expect(
      container.querySelector(`.${pieArcClasses.focusIndicator}.MuiPieArc-data-index-0`),
    ).toBeTruthy();

    // Focus the second arc
    await user.keyboard('{ArrowRight}');
    expect(
      container.querySelector(`.${pieArcClasses.focusIndicator}.MuiPieArc-data-index-1`),
    ).toBeTruthy();
  });

  it.skipIf(isJSDOM)('should only show focus indicator for the focused series', async () => {
    const { container, user } = render(
      <PieChart
        enableKeyboardNavigation
        height={400}
        width={400}
        series={[
          {
            id: 'series-1',
            data: [
              { id: 0, value: 10 },
              { id: 1, value: 20 },
            ],
            innerRadius: 0,
            outerRadius: 80,
          },
          {
            id: 'series-2',
            data: [
              { id: 0, value: 30 },
              { id: 1, value: 40 },
            ],
            innerRadius: 100,
            outerRadius: 180,
          },
        ]}
        hideLegend
      />,
    );

    const svg = container.querySelector<SVGSVGElement>(CHART_SELECTOR)!;

    // focus the chart
    await user.click(svg);

    // Focus the first arc of series-1
    await user.keyboard('{ArrowRight}');

    // Should only have one focus indicator
    const focusIndicators = container.querySelectorAll(`.${pieArcClasses.focusIndicator}`);
    expect(focusIndicators.length).to.equal(1);

    // Focus the second arc of series-1
    await user.keyboard('{ArrowRight}');

    // Should still only have one focus indicator
    const focusIndicators2 = container.querySelectorAll(`.${pieArcClasses.focusIndicator}`);
    expect(focusIndicators2.length).to.equal(1);

    // Move to series-2
    await user.keyboard('{ArrowRight}');

    // Should still only have one focus indicator
    const focusIndicators3 = container.querySelectorAll(`.${pieArcClasses.focusIndicator}`);
    expect(focusIndicators3.length).to.equal(1);
  });
});
