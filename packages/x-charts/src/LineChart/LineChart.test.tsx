import { createRenderer, waitFor } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import { screen } from '@mui/internal-test-utils';
import * as React from 'react';
import { vi } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isJSDOM } from 'test/utils/skipIf';
import { chartsSvgLayerClasses } from '../ChartsSvgLayer';
import { chartsTooltipClasses } from '../ChartsTooltip/chartsTooltipClasses';

const config = {
  dataset: [
    { x: 10, v1: 0, v2: 10 },
    { x: 20, v1: 5, v2: 8 },
    { x: 30, v1: 8, v2: 5 },
    { x: 40, v1: 10, v2: 0 },
  ],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  xAxis: [{ position: 'none' }],
  yAxis: [{ position: 'none' }],
  width: 400,
  height: 400,
} as const;

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

  describe('data-series', () => {
    it('should add data-series to area elements', () => {
      render(
        <LineChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', area: true },
            { dataKey: 'v2', id: 's2', area: true },
          ]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const areas = document.querySelectorAll<HTMLElement>(`.${lineClasses.area}`);

      expect(areas[0].getAttribute('data-series')).to.equal('s1');
      expect(areas[1].getAttribute('data-series')).to.equal('s2');
    });

    it('should add data-series to line elements', () => {
      render(
        <LineChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1' },
            { dataKey: 'v2', id: 's2' },
          ]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const lines = document.querySelectorAll<HTMLElement>(`.${lineClasses.line}`);

      expect(lines[0].getAttribute('data-series')).to.equal('s1');
      expect(lines[1].getAttribute('data-series')).to.equal('s2');
    });

    it('should add data-series to mark elements', () => {
      render(
        <LineChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', showMark: true },
            { dataKey: 'v2', id: 's2', showMark: true },
          ]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const marks = document.querySelectorAll<HTMLElement>(`.${lineClasses.mark}`);

      // First 4 marks belong to s1, next 4 to s2
      for (let i = 0; i < 4; i += 1) {
        expect(marks[i].getAttribute('data-series')).to.equal('s1');
      }
      for (let i = 4; i < 8; i += 1) {
        expect(marks[i].getAttribute('data-series')).to.equal('s2');
      }
    });
  });

  describe('data-index', () => {
    it('should add data-index to mark elements', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1', showMark: true }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const marks = document.querySelectorAll<HTMLElement>(`.${lineClasses.mark}`);

      expect(marks[0].getAttribute('data-index')).to.equal('0');
      expect(marks[1].getAttribute('data-index')).to.equal('1');
      expect(marks[2].getAttribute('data-index')).to.equal('2');
      expect(marks[3].getAttribute('data-index')).to.equal('3');
    });
  });

  describe('classes', () => {
    it('should apply MuiLineChart classes to area elements', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1', area: true }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const areas = document.querySelectorAll<HTMLElement>(`.${lineClasses.area}`);

      expect(areas.length).to.equal(1);
    });

    it('should apply MuiLineChart classes to line elements', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1' }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const lines = document.querySelectorAll<HTMLElement>(`.${lineClasses.line}`);

      expect(lines.length).to.equal(1);
    });

    it('should apply MuiLineChart classes to mark elements', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1', showMark: true }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const marks = document.querySelectorAll<HTMLElement>(`.${lineClasses.mark}`);

      expect(marks.length).to.equal(4);
    });
  });

  describe('Plot root elements', () => {
    it('should apply MuiLineChart-areaPlot class to AreaPlot root', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1', area: true }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const areaPlotRoot = document.querySelector<HTMLElement>(`.${lineClasses.areaPlot}`);

      expect(areaPlotRoot).not.to.equal(null);
    });

    it('should apply MuiLineChart-linePlot class to LinePlot root', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1' }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const linePlotRoot = document.querySelector<HTMLElement>(`.${lineClasses.linePlot}`);

      expect(linePlotRoot).not.to.equal(null);
    });

    it('should apply MuiLineChart-markPlot class to MarkPlot root', () => {
      render(
        <LineChart
          {...config}
          series={[{ dataKey: 'v1', id: 's1', showMark: true }]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
        />,
      );
      const markPlotRoot = document.querySelector<HTMLElement>(`.${lineClasses.markPlot}`);

      expect(markPlotRoot).not.to.equal(null);
    });
  });

  describe('theme style overrides', () => {
    it.skipIf(isJSDOM)('should apply MuiAreaPlot style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiAreaPlot: {
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
          <LineChart
            {...config}
            series={[{ dataKey: 'v1', id: 's1', area: true }]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </ThemeProvider>,
      );

      const area = document.querySelector<SVGElement>(`.${lineClasses.area}`);
      expect(area).not.to.equal(null);
      const areaPlotRoot = area!.parentElement;
      expect(areaPlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });

    it.skipIf(isJSDOM)('should apply MuiLinePlot style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiLinePlot: {
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
          <LineChart
            {...config}
            series={[{ dataKey: 'v1', id: 's1' }]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </ThemeProvider>,
      );

      const line = document.querySelector<SVGElement>(`.${lineClasses.line}`);
      expect(line).not.to.equal(null);
      const linePlotRoot = line!.parentElement;
      expect(linePlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });

    it.skipIf(isJSDOM)('should apply MuiMarkPlot style overrides from the theme', () => {
      const theme = createTheme({
        components: {
          MuiMarkPlot: {
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
          <LineChart
            {...config}
            series={[{ dataKey: 'v1', id: 's1', showMark: true }]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </ThemeProvider>,
      );

      const mark = document.querySelector<SVGElement>(`.${lineClasses.mark}`);
      expect(mark).not.to.equal(null);
      // mark -> series group <g> -> MarkPlotRoot
      const markPlotRoot = mark!.parentElement?.parentElement;
      expect(markPlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
    });
  });

  describe('area hit detection', () => {
    // These tests verify that hovering inside a filled area highlights the correct series.
    // They require pointer events which are not supported by JSDOM.

    const areaConfig = {
      width: 400,
      height: 400,
      margin: { top: 0, left: 0, bottom: 0, right: 0 },
      xAxis: [{ position: 'none' as const }],
      yAxis: [{ position: 'none' as const }],
      skipAnimation: true,
      hideLegend: true,
    };

    it.skipIf(isJSDOM)(
      'should highlight area series when pointer is inside the area',
      async () => {
        const onHighlightChange = vi.fn();
        const { container, user } = render(
          <div style={{ width: 400, height: 400 }}>
            <LineChart
              {...areaConfig}
              series={[
                {
                  id: 's1',
                  data: [80, 80, 80, 80],
                  area: true,
                },
              ]}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3], position: 'none' }]}
              yAxis={[{ min: 0, max: 100, position: 'none' }]}
              onHighlightChange={onHighlightChange}
            />
          </div>,
        );

        const svgLayer = container.querySelector(`.${chartsSvgLayerClasses.root}`)!;
        const layerContainer = svgLayer.parentElement!;

        // y=80 maps to pixel 80 (range [400,0]). Area spans from pixel 400 (y=0) to pixel 80 (y=80).
        // Point at pixel y=300 is inside the area.
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 300 },
        });

        expect(onHighlightChange).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 's1' }),
        );
      },
    );

    it.skipIf(isJSDOM)(
      'should fall back to closest-distance when pointer is outside all areas',
      async () => {
        const onHighlightChange = vi.fn();
        const { container, user } = render(
          <div style={{ width: 400, height: 400 }}>
            <LineChart
              {...areaConfig}
              series={[
                {
                  id: 's1',
                  data: [50, 50, 50, 50],
                  area: true,
                },
              ]}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3], position: 'none' }]}
              yAxis={[{ min: 0, max: 100, position: 'none' }]}
              onHighlightChange={onHighlightChange}
            />
          </div>,
        );

        const svgLayer = container.querySelector(`.${chartsSvgLayerClasses.root}`)!;
        const layerContainer = svgLayer.parentElement!;

        // y=50 maps to pixel 200. Area spans from pixel 400 to pixel 200.
        // Point at pixel y=50 is above the area, but the closest-distance
        // fallback should still find s1 (needed for tooltips to work).
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 50 },
        });

        expect(onHighlightChange).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 's1' }),
        );
      },
    );

    it.skipIf(isJSDOM)(
      'should highlight correct series in stacked areas',
      async () => {
        const onHighlightChange = vi.fn();
        const { container, user } = render(
          <div style={{ width: 400, height: 400 }}>
            <LineChart
              {...areaConfig}
              series={[
                {
                  id: 'bottom',
                  data: [30, 30, 30, 30],
                  area: true,
                  stack: 'total',
                },
                {
                  id: 'top',
                  data: [30, 30, 30, 30],
                  area: true,
                  stack: 'total',
                },
              ]}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3], position: 'none' }]}
              yAxis={[{ min: 0, max: 100, position: 'none' }]}
              onHighlightChange={onHighlightChange}
            />
          </div>,
        );

        const svgLayer = container.querySelector(`.${chartsSvgLayerClasses.root}`)!;
        const layerContainer = svgLayer.parentElement!;

        // Bottom series: 0–30, pixels 400–280.
        // Top series: 30–60, pixels 280–160.
        // Point at pixel y=350 (data ~12.5) should highlight bottom series.
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 350 },
        });

        expect(onHighlightChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 'bottom' }),
        );

        onHighlightChange.mockClear();

        // Point at pixel y=220 (data ~45) should highlight top series.
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 220 },
        });

        expect(onHighlightChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 'top' }),
        );
      },
    );

    it.skipIf(isJSDOM)(
      'should use closest-distance behavior for non-area line series',
      async () => {
        const onHighlightChange = vi.fn();
        const { container, user } = render(
          <div style={{ width: 400, height: 400 }}>
            <LineChart
              {...areaConfig}
              series={[
                {
                  id: 'line1',
                  data: [20, 20, 20, 20],
                },
                {
                  id: 'line2',
                  data: [80, 80, 80, 80],
                },
              ]}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3], position: 'none' }]}
              yAxis={[{ min: 0, max: 100, position: 'none' }]}
              onHighlightChange={onHighlightChange}
            />
          </div>,
        );

        const svgLayer = container.querySelector(`.${chartsSvgLayerClasses.root}`)!;
        const layerContainer = svgLayer.parentElement!;

        // line1 at y=20 → pixel 320. line2 at y=80 → pixel 80.
        // Point at pixel y=300 is closer to line1 (distance 20) than line2 (distance 220).
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 300 },
        });

        expect(onHighlightChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 'line1' }),
        );

        onHighlightChange.mockClear();

        // Point at pixel y=100 is closer to line2 (distance 20) than line1 (distance 220).
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 100 },
        });

        expect(onHighlightChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 'line2' }),
        );
      },
    );

    it.skipIf(isJSDOM)(
      'should prioritize area series over non-area series when pointer is inside area',
      async () => {
        const onHighlightChange = vi.fn();
        const { container, user } = render(
          <div style={{ width: 400, height: 400 }}>
            <LineChart
              {...areaConfig}
              series={[
                {
                  id: 'area-series',
                  data: [40, 40, 40, 40],
                  area: true,
                },
                {
                  id: 'line-series',
                  data: [20, 20, 20, 20],
                },
              ]}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3], position: 'none' }]}
              yAxis={[{ min: 0, max: 100, position: 'none' }]}
              onHighlightChange={onHighlightChange}
            />
          </div>,
        );

        const svgLayer = container.querySelector(`.${chartsSvgLayerClasses.root}`)!;
        const layerContainer = svgLayer.parentElement!;

        // Area series spans pixel 400 (y=0) to pixel 240 (y=40).
        // Line series is at pixel 320 (y=20).
        // Point at pixel y=350 is inside the area AND close to the line,
        // but area should take priority.
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 350 },
        });

        expect(onHighlightChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ type: 'line', seriesId: 'area-series' }),
        );
      },
    );

    it.skipIf(isJSDOM)(
      'should show item tooltip for area series when pointer is above all areas',
      async () => {
        // Two stacked area series: bottom (0–30) and top (30–60).
        // Y axis 0–100, height 400, so:
        //   bottom area: pixel 400 (y=0) to pixel 280 (y=30)
        //   top area:    pixel 280 (y=30) to pixel 160 (y=60)
        // Pointer at pixel y=50 is above both areas (data ~87.5).
        // The tooltip should still appear via closest-distance fallback,
        // showing the top series (closest to the pointer).
        const { container, user } = render(
          <div style={{ width: 400, height: 400 }}>
            <LineChart
              {...areaConfig}
              series={[
                {
                  id: 'bottom',
                  label: 'Bottom',
                  data: [30, 30, 30, 30],
                  area: true,
                  stack: 'total',
                },
                {
                  id: 'top',
                  label: 'Top',
                  data: [30, 30, 30, 30],
                  area: true,
                  stack: 'total',
                },
              ]}
              xAxis={[{ scaleType: 'point', data: [0, 1, 2, 3], position: 'none' }]}
              yAxis={[{ min: 0, max: 100, position: 'none' }]}
              slotProps={{ tooltip: { trigger: 'item' } }}
            />
          </div>,
        );

        const svgLayer = container.querySelector(`.${chartsSvgLayerClasses.root}`)!;
        const layerContainer = svgLayer.parentElement!;

        // Pointer above both areas — closest-distance fallback picks the top series.
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 50 },
        });

        await waitFor(() => {
          const tooltip = document.querySelector(`.${chartsTooltipClasses.root}`);
          expect(tooltip).not.toEqual(null);
          expect(tooltip!.textContent).toContain('Top');
        });

        // Pointer inside the bottom area (pixel y=350, data ~12.5).
        // Area detection (pass 1) should pick the bottom series.
        await user.pointer({
          target: layerContainer,
          coords: { clientX: 200, clientY: 350 },
        });

        await waitFor(() => {
          const tooltip = document.querySelector(`.${chartsTooltipClasses.root}`);
          expect(tooltip).not.toEqual(null);
          expect(tooltip!.textContent).toContain('Bottom');
        });
      },
    );
  });
});
