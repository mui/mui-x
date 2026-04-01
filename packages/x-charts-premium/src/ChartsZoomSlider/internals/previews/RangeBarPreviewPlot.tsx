import {
  type AxisId,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  useStore,
} from '@mui/x-charts/internals';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import { BarElement } from '@mui/x-charts/BarChart';
import { type PreviewPlotProps } from '@mui/x-charts-pro/internals';
import { useRangeBarPlotData } from '../../../BarChartPremium/RangeBar/useRangeBarPlotData';

export function RangeBarPreviewPlot(props: PreviewPlotProps) {
  const drawingArea: ChartDrawingArea = {
    left: props.x,
    top: props.y,
    width: props.width,
    height: props.height,
    right: props.x + props.width,
    bottom: props.y + props.height,
  };

  const completedData = useBarPreviewData(props.axisId, drawingArea);

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

  return useRangeBarPlotData(drawingArea, xAxes, yAxes);
}
