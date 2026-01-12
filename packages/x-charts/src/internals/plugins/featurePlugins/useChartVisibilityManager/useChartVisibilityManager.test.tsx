import * as React from 'react';
import { createRenderer, screen, within } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

/**
 * Helper to check if a bar element is visible (has non-zero dimensions)
 */
function isBarVisible(bar: Element): boolean {
  const width = Number(bar.getAttribute('width') || 0);
  const height = Number(bar.getAttribute('height') || 0);
  return width > 0 && height > 0;
}

/**
 * Helper to check if a pie arc is visible (start and end angle are different)
 * Hidden pie arcs have startAngle === endAngle (zero-size arc)
 */
function isPieArcVisible(path: Element): boolean {
  const d = path.getAttribute('d') || '';
  // A hidden arc has a path that doesn't create a visible shape
  // A visible arc has a proper arc path
  return d.includes('A') && !d.includes('A0,0');
}

/**
 * Helper to get visible bars from the document
 */
function getVisibleBars(): Element[] {
  const bars = document.querySelectorAll(`.${barElementClasses.root}`);
  return Array.from(bars).filter(isBarVisible);
}

/**
 * Helper to get visible pie arcs from the document
 */
function getVisiblePieArcs(): Element[] {
  const arcs = document.querySelectorAll(`.${pieArcClasses.root}`);
  return Array.from(arcs).filter(isPieArcVisible);
}

