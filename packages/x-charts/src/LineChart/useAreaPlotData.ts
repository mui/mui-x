import * as React from 'react';
import { area as d3Area } from '@mui/x-charts-vendor/d3-shape';
import { useChartGradientIdBuilder } from '../hooks/useChartGradientId';
import { isOrdinalScale } from '../internals/scaleGuards';
import { type ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { getCurveFactory } from '../internals/getCurve';
import { type ChartsXAxisProps, type ChartsYAxisProps } from '../models';
import { getValueToPositionMapper, useLineSeriesContext, useXAxes, useYAxes } from '../hooks';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { type SeriesId } from '../models/seriesType/common';

interface AreaPlotDataPoint {
  d: string;
  seriesId: SeriesId;
  color: string;
  area?: boolean;
  gradientId?: string;
}

export function useAreaPlotData(
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
    const areaPlotData: AreaPlotDataPoint[] = [];

    for (const stackingGroup of stackingGroups) {
      const groupIds = stackingGroup.ids;

      for (let i = groupIds.length - 1; i >= 0; i -= 1) {
        const seriesId = groupIds[i];
        const {
          xAxisId = defaultXAxisId,
          yAxisId = defaultYAxisId,
          visibleStackedData,
          stackedData,
          data,
          connectNulls,
          baseline,
          curve,
          strictStepCurve,
          area,
        } = series[seriesId];

        if (!area || !(xAxisId in xAxes) || !(yAxisId in yAxes)) {
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
            throw new Error(
              `MUI X Charts: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
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

        const areaPath = d3Area<{
          x: any;
          y: [number, number];
          nullData: boolean;
          isExtension?: boolean;
        }>()
          .x((d) => (d.isExtension ? d.x : xPosition(d.x)))
          .defined((d) => connectNulls || !d.nullData || !!d.isExtension)
          .y0((d) => {
            if (typeof baseline === 'number') {
              return yScale(baseline)!;
            }
            if (baseline === 'max') {
              return yScale.range()[1];
            }
            if (baseline === 'min') {
              return yScale.range()[0];
            }

            const value = d.y && yScale(d.y[0])!;
            if (Number.isNaN(value)) {
              return yScale.range()[0];
            }
            return value;
          })
          .y1((d) => d.y && yScale(d.y[1])!);

        const d = areaPath.curve(getCurveFactory(curve))(d3Data) || '';
        areaPlotData.push({
          area: series[seriesId].area,
          color: series[seriesId].color,
          gradientId,
          d,
          seriesId,
        });
      }
    }

    return areaPlotData;
  }, [seriesData, defaultXAxisId, defaultYAxisId, xAxes, yAxes, getGradientId]);

  return allData;
}
