import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';
import { useYAxis } from '@mui/x-charts/hooks';
import { chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe('<BarChart />', () => {
  const { render } = createRenderer();

  describeConformance(
    <BarChart height={100} width={100} series={[{ data: [100, 200] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'div',
      render,
      muiName: 'MuiBarChart',
      testComponentPropWith: 'div',
      refInstanceof: window.HTMLDivElement,
    }),
  );

  it('should render "No data to display" when axes are empty arrays', () => {
    render(<BarChart series={[]} width={100} height={100} xAxis={[]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  it('should render "No data to display" when series are empty and axes are not empty arrays', () => {
    render(<BarChart series={[]} width={100} height={100} xAxis={[{ data: ['A'] }]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  it('show `barLabel` from series', () => {
    render(
      <BarChart
        series={[{ data: [1], barLabel: () => 'Bar label from series' }]}
        width={100}
        height={100}
        xAxis={[{ data: ['A'] }]}
        yAxis={[]}
      />,
    );

    expect(screen.getByText('Bar label from series')).toBeVisible();
  });

  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 400, height: 400 }}>{children}</div>
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should hide tooltip if the item the tooltip was showing is removed',
    async () => {
      const { setProps, user } = render(
        <BarChart
          height={400}
          width={400}
          series={[{ data: [10] }]}
          xAxis={[{ data: ['A'] }]}
          hideLegend
          skipAnimation
        />,
        { wrapper },
      );

      const bar = document.querySelector(`.${barClasses.element}`)!;
      await user.pointer({ target: bar, coords: { x: 200, y: 200 } });

      expect(await screen.findByRole('tooltip')).toBeVisible();

      setProps({
        series: [{ data: [] }],
        xAxis: [{ data: [] }],
      });

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should hide tooltip if the series of the item the tooltip was showing is removed',
    async () => {
      const { setProps, user } = render(
        <BarChart
          height={400}
          width={400}
          series={[{ data: [10] }]}
          xAxis={[{ data: ['A'] }]}
          hideLegend
          skipAnimation
        />,
        { wrapper },
      );

      const bar = document.querySelector(`.${barClasses.element}`)!;

      await user.pointer({ target: bar, coords: { x: 200, y: 200 } });

      expect(await screen.findByRole('tooltip')).toBeVisible();

      setProps({
        series: [],
        xAxis: [],
      });

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should highlight element on pointer enter and remove highlight on pointer leave',
    async () => {
      const { user } = render(
        <BarChart
          height={400}
          width={400}
          series={[
            { data: [5, 10], highlightScope: { highlight: 'item', fade: 'global' } },
            { data: [1, 2] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          hideLegend
          skipAnimation
        />,
        { wrapper },
      );

      const bars = document.querySelectorAll(`.${barClasses.element}`);

      const barRect = bars[0].getBoundingClientRect();
      await user.pointer({
        target: bars[0],
        coords: {
          clientX: barRect.left + barRect.width / 2,
          clientY: barRect.top + barRect.height / 2,
        },
      });

      expect([...bars].map((b) => b.getAttribute('data-highlighted'))).to.deep.equal([
        'true',
        null,
        null,
        null,
      ]);
      expect([...bars].map((b) => b.getAttribute('data-faded'))).to.deep.equal([
        null,
        'true',
        'true',
        'true',
      ]);
    },
  );

  it('should support axis valueGetter', async () => {
    const dataset = [
      { date: '2025-01-01', value: 100 },
      { date: '2025-02-01', value: 200 },
      { date: '2025-03-01', value: 300 },
    ];

    render(
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: 'band',
            valueGetter: (item) =>
              new Date(item.date as string).toLocaleDateString('en-US', { month: 'short' }),
          },
        ]}
        series={[{ dataKey: 'value' }]}
        width={500}
        height={300}
      />,
    );

    const label = await screen.findByText('Jan');
    expect(label).toBeVisible();
  });

  it('should support series valueGetter', async () => {
    const dataset = [
      { version: 'v1', count: '100' },
      { version: 'v2', count: '200' },
    ];

    render(
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: 'version' }]}
        series={[
          {
            valueGetter: (item) => parseFloat(item.count as string),
            label: 'Count',
          },
        ]}
        width={500}
        height={300}
      />,
    );

    const label = await screen.findByText('v1');
    expect(label).toBeVisible();
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
        a2: 200,
        unusedProp: { test: 'value' },
      },
      {
        version: 'data-3',
        a1: null,
      },
      {
        version: 'data-4',
        a1: undefined,
      },
    ];

    render(
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: 'version' }]}
        series={[{ dataKey: 'a1', label: 'Series A' }]}
        width={500}
        height={300}
      />,
    );

    const labelX = await screen.findByText('data-3');
    expect(labelX).toBeVisible();

    const labelY = await screen.findByText('600');
    expect(labelY).toBeVisible();
  });

  it('should handle hidden series', async () => {
    const dataset = [
      {
        version: 'data-0',
        a1: 500,
        a2: 600,
        unusedProp: 'test',
      },
      {
        version: 'data-1',
        a1: 100,
        a2: 200,
        unusedProp: ['test'],
      },
    ];

    const yAxisDomainRef: { current: any[] } = { current: [] };
    function DomainSpy() {
      const yAxis = useYAxis();
      React.useEffect(() => {
        yAxisDomainRef.current = yAxis.scale.domain();
      });
      return null;
    }

    const series = [
      { id: 'a1', dataKey: 'a1', label: 'Series A', stack: 'stack-1' },
      { id: 'a2', dataKey: 'a2', label: 'Series B', stack: 'stack-1' },
    ];

    const { setProps } = render(
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: 'version' }]}
        yAxis={[{ domainSeries: 'visible' }]}
        series={series}
        hiddenItems={[]}
        width={500}
        height={300}
      >
        <DomainSpy />
      </BarChart>,
    );

    expect(yAxisDomainRef.current).to.deep.equal([0, 1200]);

    setProps({ hiddenItems: [{ type: 'bar', seriesId: 'a2' }] });

    expect(yAxisDomainRef.current).to.deep.equal([0, 500]);
  });

  describe('duplicated band values', () => {
    const duplicatedProps = {
      width: 400,
      height: 300,
      xAxis: [{ id: 'x', scaleType: 'band' as const, data: ['A', 'A', 'B', 'A'] }],
      series: [{ data: [10, 20, 30, 40] }],
      hideLegend: true,
      skipAnimation: true,
    };

    it('renders one bar and one tick label per data point', () => {
      const { container } = render(<BarChart {...duplicatedProps} />);

      const xs = Array.from(container.querySelectorAll(`.${barClasses.element}`), (bar) =>
        Number(bar.getAttribute('x')),
      );
      expect(xs).to.have.length(4);
      expect(xs).to.deep.equal([...new Set(xs)].sort((a, b) => a - b));

      expect(screen.getAllByText('A')).to.have.length(3);
      expect(screen.getAllByText('B')).to.have.length(1);
    });

    it('renders reversed bars at distinct positions', () => {
      const { container } = render(
        <BarChart {...duplicatedProps} xAxis={[{ ...duplicatedProps.xAxis[0], reverse: true }]} />,
      );

      const xs = Array.from(container.querySelectorAll(`.${barClasses.element}`), (bar) =>
        Number(bar.getAttribute('x')),
      );
      expect(xs).to.have.length(4);
      expect(xs).to.deep.equal([...new Set(xs)].sort((a, b) => b - a));
      expect(screen.getAllByText('A')).to.have.length(3);
    });

    it('renders one vertical grid line per tick', () => {
      const { container } = render(<BarChart {...duplicatedProps} grid={{ vertical: true }} />);

      const xs = Array.from(
        container.querySelectorAll(`.${chartsGridClasses.verticalLine}`),
        (line) => Number(line.getAttribute('x1')),
      );
      expect(xs).to.have.length(5);
      expect(new Set(xs).size).to.equal(5);
    });

    it('highlights two indexes sharing a value', () => {
      const { container } = render(
        <BarChart
          {...duplicatedProps}
          highlightedAxis={[
            { axisId: 'x', dataIndex: 0 },
            { axisId: 'x', dataIndex: 1 },
          ]}
        />,
      );

      const paths = Array.from(
        container.querySelectorAll(`.${chartsAxisHighlightClasses.root}`),
        (path) => path.getAttribute('d'),
      );
      expect(paths).to.have.length(2);
      expect(paths[0]).not.to.equal(paths[1]);
    });

    it('highlights the band of the highlighted index', () => {
      const { container } = render(
        <BarChart {...duplicatedProps} highlightedAxis={[{ axisId: 'x', dataIndex: 3 }]} />,
      );

      const bars = container.querySelectorAll(`.${barClasses.element}`);
      const [, start, , , size] =
        container
          .querySelector(`.${chartsAxisHighlightClasses.root}`)
          ?.getAttribute('d')
          ?.split(' ') ?? [];
      const barX = Number(bars[3].getAttribute('x'));
      const barWidth = Number(bars[3].getAttribute('width'));

      expect(Number(start)).to.be.greaterThan(Number(bars[0].getAttribute('x')));
      expect(Number(start)).to.be.at.most(barX);
      expect(Number(start) + Number(size)).to.be.at.least(barX + barWidth);
    });

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)('resolves the hovered index in the axis tooltip', async () => {
      const { user, container } = render(<BarChart {...duplicatedProps} />, { wrapper });

      const lastBar = container.querySelectorAll(`.${barClasses.element}`)[3];
      const rect = lastBar.getBoundingClientRect();
      await user.pointer({
        target: lastBar,
        coords: { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 },
      });

      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip.textContent).to.contain('40');
      expect(tooltip.textContent).not.to.contain('20');
    });
  });
});
