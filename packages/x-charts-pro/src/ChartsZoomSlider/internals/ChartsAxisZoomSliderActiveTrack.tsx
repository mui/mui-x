'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import {
  getChartPoint,
  invertScale,
  selectorChartAxis,
  selectorChartAxisZoomOptionsLookup,
  useChartsContext,
  useDrawingArea,
  useStore,
} from '@mui/x-charts/internals';
import type { AxisId, ComputedAxis, ZoomData } from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import { shouldForwardProp } from '@mui/system';
import { selectorChartAxisZoomData } from '../../internals/plugins/useChartProZoom';
import type { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom';
import { ChartsAxisZoomSliderThumb } from './ChartsAxisZoomSliderThumb';
import { ChartsTooltipZoomSliderValue } from './ChartsTooltipZoomSliderValue';
import {
  calculateZoomEnd,
  calculateZoomFromPoint,
  calculateZoomStart,
  getZoomSliderKeyboardStep,
  getZoomSliderKeyMovement,
} from './zoom-utils';
import {
  ZOOM_SLIDER_THUMB_HEIGHT,
  ZOOM_SLIDER_THUMB_WIDTH,
  ZOOM_SLIDER_TOUCH_TARGET,
} from './constants';
import { useUtilityClasses } from './chartsAxisZoomSliderTrackClasses';

/**
 * Invisible touch target that is only active on coarse pointer devices (touch).
 * On fine pointer devices (mouse), it disables pointer events so it doesn't
 * interfere with precise interactions on small zoom ranges.
 */
const TouchTarget = styled('rect')({
  '@media (pointer: fine)': {
    pointerEvents: 'none',
  },
});

const ZoomSliderActiveTrackRect = styled('rect', {
  slot: 'internal',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'preview',
})<{ preview: boolean }>(({ theme }) => ({
  fill: (theme.vars || theme).palette.grey[600],
  ...theme.applyStyles('dark', {
    fill: (theme.vars || theme).palette.grey[500],
  }),
  cursor: 'grab',
  variants: [
    {
      props: { preview: true },
      style: {
        fill: 'transparent',
        // Increases the specificity to override the default fill
        ...theme.applyStyles('dark', {
          fill: 'transparent',
        }),
        rx: 4,
        ry: 4,
        stroke: (theme.vars || theme).palette.grey[500],
      },
    },
  ],
}));

/**
 * Invisible HTML element laid over a handle of the zoom slider, which makes it focusable and operable
 * with the keyboard. The chart SVG is hidden from assistive technologies, so the slider is exposed
 * through these elements, the same way the accessibility proxy exposes the chart items.
 * Pointer events go through it to the SVG elements below.
 */
const ZoomSliderControl = styled('div', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  borderRadius: 4,
  outline: 'none',
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.text.primary}`,
  },
}));

interface ZoomSliderHandleControlProps {
  label: string;
  orientation: 'horizontal' | 'vertical';
  min: number;
  max: number;
  now: number;
  /**
   * The formatted value of the handle, announced instead of `now` when it is not empty.
   */
  text: string;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  left: number;
  top: number;
  width: number;
  height: number;
}

function ZoomSliderHandleControl({
  label,
  orientation,
  min,
  max,
  now,
  text,
  onKeyDown,
  left,
  top,
  width,
  height,
}: ZoomSliderHandleControlProps) {
  return (
    <ZoomSliderControl
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation={orientation}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={now}
      aria-valuetext={text !== '' ? text : undefined}
      onKeyDown={onKeyDown}
      style={{ left, top, width, height }}
    />
  );
}

export interface ChartsAxisZoomSliderActiveTrackProps {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  axisPosition: 'top' | 'bottom' | 'left' | 'right';
  /**
   * The horizontal position of the zoom slider in the chart.
   * Places the elements that expose the slider to the keyboard and to assistive technologies.
   */
  x: number;
  /**
   * The vertical position of the zoom slider in the chart.
   * Places the elements that expose the slider to the keyboard and to assistive technologies.
   */
  y: number;
  size: number;
  preview: boolean;
  zoomData: ZoomData;
  reverse?: boolean;
  showTooltip: boolean;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  /**
   * Called when the focus enters the slider.
   */
  onFocus?: () => void;
  /**
   * Called when the focus leaves the slider.
   */
  onBlur?: () => void;
}

export function ChartsAxisZoomSliderActiveTrack({
  axisId,
  axisDirection,
  axisPosition,
  x,
  y,
  size,
  preview,
  zoomData,
  reverse,
  showTooltip,
  onPointerEnter,
  onPointerLeave,
  onInteractionStart,
  onInteractionEnd,
  onFocus,
  onBlur,
}: ChartsAxisZoomSliderActiveTrackProps) {
  const { instance } = useChartsContext<[UseChartProZoomSignature]>();
  const { chartsLayerContainerRef } = instance;
  const store = useStore<[UseChartProZoomSignature]>();
  const axis = store.use(selectorChartAxis, axisId);
  const drawingArea = useDrawingArea();
  const activeTrackGroupRef = React.useRef<SVGGElement>(null);
  const touchTargetRef = React.useRef<SVGRectElement>(null);
  const [startThumbEl, setStartThumbEl] = React.useState<SVGRectElement | null>(null);
  const [endThumbEl, setEndThumbEl] = React.useState<SVGRectElement | null>(null);
  const { tooltipStart, tooltipEnd } = getZoomSliderTooltipsText(axis, drawingArea);
  const { localeText } = useChartsLocalization();
  // Read in an effect: the layer container is an ancestor, so its ref is not attached yet during
  // the render, nor during the layout effects of its children.
  const [layerContainer, setLayerContainer] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setLayerContainer(chartsLayerContainerRef.current);
  }, [chartsLayerContainerRef]);
  const classes = useUtilityClasses({ axisDirection });

  const previewThumbWidth =
    axisDirection === 'x' ? ZOOM_SLIDER_THUMB_WIDTH : ZOOM_SLIDER_THUMB_HEIGHT;
  const previewThumbHeight =
    axisDirection === 'x' ? ZOOM_SLIDER_THUMB_HEIGHT : ZOOM_SLIDER_THUMB_WIDTH;

  React.useEffect(() => {
    const group = activeTrackGroupRef.current;
    const touchTarget = touchTargetRef.current;

    if (!group || !touchTarget) {
      return;
    }

    let prevPointerZoom = 0;

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      const element = chartsLayerContainerRef.current;

      if (!element) {
        return;
      }

      const point = getChartPoint(element, event);
      const pointerZoom = calculateZoomFromPoint(store.state, axisId, point);

      if (pointerZoom === null) {
        return;
      }

      const deltaZoom = pointerZoom - prevPointerZoom;
      prevPointerZoom = pointerZoom;

      instance.moveZoomRange(axisId, deltaZoom);
    });

    const onPointerUp = () => {
      group.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      onInteractionEnd?.();
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging
      event.preventDefault();
      // Use the touch target rect for pointer capture as setPointerCapture
      // does not work reliably on SVG <g> elements on touch devices.
      touchTarget.setPointerCapture(event.pointerId);
      onInteractionStart?.();

      const axisZoomData = selectorChartAxisZoomData(store.state, axisId);
      const element = chartsLayerContainerRef.current;

      if (!axisZoomData || !element) {
        return;
      }

      const point = getChartPoint(element, event);
      const pointerDownZoom = calculateZoomFromPoint(store.state, axisId, point);

      if (pointerDownZoom === null) {
        return;
      }

      prevPointerZoom = pointerDownZoom;

      document.addEventListener('pointerup', onPointerUp);
      group.addEventListener('pointermove', onPointerMove);
    };

    // Listen on the group so events from both the visible rect and touch target are captured
    group.addEventListener('pointerdown', onPointerDown);

    // eslint-disable-next-line consistent-return
    return () => {
      group.removeEventListener('pointerdown', onPointerDown);
      onPointerMove.clear();
    };
  }, [
    axisDirection,
    axisId,
    instance,
    reverse,
    store,
    chartsLayerContainerRef,
    onInteractionStart,
    onInteractionEnd,
  ]);

  const updateZoomStart = (getNewStart: (zoom: ZoomData) => number | null) => {
    const zoomOptions = selectorChartAxisZoomOptionsLookup(store.state, axisId);

    instance.setAxisZoomData(axisId, (zoom) => {
      const newStart = getNewStart(zoom);

      if (newStart === null) {
        return zoom;
      }

      return { ...zoom, start: calculateZoomStart(newStart, zoom, zoomOptions) };
    });
  };

  const updateZoomEnd = (getNewEnd: (zoom: ZoomData) => number | null) => {
    const zoomOptions = selectorChartAxisZoomOptionsLookup(store.state, axisId);

    instance.setAxisZoomData(axisId, (zoom) => {
      const newEnd = getNewEnd(zoom);

      if (newEnd === null) {
        return zoom;
      }

      return { ...zoom, end: calculateZoomEnd(newEnd, zoom, zoomOptions) };
    });
  };

  const onStartThumbMove = (event: PointerEvent) => {
    const element = chartsLayerContainerRef.current;

    if (!element) {
      return;
    }

    const point = getChartPoint(element, event);

    updateZoomStart(() => calculateZoomFromPoint(store.state, axisId, point));
  };

  const onEndThumbMove = (event: PointerEvent) => {
    const element = chartsLayerContainerRef.current;

    if (!element) {
      return;
    }

    const point = getChartPoint(element, event);

    updateZoomEnd(() => calculateZoomFromPoint(store.state, axisId, point));
  };

  const keyboardStep = getZoomSliderKeyboardStep(axis);

  const onStartThumbKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movement = getZoomSliderKeyMovement(event, reverse ?? false, keyboardStep);

    if (movement === null) {
      return;
    }

    // Keeps the page from scrolling, even when the handle is already at a boundary.
    event.preventDefault();
    updateZoomStart((zoom) => zoom.start + movement);
  };

  const onEndThumbKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movement = getZoomSliderKeyMovement(event, reverse ?? false, keyboardStep);

    if (movement === null) {
      return;
    }

    event.preventDefault();
    updateZoomEnd((zoom) => zoom.end + movement);
  };

  let previewX: number;
  let previewY: number;
  let previewWidth: number;
  let previewHeight: number;
  let startThumbX: number;
  let startThumbY: number;
  let endThumbX: number;
  let endThumbY: number;

  const { minStart, maxEnd, minSpan } = selectorChartAxisZoomOptionsLookup(store.state, axisId);
  const range = maxEnd - minStart;
  const zoomStart = Math.max(minStart, zoomData.start);
  const zoomEnd = Math.min(zoomData.end, maxEnd);

  if (axisDirection === 'x') {
    previewX = ((zoomStart - minStart) / range) * drawingArea.width;
    previewY = 0;
    previewWidth = (drawingArea.width * (zoomEnd - zoomStart)) / range;
    previewHeight = size;

    startThumbX = ((zoomStart - minStart) / range) * drawingArea.width;
    startThumbY = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
    endThumbX = ((zoomEnd - minStart) / range) * drawingArea.width;
    endThumbY = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;

    if (reverse) {
      previewX = drawingArea.width - previewX - previewWidth;

      startThumbX = drawingArea.width - startThumbX;
      endThumbX = drawingArea.width - endThumbX;
    }

    startThumbX -= previewThumbWidth / 2;
    endThumbX -= previewThumbWidth / 2;
  } else {
    previewX = 0;
    previewY = drawingArea.height - ((zoomEnd - minStart) / range) * drawingArea.height;
    previewWidth = size;
    previewHeight = (drawingArea.height * (zoomEnd - zoomStart)) / range;

    startThumbX = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
    startThumbY = drawingArea.height - ((zoomStart - minStart) / range) * drawingArea.height;
    endThumbX = ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
    endThumbY = drawingArea.height - ((zoomEnd - minStart) / range) * drawingArea.height;

    if (reverse) {
      previewY = drawingArea.height - previewY - previewHeight;

      startThumbY = drawingArea.height - startThumbY;
      endThumbY = drawingArea.height - endThumbY;
    }

    startThumbY -= previewThumbHeight / 2;
    endThumbY -= previewThumbHeight / 2;
  }

  const previewOffset = ZOOM_SLIDER_THUMB_HEIGHT > size ? (ZOOM_SLIDER_THUMB_HEIGHT - size) / 2 : 0;

  const activeTrackX = previewX + (axisDirection === 'x' ? 0 : previewOffset);
  const activeTrackY = previewY + (axisDirection === 'x' ? previewOffset : 0);

  // Compute a larger invisible touch target centered on the visible active track
  const touchWidth =
    axisDirection === 'y' ? Math.max(previewWidth, ZOOM_SLIDER_TOUCH_TARGET) : previewWidth;
  const touchHeight =
    axisDirection === 'x' ? Math.max(previewHeight, ZOOM_SLIDER_TOUCH_TARGET) : previewHeight;
  const touchX = activeTrackX - (touchWidth - previewWidth) / 2;
  const touchY = activeTrackY - (touchHeight - previewHeight) / 2;

  const orientation = axisDirection === 'x' ? 'horizontal' : 'vertical';

  const axisLabel = axis?.label;
  const startHandle: ZoomSliderHandleControlProps = {
    label: localeText.zoomSliderStartLabel({ axisDirection, axisLabel }),
    orientation,
    min: minStart,
    max: Math.max(zoomStart, zoomEnd - minSpan),
    now: zoomStart,
    text: tooltipStart,
    onKeyDown: onStartThumbKeyDown,
    left: x + startThumbX,
    top: y + startThumbY,
    width: previewThumbWidth,
    height: previewThumbHeight,
  };
  const endHandle: ZoomSliderHandleControlProps = {
    label: localeText.zoomSliderEndLabel({ axisDirection, axisLabel }),
    orientation,
    min: Math.min(zoomEnd, zoomStart + minSpan),
    max: maxEnd,
    now: zoomEnd,
    text: tooltipEnd,
    onKeyDown: onEndThumbKeyDown,
    left: x + endThumbX,
    top: y + endThumbY,
    width: previewThumbWidth,
    height: previewThumbHeight,
  };
  // The handles are in the order they appear on the screen, which is not the one of the zoom for a
  // vertical slider: its start is at the bottom, so the focus goes top to bottom.
  const handles =
    axisDirection === 'y' && endThumbY < startThumbY
      ? [endHandle, startHandle]
      : [startHandle, endHandle];

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // The focus moving between the handles stays in the slider.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onBlur?.();
    }
  };

  return (
    <React.Fragment>
      <g ref={activeTrackGroupRef}>
        <ZoomSliderActiveTrackRect
          x={activeTrackX}
          y={activeTrackY}
          preview={preview}
          width={previewWidth}
          height={previewHeight}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className={classes.active}
        />
        {/* Invisible touch target rendered on top for easier interaction on touch devices */}
        <TouchTarget
          ref={touchTargetRef}
          x={touchX}
          y={touchY}
          width={touchWidth}
          height={touchHeight}
          fill="transparent"
          stroke="none"
          cursor="grab"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
      </g>
      <ChartsAxisZoomSliderThumb
        ref={setStartThumbEl}
        x={startThumbX}
        y={startThumbY}
        width={previewThumbWidth}
        height={previewThumbHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onMove={onStartThumbMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onInteractionStart={onInteractionStart}
        onInteractionEnd={onInteractionEnd}
        placement="start"
      />
      <ChartsAxisZoomSliderThumb
        ref={setEndThumbEl}
        x={endThumbX}
        y={endThumbY}
        width={previewThumbWidth}
        height={previewThumbHeight}
        orientation={axisDirection === 'x' ? 'horizontal' : 'vertical'}
        onMove={onEndThumbMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onInteractionStart={onInteractionStart}
        onInteractionEnd={onInteractionEnd}
        placement="end"
      />
      {layerContainer &&
        ReactDOM.createPortal(
          // `display: contents` keeps the wrapper out of the layout of the layer container.
          <div style={{ display: 'contents' }} onFocus={onFocus} onBlur={handleBlur}>
            {handles.map((handle) => (
              <ZoomSliderHandleControl key={handle.label} {...handle} />
            ))}
          </div>,
          layerContainer,
        )}
      <ChartsTooltipZoomSliderValue
        anchorEl={startThumbEl}
        open={showTooltip && tooltipStart !== ''}
        placement={axisPosition}
      >
        {tooltipStart}
      </ChartsTooltipZoomSliderValue>
      <ChartsTooltipZoomSliderValue
        anchorEl={endThumbEl}
        open={showTooltip && tooltipEnd !== ''}
        placement={axisPosition}
      >
        {tooltipEnd}
      </ChartsTooltipZoomSliderValue>
    </React.Fragment>
  );
}

/**
 * Returns the text for the tooltips on the thumbs of the zoom slider.
 */
function getZoomSliderTooltipsText(axis: ComputedAxis, drawingArea: ChartDrawingArea) {
  const formatValue = (value: Date | number | null) => {
    if (axis.valueFormatter) {
      return axis.valueFormatter(value, { location: 'zoom-slider-tooltip', scale: axis.scale });
    }

    return `${value}`;
  };

  const axisDirection = axis.position === 'top' || axis.position === 'bottom' ? 'x' : 'y';

  let start = axisDirection === 'x' ? drawingArea.left : drawingArea.top;
  const size = axisDirection === 'x' ? drawingArea.width : drawingArea.height;
  let end = start + size;
  if (axisDirection === 'y') {
    [start, end] = [end, start]; // Invert for y-axis
  }

  if (axis.zoom?.reverse) {
    [start, end] = [end, start]; // Reverse the start and end if the zoom range is reversed
  }

  const startValue = invertScale(axis.scale, axis.data ?? [], start) ?? axis.data?.at(0);
  const endValue = invertScale(axis.scale, axis.data ?? [], end) ?? axis.data?.at(-1);

  const tooltipStart = formatValue(startValue);
  const tooltipEnd = formatValue(endValue);

  return { tooltipStart, tooltipEnd };
}
