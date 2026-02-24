import { createRenderer, screen, act } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/describeConformance';
import { pieArcClasses, PieChart } from '@mui/x-charts/PieChart';

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
      inheritComponent: 'div',
      render,
      muiName: 'MuiPieChart',
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

  it('should show focus indicator when navigating with keyboard', async () => {
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

    // by default does not show focus indicator
    expect(container.querySelector(`.${pieArcClasses.focusIndicator}`)).not.toBeTruthy();

    // focus the chart
    await act(async () => screen.getByTestId('chart-keyboard-navigation').focus());

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

  it('should only show focus indicator for the focused series', async () => {
    const { container, user } = render(
      <PieChart
        enableKeyboardNavigation
        data-testid="chart-focus-series"
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

    // focus the chart
    await act(async () => screen.getByTestId('chart-focus-series').focus());

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
