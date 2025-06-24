import * as React from 'react';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
  D3Scale,
  ColorGetter,
  useScatterPlotData,
  scatterSeriesConfig,
  ZoomMap,
} from '@mui/x-charts/internals';
import {
  ChartDrawingArea,
  useScatterSeriesContext,
  useXAxes,
  useYAxes,
  useZAxes,
} from '@mui/x-charts/hooks';
import { ScatterMarker } from '@mui/x-charts/ScatterChart';
import { DefaultizedScatterSeriesType } from '@mui/x-charts/models';

interface ScatterPreviewPlotProps {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
  zoomMap: ZoomMap;
}

export function ScatterPreviewPlot({
  axisId,
  x,
  y,
  height,
  width,
  zoomMap,
}: ScatterPreviewPlotProps) {
  const drawingArea: ChartDrawingArea = {
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };
  const store = useStore();
  const seriesData = useScatterSeriesContext();
  let xAxes = useSelector(store, selectorChartComputedXAxes, [{ drawingArea, zoomMap }]).axis;
  let yAxes = useSelector(store, selectorChartComputedYAxes, [{ drawingArea, zoomMap }]).axis;
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const { zAxis: zAxes, zAxisIds } = useZAxes();
  const defaultZAxisId = zAxisIds[0];

  if (seriesData === undefined) {
    return null;
  }

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxes) {
    xAxes = { [axisId]: xAxes[axisId] };
  } else if (axisId in yAxes) {
    yAxes = { [axisId]: yAxes[axisId] };
  }

  const { series, seriesOrder } = seriesData;

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisId, yAxisId, zAxisId, color } = series[seriesId];

        const colorGetter = scatterSeriesConfig.colorProcessor(
          series[seriesId],
          xAxes[xAxisId ?? defaultXAxisId],
          yAxes[yAxisId ?? defaultYAxisId],
          zAxes[zAxisId ?? defaultZAxisId],
        );
        const xScale = xAxes[xAxisId ?? defaultXAxisId].scale;
        const yScale = yAxes[yAxisId ?? defaultYAxisId].scale;

        return (
          <ScatterPreviewItems
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            colorGetter={colorGetter}
            series={series[seriesId]}
            drawingArea={drawingArea}
          />
        );
      })}
    </React.Fragment>
  );
}

interface ScatterPreviewItemsProps {
  drawingArea: ChartDrawingArea;
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
}

function ScatterPreviewItems(props: ScatterPreviewItemsProps) {
  const { series, xScale, yScale, color, colorGetter, drawingArea } = props;

  const isPointInside = React.useCallback(
    (x: number, y: number) =>
      x >= drawingArea.left &&
      x <= drawingArea.right &&
      y >= drawingArea.top &&
      y <= drawingArea.bottom,
    [drawingArea.bottom, drawingArea.left, drawingArea.right, drawingArea.top],
  );

  const scatterPlotData = useScatterPlotData(series, xScale, yScale, isPointInside);

  const Marker = ScatterMarker;

  return (
    <g data-series={series.id}>
      {scatterPlotData.map((dataPoint, i) => {
        return (
          <Marker
            key={dataPoint.id ?? dataPoint.dataIndex}
            dataIndex={dataPoint.dataIndex}
            color={colorGetter ? colorGetter(i) : color}
            x={dataPoint.x}
            y={dataPoint.y}
            seriesId={series.id}
            size={series.markerSize}
            isHighlighted={false}
            isFaded={false}
          />
        );
      })}
    </g>
  );
}
