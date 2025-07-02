import * as React from 'react';
import {
  AxisId,
  useSelector,
  useStore,
  useLinePlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
} from '@mui/x-charts/internals';
import { LineElement } from '@mui/x-charts/LineChart';
import { PreviewPlotProps } from './PreviewPlot.types';

interface LinePreviewPlotProps extends PreviewPlotProps {}

export function LinePreviewPlot({ axisId }: LinePreviewPlotProps) {
  const completedData = useLinePreviewData(axisId);
  return (
    <g>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        return (
          <LineElement
            key={seriesId}
            id={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
            skipAnimation
          />
        );
      })}
    </g>
  );
}

function useLinePreviewData(axisId: AxisId) {
  const store = useStore();

  const xAxes = useSelector(store, selectorChartPreviewComputedXAxis, [axisId]);
  const yAxes = useSelector(store, selectorChartPreviewComputedYAxis, [axisId]);

  return useLinePlotData(xAxes, yAxes);
}
