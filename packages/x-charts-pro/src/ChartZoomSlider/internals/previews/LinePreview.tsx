import {
  ChartDrawingArea,
  DEFAULT_X_AXIS_KEY,
  getValueToPositionMapper,
  LineElement,
  useLineSeriesContext,
} from '@mui/x-charts';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useChartGradientIdBuilder } from '@mui/x-charts/hooks/useChartGradientId';
import { warnOnce } from '@mui/x-internals/warning';
import { isBandScale } from '@mui/x-charts/internals/isBandScale';
import { line as d3Line } from 'd3-shape';
import {
  getCurveFactory,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';

const LinePlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})();

export function LinePreview({
  x,
  y,
  height,
  width,
}: {
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const drawingArea: ChartDrawingArea = {
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };

  const completedData = useAggregatedData(drawingArea);
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

function useAggregatedData(drawingArea: ChartDrawingArea) {
  const store = useStore();
  const seriesData = useLineSeriesContext();

  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartComputedXAxes, {
    drawingArea,
    zoomMap: undefined,
  });
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartComputedYAxes, {
    drawingArea,
    zoomMap: undefined,
  });
  const getGradientId = useChartGradientIdBuilder();

  // This memo prevents odd line chart behavior when hydrating.
  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    return stackingGroups.flatMap(({ ids: groupIds }) => {
      return groupIds.flatMap((seriesId) => {
        const {
          xAxisId = defaultXAxisId,
          yAxisId = defaultYAxisId,
          stackedData,
          data,
          connectNulls,
          curve,
          strictStepCurve,
        } = series[seriesId];

        const xScale = xAxis[xAxisId].scale;
        const xPosition = getValueToPositionMapper(xScale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;

        const gradientId: string | undefined =
          (yAxis[yAxisId].colorScale && getGradientId(yAxisId)) ||
          (xAxis[xAxisId].colorScale && getGradientId(xAxisId)) ||
          undefined;

        if (process.env.NODE_ENV !== 'production') {
          if (xData === undefined) {
            throw new Error(
              `MUI X Charts: ${
                xAxisId === DEFAULT_X_AXIS_KEY
                  ? 'The first `xAxis`'
                  : `The x-axis with id "${xAxisId}"`
              } should have data property to be able to display a line plot.`,
            );
          }
          if (xData.length < stackedData.length) {
            warnOnce(
              `MUI X Charts: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
              'error',
            );
          }
        }

        const shouldExpand = curve?.includes('step') && !strictStepCurve && isBandScale(xScale);

        const formattedData: {
          x: any;
          y: [number, number];
          nullData: boolean;
          isExtension?: boolean;
        }[] =
          xData?.flatMap((x, index) => {
            const nullData = data[index] == null;
            if (shouldExpand) {
              const rep = [{ x, y: stackedData[index], nullData, isExtension: false }];
              if (!nullData && (index === 0 || data[index - 1] == null)) {
                rep.unshift({
                  x: (xScale(x) ?? 0) - (xScale.step() - xScale.bandwidth()) / 2,
                  y: stackedData[index],
                  nullData,
                  isExtension: true,
                });
              }
              if (!nullData && (index === data.length - 1 || data[index + 1] == null)) {
                rep.push({
                  x: (xScale(x) ?? 0) + (xScale.step() + xScale.bandwidth()) / 2,
                  y: stackedData[index],
                  nullData,
                  isExtension: true,
                });
              }
              return rep;
            }
            return { x, y: stackedData[index], nullData };
          }) ?? [];

        const d3Data = connectNulls ? formattedData.filter((d) => !d.nullData) : formattedData;

        const linePath = d3Line<{
          x: any;
          y: [number, number];
          nullData: boolean;
          isExtension?: boolean;
        }>()
          .x((d) => (d.isExtension ? d.x : xPosition(d.x)))
          .defined((d) => connectNulls || !d.nullData || !!d.isExtension)
          .y((d) => yScale(d.y[1])!);

        const d = linePath.curve(getCurveFactory(curve))(d3Data) || '';
        return {
          ...series[seriesId],
          gradientId,
          d,
          seriesId,
        };
      });
    });
  }, [seriesData, xAxisIds, yAxisIds, xAxis, yAxis, getGradientId]);

  return allData;
}
