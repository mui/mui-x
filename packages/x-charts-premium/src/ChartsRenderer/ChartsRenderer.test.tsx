import { vi, describe, it, expect } from 'vitest';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import { screen } from '@mui/internal-test-utils';
import { colorPaletteLookup } from './colors';

describe('<ChartsRenderer />', () => {
  const { render } = createRenderer();

  it('should not render anything if the chart type is not supported', () => {
    render(
      <div data-testid="container">
        <ChartsRenderer dimensions={[]} values={[]} chartType="unsupported" configuration={{}} />
      </div>,
    );

    expect(screen.queryByTestId('container')!.querySelector('svg')).to.equal(null);
  });

  it('should render a bar chart if the chart type is supported', () => {
    render(
      <div data-testid="container">
        <ChartsRenderer dimensions={[]} values={[]} chartType="bar" configuration={{}} />
      </div>,
    );

    expect(screen.queryByTestId('container')!.querySelector('svg')).not.to.equal(null);
  });

  it('should pass the rendering to the onRender callback', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    expect(onRenderSpy.mock.lastCall?.[0]).to.equal('line');
  });

  it('should compute props for the chart', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.mock.lastCall?.[1];
    expect(props.colors).to.equal(colorPaletteLookup.get('rainbowSurgePalette'));
  });

  it('should override the props if the configuration has an updated value', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{
            colors: 'mangoFusionPalette',
          }}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.mock.lastCall?.[1];
    expect(props.colors).to.equal(colorPaletteLookup.get('mangoFusionPalette'));
  });

  it('should place dimensions and values to the correct place in the props', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[{ id: 'dimension', label: 'Dimension', data: ['A'] }]}
          values={[{ id: 'value', label: 'Value', data: [1, 2, 3] }]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.mock.lastCall?.[1];
    expect(props.series[0].data).to.deep.equal([1, 2, 3]);
  });

  describe('Excel export', () => {
    it('offers the export through the toolbar, which the chart cannot do on its own', () => {
      const onRenderSpy = vi.fn();
      render(
        <div data-testid="container">
          <ChartsRenderer
            dimensions={[]}
            values={[]}
            chartType="bar"
            configuration={{ showToolbar: true }}
            onRender={onRenderSpy}
          />
        </div>,
      );

      const props = onRenderSpy.mock.lastCall?.[1];
      expect(props.slots.toolbar).not.to.equal(undefined);
      expect(typeof props.slotProps.toolbar.onExcelExport).to.equal('function');
    });

    it('passes the Data Grid export to the toolbar as a second entry', () => {
      const onRenderSpy = vi.fn();
      const exportDataAsExcel = vi.fn(async () => {});
      render(
        <div data-testid="container">
          <ChartsRenderer
            dimensions={[]}
            values={[]}
            chartType="bar"
            configuration={{ showToolbar: true }}
            exportDataAsExcel={exportDataAsExcel}
            onRender={onRenderSpy}
          />
        </div>,
      );

      const props = onRenderSpy.mock.lastCall?.[1];
      expect(props.slotProps.toolbar.onDataGridExcelExport).to.equal(exportDataAsExcel);
      expect(typeof props.slotProps.toolbar.onExcelExport).to.equal('function');
    });

    it('exports the grid selection, keeping a column per dimension', async () => {
      const onRenderSpy = vi.fn();
      render(
        <div data-testid="container">
          <ChartsRenderer
            dimensions={[
              { id: 'country', label: 'Country', data: ['France', 'France'] },
              { id: 'city', label: 'City', data: ['Paris', 'Paris'] },
            ]}
            values={[{ id: 'visits', label: 'Visits', data: [1, 2] }]}
            chartType="column"
            configuration={{ showToolbar: true }}
            onRender={onRenderSpy}
          />
        </div>,
      );

      // The axis labels the chart renders are mangled, which is why the export reads the selection.
      const props = onRenderSpy.mock.lastCall?.[1];
      expect(props.xAxis[0].data).to.deep.equal([
        ['France', 'Paris'],
        ['France', 'Paris'],
      ]);

      const { getGridChartsExcelTables } = await import('../internals/excelExport');
      const [table] = getGridChartsExcelTables(
        [
          { id: 'country', label: 'Country', data: ['France', 'France'] },
          { id: 'city', label: 'City', data: ['Paris', 'Paris'] },
        ],
        [{ id: 'visits', label: 'Visits', data: [1, 2] }],
      );

      expect(table.columns.map((column) => column.header)).to.deep.equal([
        'Country',
        'City',
        'series',
        'value',
      ]);
      expect(table.rows).to.deep.equal([
        { dimension0: 'France', dimension1: 'Paris', series: 'Visits', value: 1 },
        { dimension0: 'France', dimension1: 'Paris', series: 'Visits', value: 2 },
      ]);
    });
  });
});
