import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
  useLinePlotData,
  ZoomMap,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { LineElement } from '@mui/x-charts/LineChart';

const LinePlotRoot = styled('g', {
  name: 'MuiLinePlot',
  slot: 'Root',
})();

interface LinePreviewPlotProps {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
  zoomMap: ZoomMap;
}

export function LinePreviewPlot({ axisId, x, y, height, width, zoomMap }: LinePreviewPlotProps) {
  const drawingArea: ChartDrawingArea = {
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };

  const completedData = useLinePreviewData(axisId, drawingArea, zoomMap);
  return (
    <LinePlotRoot>
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
    </LinePlotRoot>
  );
}

function useLinePreviewData(axisId: AxisId, drawingArea: ChartDrawingArea, zoomMap: ZoomMap) {
  const store = useStore();

  let xAxes = useSelector(store, selectorChartComputedXAxes, [{ drawingArea, zoomMap }]).axis;
  let yAxes = useSelector(store, selectorChartComputedYAxes, [{ drawingArea, zoomMap }]).axis;

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxes) {
    xAxes = { [axisId]: xAxes[axisId] };
  } else if (axisId in yAxes) {
    yAxes = { [axisId]: yAxes[axisId] };
  }

  return useLinePlotData(xAxes, yAxes);
}
