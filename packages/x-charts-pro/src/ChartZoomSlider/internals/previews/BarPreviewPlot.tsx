import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  BarClipPath,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useBarPlotData,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { BarElement } from '@mui/x-charts/BarChart';

const BarPlotRoot = styled('g', {
  name: 'MuiBarPlot',
  slot: 'Root',
})();

export function BarPreviewPlot(props: {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const drawingArea: ChartDrawingArea = {
    left: props.x,
    top: props.y,
    width: props.width,
    height: props.height,
    right: props.x + props.width,
    bottom: props.y + props.height,
  };

  const borderRadius = 0; // TODO: How to obtain the border radius from props?
  const withoutBorderRadius = !borderRadius || borderRadius <= 0;
  const { completedData, masksData } = useBarPreviewData(props.axisId, drawingArea);

  return (
    <BarPlotRoot>
      {!withoutBorderRadius &&
        masksData.map(({ id, x, y, width, height, hasPositive, hasNegative, layout }) => {
          return (
            <BarClipPath
              key={id}
              maskId={id}
              borderRadius={borderRadius}
              hasNegative={hasNegative}
              hasPositive={hasPositive}
              layout={layout}
              x={x}
              y={y}
              width={width}
              height={height}
              skipAnimation
            />
          );
        })}
      {completedData.map(({ seriesId, data }) => (
        <g key={seriesId}>
          {data.map(
            ({ dataIndex, color, maskId, layout, x, xOrigin, y, yOrigin, width, height }) => {
              const barElement = (
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

              if (withoutBorderRadius) {
                return barElement;
              }

              return (
                <g key={dataIndex} clipPath={`url(#${maskId})`}>
                  {barElement}
                </g>
              );
            },
          )}
        </g>
      ))}
    </BarPlotRoot>
  );
}

function useBarPreviewData(axisId: AxisId, drawingArea: ChartDrawingArea) {
  const store = useStore();

  let xAxes = useSelector(store, selectorChartComputedXAxes, [
    { drawingArea, zoomMap: undefined },
  ]).axis;
  let yAxes = useSelector(store, selectorChartComputedYAxes, [
    { drawingArea, zoomMap: undefined },
  ]).axis;

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxes) {
    xAxes = { [axisId]: xAxes[axisId] };
  } else if (axisId in yAxes) {
    yAxes = { [axisId]: yAxes[axisId] };
  }

  return useBarPlotData(drawingArea, xAxes, yAxes);
}