describe('useChartVisibilityManager', () => {
  const { render } = createRenderer();

  describe('Legend toggleVisibilityOnClick', () => {
    it('should toggle bar series visibility when clicking on legend item', async () => {
      const { user } = render(
        <BarChart
          height={300}
          width={300}
          skipAnimation
          series={[
            { id: 'series-1', label: 'Series 1', data: [10, 20] },
            { id: 'series-2', label: 'Series 2', data: [15, 25] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          slotProps={{ legend: { toggleVisibilityOnClick: true } }}
        />,
      );

      // Initially all bars should be visible (with non-zero dimensions)
      expect(getVisibleBars().length).to.equal(4); // 2 series x 2 data points

      // Find and click the first legend item by its text
      const series1Button = screen.getByRole('button', { name: /Series 1/ });
      await user.click(series1Button);

      // The legend item should now be marked as hidden
      expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(true);

      // Only series-2 bars should be visible now (2 bars with non-zero dimensions)
      expect(getVisibleBars().length).to.equal(2);

      // Click again to show the series
      await user.click(series1Button);

      // Legend item should no longer be hidden
      expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(false);

      // All bars should be visible again
      expect(getVisibleBars().length).to.equal(4);
    });

    it('should toggle pie series visibility when clicking on legend item', async () => {
      const { user } = render(
        <PieChart
          height={300}
          width={300}
          skipAnimation
          series={[
            {
              id: 'pie-series',
              data: [
                { label: 'Slice 1', value: 10 },
                { label: 'Slice 2', value: 20 },
                { label: 'Slice 3', value: 30 },
              ],
            },
          ]}
          slotProps={{ legend: { toggleVisibilityOnClick: true } }}
        />,
      );

      // Initially all pie slices should be visible
      expect(getVisiblePieArcs().length).to.equal(3);

      // Find and click the first legend item
      const slice1Button = screen.getByRole('button', { name: /Slice 1/ });
      await user.click(slice1Button);

      // The legend item should now be marked as hidden
      expect(slice1Button.classList.contains(legendClasses.hidden)).to.equal(true);

      // Two slices should still be visible (one hidden)
      expect(getVisiblePieArcs().length).to.equal(2);
    });
  });

  describe('onHiddenItemsChange callback', () => {
    it('should call onHiddenItemsChange when hiding and showing a item via legend click', async () => {
      const onHiddenItemsChange = vi.fn();
      const { user } = render(
        <BarChart
          height={300}
          width={300}
          skipAnimation
          series={[
            { id: 'series-1', label: 'Series 1', data: [10, 20] },
            { id: 'series-2', label: 'Series 2', data: [15, 25] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          onHiddenItemsChange={onHiddenItemsChange}
          slotProps={{ legend: { toggleVisibilityOnClick: true } }}
        />,
      );

      const series1Button = screen.getByRole('button', { name: /Series 1/ });

      // Hide the item
      await user.click(series1Button);
      expect(onHiddenItemsChange).toHaveBeenCalledTimes(1);
      expect(onHiddenItemsChange.mock.lastCall?.[0]).to.deep.equal([
        { type: 'bar', seriesId: 'series-1', dataIndex: undefined },
      ]);

      // Show the item again
      await user.click(series1Button);
      expect(onHiddenItemsChange).toHaveBeenCalledTimes(2);
      expect(onHiddenItemsChange.mock.lastCall?.[0]).to.deep.equal([]);
    });
  });

  describe('controlled hiddenItems', () => {
    it('should respect controlled hiddenItems for bar chart', () => {
      const { setProps } = render(
        <BarChart
          height={300}
          width={300}
          skipAnimation
          series={[
            { id: 'series-1', label: 'Series 1', data: [10, 20] },
            { id: 'series-2', label: 'Series 2', data: [15, 25] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          hiddenItems={[{ type: 'bar', seriesId: 'series-1' }]}
        />,
      );

      // Only series-2 should be visible (bars with non-zero dimensions)
      expect(getVisibleBars().length).to.equal(2);

      // The legend item for series-1 should be marked as hidden
      const legend = screen.getByRole('list');
      const series1Item = within(legend).getByText('Series 1').closest(`.${legendClasses.series}`);
      const series2Item = within(legend).getByText('Series 2').closest(`.${legendClasses.series}`);

      expect(series1Item?.classList.contains(legendClasses.hidden)).to.equal(true);
      expect(series2Item?.classList.contains(legendClasses.hidden)).to.equal(false);

      setProps({
        hiddenItems: [{ type: 'bar', seriesId: 'series-2' }],
      });

      expect(series1Item?.classList.contains(legendClasses.hidden)).to.equal(false);
      expect(series2Item?.classList.contains(legendClasses.hidden)).to.equal(true);
    });
  });

  describe('initialHiddenItems', () => {
    it('should hide items on initial render with initialHiddenItems', () => {
      render(
        <BarChart
          height={300}
          width={300}
          skipAnimation
          series={[
            { id: 'series-1', label: 'Series 1', data: [10, 20] },
            { id: 'series-2', label: 'Series 2', data: [15, 25] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          initialHiddenItems={[{ type: 'bar', seriesId: 'series-1' }]}
        />,
      );

      // Only series-2 should be visible (bars with non-zero dimensions)
      expect(getVisibleBars().length).to.equal(2);

      // The legend item for series-1 should be marked as hidden
      const legend = screen.getByRole('list');
      const series1Item = within(legend).getByText('Series 1').closest(`.${legendClasses.series}`);
      const series2Item = within(legend).getByText('Series 2').closest(`.${legendClasses.series}`);

      expect(series1Item?.classList.contains(legendClasses.hidden)).to.equal(true);
      expect(series2Item?.classList.contains(legendClasses.hidden)).to.equal(false);
    });

    it('should allow toggling visibility when using initialHiddenItems', async () => {
      const { user } = render(
        <BarChart
          height={300}
          width={300}
          skipAnimation
          series={[
            { id: 'series-1', label: 'Series 1', data: [10, 20] },
            { id: 'series-2', label: 'Series 2', data: [15, 25] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          initialHiddenItems={[{ type: 'bar', seriesId: 'series-1' }]}
          slotProps={{ legend: { toggleVisibilityOnClick: true } }}
        />,
      );

      // Initially only series-2 should be visible
      expect(getVisibleBars().length).to.equal(2);

      // Click on series-1 legend item to show it
      const series1Button = screen.getByRole('button', { name: /Series 1/ });
      await user.click(series1Button);

      // All bars should now be visible
      expect(getVisibleBars().length).to.equal(4);
    });
  });
});
