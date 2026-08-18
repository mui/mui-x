import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

describe('keyboard zoom and pan', () => {
  const { render } = createRenderer();

  const barChartProps = {
    series: [{ id: 'A', data: [10, 20, 30, 40] }],
    xAxis: [{ id: 'x', data: ['A', 'B', 'C', 'D'], zoom: true }],
    yAxis: [{ position: 'none' as const }],
    width: 200,
    height: 200,
    margin: 0,
    hideLegend: true,
    skipAnimation: true,
    slotProps: { tooltip: { trigger: 'none' as const } },
  };

  const lastZoom = (onZoomChange: ReturnType<typeof vi.fn>, axisId = 'x') =>
    onZoomChange.mock.lastCall?.[0].find((zoom: { axisId: string }) => zoom.axisId === axisId);

  describe('opt-in', () => {
    it('should not zoom without the `keyboardZoom` experimental feature', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(<BarChartPro {...barChartProps} onZoomChange={onZoomChange} />);

      await user.keyboard('{Tab}');
      await user.keyboard('+');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });

    it('should not pan without the `keyboardZoom` experimental feature', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 0, end: 50 }]}
          onZoomChange={onZoomChange}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });

    it('should zoom when the `keyboard` interaction is set explicitly', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{ zoom: ['keyboard'] }}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('+');

      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 5, end: 95 });
    });

    it('should not zoom when the interaction config excludes `keyboard`', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          experimentalFeatures={{ keyboardZoom: true }}
          zoomInteractionConfig={{ zoom: ['wheel'], pan: ['drag'] }}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('+');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });
  });

  describe('key bindings', () => {
    const renderChart = (props?: Partial<React.ComponentProps<typeof BarChartPro>>) => {
      const onZoomChange = vi.fn();
      const view = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          experimentalFeatures={{ keyboardZoom: true }}
          {...props}
        />,
      );
      return { ...view, onZoomChange };
    };

    it('should zoom in on `+` and on `=`', async () => {
      const { user, onZoomChange } = renderChart();

      await user.keyboard('{Tab}');
      await user.keyboard('+');
      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 5, end: 95 });

      await user.keyboard('=');
      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 9.5, end: 90.5 });
    });

    it('should zoom out on `-`', async () => {
      const { user, onZoomChange } = renderChart({
        initialZoom: [{ axisId: 'x', start: 20, end: 80 }],
      });

      await user.keyboard('{Tab}');
      await user.keyboard('-');

      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 17, end: 83 });
    });

    it('should reset the zoom on `0`', async () => {
      const { user, onZoomChange } = renderChart({
        initialZoom: [{ axisId: 'x', start: 20, end: 80 }],
      });

      await user.keyboard('{Tab}');
      await user.keyboard('0');

      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 0, end: 100 });
    });

    it('should pan on `Shift` + horizontal arrows', async () => {
      const { user, onZoomChange } = renderChart({
        initialZoom: [{ axisId: 'x', start: 20, end: 70 }],
      });

      await user.keyboard('{Tab}');
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 25, end: 75 });

      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
      expect(lastZoom(onZoomChange)).to.deep.equal({ axisId: 'x', start: 20, end: 70 });
    });

    it('should not pan past the axis boundaries', async () => {
      const { user, onZoomChange } = renderChart({
        initialZoom: [{ axisId: 'x', start: 50, end: 100 }],
      });

      await user.keyboard('{Tab}');
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });

    it('should pan the y-axis on `Shift` + vertical arrows', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <ScatterChartPro
          width={200}
          height={200}
          margin={0}
          hideLegend
          skipAnimation
          series={[
            {
              id: 'A',
              data: [
                { x: 1, y: 1, id: 'a' },
                { x: 2, y: 2, id: 'b' },
              ],
            },
          ]}
          xAxis={[{ id: 'x', zoom: true }]}
          yAxis={[{ id: 'y', zoom: true }]}
          initialZoom={[{ axisId: 'y', start: 20, end: 70 }]}
          onZoomChange={onZoomChange}
          experimentalFeatures={{ keyboardZoom: true }}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');

      expect(lastZoom(onZoomChange, 'y')).to.deep.equal({ axisId: 'y', start: 25, end: 75 });
      // The horizontal axis is left untouched.
      expect(lastZoom(onZoomChange, 'x')).to.deep.equal({ axisId: 'x', start: 0, end: 100 });
    });

    it('should ignore zoom keys combined with `Control` or `Meta`', async () => {
      const { user, onZoomChange } = renderChart();

      await user.keyboard('{Tab}');
      await user.keyboard('{Control>}={/Control}');
      await user.keyboard('{Meta>}-{/Meta}');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });

    it('should ignore unmodified arrow keys', async () => {
      const { user, onZoomChange } = renderChart({
        initialZoom: [{ axisId: 'x', start: 20, end: 70 }],
      });

      await user.keyboard('{Tab}');
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowUp}');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });
  });

  describe('focus requirements', () => {
    it('should not react to keys pressed outside of the chart', async () => {
      const onZoomChange = vi.fn();
      render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          experimentalFeatures={{ keyboardZoom: true }}
        />,
      );

      fireEvent.keyDown(document.body, { key: '+' });
      fireEvent.keyDown(document.body, { key: 'ArrowRight', shiftKey: true });

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });

    it('should make the chart focusable and zoom once focused', async () => {
      const onZoomChange = vi.fn();
      const { user, container } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          experimentalFeatures={{ keyboardZoom: true }}
        />,
      );

      await user.keyboard('{Tab}');

      expect(document.activeElement).not.to.equal(document.body);
      expect(container.contains(document.activeElement)).to.equal(true);

      await user.keyboard('+');
      expect(onZoomChange.mock.calls.length).to.equal(1);
    });

    it('should not zoom when keyboard navigation is disabled', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          disableKeyboardNavigation
          onZoomChange={onZoomChange}
          experimentalFeatures={{ keyboardZoom: true }}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('+');

      expect(onZoomChange.mock.calls.length).to.equal(0);
    });
  });

  describe('item navigation', () => {
    it('should keep unmodified arrows for item navigation while panning with `Shift`', async () => {
      const onZoomChange = vi.fn();
      const onItemClick = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
          onZoomChange={onZoomChange}
          onItemClick={onItemClick}
          experimentalFeatures={{ keyboardZoom: true, keyboardActivation: true }}
        />,
      );

      await user.keyboard('{Tab}');
      // Focuses the first item.
      await user.keyboard('{ArrowRight}');
      // Pans, and must not move the focused item.
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
      await user.keyboard('{Enter}');

      expect(onZoomChange.mock.calls.length).to.equal(1);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'bar',
        seriesId: 'A',
        dataIndex: 0,
      });
    });
  });

  describe('screen reader announcement', () => {
    it('should announce the visible range after a keyboard zoom', async () => {
      const { user, container } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
          experimentalFeatures={{ keyboardZoom: true }}
        />,
      );

      const liveRegion = container.querySelector<HTMLElement>('[role="status"]')!;
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
          <BarChartPro {...barChartProps} experimentalFeatures={{ keyboardZoom: true }} />
          <button type="button">outside</button>
        </div>,
      );

      const liveRegion = container.querySelector<HTMLElement>('[role="status"]')!;

      await user.keyboard('{Tab}');
      await user.keyboard('+');
      expect(liveRegion.textContent).to.equal('Showing 5% to 95% of the horizontal axis');

      await user.click(container.querySelector('button')!);
      expect(liveRegion.textContent).to.equal('');
    });
  });
});
