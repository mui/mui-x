import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';

const config: Partial<BarChartProps> = {
  dataset: [
    { x: 'A', v1: 4, v2: 2 },
    { x: 'B', v1: 1, v2: 1 },
  ],
  margin: 0,
  xAxis: [{ position: 'none' }],
  yAxis: [{ position: 'none' }],
  hideLegend: true,
  width: 400,
  height: 400,
} as const;

// Plot as follow to simplify click position
//
// | X
// | X
// | X X
// | X X X X
// ---A---B-
//
// Horizontal layout
// A| X X X X
// A| X X
// B| X
// B| X
//   --------

const cellSelector =
  '.MuiChartsTooltip-root td, .MuiChartsTooltip-root th, .MuiChartsTooltip-root caption';

describe('ChartsTooltip', () => {
  const { render } = createRenderer();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 400, height: 400 }}>{children}</div>
  );

  beforeEach(() => {
    // TODO: Remove beforeEach/afterEach after vitest becomes our main runner
    if (window?.document?.body?.style) {
      window.document.body.style.margin = '0';
    }
  });

  afterEach(() => {
    if (window?.document?.body?.style) {
      window.document.body.style.margin = '8px';
    }
  });

  // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
  describeSkipIf(isJSDOM)('axis trigger', () => {
    it('should show right values with vertical layout on axis', async () => {
      const { user } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />,
        { wrapper },
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      // Trigger the tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 198,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const firstRow = ['S1', '4'];
        const secondRow = ['S2', '2'];
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          // Header
          'A',
          ...firstRow,
          ...secondRow,
        ]);
      });

      // Trigger the tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 201,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const firstRow = ['S1', '1'];
        const secondRow = ['S2', '1'];
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          // Header
          'B',
          ...firstRow,
          ...secondRow,
        ]);
      });
    });

    it('should show right values with horizontal layout on axis', async () => {
      const { user } = render(
        <BarChart
          {...config}
          layout="horizontal"
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          yAxis={[{ scaleType: 'band', dataKey: 'x', position: 'none' }]}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />,
        { wrapper },
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      // Trigger the tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 150,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const firstRow = ['S1', '4'];
        const secondRow = ['S2', '2'];
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          // Header
          'A',
          ...firstRow,
          ...secondRow,
        ]);
      });

      // Trigger the tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 150,
          y: 220,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const firstRow = ['S1', '1'];
        const secondRow = ['S2', '1'];
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          // Header
          'B',
          ...firstRow,
          ...secondRow,
        ]);
      });
    });
  });

  // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
  describeSkipIf(isJSDOM)('item trigger', () => {
    it('should show right values with vertical layout on item', async () => {
      const { user } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          slotProps={{ tooltip: { trigger: 'item' } }}
        />,
        { wrapper },
      );
      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      // Trigger the tooltip
      await user.pointer({
        target: rectangles[0],
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['S1', '4']);
      });

      // Trigger the tooltip
      await user.pointer({
        target: rectangles[3],
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['S2', '1']);
      });
    });

    it('should show right values with horizontal layout on item', async () => {
      const { user } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          layout="horizontal"
          yAxis={[{ scaleType: 'band', dataKey: 'x', position: 'none' }]}
          slotProps={{ tooltip: { trigger: 'item' } }}
        />,
        { wrapper },
      );

      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      await user.pointer({
        target: rectangles[0],
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['S1', '4']);
      });

      await user.pointer({
        target: rectangles[3],
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['S2', '1']);
      });
    });
  });
});
