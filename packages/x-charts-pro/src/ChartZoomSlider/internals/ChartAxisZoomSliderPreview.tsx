import * as React from 'react';
import { AxisId } from '@mui/x-charts/internals';
import { useAggregatedData } from '@mui/x-charts/BarChart/BarPlot';
import { BarElement } from '@mui/x-charts/BarChart';

interface ChartAxisZoomSliderPreviewProps {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  reverse: boolean;
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ChartAxisZoomSliderPreview({
  axisId,
  axisDirection,
  reverse,
  ...props
}: ChartAxisZoomSliderPreviewProps) {
  const { completedData } = useAggregatedData();
  const skipAnimation = true;
  console.log(completedData);

  return (
    <g {...props}>
      {completedData.map(
        ({ seriesId, dataIndex, color, layout, x, xOrigin, y, yOrigin, width, height }) => (
          <BarElement
            key={`${seriesId}-${dataIndex}`}
            id={seriesId}
            dataIndex={dataIndex}
            color={color}
            skipAnimation={skipAnimation ?? false}
            layout={layout ?? 'vertical'}
            x={x}
            xOrigin={xOrigin}
            y={y}
            yOrigin={yOrigin}
            width={width}
            height={height}
          />
        ),
      )}
    </g>
  );
}
