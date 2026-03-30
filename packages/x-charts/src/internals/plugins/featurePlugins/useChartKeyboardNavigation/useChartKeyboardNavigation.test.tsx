import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer, act } from '@mui/internal-test-utils/createRenderer';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';

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
