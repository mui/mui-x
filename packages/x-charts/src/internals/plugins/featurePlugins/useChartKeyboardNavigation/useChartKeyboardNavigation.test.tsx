import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer, act } from '@mui/internal-test-utils/createRenderer';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';
import { PieChart, pieClasses } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

describe('useChartKeyboardNavigation', () => {
  const { render } = createRenderer();

  const FOCUSED_BAR_SELECTOR = 'rect[fill="none"]';

  function focusChart(container: HTMLElement) {
    act(() => {
      container.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    });
  }

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)('should show focus indicator when navigating with keyboard', async () => {
    const { container, user } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100] }]}
      />,
    );

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).to.equal(null);

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);
  });

  it.skipIf(isJSDOM)('should remove focus indicator on blur', async () => {
    const { container, user } = render(
      <div>
        <BarChart
          height={100}
          width={100}
          skipAnimation
          margin={0}
          series={[{ id: 'A', data: [50, 100] }]}
        />
        <button id="test-button">toFocus</button>
      </div>,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);

    await user.click(container.querySelector('#test-button')!);

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).to.equal(null);
  });

  it.skipIf(isJSDOM)('should not focus a hidden series via keyboard navigation', async () => {
    const { container, user } = render(
      <BarChart
        height={200}
        width={400}
        skipAnimation
        margin={0}
        hiddenItems={[{ type: 'bar', seriesId: 'A' }]}
        series={[
          { id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } },
          { id: 'B', data: [10, 20], highlightScope: { highlight: 'item' } },
        ]}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');

    // Focus indicator must appear (we are on a visible series).
    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);

    // No bar from the hidden series can be highlighted.
    expect(
      container.querySelectorAll(`[data-series="A"] [data-highlighted="true"]`),
    ).to.have.length(0);

    // The keyboard focus must propagate as a highlight on the visible series.
    expect(
      container.querySelectorAll(`[data-series="B"] [data-highlighted="true"]`),
    ).to.have.length(1);
  });

  it.skipIf(isJSDOM)('should skip hidden series when changing series with ArrowUp', async () => {
    const { container, user } = render(
      <BarChart
        height={200}
        width={400}
        skipAnimation
        margin={0}
        hiddenItems={[{ type: 'bar', seriesId: 'middle' }]}
        series={[
          { id: 'top', data: [10, 20], highlightScope: { highlight: 'item' } },
          { id: 'middle', data: [30, 40], highlightScope: { highlight: 'item' } },
          { id: 'bottom', data: [50, 60], highlightScope: { highlight: 'item' } },
        ]}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    // ArrowUp would route to "middle" if hidden series were focusable; it must skip to "bottom".
    await user.keyboard('[ArrowUp]');

    // The hidden middle series must never receive the highlight.
    expect(
      container.querySelectorAll(`[data-series="middle"] [data-highlighted="true"]`),
    ).to.have.length(0);
    // The highlight must be on the next visible series ("bottom"), not back on "top".
    expect(
      container.querySelectorAll(`[data-series="bottom"] [data-highlighted="true"]`),
    ).to.have.length(1);
  });

  it.skipIf(isJSDOM)(
    'should not render any focus indicator when every series is hidden',
    async () => {
      const { container, user } = render(
        <BarChart
          height={100}
          width={100}
          skipAnimation
          margin={0}
          hiddenItems={[{ type: 'bar', seriesId: 'A' }]}
          series={[{ id: 'A', data: [50, 100] }]}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('[ArrowRight]');
      await user.keyboard('[ArrowDown]');
      await user.keyboard('[ArrowUp]');

      expect(container.querySelector(FOCUSED_BAR_SELECTOR)).to.equal(null);
    },
  );

  it.skipIf(isJSDOM)('should skip a hidden pie arc when navigating with keyboard', async () => {
    const { container, user } = render(
      <PieChart
        height={200}
        width={200}
        hideLegend
        hiddenItems={[{ type: 'pie', seriesId: 'pie', dataIndex: 0 }]}
        series={[
          {
            id: 'pie',
            data: [
              { id: 0, value: 10 },
              { id: 1, value: 20 },
              { id: 2, value: 30 },
            ],
          },
        ]}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');

    // The first ArrowRight must skip the hidden arc at dataIndex 0 and focus
    // the next visible arc instead.
    expect(container.querySelector(`.${pieClasses.focusIndicator}[data-index="0"]`)).to.equal(null);
    expect(container.querySelector(`.${pieClasses.focusIndicator}[data-index="1"]`)).not.to.equal(
      null,
    );

    await user.keyboard('[ArrowRight]');

    // ArrowRight again moves to the next visible arc.
    expect(container.querySelector(`.${pieClasses.focusIndicator}[data-index="2"]`)).not.to.equal(
      null,
    );
    // The hidden arc is never reachable.
    expect(container.querySelector(`.${pieClasses.focusIndicator}[data-index="0"]`)).to.equal(null);
  });

  it.skipIf(isJSDOM)(
    'should not focus marks of a hidden scatter series via keyboard navigation',
    async () => {
      const { container, user } = render(
        <ScatterChart
          height={200}
          width={200}
          skipAnimation
          margin={0}
          hiddenItems={[{ type: 'scatter', seriesId: 'A' }]}
          series={[
            {
              id: 'A',
              data: [
                { id: 'a1', x: 1, y: 1 },
                { id: 'a2', x: 2, y: 2 },
              ],
            },
            {
              id: 'B',
              data: [
                { id: 'b1', x: 3, y: 3 },
                { id: 'b2', x: 4, y: 4 },
              ],
            },
          ]}
        />,
      );

      // ScatterPlot returns null for hidden series, so Series A's mark group is not rendered.
      expect(container.querySelector(`[data-series="A"]`)).to.equal(null);
      expect(container.querySelector(`[data-series="B"]`)).not.to.equal(null);

      await user.keyboard('{Tab}');
      await user.keyboard('[ArrowRight]');
      // ArrowDown would route to "Series A" if hidden series were focusable.
      await user.keyboard('[ArrowDown]');

      // Focus indicator must still be rendered (Series B is visible).
      expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);
    },
  );

  it.skipIf(isJSDOM)(
    'should restore focus indicator on the last focused item when refocusing',
    async () => {
      const { container, user } = render(
        <div>
          <BarChart
            height={100}
            width={100}
            skipAnimation
            margin={0}
            series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
          />
          <button id="test-button">toFocus</button>
        </div>,
      );

      const firstBar = container.querySelector(
        `[data-series="A"] .${barClasses.element}:nth-child(1)`,
      );
      const secondBar = container.querySelector(
        `[data-series="A"] .${barClasses.element}:nth-child(2)`,
      );

      await user.keyboard('{Tab}');
      // Navigate to first bar, then to second bar
      await user.keyboard('[ArrowRight]');
      await user.keyboard('[ArrowRight]');

      expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');
      expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);

      await user.click(container.querySelector('#test-button')!);

      expect(container.querySelector(FOCUSED_BAR_SELECTOR)).to.equal(null);
      expect(secondBar!.getAttribute('data-highlighted')).to.equal(null);

      // Focusing back restores the focus on the last item
      focusChart(container);

      expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);
      expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');
      expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
    },
  );
});
