import { act, createRenderer, fireEvent } from '@mui/internal-test-utils';
import * as React from 'react';
import { vi } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { chartsSvgLayerClasses } from '../../../ChartsSvgLayer';

describe('zoom range announcement', () => {
  const { render } = createRenderer();

  const barChartProps = {
    series: [{ id: 'A', data: [10, 20, 30, 40] }],
    xAxis: [{ id: 'x', data: ['A', 'B', 'C', 'D'], zoom: true, height: 30 }],
    yAxis: [{ position: 'none' as const }],
    width: 100,
    height: 130,
    margin: 0,
    hideLegend: true,
    skipAnimation: true,
    slotProps: { tooltip: { trigger: 'none' as const } },
  };

  const options = {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 100, height: 130 }}>{children}</div>
    ),
  };

  const getLiveRegion = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[role="status"]')!;

  const wheelZoom = async (
    container: HTMLElement,
    user: ReturnType<typeof render>['user'],
    onZoomChange: ReturnType<typeof vi.fn>,
  ) => {
    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    await user.pointer([{ target: layerContainer, coords: { x: 50, y: 50 } }]);

    const callsBefore = onZoomChange.mock.calls.length;
    fireEvent.wheel(layerContainer, { deltaY: -30, clientX: 50, clientY: 50 });
    await act(
      async () =>
        new Promise((resolve) => {
          requestAnimationFrame(resolve);
        }),
    );

    // The rest of the test only means something if the wheel did zoom.
    expect(onZoomChange.mock.calls.length).to.be.greaterThan(callsBefore);
  };

  it('should announce the visible range after a keyboard zoom', async () => {
    const { user, container } = render(
      <BarChartPro {...barChartProps} initialZoom={[{ axisId: 'x', start: 20, end: 70 }]} />,
      options,
    );

    const liveRegion = getLiveRegion(container);
    expect(liveRegion).not.to.equal(null);
    expect(liveRegion.getAttribute('aria-live')).to.equal('polite');
    // Nothing is announced before the user interacts with the zoom.
    expect(liveRegion.textContent).to.equal('');

    await user.keyboard('{Tab}');
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

    expect(liveRegion.textContent).to.equal('Showing 25% to 75% of the horizontal axis');
  });

  it('should stop announcing once the chart loses focus', async () => {
    const { user, container } = render(
      <div>
        <BarChartPro {...barChartProps} />
        <button type="button">outside</button>
      </div>,
      options,
    );

    const liveRegion = getLiveRegion(container);

    await user.keyboard('{Tab}');
    await user.keyboard('+');
    expect(liveRegion.textContent).to.equal('Showing 5% to 95% of the horizontal axis');

    await user.click(container.querySelector('button')!);
    expect(liveRegion.textContent).to.equal('');
  });

  it('should not announce a zoom coming from the pointer', async () => {
    const onZoomChange = vi.fn();
    const { container, user } = render(
      <BarChartPro {...barChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    await wheelZoom(container, user, onZoomChange);

    expect(getLiveRegion(container).textContent).to.equal('');
  });

  it('should not keep announcing the pointer zoom that follows a keyboard zoom', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <BarChartPro {...barChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    const liveRegion = getLiveRegion(container);

    await user.keyboard('{Tab}');
    await user.keyboard('+');
    const announced = liveRegion.textContent;
    expect(announced).to.equal('Showing 5% to 95% of the horizontal axis');

    // The keyboard asks for the announcement, so the wheel must not rewrite it.
    await wheelZoom(container, user, onZoomChange);

    expect(liveRegion.textContent).to.equal(announced);
  });
});
