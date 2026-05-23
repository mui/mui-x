import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { ScatterChart, scatterClasses } from '@mui/x-charts/ScatterChart';
import { isJSDOM } from 'test/utils/skipIf';
import { chartsSvgLayerClasses } from '../ChartsSvgLayer';

const cellSelector = '.MuiChartsTooltip-root td, .MuiChartsTooltip-root th';

describe('<ScatterChart />', () => {
  const { render } = createRenderer();

  describeConformance(
    <ScatterChart
      height={100}
      width={100}
      series={[
        {
          data: [
            { id: 'A', x: 100, y: 10 },
            { id: 'B', x: 200, y: 20 },
          ],
        },
      ]}
    />,
    () => ({
      classes: {} as any,
      inheritComponent: 'div',
      render,
      muiName: 'MuiScatterChart',
      testComponentPropWith: 'div',
      refInstanceof: window.HTMLDivElement,
    }),
  );

  const config = {
    dataset: [
      { id: 1, x: 0, y: 10 },
      { id: 2, x: 10, y: 10 },
      { id: 3, x: 10, y: 0 },
      { id: 4, x: 0, y: 0 },
      { id: 5, x: 5, y: 5 },
    ],
    margin: 0,
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 100,
  } as const;

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)('should show the tooltip without errors in default config', async () => {
    const { user, container } = render(
      <div
        style={{
          margin: -8, // Removes the body default margins
          width: 100,
          height: 100,
        }}
      >
        <ScatterChart
          {...config}
          series={[{ id: 's1', label: 'series', data: config.dataset }]}
          hideLegend
        />
      </div>,
    );
    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;
    await user.pointer([
      // Set tooltip position voronoi value
      { target: layerContainer, coords: { clientX: 10, clientY: 10 } },
    ]);

    let cells: NodeListOf<HTMLElement> = [] as any;

    await screen.findByRole('tooltip');
    cells = document.querySelectorAll<HTMLElement>(cellSelector);
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['series', '(0, 10)']);

    await user.pointer([
      // Set tooltip position voronoi value
      { target: layerContainer, coords: { clientX: 40, clientY: 60 } },
    ]);

    await screen.findByRole('tooltip');
    cells = document.querySelectorAll<HTMLElement>(cellSelector);
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['series', '(5, 5)']);
  });

  it.skipIf(isJSDOM)('should show the tooltip without errors with voronoi disabled', async () => {
    const { user } = render(
      <div
        style={{
          margin: -8, // Removes the body default margins
          width: 100,
          height: 100,
        }}
      >
        <ScatterChart {...config} disableHitArea series={[{ id: 's1', data: config.dataset }]} />
      </div>,
    );
    const marks = document.querySelectorAll<HTMLElement>('circle');

    await user.pointer([
      // Only to set the tooltip position
      { target: marks[0] },
    ]);

    let cells: NodeListOf<HTMLElement> = [] as any;

    await screen.findByRole('tooltip');
    cells = document.querySelectorAll<HTMLElement>(cellSelector);
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', '(0, 10)']);

    await user.pointer([
      // Only to set the tooltip position
      { target: marks[4] },
    ]);

    await screen.findByRole('tooltip');
    cells = document.querySelectorAll<HTMLElement>(cellSelector);
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', '(5, 5)']);
  });

  it('should support dataset with missing values', async () => {
    // x from 500 to 600
    // y from 100 to 200
    const dataset = [
      {
        version: 'data-0',
        a1: 500,
        a2: 100,
      },
      {
        version: 'data-1',
        a1: 600,
        a2: 200,
      },
      {
        version: 'data-2',
        // Item with missing x-values
        // a1: 500,
        a2: 200,
      },
      {
        version: 'data-2',
        // Item with missing y-values
        a1: 500,
        // a2: 200,
      },
    ];

    render(
      <ScatterChart
        dataset={dataset}
        series={[{ datasetKeys: { id: 'version', x: 'a1', y: 'a2' }, label: 'Series A' }]}
        width={500}
        height={300}
      />,
    );

    const labelX = await screen.findByText('100');
    expect(labelX).toBeVisible();

    const labelY = await screen.findByText('600');
    expect(labelY).toBeVisible();
  });

  it('should render "No data to display" when axes are empty arrays', () => {
    render(<ScatterChart series={[]} width={100} height={100} xAxis={[]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  describe('classes', () => {
    it('should apply scatterClasses.root to the ScatterPlot root element', () => {
      render(<ScatterChart {...config} series={[{ id: 's1', data: config.dataset }]} hideLegend />);
      const root = document.querySelector<HTMLElement>(`.${scatterClasses.root}`);

      expect(root).not.to.equal(null);
    });

    it('should apply scatterClasses.series to series group elements', () => {
      render(<ScatterChart {...config} series={[{ id: 's1', data: config.dataset }]} hideLegend />);
      const seriesGroups = document.querySelectorAll<HTMLElement>(`.${scatterClasses.series}`);

      expect(seriesGroups.length).to.equal(1);
    });

    it('should apply scatterClasses.marker to scatter marker elements', () => {
      render(<ScatterChart {...config} series={[{ id: 's1', data: config.dataset }]} hideLegend />);
      const markers = document.querySelectorAll<HTMLElement>(`.${scatterClasses.marker}`);

      expect(markers.length).to.equal(5);
    });
  });

  describe('markerLabel', () => {
    const labelDataset = [
      { id: 'A', x: 1, y: 1, label: 'Alpha' },
      { id: 'B', x: 2, y: 2, label: 'Beta' },
      { id: 'C', x: 3, y: 3 },
    ];

    it('renders per-point labels when `markerLabel` is "label"', () => {
      render(
        <ScatterChart
          width={200}
          height={200}
          series={[{ id: 's1', data: labelDataset, markerLabel: 'label' }]}
          hideLegend
        />,
      );

      expect(screen.getByText('Alpha')).toBeVisible();
      expect(screen.getByText('Beta')).toBeVisible();
      expect(screen.queryByText('Gamma')).to.equal(null);
    });

    it('skips the label when `markerLabel` is "label" and the point has no label', () => {
      render(
        <ScatterChart
          width={200}
          height={200}
          series={[{ id: 's1', data: labelDataset, markerLabel: 'label' }]}
          hideLegend
        />,
      );

      const labels = document.querySelectorAll(`.${scatterClasses.label}`);
      expect(labels.length).to.equal(2);
    });

    it('invokes the `markerLabel` function with item and marker context', () => {
      const markerLabel = vi.fn(
        ({ value }: { value: { x: number; y: number } }) => `point-${value.x}`,
      );

      render(
        <ScatterChart
          width={200}
          height={200}
          series={[{ id: 's1', data: labelDataset, markerSize: 7, markerLabel }]}
          hideLegend
        />,
      );

      expect(markerLabel).toHaveBeenCalled();
      const firstCall = markerLabel.mock.calls[0] as unknown as [
        { seriesId: string; dataIndex: number; value: { x: number; y: number } },
        { marker: { size: number } },
      ];
      expect(firstCall[0]).to.deep.include({ seriesId: 's1', dataIndex: 0 });
      expect(firstCall[0].value).to.deep.include({ x: 1, y: 1 });
      expect(firstCall[1]).to.deep.equal({ marker: { size: 7 } });

      const labelTexts = [
        ...document.querySelectorAll<SVGTextElement>(`.${scatterClasses.label}`),
      ].map((node) => node.textContent);
      expect(labelTexts).to.deep.equal(['point-1', 'point-2', 'point-3']);
    });

    it('skips the label when the `markerLabel` function returns null', () => {
      render(
        <ScatterChart
          width={200}
          height={200}
          series={[
            {
              id: 's1',
              data: labelDataset,
              markerLabel: ({ dataIndex }) => (dataIndex === 1 ? 'kept' : null),
            },
          ]}
          hideLegend
        />,
      );

      const labels = document.querySelectorAll(`.${scatterClasses.label}`);
      expect(labels.length).to.equal(1);
      expect(screen.getByText('kept')).toBeVisible();
    });

    it('reads the label from `datasetKeys.label`', () => {
      render(
        <ScatterChart
          width={200}
          height={200}
          dataset={[
            { ax: 1, ay: 1, name: 'one' },
            { ax: 2, ay: 2, name: 'two' },
          ]}
          series={[
            {
              id: 's1',
              datasetKeys: { x: 'ax', y: 'ay', label: 'name' },
              markerLabel: 'label',
            },
          ]}
          hideLegend
        />,
      );

      expect(screen.getByText('one')).toBeVisible();
      expect(screen.getByText('two')).toBeVisible();
    });

    it('applies `scatterClasses.seriesLabels` to the per-series label group', () => {
      render(
        <ScatterChart
          width={200}
          height={200}
          series={[{ id: 's1', data: labelDataset, markerLabel: 'label' }]}
          hideLegend
        />,
      );

      const groups = document.querySelectorAll(`.${scatterClasses.seriesLabels}`);
      expect(groups.length).to.equal(1);
    });

    it('allows the rendered component to be overridden via `slots.markerLabel`', () => {
      render(
        <ScatterChart
          width={200}
          height={200}
          series={[{ id: 's1', data: labelDataset, markerLabel: 'label' }]}
          slots={{
            markerLabel: ({ children, x, y }) => (
              <text data-testid="custom-label" x={x} y={y}>
                custom:{children}
              </text>
            ),
          }}
          hideLegend
        />,
      );

      const labels = screen.getAllByTestId('custom-label');
      expect(labels.length).to.equal(2);
      expect(labels[0].textContent).to.equal('custom:Alpha');
    });
  });
});
