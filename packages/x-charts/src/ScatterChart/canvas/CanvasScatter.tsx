'use client';
import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import {
  type DefaultizedScatterSeriesType,
  type ScatterItemIdentifier,
} from '../../models/seriesType/scatter';
import { type D3Scale } from '../../models/axis';
import { type ColorGetter } from '../../internals/plugins/models/seriesConfig';
import { useScatterPlotData } from '../useScatterPlotData';
import { useChartContext } from '../../context/ChartProvider';
import { type UseChartTooltipSignature } from '../../internals/plugins/featurePlugins/useChartTooltip';
import { type UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { type UseChartHighlightSignature } from '../../internals/plugins/featurePlugins/useChartHighlight';
import { useCanvasContext } from './CanvasContext';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  /**
   * Function to get the color of a scatter item given its data index.
   * The data index argument is optional. If not provided, the color for the entire series is returned.
   * If provided, the color for the specific scatter item is returned.
   */
  colorGetter: ColorGetter<'scatter'>;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    scatterItemIdentifier: ScatterItemIdentifier,
  ) => void;
}

export interface ScatterMarkerProps {
  /**
   * The x coordinate of the data point.
   */
  x: number;
  /**
   * The y coordinate of the data point.
   */
  y: number;
  /**
   * The fill color of the marker.
   */
  color: string;
  /**
   * The size of the marker.
   */
  size: number;
  /**
   * If `true`, the marker is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, the marker is faded.
   */
  isFaded: boolean;
}

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function CanvasScatter(props: ScatterProps) {
  const { series, xScale, yScale, colorGetter } = props;
  const drawingArea = useDrawingArea();

  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();

  const scatterPlotData = useScatterPlotData(series, xScale, yScale, instance.isPointInside);
  const ctx = useCanvasContext();

  React.useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.save();
    const scale = window.devicePixelRatio;

    scatterPlotData.forEach((dataPoint) => {
      const isItemHighlighted = false; // isHighlighted(dataPoint);
      const isItemFaded = false; // !isItemHighlighted && isFaded(dataPoint);

      // eslint-disable-next-line react-compiler/react-compiler
      ctx.fillStyle = colorGetter(dataPoint.dataIndex);
      ctx.globalAlpha = isItemFaded ? 0.3 : 1;

      ctx.beginPath();
      ctx.arc(
        (dataPoint.x - drawingArea.left) / scale,
        (dataPoint.y - drawingArea.top) / scale,
        ((isItemFaded ? 1.2 : 1) * series.markerSize) / scale,
        0,
        2 * Math.PI,
      );
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }, [ctx, colorGetter, scatterPlotData, series.markerSize, drawingArea.left, drawingArea.top]);

  return null;
}

export { CanvasScatter };
