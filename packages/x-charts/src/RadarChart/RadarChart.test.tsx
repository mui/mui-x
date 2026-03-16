import { createRenderer, screen, waitFor } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { RadarChart, type RadarChartProps } from '@mui/x-charts/RadarChart';
import { vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { chartsTooltipClasses } from '../ChartsTooltip';
import { chartsSvgLayerClasses } from '../ChartsSvgLayer';

const radarConfig: RadarChartProps = {
  height: 100,
  width: 100,
  margin: 0,
  series: [{ data: [10, 15, 20, 25] }],
  radar: { metrics: ['A', 'B', 'C', 'D'] },
};

describe('<RadarChart />', () => {
  const { render } = createRenderer();
  describeConformance(<RadarChart {...radarConfig} />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiRadarChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
  }));

  it('should render "No Data" overlay when series prop is an empty array', () => {
    render(<RadarChart height={100} width={100} series={[]} radar={{ metrics: [] }} />);

    const noDataOverlay = screen.getByText('No data to display');
    expect(noDataOverlay).toBeVisible();
  });

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)('should call onHighlightChange', async () => {
    const onHighlightChange = vi.fn();
    const { user } = render(<RadarChart {...radarConfig} onHighlightChange={onHighlightChange} />);

    const path = document.querySelector<HTMLElement>('svg .MuiRadarSeriesPlot-area')!;
    await user.pointer({ target: path });

    expect(onHighlightChange.mock.calls.length).to.equal(1);
  });

  it.skipIf(isJSDOM)('should highlight axis on hover', async () => {
    const { user, container } = render(
      <div
        style={{
          margin: -8, // Removes the body default margins
          width: 100,
          height: 100,
        }}
      >
        <RadarChart {...radarConfig} />
      </div>,
    );

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;
    await user.pointer([{ target: layerContainer, coords: { clientX: 45, clientY: 45 } }]);

    expect(document.querySelector<HTMLElement>('svg .MuiRadarAxisHighlight-root')!).toBeVisible();
  });

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should show tooltip on keyboard navigation and update on arrow keys',
    async () => {
      const cellSelector = `.${chartsTooltipClasses.cell}, .${chartsTooltipClasses.root} caption`;

      const { user } = render(
        <RadarChart
          {...radarConfig}
          radar={{ metrics: ['A', 'B', 'C'] }}
          series={[
            { data: [10, 15, 20], label: 'Series 1' },
            { data: [11, 16, 21], label: 'Series 2' },
          ]}
          slotProps={{ tooltip: { trigger: 'item' } }}
        />,
      );

      // Focus the chart
      await user.keyboard('{Tab}');

      // Navigate to the first item (dataIndex=0)
      await user.keyboard('[ArrowRight]');

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        expect(cells.length).to.be.greaterThan(0);
        const content = [...cells].map((cell) => cell.textContent);
        // Caption is the series label, then a row with metric label + value
        expect(content).to.deep.equal(['Series 1', 'A', '10']);
      });

      // Navigate to the second item (dataIndex=1)
      await user.keyboard('[ArrowRight]');

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const content = [...cells].map((cell) => cell.textContent);
        expect(content).to.deep.equal(['Series 1', 'B', '15']);
      });

      // Navigate to the third item (dataIndex=2)
      await user.keyboard('[ArrowRight]');

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const content = [...cells].map((cell) => cell.textContent);
        expect(content).to.deep.equal(['Series 1', 'C', '20']);
      });

      // Back to the first element (dataIndex=0)
      await user.keyboard('[ArrowRight]');

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const content = [...cells].map((cell) => cell.textContent);
        expect(content).to.deep.equal(['Series 1', 'A', '10']);
      });

      // Navigate back with ArrowLeft to the third item (dataIndex=2)
      await user.keyboard('[ArrowLeft]');

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const content = [...cells].map((cell) => cell.textContent);
        expect(content).to.deep.equal(['Series 1', 'C', '20']);
      });

      // switch series with ArrowUp
      await user.keyboard('[ArrowUp]');

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const content = [...cells].map((cell) => cell.textContent);
        expect(content).to.deep.equal(['Series 2', 'C', '21']);
      });
    },
  );
});
