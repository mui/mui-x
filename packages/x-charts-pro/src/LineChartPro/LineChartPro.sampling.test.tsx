import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { lineClasses } from '@mui/x-charts/LineChart';
import { LineChartPro } from './LineChartPro';

const POINT_COUNT = 2000;
const data = Array.from({ length: POINT_COUNT }, (_, i) => Math.sin(i / 20) * 100);
const xData = Array.from({ length: POINT_COUNT }, (_, i) => i);

const getLinePath = (container: HTMLElement) =>
  container.querySelector(`.${lineClasses.line}`)?.getAttribute('d') ?? '';

const getLinePaths = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(`.${lineClasses.line}`)).map(
    (node) => node.getAttribute('d') ?? '',
  );

// Counts the SVG path commands, which is proportional to the number of rendered points.
const countPathCommands = (d: string) => (d.match(/[MLC]/g) ?? []).length;

const getAxisTickValues = (axis: 'x' | 'y', container: HTMLElement): string[] =>
  Array.from(
    container.querySelectorAll(
      `.MuiChartsAxis-direction${axis.toUpperCase()} .MuiChartsAxis-tickContainer`,
    ),
  )
    .map((v) => v.textContent)
    .filter(Boolean) as string[];

describe('<LineChartPro /> - Sampling', () => {
  const { render } = createRenderer();

  const baseProps = {
    xAxis: [{ data: xData }],
    width: 600,
    height: 400,
    skipAnimation: true,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  it('renders fewer points when sampling is enabled', () => {
    const { container: withSampling } = render(
      <LineChartPro {...baseProps} series={[{ data, sampling: 'lttb', showMark: false }]} />,
    );
    const { container: withoutSampling } = render(
      <LineChartPro {...baseProps} series={[{ data, showMark: false }]} />,
    );

    const sampledCommands = countPathCommands(getLinePath(withSampling));
    const fullCommands = countPathCommands(getLinePath(withoutSampling));

    expect(fullCommands).to.be.greaterThan(sampledCommands);
    // The drawing area is ~570px wide, so the line should collapse to roughly one point per pixel.
    expect(sampledCommands).to.be.lessThan(POINT_COUNT / 2);
    expect(fullCommands).to.be.greaterThan(POINT_COUNT / 2);
  });

  it('does not change the axis domain (extremums use the full data)', () => {
    const { container: withSampling } = render(
      <LineChartPro {...baseProps} series={[{ data, sampling: 'lttb', showMark: false }]} />,
    );
    const { container: withoutSampling } = render(
      <LineChartPro {...baseProps} series={[{ data, showMark: false }]} />,
    );

    expect(getAxisTickValues('y', withSampling)).to.deep.equal(
      getAxisTickValues('y', withoutSampling),
    );
  });

  it('shares the sampled indices across a stacking group so the series stay aligned', () => {
    const dataB = Array.from({ length: POINT_COUNT }, (_, i) => Math.cos(i / 15) * 80 + 100);
    const { container } = render(
      <LineChartPro
        {...baseProps}
        series={[
          { data, stack: 'total', area: true, sampling: 'lttb', showMark: false },
          { data: dataB, stack: 'total', area: true, sampling: 'lttb', showMark: false },
        ]}
      />,
    );

    const paths = getLinePaths(container);
    expect(paths.length).to.equal(2);
    // Both stacked lines render the same number of points (identical kept indices).
    expect(countPathCommands(paths[0])).to.equal(countPathCommands(paths[1]));
    expect(countPathCommands(paths[0])).to.be.lessThan(POINT_COUNT / 2);
  });

  it('accepts a custom sampling function', () => {
    const everyTenth = ({ length }: { length: number }) => {
      const indices: number[] = [];
      for (let i = 0; i < length; i += 10) {
        indices.push(i);
      }
      return indices;
    };
    const { container } = render(
      <LineChartPro {...baseProps} series={[{ data, sampling: everyTenth, showMark: false }]} />,
    );

    expect(countPathCommands(getLinePath(container))).to.be.lessThan(POINT_COUNT / 2);
  });

  it('leaves the line unchanged when no sampling method is set', () => {
    const { container: withPlugin } = render(
      <LineChartPro {...baseProps} series={[{ data, showMark: false }]} />,
    );

    expect(countPathCommands(getLinePath(withPlugin))).to.be.greaterThan(POINT_COUNT / 2);
  });
});
