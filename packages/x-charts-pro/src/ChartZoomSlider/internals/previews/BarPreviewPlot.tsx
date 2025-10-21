import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import {
  AxisId,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  useBarPlotData,
  useChartStore,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { BarElement } from '@mui/x-charts/BarChart';
import { PreviewPlotProps } from './PreviewPlot.types';

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
      {completedData.map(({ seriesId, data }) => (
        <g key={seriesId}>
          {data.map(({ dataIndex, color, layout, x, xOrigin, y, yOrigin, width, height }) => {
            return (
              <BarElement
                key={dataIndex}
                id={seriesId}
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
  const store = useChartStore();

  const xAxes = useStore(store, selectorChartPreviewComputedXAxis, axisId);
  const yAxes = useStore(store, selectorChartPreviewComputedYAxis, axisId);

  return useBarPlotData(drawingArea, xAxes, yAxes);
}
