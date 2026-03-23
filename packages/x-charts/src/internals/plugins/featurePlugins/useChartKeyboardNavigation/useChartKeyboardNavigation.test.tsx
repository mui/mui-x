import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer, act } from '@mui/internal-test-utils/createRenderer';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';
import { chartsSvgLayerClasses } from '../../../../ChartsSvgLayer';

describe('useChartKeyboardNavigation', () => {
  const { render } = createRenderer();

  const FOCUSED_BAR_SELECTOR = 'rect[fill="none"]';

  /**
   * The keyboard navigation event listeners are on the ChartsLayerContainer div,
   * not the SVG element. Clicking the SVG focuses the parent div.
   * We need to blur/focus the actual focused element (the div).
   */
  function blurChart() {
    act(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

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

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).to.equal(null);

    await user.click(layerContainer);
    await user.keyboard('[ArrowRight]');

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);
  });

  it.skipIf(isJSDOM)('should remove focus indicator on blur', async () => {
    const { container, user } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100] }]}
      />,
    );

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    await user.click(layerContainer);
    await user.keyboard('[ArrowRight]');

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).not.to.equal(null);

    blurChart();

    expect(container.querySelector(FOCUSED_BAR_SELECTOR)).to.equal(null);
  });

  it.skipIf(isJSDOM)(
    'should restore focus indicator on the last focused item when refocusing',
    async () => {
      const { container, user } = render(
        <BarChart
          height={100}
          width={100}
          skipAnimation
          margin={0}
          series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
        />,
      );

      const layerContainer = container.querySelector<HTMLElement>(
        `.${chartsSvgLayerClasses.root}`,
      )!.parentElement!;
      const firstBar = container.querySelector(
        `[data-series="A"] .${barClasses.element}:nth-child(1)`,
      );
      const secondBar = container.querySelector(
        `[data-series="A"] .${barClasses.element}:nth-child(2)`,
      );

      await user.click(layerContainer);
      // Navigate to first bar, then to second bar
      await user.keyboard('[ArrowRight]');
      await user.keyboard('[ArrowRight]');

      expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');
      expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);

      // Blur removes the focus indicator
      blurChart();

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
