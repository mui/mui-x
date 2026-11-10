/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, act, screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { BarChartPro } from '../BarChartPro/BarChartPro';
import { LineChartPro } from '../LineChartPro/LineChartPro';
import type { LineChartProProps } from '../LineChartPro/LineChartPro';
import { chartsAxisZoomSliderThumbClasses } from './internals/chartsAxisZoomSliderThumbClasses';
import { chartsAxisZoomSliderTrackClasses } from './internals/chartsAxisZoomSliderTrackClasses';
import { ZOOM_SLIDER_TOUCH_TARGET } from './internals/constants';

const getAxisTickValues = (axis: 'x' | 'y'): string[] => {
  const axisData = Array.from(
    document.querySelectorAll(
      `.MuiChartsAxis-direction${axis.toUpperCase()} .MuiChartsAxis-tickContainer`,
    ),
  )
    .map((v) => v.textContent)
    .filter(Boolean);

  return axisData as string[];
};

describe.skipIf(isJSDOM)('<ChartsZoomSlider />', () => {
  const { render } = createRenderer();

  const lineChartProps: LineChartProProps = {
    series: [
      {
        data: [10, 20, 30, 40],
      },
    ],
    xAxis: [
      {
        scaleType: 'point',
        data: ['A', 'B', 'C', 'D'],
        zoom: {
          slider: {
            enabled: true,
          },
        },
        height: 30,
        id: 'x',
      },
    ],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 130,
    margin: 5,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  const options = {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 100, height: 130 }}>{children}</div>
    ),
  };

  it('should pan when using the slider track', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <LineChartPro
        {...lineChartProps}
        onZoomChange={onZoomChange}
        initialZoom={[{ axisId: 'x', start: 50, end: 100 }]}
      />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['C', 'D']);

    // Get the zoom slider thumb elements
    const sliderTrack = document.querySelector(`.${chartsAxisZoomSliderTrackClasses.active}`)!;

    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: sliderTrack,
        coords: { x: 50, y: 0 },
      },
      {
        target: sliderTrack,
        coords: { x: 20, y: 0 },
      },
      {
        keys: '[/MouseLeft]',
        target: sliderTrack,
        coords: { x: 20, y: 0 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    // The visible area should have shifted left
    expect(getAxisTickValues('x')).to.deep.equal(['B']);
  });

  it('should zoom pulling the slider thumb', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    // Find the slider elements
    const startThumb = document.querySelector(`.${chartsAxisZoomSliderThumbClasses.start}`)!;
    const endThumb = document.querySelector(`.${chartsAxisZoomSliderThumbClasses.end}`)!;

    // Move the start thumb to zoom in from the left
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: startThumb,
        coords: { x: 0, y: 0 },
      },
      {
        target: startThumb,
        coords: { x: 40, y: 0 },
      },
      {
        keys: '[/MouseLeft]',
        target: startThumb,
        coords: { x: 40, y: 0 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    expect(getAxisTickValues('x')).to.not.include('A');

    // Reset zoom change spy
    onZoomChange.mockClear();

    // Move the end thumb to zoom in from the right
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: endThumb,
        coords: { x: 0, y: 0 },
      },
      {
        target: endThumb,
        coords: { x: 60, y: 0 },
      },
      {
        keys: '[/MouseLeft]',
        target: endThumb,
        coords: { x: 60, y: 0 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    expect(getAxisTickValues('x')).to.not.include('D');
  });

  describe('touch targets', () => {
    it('should render invisible touch targets on thumbs that are at least ZOOM_SLIDER_TOUCH_TARGET size', () => {
      render(<LineChartPro {...lineChartProps} />, options);

      const thumbGroups = document.querySelectorAll(
        `[data-charts-zoom-slider] .${chartsAxisZoomSliderThumbClasses.root}`,
      );

      // Each thumb's visible rect should have a sibling touch target rect in the parent <g>
      thumbGroups.forEach((thumb) => {
        const group = thumb.parentElement!;
        const rects = group.querySelectorAll('rect');
        // The group should contain the touch target rect and the visible thumb rect
        expect(rects.length).to.equal(2);

        // The touch target (last rect, rendered on top) should be at least ZOOM_SLIDER_TOUCH_TARGET size
        const touchTarget = rects[1];
        expect(Number(touchTarget.getAttribute('width'))).to.be.greaterThanOrEqual(
          ZOOM_SLIDER_TOUCH_TARGET,
        );
        expect(Number(touchTarget.getAttribute('height'))).to.be.greaterThanOrEqual(
          ZOOM_SLIDER_TOUCH_TARGET,
        );
      });
    });

    it('should render invisible touch target on active track that is at least ZOOM_SLIDER_TOUCH_TARGET in the thin dimension', () => {
      render(<LineChartPro {...lineChartProps} />, options);

      const activeTrack = document.querySelector(`.${chartsAxisZoomSliderTrackClasses.active}`)!;

      // The touch target rect is the next sibling of the visible active track rect
      const touchTarget = activeTrack.nextElementSibling!;
      expect(touchTarget.tagName).to.equal('rect');
      expect(Number(touchTarget.getAttribute('height'))).to.be.greaterThanOrEqual(
        ZOOM_SLIDER_TOUCH_TARGET,
      );
    });
  });

  describe('tooltip', () => {
    const getZoomSliderTooltips = () => document.querySelectorAll('[data-popper-placement]');

    it('should show tooltip when showTooltip is "always"', async () => {
      render(
        <LineChartPro
          {...lineChartProps}
          xAxis={[
            {
              ...lineChartProps.xAxis![0],
              zoom: { slider: { enabled: true, showTooltip: 'always' } },
            },
          ]}
        />,
        options,
      );

      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getZoomSliderTooltips().length).to.be.greaterThan(0);
    });

    it('should show tooltip on pointer enter when showTooltip is "hover"', async () => {
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          xAxis={[
            {
              ...lineChartProps.xAxis![0],
              zoom: { slider: { enabled: true, showTooltip: 'hover' } },
            },
          ]}
        />,
        options,
      );

      const startThumb = document.querySelector(`.${chartsAxisZoomSliderThumbClasses.start}`)!;

      await user.pointer([{ target: startThumb }]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getZoomSliderTooltips().length).to.be.greaterThan(0);
    });

    it('should show tooltip on pointerdown (touch interaction) when showTooltip is "hover"', async () => {
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          xAxis={[
            {
              ...lineChartProps.xAxis![0],
              zoom: { slider: { enabled: true, showTooltip: 'hover' } },
            },
          ]}
        />,
        options,
      );

      expect(getZoomSliderTooltips().length).to.equal(0);

      const startThumb = document.querySelector(`.${chartsAxisZoomSliderThumbClasses.start}`)!;

      // Simulate a touch press on the thumb
      await user.pointer([
        {
          keys: '[TouchA>]',
          target: startThumb,
          coords: { x: 0, y: 0 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getZoomSliderTooltips().length).to.be.greaterThan(0);

      // Release
      await user.pointer([
        {
          keys: '[/TouchA]',
          target: startThumb,
          coords: { x: 0, y: 0 },
        },
      ]);
    });

    it('should not show tooltip when showTooltip is "never"', async () => {
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          xAxis={[
            {
              ...lineChartProps.xAxis![0],
              zoom: { slider: { enabled: true, showTooltip: 'never' } },
            },
          ]}
        />,
        options,
      );

      const startThumb = document.querySelector(`.${chartsAxisZoomSliderThumbClasses.start}`)!;

      await user.pointer([{ target: startThumb }]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getZoomSliderTooltips().length).to.equal(0);
    });
  });

  describe('ordinal y-axis', () => {
    const data = Array.from({ length: 20 }, (_, index) => `G${index}`);
    const height = 200;
    const horizontalBarProps = {
      layout: 'horizontal',
      series: [{ data: data.map((_, index) => index + 1) }],
      xAxis: [{ position: 'none' }],
      yAxis: [
        {
          id: 'y',
          scaleType: 'band',
          data,
          width: 30,
          zoom: { minSpan: 5, slider: { enabled: true, preview: true } },
        },
      ],
      width: 200,
      height,
      margin: 0,
      slotProps: { tooltip: { trigger: 'none' } },
    } as const;
    const barOptions = {
      wrapper: ({ children }: { children?: React.ReactNode }) => (
        <div style={{ width: 200, height }}>{children}</div>
      ),
    };

    const getActiveTrackY = () => {
      const track = document.querySelector(`.${chartsAxisZoomSliderTrackClasses.active}`)!;

      return {
        start: Number(track.getAttribute('y')),
        end: Number(track.getAttribute('y')) + Number(track.getAttribute('height')),
      };
    };

    const getMaskHoleY = () => {
      const hole = document.querySelector('mask rect[fill="black"]')!;

      return {
        start: Number(hole.getAttribute('y')),
        end: Number(hole.getAttribute('y')) + Number(hole.getAttribute('height')),
      };
    };

    it('should draw the zoom range from the top of the slider', () => {
      render(
        <BarChartPro {...horizontalBarProps} initialZoom={[{ axisId: 'y', start: 0, end: 25 }]} />,
        barOptions,
      );

      expect(getAxisTickValues('y')).to.deep.equal(['G0', 'G1', 'G2', 'G3', 'G4']);
      expect(getActiveTrackY()).to.deep.equal({ start: 0, end: height / 4 });
      expect(getMaskHoleY()).to.deep.equal({ start: 0, end: height / 4 });
    });

    it('should draw the zoom range from the bottom of the slider when the axis is reversed', () => {
      render(
        <BarChartPro
          {...horizontalBarProps}
          yAxis={[{ ...horizontalBarProps.yAxis[0], reverse: true }]}
          initialZoom={[{ axisId: 'y', start: 0, end: 25 }]}
        />,
        barOptions,
      );

      expect(getActiveTrackY()).to.deep.equal({ start: (height * 3) / 4, end: height });
      expect(getMaskHoleY()).to.deep.equal({ start: (height * 3) / 4, end: height });
    });

    it('should show the first visible category in the tooltip of the top thumb', () => {
      render(
        <BarChartPro
          {...horizontalBarProps}
          yAxis={[
            {
              ...horizontalBarProps.yAxis[0],
              zoom: { minSpan: 5, slider: { enabled: true, showTooltip: 'always' } },
            },
          ]}
          initialZoom={[{ axisId: 'y', start: 10, end: 35 }]}
        />,
        barOptions,
      );

      expect(screen.getAllByRole('tooltip')[0].textContent).to.equal('G2');
    });

    it('should scroll down the categories when dragging the slider down', async () => {
      const { user } = render(
        <BarChartPro {...horizontalBarProps} initialZoom={[{ axisId: 'y', start: 0, end: 25 }]} />,
        barOptions,
      );
      const activeTrack = document.querySelector(`.${chartsAxisZoomSliderTrackClasses.active}`)!;

      await user.pointer([
        { keys: '[MouseLeft>]', target: activeTrack, coords: { x: 0, y: 10 } },
        { target: activeTrack, coords: { x: 0, y: 60 } },
        { keys: '[/MouseLeft]', target: activeTrack, coords: { x: 0, y: 60 } },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getAxisTickValues('y')).to.deep.equal(['G5', 'G6', 'G7', 'G8', 'G9']);
      expect(getActiveTrackY()).to.deep.equal({ start: 50, end: 100 });
    });

    it('should move the start of the zoom range with the top thumb', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro {...horizontalBarProps} onZoomChange={onZoomChange} />,
        barOptions,
      );
      const startThumb = document.querySelector(`.${chartsAxisZoomSliderThumbClasses.start}`)!;

      await user.pointer([
        { keys: '[MouseLeft>]', target: startThumb, coords: { x: 0, y: 0 } },
        { target: startThumb, coords: { x: 0, y: 50 } },
        { keys: '[/MouseLeft]', target: startThumb, coords: { x: 0, y: 50 } },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'y', start: 25, end: 100 }]);
    });
  });

  describe('keyboard', () => {
    const getSlider = (name: string) => screen.getByRole('slider', { name });

    const focus = (element: HTMLElement) => {
      act(() => element.focus());
    };

    const getRect = (element: Element) => {
      const { x, y, width, height } = element.getBoundingClientRect();

      return { x, y, width, height };
    };

    it('should lay the sliders over the handles and the track', () => {
      render(
        <LineChartPro {...lineChartProps} initialZoom={[{ axisId: 'x', start: 20, end: 70 }]} />,
        options,
      );

      expect(getRect(getSlider('Horizontal axis zoom start'))).to.deep.equal(
        getRect(document.querySelector(`.${chartsAxisZoomSliderThumbClasses.start}`)!),
      );
      expect(getRect(getSlider('Horizontal axis zoom end'))).to.deep.equal(
        getRect(document.querySelector(`.${chartsAxisZoomSliderThumbClasses.end}`)!),
      );
      expect(getRect(getSlider('Horizontal axis zoom range'))).to.deep.equal(
        getRect(document.querySelector(`.${chartsAxisZoomSliderTrackClasses.active}`)!),
      );
    });

    it('should expose the handles and the track as sliders', () => {
      render(
        <LineChartPro {...lineChartProps} initialZoom={[{ axisId: 'x', start: 0, end: 100 }]} />,
        options,
      );

      const startThumb = getSlider('Horizontal axis zoom start');
      const endThumb = getSlider('Horizontal axis zoom end');
      const track = getSlider('Horizontal axis zoom range');

      [startThumb, endThumb, track].forEach((slider) => {
        expect(slider).to.have.attribute('tabindex', '0');
        expect(slider).to.have.attribute('aria-orientation', 'horizontal');
        expect(slider).to.have.attribute('aria-valuemin', '0');
      });

      expect(startThumb).to.have.attribute('aria-valuenow', '0');
      expect(startThumb).to.have.attribute('aria-valuemax', '100');
      expect(startThumb).to.have.attribute('aria-valuetext', 'A');
      expect(endThumb).to.have.attribute('aria-valuenow', '100');
      expect(endThumb).to.have.attribute('aria-valuemax', '100');
      expect(endThumb).to.have.attribute('aria-valuetext', 'D');
      expect(track).to.have.attribute('aria-valuenow', '0');
      expect(track).to.have.attribute('aria-valuemax', '0');
      expect(track).to.have.attribute('aria-valuetext', 'A to D');
    });

    it('should move the start of the zoom range with the start handle', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          onZoomChange={onZoomChange}
          initialZoom={[{ axisId: 'x', start: 20, end: 80 }]}
        />,
        options,
      );
      const startThumb = getSlider('Horizontal axis zoom start');

      focus(startThumb);

      await user.keyboard('{ArrowRight}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 21, end: 80 }]);

      await user.keyboard('{ArrowDown}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 20, end: 80 }]);

      await user.keyboard('{PageUp}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 30, end: 80 }]);

      await user.keyboard('{End}');
      // The default `minSpan` is 10.
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 70, end: 80 }]);
      expect(startThumb).to.have.attribute('aria-valuenow', '70');

      await user.keyboard('{Home}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 0, end: 80 }]);
    });

    it('should move the end of the zoom range with the end handle', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          onZoomChange={onZoomChange}
          initialZoom={[{ axisId: 'x', start: 20, end: 80 }]}
        />,
        options,
      );

      focus(getSlider('Horizontal axis zoom end'));

      await user.keyboard('{ArrowLeft}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 20, end: 79 }]);

      await user.keyboard('{ArrowUp}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 20, end: 80 }]);

      await user.keyboard('{PageDown}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 20, end: 70 }]);

      await user.keyboard('{Home}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 20, end: 30 }]);

      await user.keyboard('{End}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 20, end: 100 }]);
    });

    it('should pan the zoom range with the track', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          onZoomChange={onZoomChange}
          initialZoom={[{ axisId: 'x', start: 20, end: 50 }]}
        />,
        options,
      );
      const track = getSlider('Horizontal axis zoom range');

      focus(track);

      await user.keyboard('{ArrowRight}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 21, end: 51 }]);

      await user.keyboard('{PageDown}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 11, end: 41 }]);

      await user.keyboard('{End}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 70, end: 100 }]);
      expect(track).to.have.attribute('aria-valuenow', '70');
      expect(track).to.have.attribute('aria-valuemax', '70');

      await user.keyboard('{Home}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 0, end: 30 }]);
    });

    it('should move the handles in the direction of the arrow keys on a reversed axis', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          xAxis={[{ ...lineChartProps.xAxis![0], reverse: true }]}
          onZoomChange={onZoomChange}
          initialZoom={[{ axisId: 'x', start: 20, end: 80 }]}
        />,
        options,
      );

      focus(getSlider('Horizontal axis zoom start'));

      // The start handle is on the right of a reversed axis, so moving it right shrinks the start.
      await user.keyboard('{ArrowRight}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 19, end: 80 }]);

      await user.keyboard('{Home}');
      expect(onZoomChange.mock.lastCall![0]).to.deep.equal([{ axisId: 'x', start: 0, end: 80 }]);
    });

    it('should leave the modified arrow keys to the keyboard pan of the chart', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          onZoomChange={onZoomChange}
          initialZoom={[{ axisId: 'x', start: 20, end: 50 }]}
        />,
        options,
      );

      focus(getSlider('Horizontal axis zoom start'));

      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      // The keyboard pan moves the whole range, while the handle alone would only move the start.
      const [{ start, end }] = onZoomChange.mock.lastCall![0];
      expect(start).to.be.above(20);
      expect(end - start).to.be.closeTo(30, 1e-9);
    });

    it('should show the tooltips while the slider is focused when showTooltip is "hover"', async () => {
      render(
        <LineChartPro
          {...lineChartProps}
          xAxis={[
            {
              ...lineChartProps.xAxis![0],
              zoom: { slider: { enabled: true, showTooltip: 'hover' } },
            },
          ]}
        />,
        options,
      );
      const getZoomSliderTooltips = () => document.querySelectorAll('[data-popper-placement]');

      expect(getZoomSliderTooltips().length).to.equal(0);

      focus(getSlider('Horizontal axis zoom start'));
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
      expect(getZoomSliderTooltips().length).to.equal(2);

      // Moving between the parts of the slider keeps the tooltips open.
      focus(getSlider('Horizontal axis zoom range'));
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
      expect(getZoomSliderTooltips().length).to.equal(2);

      act(() => (document.activeElement as HTMLElement).blur());
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
      expect(getZoomSliderTooltips().length).to.equal(0);
    });

    it('should move the focus from the chart to the slider with the Tab key', async () => {
      const { user, container } = render(
        <BarChartPro
          series={[{ data: [10, 20, 30, 40] }]}
          xAxis={[
            {
              id: 'x',
              scaleType: 'band',
              data: ['A', 'B', 'C', 'D'],
              zoom: { slider: { enabled: true } },
            },
          ]}
          yAxis={[{ position: 'none' }]}
          width={100}
          height={130}
          margin={5}
          skipAnimation
        />,
        options,
      );
      const getFocusedBar = () => container.querySelector('rect[fill="none"]');

      await user.keyboard('{Tab}');
      await user.keyboard('{ArrowRight}');
      expect(getFocusedBar()).not.to.equal(null);

      await user.keyboard('{Tab}');
      expect(document.activeElement).to.equal(getSlider('Horizontal axis zoom start'));
      // The item focus belongs to the chart, not to the slider.
      expect(getFocusedBar()).to.equal(null);

      await user.keyboard('{ArrowRight}');
      expect(getFocusedBar()).to.equal(null);

      await user.keyboard('{Tab}');
      expect(document.activeElement).to.equal(getSlider('Horizontal axis zoom range'));

      await user.keyboard('{Tab}');
      expect(document.activeElement).to.equal(getSlider('Horizontal axis zoom end'));

      await user.keyboard('{Shift>}{Tab}{Tab}{Tab}{/Shift}');
      // Coming back to the chart restores its item focus.
      expect(getFocusedBar()).not.to.equal(null);
    });
  });
});
