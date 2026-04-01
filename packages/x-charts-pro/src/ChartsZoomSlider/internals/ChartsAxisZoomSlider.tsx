'use client';
import * as React from 'react';
import {
  type AxisId,
  DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP,
  selectorChartAxisZoomOptionsLookup,
  useDrawingArea,
  useStore,
  ZOOM_SLIDER_MARGIN,
  ZOOM_SLIDER_PREVIEW_SIZE,
  type ZoomSliderShowTooltip,
} from '@mui/x-charts/internals';
import { useChartsLayerContainerRef, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { ChartsAxisZoomSliderPreview } from './ChartsAxisZoomSliderPreview';
import {
  ZOOM_SLIDER_ACTIVE_TRACK_SIZE,
  ZOOM_SLIDER_SIZE,
  ZOOM_SLIDER_TRACK_SIZE,
} from './constants';
import { selectorChartAxisZoomData } from '../../internals/plugins/useChartProZoom';
import { ChartsAxisZoomSliderTrack } from './ChartsAxisZoomSliderTrack';
import { ChartsAxisZoomSliderActiveTrack } from './ChartsAxisZoomSliderActiveTrack';

interface ChartsZoomSliderProps {
  /**
   * The ID of the axis this overview refers to.
   */
  axisId: AxisId;
  /**
   * The direction of the axis.
   */
  axisDirection: 'x' | 'y';
}

/**
 * Renders the zoom slider for a specific axis.
 * @internal
 */
export function ChartsAxisZoomSlider({ axisDirection, axisId }: ChartsZoomSliderProps) {
  const store = useStore();
  const drawingArea = useDrawingArea();
  const zoomData = store.use(selectorChartAxisZoomData, axisId);
  const zoomOptions = store.use(selectorChartAxisZoomOptionsLookup, axisId);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();
  const previewOption = zoomOptions.slider.preview;
  const showPreview = !!previewOption;
  const previewSeriesIds = typeof previewOption === 'object' ? previewOption.seriesIds : undefined;

  const sliderRef = React.useRef<SVGGElement>(null);
  const layerContainerRef = useChartsLayerContainerRef();
  const isDraggingRef = React.useRef(false);

  // Prevent scrolling on touch devices when interacting with the zoom slider.
  // Listeners are attached to the parent `<svg>` element because calling
  // `preventDefault` on SVG child elements does not reliably block scrolling —
  // the browser's compositor decides based on the `<svg>` HTML element.
  React.useEffect(() => {
    const slider = sliderRef.current;
    const layerContainer = layerContainerRef.current;
    if (!slider || !layerContainer) {
      return undefined;
    }

    function preventTouchDefault(event: TouchEvent) {
      if (slider && slider.contains(event.target as Node)) {
        event.preventDefault();
      }
    }

    layerContainer.addEventListener('touchstart', preventTouchDefault, { passive: false });
    layerContainer.addEventListener('touchmove', preventTouchDefault, { passive: false });

    return () => {
      layerContainer.removeEventListener('touchstart', preventTouchDefault);
      layerContainer.removeEventListener('touchmove', preventTouchDefault);
    };
  }, [layerContainerRef]);

  const tooltipOn = React.useCallback(() => {
    setShowTooltip(true);
  }, []);

  const tooltipOff = React.useCallback(() => {
    // Don't hide tooltip while dragging — pointerleave fires when the pointer
    // moves away from the element during drag, but we want to keep the tooltip visible.
    if (!isDraggingRef.current) {
      setShowTooltip(false);
    }
  }, []);

  const interactionStart = React.useCallback(() => {
    isDraggingRef.current = true;
    setShowTooltip(true);
  }, []);

  const interactionEnd = React.useCallback(() => {
    isDraggingRef.current = false;
    setShowTooltip(false);
  }, []);

  if (!zoomData) {
    return null;
  }

  let x: number;
  let y: number;
  let reverse: boolean;
  let axisPosition: 'top' | 'bottom' | 'left' | 'right';
  let tooltipConditions: ZoomSliderShowTooltip;
  const sliderSize = showPreview ? ZOOM_SLIDER_PREVIEW_SIZE : ZOOM_SLIDER_SIZE;

  if (axisDirection === 'x') {
    const axis = xAxis[axisId];

    if (!axis || axis.position === 'none') {
      return null;
    }

    const axisSize = axis.height;

    x = drawingArea.left;
    y =
      axis.position === 'bottom'
        ? drawingArea.top + drawingArea.height + axis.offset + axisSize + ZOOM_SLIDER_MARGIN
        : drawingArea.top - axis.offset - axisSize - sliderSize - ZOOM_SLIDER_MARGIN;
    reverse = axis.reverse ?? false;
    axisPosition = axis.position ?? 'bottom';
    tooltipConditions = axis.zoom?.slider?.showTooltip ?? DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP;
  } else {
    const axis = yAxis[axisId];

    if (!axis || axis.position === 'none') {
      return null;
    }

    const axisSize = axis.width;

    x =
      axis.position === 'right'
        ? drawingArea.left + drawingArea.width + axis.offset + axisSize + ZOOM_SLIDER_MARGIN
        : drawingArea.left - axis.offset - axisSize - sliderSize - ZOOM_SLIDER_MARGIN;
    y = drawingArea.top;
    reverse = axis.reverse ?? false;
    axisPosition = axis.position ?? 'left';
    tooltipConditions = axis.zoom?.slider?.showTooltip ?? DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP;
  }

  const backgroundRectOffset = (sliderSize - ZOOM_SLIDER_TRACK_SIZE) / 2;

  const track = showPreview ? (
    <ChartsAxisZoomSliderPreview
      axisId={axisId}
      axisDirection={axisDirection}
      reverse={reverse}
      seriesIds={previewSeriesIds}
      x={0}
      y={0}
      height={axisDirection === 'x' ? ZOOM_SLIDER_PREVIEW_SIZE : drawingArea.height}
      width={axisDirection === 'x' ? drawingArea.width : ZOOM_SLIDER_PREVIEW_SIZE}
    />
  ) : (
    <ChartsAxisZoomSliderTrack
      x={axisDirection === 'x' ? 0 : backgroundRectOffset}
      y={axisDirection === 'x' ? backgroundRectOffset : 0}
      height={axisDirection === 'x' ? ZOOM_SLIDER_TRACK_SIZE : drawingArea.height}
      width={axisDirection === 'x' ? drawingArea.width : ZOOM_SLIDER_TRACK_SIZE}
      rx={ZOOM_SLIDER_TRACK_SIZE / 2}
      ry={ZOOM_SLIDER_TRACK_SIZE / 2}
      axisId={axisId}
      axisDirection={axisDirection}
      reverse={reverse}
      onSelectStart={tooltipConditions === 'hover' ? interactionStart : undefined}
      onSelectEnd={tooltipConditions === 'hover' ? interactionEnd : undefined}
    />
  );

  return (
    <g ref={sliderRef} data-charts-zoom-slider transform={`translate(${x} ${y})`}>
      {track}
      <ChartsAxisZoomSliderActiveTrack
        zoomData={zoomData}
        axisId={axisId}
        axisPosition={axisPosition}
        axisDirection={axisDirection}
        reverse={reverse}
        showTooltip={
          (showTooltip && tooltipConditions !== 'never') || tooltipConditions === 'always'
        }
        size={showPreview ? ZOOM_SLIDER_PREVIEW_SIZE : ZOOM_SLIDER_ACTIVE_TRACK_SIZE}
        preview={showPreview}
        onPointerEnter={tooltipConditions === 'hover' ? tooltipOn : undefined}
        onPointerLeave={tooltipConditions === 'hover' ? tooltipOff : undefined}
        onInteractionStart={tooltipConditions === 'hover' ? interactionStart : undefined}
        onInteractionEnd={tooltipConditions === 'hover' ? interactionEnd : undefined}
      />
    </g>
  );
}
