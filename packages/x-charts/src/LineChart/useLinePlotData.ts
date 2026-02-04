import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { useChartGradientIdBuilder } from '../hooks/useChartGradientId';
import { isOrdinalScale } from '../internals/scaleGuards';
import { type ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { getCurveFactory } from '../internals/getCurve';
import { type ChartsXAxisProps, type ChartsYAxisProps } from '../models';
import { getValueToPositionMapper, useLineSeriesContext, useXAxes, useYAxes } from '../hooks';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { type SeriesId } from '../models/seriesType/common';

interface LinePlotDataPoint {
  d: string;
  seriesId: SeriesId;
  color: string;
  gradientId?: string;
  hidden: boolean;
}

export function useLinePlotData(
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
) {
  const seriesData = useLineSeriesContext();
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const getGradientId = useChartGradientIdBuilder();

  // This memo prevents odd line chart behavior when hydrating.
  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;

    const linePlotData: LinePlotDataPoint[] = [];

    for (const stackingGroup of stackingGroups) {
      const groupIds = stackingGroup.ids;

      for (const seriesId of groupIds) {
        const {
          xAxisId = defaultXAxisId,
          yAxisId = defaultYAxisId,
          stackedData,
          visibleStackedData,
          data,
          connectNulls,
          curve,
          strictStepCurve,
        } = series[seriesId];

        if (!(xAxisId in xAxes) || !(yAxisId in yAxes)) {
          continue;
        }

        const xScale = xAxes[xAxisId].scale;
        const xPosition = getValueToPositionMapper(xScale);
        const yScale = yAxes[yAxisId].scale;
        const xData = xAxes[xAxisId].data;

        const gradientId: string | undefined =
          (yAxes[yAxisId].colorScale && getGradientId(yAxisId)) ||
          (xAxes[xAxisId].colorScale && getGradientId(xAxisId)) ||
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

        const shouldExpand = curve?.includes('step') && !strictStepCurve && isOrdinalScale(xScale);

        const formattedData: {
          x: any;
          y: [number, number];
          nullData: boolean;
          isExtension?: boolean;
        }[] =
          xData?.flatMap((x, index) => {
            const nullData = data[index] == null;
            if (shouldExpand) {
              const rep = [{ x, y: visibleStackedData[index], nullData, isExtension: false }];
              if (!nullData && (index === 0 || data[index - 1] == null)) {
                rep.unshift({
                  x: (xScale(x) ?? 0) - (xScale.step() - xScale.bandwidth()) / 2,
                  y: visibleStackedData[index],
                  nullData,
                  isExtension: true,
                });
              }
              if (!nullData && (index === data.length - 1 || data[index + 1] == null)) {
                rep.push({
                  x: (xScale(x) ?? 0) + (xScale.step() + xScale.bandwidth()) / 2,
                  y: visibleStackedData[index],
                  nullData,
                  isExtension: true,
                });
              }
              return rep;
            }
            return { x, y: visibleStackedData[index], nullData };
          }) ?? [];

        const d3Data = connectNulls ? formattedData.filter((d) => !d.nullData) : formattedData;
        const hidden = series[seriesId].hidden;

        const linePath = d3Line<{
          x: any;
          y: [number, number];
          nullData: boolean;
          isExtension?: boolean;
        }>()
          .x((d) => (d.isExtension ? d.x : xPosition(d.x)))
          .defined((d) => connectNulls || !d.nullData || !!d.isExtension)
          .y((d) => {
            if (hidden) {
              return yScale(yScale.domain()[0] as number)!;
            }

            return yScale(d.y[1])!;
          });

        const d = linePath.curve(getCurveFactory(curve))(d3Data) || '';
        linePlotData.push({
          color: series[seriesId].color,
          gradientId,
          d,
          seriesId,
          hidden: series[seriesId].hidden,
        });
      }
    }

    return linePlotData;
  }, [seriesData, defaultXAxisId, defaultYAxisId, xAxes, yAxes, getGradientId]);

  return allData;
}
