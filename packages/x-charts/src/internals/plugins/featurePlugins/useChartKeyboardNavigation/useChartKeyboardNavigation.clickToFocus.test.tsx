import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { vi } from 'vitest';
import { getCenter } from 'test/utils/charts/getCenter';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';
import { chartsSvgLayerClasses } from '@mui/x-charts/ChartsSvgLayer';
import { PieChart, pieClasses } from '@mui/x-charts/PieChart';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { RadarChart, radarClasses } from '@mui/x-charts/RadarChart';

describe('useChartKeyboardNavigation - click to focus', () => {
  const { render } = createRenderer();

  const FOCUS_INDICATOR_SELECTOR = '[fill="none"][stroke-width="2"]';

  const barProps = {
    height: 100,
    width: 400,
    skipAnimation: true,
    margin: 0,
    series: [{ id: 'A', data: [10, 20, 30, 40] }],
  };

  function getBars(container: HTMLElement) {
    return container.querySelectorAll<SVGElement>(`.${barClasses.series} rect`);
  }

  function getLayerContainer(container: HTMLElement) {
    return container.querySelector<HTMLElement>(`.${chartsSvgLayerClasses.root}`)!.parentElement!;
  }

  /** Bars are resolved by a container hit test, so the click needs real coordinates. */
  function clickAt(
    user: any,
    container: HTMLElement,
    coords: { clientX: number; clientY: number },
  ) {
    return user.pointer([{ keys: '[MouseLeft]', target: getLayerContainer(container), coords }]);
  }

  function getFocusIndicator(container: HTMLElement) {
    return container.querySelector(FOCUS_INDICATOR_SELECTOR);
  }

  function getFocusedDataIndex(container: HTMLElement) {
    const indicator = getFocusIndicator(container);
    if (!indicator) {
      return null;
    }

    const { clientX } = getCenter(indicator);
    return Array.from(getBars(container)).findIndex(
      (bar) => Math.abs(getCenter(bar).clientX - clientX) < 1,
    );
  }

  // svg.createSVGPoint is not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  describe.skipIf(isJSDOM)('bar chart', () => {
    it('sets the focused item without showing it when the chart was not focused', async () => {
      const { container, user } = render(<BarChart {...barProps} />);

      await clickAt(user, container, getCenter(getBars(container)[1]));

      expect(getFocusIndicator(container)).to.equal(null);
      expect(container.contains(document.activeElement)).to.equal(true);
    });

    it('resumes the keyboard navigation from the clicked item', async () => {
      const { container, user } = render(<BarChart {...barProps} />);

      await clickAt(user, container, getCenter(getBars(container)[1]));
      await user.keyboard('[ArrowRight]');

      expect(getFocusedDataIndex(container)).to.equal(2);
    });

    it('reveals the focus on the clicked item at the end of a series', async () => {
      const { container, user } = render(<BarChart {...barProps} />);

      await clickAt(user, container, getCenter(getBars(container)[3]));
      // The last item does not move, but the key was handled so the focus must show up.
      await user.keyboard('[ArrowRight]');

      expect(getFocusedDataIndex(container)).to.equal(3);
    });

    it('moves the visible focus when the chart is already navigated with the keyboard', async () => {
      const { container, user } = render(<BarChart {...barProps} />);

      await user.keyboard('{Tab}');
      await user.keyboard('[ArrowRight]');
      expect(getFocusedDataIndex(container)).to.equal(0);

      await clickAt(user, container, getCenter(getBars(container)[3]));

      expect(getFocusedDataIndex(container)).to.equal(3);
    });

    it('shows the focus right away with focusItemOnClick', async () => {
      const { container, user } = render(<BarChart {...barProps} focusItemOnClick />);

      await clickAt(user, container, getCenter(getBars(container)[2]));

      expect(getFocusedDataIndex(container)).to.equal(2);
    });

    it('reads focusItemOnClick from the theme default props', async () => {
      const theme = createTheme({
        components: {
          MuiChartsDataProvider: { defaultProps: { focusItemOnClick: true } },
        },
      });

      const { container, user } = render(
        <ThemeProvider theme={theme}>
          <BarChart {...barProps} />
        </ThemeProvider>,
      );

      await clickAt(user, container, getCenter(getBars(container)[2]));

      expect(getFocusedDataIndex(container)).to.equal(2);
    });

    it('does nothing when the keyboard navigation is disabled', async () => {
      const { container, user } = render(<BarChart {...barProps} disableKeyboardNavigation />);
      const activeElementBefore = document.activeElement;

      await clickAt(user, container, getCenter(getBars(container)[1]));

      expect(getFocusIndicator(container)).to.equal(null);
      expect(document.activeElement).to.equal(activeElementBefore);
    });

    it('keeps the highlight following the pointer after a hidden click focus', async () => {
      const { container, user } = render(
        <BarChart
          {...barProps}
          series={[{ id: 'A', data: [10, 20, 30, 40], highlightScope: { highlight: 'item' } }]}
        />,
      );
      const bars = getBars(container);

      await clickAt(user, container, getCenter(bars[0]));
      await user.pointer({ target: bars[2], coords: getCenter(bars[2]) });

      // The click must not have switched the highlight to keyboard mode.
      expect(bars[2].getAttribute('data-highlighted')).to.equal('true');
      expect(bars[0].getAttribute('data-highlighted')).to.equal(null);
    });

    it('falls back to the axis when the click hits no item', async () => {
      const { container, user } = render(<BarChart {...barProps} />);

      // Above the shortest bar, so inside the drawing area but on no item.
      const firstBar = getBars(container)[0].getBoundingClientRect();
      await clickAt(user, container, {
        clientX: firstBar.left + firstBar.width / 2,
        clientY: firstBar.top - 10,
      });
      await user.keyboard('[ArrowRight]');

      // The axis under the pointer resolved index 0, so the arrow moved to 1.
      expect(getFocusedDataIndex(container)).to.equal(1);
      expect(container.contains(document.activeElement)).to.equal(true);
    });

    it('keeps the focused series when falling back to the axis', async () => {
      const { container, user } = render(
        <BarChart
          {...barProps}
          series={[
            { id: 'A', data: [10, 20, 30, 40] },
            { id: 'B', data: [40, 30, 20, 10] },
          ]}
        />,
      );

      // Focus an item of the second series.
      await user.keyboard('{Tab}');
      await user.keyboard('[ArrowRight]');
      await user.keyboard('[ArrowUp]');

      const lastBarOfB = container
        .querySelectorAll<SVGElement>(`[data-series="B"] rect`)[3]
        .getBoundingClientRect();
      await clickAt(user, container, {
        clientX: lastBarOfB.left + lastBarOfB.width / 2,
        clientY: lastBarOfB.top - 5,
      });

      // Still on series B, moved to the clicked column.
      const indicator = getFocusIndicator(container)!;
      const indicatorCenter = getCenter(indicator);
      const barsOfB = container.querySelectorAll<SVGElement>(`[data-series="B"] rect`);
      const matched = Array.from(barsOfB).findIndex(
        (bar) => Math.abs(getCenter(bar).clientX - indicatorCenter.clientX) < 1,
      );
      expect(matched).to.equal(3);
    });

    it('keeps the focus hidden when a background click follows a hidden click focus', async () => {
      const { container, user } = render(<BarChart {...barProps} />);

      await clickAt(user, container, getCenter(getBars(container)[1]));

      const firstBar = getBars(container)[0].getBoundingClientRect();
      await clickAt(user, container, {
        clientX: firstBar.left + firstBar.width / 2,
        clientY: firstBar.top - 10,
      });

      expect(getFocusIndicator(container)).to.equal(null);

      // The axis fallback moved the item to the clicked column, still hidden.
      await user.keyboard('[ArrowRight]');
      expect(getFocusedDataIndex(container)).to.equal(1);
    });

    it('shows the focus again when tabbing back in after a hidden click focus', async () => {
      const { container, user } = render(
        <div>
          <BarChart {...barProps} />
          <button id="outside">outside</button>
        </div>,
      );

      await clickAt(user, container, getCenter(getBars(container)[1]));
      expect(getFocusIndicator(container)).to.equal(null);

      await user.click(container.querySelector('#outside')!);
      await user.keyboard('{Shift>}{Tab}{/Shift}');

      expect(getFocusedDataIndex(container)).to.equal(1);
    });

    // The clicked item is resolved by the series, not read from the highlight. Controlling the
    // highlight freezes `highlight.item`, so a focus derived from it would follow the consumer
    // rather than the pointer.
    it('resolves the clicked item independently of a controlled highlight', async () => {
      function Controlled() {
        const [highlightedItem, setHighlightedItem] = React.useState<any>(null);
        return (
          <BarChart
            {...barProps}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
          />
        );
      }

      const { container, user } = render(<Controlled />);

      await clickAt(user, container, getCenter(getBars(container)[1]));
      await user.keyboard('[ArrowRight]');

      expect(getFocusedDataIndex(container)).to.equal(2);
    });

    it('fires onItemClick exactly once', async () => {
      const onItemClick = vi.fn();
      const { container, user } = render(<BarChart {...barProps} onItemClick={onItemClick} />);

      await clickAt(user, container, getCenter(getBars(container)[1]));

      expect(onItemClick.mock.calls.length).to.equal(1);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'bar',
        seriesId: 'A',
        dataIndex: 1,
      });
    });
  });

  describe.skipIf(isJSDOM)('scatter chart', () => {
    const scatterProps = {
      height: 200,
      width: 200,
      skipAnimation: true,
      margin: 0,
      xAxis: [{ position: 'none' as const, min: 0, max: 10 }],
      yAxis: [{ position: 'none' as const, min: 0, max: 10 }],
      series: [
        {
          id: 'A',
          data: [
            { x: 2, y: 2, id: 0 },
            { x: 8, y: 8, id: 1 },
          ],
        },
      ],
    };

    it('focuses the closest point when clicking next to it', async () => {
      const { container, user } = render(<ScatterChart {...scatterProps} />);

      const svg = container.querySelector('svg')!;
      const { clientX, clientY } = getCenter(svg);
      // Bottom left quadrant, closest to the first point.
      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: clientX - 40, clientY: clientY + 40 },
        },
      ]);
      await user.keyboard('[ArrowRight]');

      expect(getFocusIndicator(container)).not.to.equal(null);
    });
  });

  // The click handlers are now always attached, so the pointer cursor must keep coming from
  // `onItemClick` rather than from the presence of a handler.
  describe('cursor', () => {
    it('leaves the scatter markers alone without onItemClick', () => {
      const { container } = render(
        <ScatterChart
          height={200}
          width={200}
          disableHitArea
          series={[{ id: 'A', data: [{ x: 1, y: 1, id: 0 }] }]}
        />,
      );

      expect(container.querySelector('circle')?.getAttribute('cursor')).to.equal('unset');
    });

    it('marks the scatter markers as clickable with onItemClick', () => {
      const { container } = render(
        <ScatterChart
          height={200}
          width={200}
          disableHitArea
          onItemClick={() => {}}
          series={[{ id: 'A', data: [{ x: 1, y: 1, id: 0 }] }]}
        />,
      );

      expect(container.querySelector('circle')?.getAttribute('cursor')).to.equal('pointer');
    });

    it('leaves the line and area paths alone without onItemClick', () => {
      const { container } = render(
        <LineChart
          height={100}
          width={200}
          series={[{ id: 'A', data: [1, 2], area: true }]}
          xAxis={[{ data: [0, 1] }]}
        />,
      );

      expect(container.querySelector(`.${lineClasses.line}`)?.getAttribute('cursor')).to.equal(
        'unset',
      );
      expect(container.querySelector(`.${lineClasses.area}`)?.getAttribute('cursor')).to.equal(
        'unset',
      );
    });
  });

  describe.skipIf(isJSDOM)('line chart', () => {
    const lineProps = {
      height: 100,
      width: 400,
      skipAnimation: true,
      margin: 0,
      xAxis: [{ position: 'none' as const, data: [0, 1, 2, 3] }],
      yAxis: [{ position: 'none' as const }],
      series: [{ id: 'A', data: [10, 20, 30, 40], showMark: true }],
    };

    it('focuses the item under a clicked mark', async () => {
      const { container, user } = render(<LineChart {...lineProps} />);

      const marks = container.querySelectorAll<SVGElement>(`.${lineClasses.mark}`);
      await user.click(marks[2]);
      await user.keyboard('[ArrowRight]');

      expect(getFocusIndicator(container)).not.to.equal(null);
    });

    it('focuses the item under a clicked line, without onItemClick', async () => {
      const { container, user } = render(
        <LineChart {...lineProps} series={[{ id: 'A', data: [10, 20, 30, 40] }]} />,
      );

      const line = container.querySelector<SVGElement>(`.${lineClasses.line}`)!;
      await user.click(line);
      await user.keyboard('[ArrowRight]');

      expect(getFocusIndicator(container)).not.to.equal(null);
    });
  });

  describe('pie chart', () => {
    const pieProps = {
      height: 200,
      width: 200,
      hideLegend: true,
      skipAnimation: true,
      series: [
        {
          id: 'pie',
          data: [
            { id: 0, value: 10 },
            { id: 1, value: 20 },
          ],
        },
      ],
    };

    it('sets the focused item without showing it, then reveals it on a key press', async () => {
      const { container, user } = render(<PieChart {...pieProps} />);

      const arcs = container.querySelectorAll<SVGElement>(`.${pieClasses.arc}`);
      await user.click(arcs[1]);

      expect(container.querySelector(`.${pieClasses.focusIndicator}`)).to.equal(null);

      await user.keyboard('[ArrowRight]');

      expect(container.querySelector(`.${pieClasses.focusIndicator}`)).not.to.equal(null);
    });

    // The pie does not fill its drawing area, so a click next to it is not a click on the chart.
    it.skipIf(isJSDOM)('ignores a click outside the pie', async () => {
      const { container, user } = render(<PieChart {...pieProps} />);
      const layerContainer = getLayerContainer(container);
      const rect = layerContainer.getBoundingClientRect();

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: layerContainer,
          coords: { clientX: rect.left + 2, clientY: rect.top + 2 },
        },
      ]);

      expect(container.contains(document.activeElement)).to.equal(false);
      expect(container.querySelector(`.${pieClasses.focusIndicator}`)).to.equal(null);
    });

    it('fires onItemClick exactly once', async () => {
      const onItemClick = vi.fn();
      const { container, user } = render(<PieChart {...pieProps} onItemClick={onItemClick} />);

      await user.click(container.querySelectorAll<SVGElement>(`.${pieClasses.arc}`)[1]);

      expect(onItemClick.mock.calls.length).to.equal(1);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'pie',
        seriesId: 'pie',
        dataIndex: 1,
      });
    });
  });

  describe.skipIf(isJSDOM)('radar chart', () => {
    const radarProps = {
      height: 300,
      width: 300,
      radar: { metrics: ['A', 'B', 'C', 'D'] },
      series: [{ id: 'radar', data: [10, 20, 30, 40] }],
    };

    /** The focus indicator is a rect centered on the focused point. */
    function getFocusedMarkIndex(container: HTMLElement) {
      const indicator = getFocusIndicator(container);
      if (!indicator) {
        return null;
      }

      const center = getCenter(indicator);
      return Array.from(container.querySelectorAll<SVGElement>('circle')).findIndex((mark) => {
        const markCenter = getCenter(mark);
        return (
          Math.abs(markCenter.clientX - center.clientX) < 2 &&
          Math.abs(markCenter.clientY - center.clientY) < 2
        );
      });
    }

    it('focuses the clicked mark', async () => {
      const { container, user } = render(<RadarChart {...radarProps} onMarkClick={() => {}} />);

      await user.click(container.querySelectorAll<SVGElement>('circle')[2]);

      // Hidden, but stored: the next key moves on from the clicked mark.
      expect(getFocusIndicator(container)).to.equal(null);
      await user.keyboard('[ArrowRight]');

      expect(getFocusedMarkIndex(container)).to.equal(3);
    });

    it('focuses the mark through the area when no click callback is set', async () => {
      // Marks are pointer transparent without `onMarkClick`, so the click lands on the area,
      // which resolves the index from the click angle.
      const { container, user } = render(<RadarChart {...radarProps} />);

      const marks = container.querySelectorAll<SVGElement>('circle');
      const area = container.querySelector<SVGElement>(`.${radarClasses.seriesArea}`)!;
      await user.pointer([{ keys: '[MouseLeft]', target: area, coords: getCenter(marks[2]) }]);
      await user.keyboard('[ArrowRight]');

      expect(getFocusedMarkIndex(container)).to.equal(3);
    });
  });
});
