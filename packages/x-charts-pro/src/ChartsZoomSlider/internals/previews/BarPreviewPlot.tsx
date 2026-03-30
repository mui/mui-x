import {
  type AxisId,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  type SeriesProcessorResult,
  useStore,
} from '@mui/x-charts/internals';
import {
  type ChartDrawingArea,
  useBarSeriesContext,
  useChartId,
  useXAxes,
  useYAxes,
} from '@mui/x-charts/hooks';
import { BarElement } from '@mui/x-charts/BarChart';
import { processBarDataForPlot } from '@mui/x-charts/internals';
import { type PreviewPlotProps } from './PreviewPlot.types';

interface BarPreviewPlotProps extends PreviewPlotProps {
  x: number;
  y: number;
  height: number;
  width: number;
}

export function BarPreviewPlot(props: BarPreviewPlotProps) {
  const drawingArea: ChartDrawingArea = {
    left: props.x,
    top: props.y,
    width: props.width,
    height: props.height,
    right: props.x + props.width,
    bottom: props.y + props.height,
  };

  const { completedData } = useBarPreviewData(props.axisId, drawingArea);

  return (
    <g>
      {completedData.map(({ seriesId, layout, xOrigin, yOrigin, data }) => (
        <g key={seriesId}>
          {data.map(({ dataIndex, color, x, y, width, height }) => {
            return (
              <BarElement
                key={dataIndex}
                seriesId={seriesId}
                dataIndex={dataIndex}
                color={color}
                skipAnimation
                layout={layout ?? 'vertical'}
                x={x}
                xOrigin={xOrigin}
                y={y}
                yOrigin={yOrigin}
                width={width}
                height={height}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}

function useBarPreviewData(axisId: AxisId, drawingArea: ChartDrawingArea) {
  const store = useStore();
  const xAxes = store.use(selectorChartPreviewComputedXAxis, axisId);
  const yAxes = store.use(selectorChartPreviewComputedYAxis, axisId);
  const seriesData =
    useBarSeriesContext() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'bar'>);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];

  const chartId = useChartId();

  const stackingGroups = seriesData.stackingGroups.filter((group) =>
    group.ids.some((seriesId) => {
      const series = seriesData.series[seriesId];
      const xAxisId = series.xAxisId ?? defaultXAxisId;
      const yAxisId = series.yAxisId ?? defaultYAxisId;
      return xAxisId === axisId || yAxisId === axisId;
    }),
  );
  const filteredSeries = Object.fromEntries(
    Object.entries(seriesData.series).filter(([_, series]) => {
      const xAxisId = series.xAxisId ?? defaultXAxisId;
      const yAxisId = series.yAxisId ?? defaultYAxisId;
      return xAxisId === axisId || yAxisId === axisId;
    }),
  );

  return processBarDataForPlot(
    drawingArea,
    chartId,
    stackingGroups,
    filteredSeries,
    xAxes,
    yAxes,
    defaultXAxisId,
    defaultYAxisId,
  );
}
