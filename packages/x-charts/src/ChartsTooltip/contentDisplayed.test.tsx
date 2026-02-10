import * as React from 'react';
import { createRenderer, waitFor, screen } from '@mui/internal-test-utils';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import { isJSDOM } from 'test/utils/skipIf';
import { useItemTooltip } from './useItemTooltip';
import { useBarSeries } from '../hooks';
import { ChartsTooltipContainer } from './ChartsTooltipContainer';
import { legendClasses } from '../ChartsLegend';

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

// can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
describe.skipIf(isJSDOM)('ChartsTooltip', () => {
  const { render } = createRenderer();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 400, height: 400 }}>{children}</div>
  );

  describe('axis trigger', () => {
    it('should show right values with vertical layout on axis', async () => {
      const { user, container } = render(
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
      const svg = container.querySelector('svg')!;

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
      const { user, container } = render(
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
      const svg = container.querySelector('svg')!;

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

  describe('item trigger', () => {
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

  describe('custom tooltip', () => {
    it('should show custom tooltip', async () => {
      function CustomTooltip() {
        const tooltipData = useItemTooltip<'bar'>();
        const barSeries = useBarSeries(tooltipData?.identifier.seriesId ?? '');

        if (!tooltipData || !barSeries) {
          return null;
        }

        const sum = barSeries.data
          .slice(0, tooltipData.identifier.dataIndex + 1)
          .reduce((acc, v) => acc! + (v ?? 0), 0);

        return (
          <ChartsTooltipContainer trigger="item">
            <div>
              <div>
                <p>sum</p>
                <p>{sum}</p>
              </div>
              <div>
                <p>current</p>
                <p>{tooltipData?.formattedValue}</p>
              </div>
            </div>
          </ChartsTooltipContainer>
        );
      }

      const { user } = render(
        <BarChart
          {...config}
          dataset={undefined}
          series={[{ id: 's1', label: 'S1', data: [100, 200, 300, 400] }]}
          xAxis={[{ data: ['A', 'B', 'C', 'D'], position: 'none' }]}
          slotProps={{ tooltip: { trigger: 'item' } }}
          slots={{ tooltip: CustomTooltip }}
        />,
        { wrapper },
      );
      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      // Trigger the tooltip
      await user.pointer({
        target: rectangles[1],
        coords: {
          x: 50,
          y: 350,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root p');
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          'sum',
          '300',
          'current',
          '200',
        ]);
      });

      // Trigger the tooltip
      await user.pointer({
        target: rectangles[3],
        coords: {
          x: 350,
          y: 350,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root p');
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          'sum',
          '1000',
          'current',
          '400',
        ]);
      });
    });
  });

  describe('visibility filtering', () => {
    it('should filter hidden series using hiddenItems prop', async () => {
      const { user, container, rerender } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 'series-1', label: 'S1' },
            { dataKey: 'v2', id: 'series-2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />,
        { wrapper },
      );

      const svg = container.querySelector('svg')!;

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

      // Rerender with S2 hidden
      rerender(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 'series-1', label: 'S1' },
            { dataKey: 'v2', id: 'series-2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          hiddenItems={[{ type: 'bar', seriesId: 'series-2' }]}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />,
      );

      // Trigger tooltip again
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
        // S2 should NOT be in tooltip - only one row
        expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
          // Header
          'B',
          ...firstRow,
        ]);
      });
    });

    it('should only show visible series in axis tooltip for BarChart', async () => {
      const { user, container } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          hideLegend={false}
          slotProps={{
            tooltip: { trigger: 'axis' },
            legend: { toggleVisibilityOnClick: true },
          }}
        />,
        { wrapper },
      );

      const svg = container.querySelector('svg')!;

      // Wait for chart to fully render
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /S1/ })).toBeTruthy();
      });

      // Trigger the tooltip - all series should be visible initially
      await user.pointer({
        target: svg,
        coords: {
          x: 198,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const cellTexts = [...cells].map((cell) => cell.textContent);
        // All series should be present in tooltip
        expect(cellTexts).to.include('S1');
        expect(cellTexts).to.include('S2');
      });

      // Click legend to hide S2
      const s2Legend = screen.getByRole('button', { name: /S2/ });
      await user.click(s2Legend);

      // Verify legend item is marked as hidden
      expect(s2Legend.classList.contains(legendClasses.hidden)).to.equal(true);

      // Move pointer slightly to trigger tooltip update
      await user.pointer({
        target: svg,
        coords: {
          x: 199,
          y: 61,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const cellTexts = [...cells].map((cell) => cell.textContent);
        // S2 should NOT be in tooltip
        expect(cellTexts).to.include('S1');
        expect(cellTexts).to.not.include('S2');
      });
    });

    it('should update tooltip when toggling multiple series visibility', async () => {
      const { user, container } = render(
        <BarChart
          {...config}
          dataset={[
            { x: 'A', v1: 4, v2: 2, v3: 3 },
            { x: 'B', v1: 1, v2: 1, v3: 2 },
          ]}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
            { dataKey: 'v3', id: 's3', label: 'S3' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          hideLegend={false}
          slotProps={{
            tooltip: { trigger: 'axis' },
            legend: { toggleVisibilityOnClick: true },
          }}
        />,
        { wrapper },
      );

      const svg = container.querySelector('svg')!;

      // Hide S1 and S3
      const s1Legend = screen.getByRole('button', { name: /S1/ });
      const s3Legend = screen.getByRole('button', { name: /S3/ });
      await user.click(s1Legend);
      await user.click(s3Legend);

      // Trigger tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 198,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const cellTexts = [...cells].map((cell) => cell.textContent);
        // Only S2 should be visible
        expect(cellTexts).to.not.include('S1');
        expect(cellTexts).to.include('S2');
        expect(cellTexts).to.not.include('S3');
      });
    });

    it('should show all series again when toggled back to visible', async () => {
      const { user, container } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          hideLegend={false}
          slotProps={{
            tooltip: { trigger: 'axis' },
            legend: { toggleVisibilityOnClick: true },
          }}
        />,
        { wrapper },
      );

      const svg = container.querySelector('svg')!;
      const s2Legend = screen.getByRole('button', { name: /S2/ });

      // Hide S2
      await user.click(s2Legend);

      // Trigger tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 198,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const cellTexts = [...cells].map((cell) => cell.textContent);
        expect(cellTexts).to.include('S1');
        expect(cellTexts).to.not.include('S2');
      });

      // Show S2 again
      await user.click(s2Legend);

      // Move pointer to trigger tooltip update
      await user.pointer({
        target: svg,
        coords: {
          x: 199,
          y: 61,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const cellTexts = [...cells].map((cell) => cell.textContent);
        // Both series should be present again
        expect(cellTexts).to.include('S1');
        expect(cellTexts).to.include('S2');
      });
    });

    it('should filter hidden series in BarChart axis tooltip', async () => {
      const { user, container } = render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1', label: 'S1' },
            { dataKey: 'v2', id: 's2', label: 'S2' },
          ]}
          xAxis={[{ dataKey: 'x', position: 'none' }]}
          hideLegend={false}
          slotProps={{
            tooltip: { trigger: 'axis' },
            legend: { toggleVisibilityOnClick: true },
          }}
        />,
      );

      const svg = container.querySelector('svg')!;

      // Hide S1 series
      const s1Legend = screen.getByRole('button', { name: /S1/ });
      await user.click(s1Legend);

      // Trigger tooltip
      await user.pointer({
        target: svg,
        coords: {
          x: 198,
          y: 60,
        },
      });

      await waitFor(() => {
        const cells = document.querySelectorAll<HTMLElement>(cellSelector);
        const cellTexts = [...cells].map((cell) => cell.textContent);
        // Only S2 should be in the tooltip
        expect(cellTexts).to.not.include('S1');
        expect(cellTexts).to.include('S2');
        expect(cellTexts).to.include('2'); // S2 value
      });
    });
  });
});
