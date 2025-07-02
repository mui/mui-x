import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  useSelector,
  useStore,
  useAreaPlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
} from '@mui/x-charts/internals';
import { AreaElement } from '@mui/x-charts/LineChart';
import { PreviewPlotProps } from './PreviewPlot.types';

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})();

interface AreaPreviewPlotProps extends PreviewPlotProps {}

export function AreaPreviewPlot({ axisId }: AreaPreviewPlotProps) {
  const completedData = useAreaPreviewData(axisId);

  return (
    <AreaPlotRoot>
      {completedData.map(
        ({ d, seriesId, color, area, gradientId }) =>
          !!area && (
            <AreaElement
              key={seriesId}
              id={seriesId}
              d={d}
              color={color}
              gradientId={gradientId}
              skipAnimation
            />
          ),
      )}
    </AreaPlotRoot>
  );
}

function useAreaPreviewData(axisId: AxisId) {
  const store = useStore();

  const xAxes = useSelector(store, selectorChartPreviewComputedXAxis, [axisId]);
  const yAxes = useSelector(store, selectorChartPreviewComputedYAxis, [axisId]);

  return useAreaPlotData(xAxes, yAxes);
}
