import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
  useAreaPlotData,
  ZoomMap,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { AreaElement } from '@mui/x-charts/LineChart';
import { PreviewPlotProps } from './PreviewPlot.types';

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})();

interface AreaPreviewPlotProps extends PreviewPlotProps {}

export function AreaPreviewPlot({ axisId, x, y, height, width, zoomMap }: AreaPreviewPlotProps) {
  const drawingArea: ChartDrawingArea = {
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };

  const completedData = useAreaPreviewData(axisId, drawingArea, zoomMap);
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

function useAreaPreviewData(axisId: AxisId, drawingArea: ChartDrawingArea, zoomMap: ZoomMap) {
  const store = useStore();

  let xAxes = useSelector(store, selectorChartComputedXAxes, [{ drawingArea, zoomMap }]).axis;
  let yAxes = useSelector(store, selectorChartComputedYAxes, [{ drawingArea, zoomMap }]).axis;

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxes) {
    xAxes = { [axisId]: xAxes[axisId] };
  } else if (axisId in yAxes) {
    yAxes = { [axisId]: yAxes[axisId] };
  }

  return useAreaPlotData(xAxes, yAxes);
}
