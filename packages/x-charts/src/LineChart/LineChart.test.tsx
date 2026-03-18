import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import { screen } from '@mui/internal-test-utils';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isJSDOM } from 'test/utils/skipIf';

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
});
