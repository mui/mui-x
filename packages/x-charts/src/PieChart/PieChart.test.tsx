import { createRenderer, screen } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { pieArcClasses, pieClasses, PieChart } from '@mui/x-charts/PieChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isJSDOM } from 'test/utils/skipIf';
import { chartsSvgLayerClasses } from '../ChartsSvgLayer';

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

    const pieArc = document.querySelector(`.${pieClasses.arc}`)!;
    await user.hover(pieArc);

    expect(await screen.findByRole('tooltip')).toBeVisible();

    rerender(<PieChart height={100} width={100} series={[{ data: [] }]} hideLegend />);

    expect(screen.queryByRole('tooltip')).to.equal(null);
  });

  it('should hide tooltip if the series of the item the tooltip was showing is removed', async () => {
    const { rerender, user } = render(
      <PieChart height={100} width={100} series={[{ data: [{ id: 0, value: 10 }] }]} hideLegend />,
    );

    const pieArc = document.querySelector(`.${pieClasses.arc}`)!;
    await user.hover(pieArc);

    expect(await screen.findByRole('tooltip')).toBeVisible();

    rerender(<PieChart height={100} width={100} series={[]} hideLegend />);

    expect(screen.queryByRole('tooltip')).to.equal(null);
  });

  describe('classes', () => {
    it('should apply root class to the pie plot', () => {
      const { container } = render(
        <PieChart
          height={100}
          width={100}
          series={[{ data: [{ id: 'A', value: 100 }] }]}
          hideLegend
        />,
      );

      expect(container.querySelector(`.${pieClasses.root}`)).toBeTruthy();
    });

    it('should apply series class to each series group', () => {
      const { container } = render(
        <PieChart
          height={100}
          width={100}
          series={[{ data: [{ id: 'A', value: 100 }] }, { data: [{ id: 'B', value: 200 }] }]}
          hideLegend
        />,
      );

      const seriesGroups = container.querySelectorAll(`.${pieClasses.series}`);
      expect(seriesGroups.length).to.equal(2);
    });

    it('should apply arc class to each pie arc element', () => {
      const { container } = render(
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
          hideLegend
        />,
      );

      const arcs = container.querySelectorAll(`.${pieClasses.arc}`);
      expect(arcs.length).to.equal(2);
    });

    it('should apply arcLabel class to each pie arc label element', () => {
      const { container } = render(
        <PieChart
          height={100}
          width={100}
          series={[
            {
              arcLabel: 'value',
              data: [
                { id: 'A', value: 100 },
                { id: 'B', value: 200 },
              ],
            },
          ]}
          hideLegend
        />,
      );

      const arcLabels = container.querySelectorAll(`.${pieClasses.arcLabel}`);
      expect(arcLabels.length).to.equal(2);
    });

    it('should apply focusIndicator class to the focused arc', async () => {
      const { container, user } = render(
        <PieChart
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

      const layerContainer = container.querySelector<HTMLElement>(
        `.${chartsSvgLayerClasses.root}`,
      )!.parentElement!;

      // by default does not show focus indicator
      expect(container.querySelector(`.${pieClasses.focusIndicator}`)).not.toBeTruthy();

      // focus the chart and navigate
      await user.click(layerContainer);
      await user.keyboard('{ArrowRight}');

      expect(container.querySelector(`.${pieClasses.focusIndicator}`)).toBeTruthy();
    });
  });

  it('should show focus indicator when navigating with keyboard', async () => {
    const { container, user } = render(
      <PieChart
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

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    // by default does not show focus indicator
    expect(container.querySelector(`.${pieArcClasses.focusIndicator}`)).not.toBeTruthy();

    // focus the chart
    await user.click(layerContainer);

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

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    // focus the chart
    await user.click(layerContainer);

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

  describe('theme style overrides', () => {
    it.skipIf(isJSDOM)('should apply MuiPieArcPlot style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiPieArcPlot: {
            styleOverrides: {
              root: {
                strokeDashoffset: 10,
              },
            },
          },
        },
      });

      render(
        <ThemeProvider theme={theme}>
          <PieChart
            height={100}
            width={100}
            series={[{ data: [{ id: 'A', value: 100 }] }]}
            hideLegend
          />
        </ThemeProvider>,
      );

      const arc = document.querySelector<SVGElement>(`.${pieClasses.arc}`);
      expect(arc).not.to.equal(null);
      const pieArcPlotRoot = arc!.parentElement;
      expect(pieArcPlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });

    it.skipIf(isJSDOM)('should apply MuiPieArcLabelPlot style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiPieArcLabelPlot: {
            styleOverrides: {
              root: {
                strokeDashoffset: 10,
              },
            },
          },
        },
      });

      render(
        <ThemeProvider theme={theme}>
          <PieChart
            height={100}
            width={100}
            series={[{ arcLabel: 'value', data: [{ id: 'A', value: 100 }] }]}
            hideLegend
          />
        </ThemeProvider>,
      );

      const arcLabel = document.querySelector<SVGElement>(`.${pieClasses.arcLabel}`);
      expect(arcLabel).not.to.equal(null);
      const pieArcLabelPlotRoot = arcLabel!.parentElement;
      expect(pieArcLabelPlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });
  });
});
