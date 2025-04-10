'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { area as d3Area } from '@mui/x-charts-vendor/d3-shape';
import {
  AreaElement,
  areaElementClasses,
  AreaElementProps,
  AreaElementSlotProps,
  AreaElementSlots,
} from './AreaElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import { getCurveFactory } from '../internals/getCurve';
import { isBandScale } from '../internals/isBandScale';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { LineItemIdentifier } from '../models/seriesType/line';
import { useLineSeriesContext } from '../hooks/useLineSeries';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useChartGradientIdBuilder } from '../hooks/useChartGradientId';
import { useXAxes, useYAxes } from '../hooks/useAxis';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';

export interface AreaPlotSlots extends AreaElementSlots {}

export interface AreaPlotSlotProps extends AreaElementSlotProps {}

export interface AreaPlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<AreaElementProps, 'slots' | 'slotProps' | 'skipAnimation'> {
  /**
   * Callback fired when a line area item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemIdentifier,
  ) => void;
}

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  [`& .${areaElementClasses.root}`]: {
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  },
});

const useAggregatedData = () => {
  const seriesData = useLineSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
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
      return [...groupIds]
        .reverse() // Revert stacked area for a more pleasant animation
        .map((seriesId) => {
          const {
            xAxisId = defaultXAxisId,
            yAxisId = defaultYAxisId,
            stackedData,
            data,
            connectNulls,
            baseline,
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
                `MUI X: ${
                  xAxisId === DEFAULT_X_AXIS_KEY
                    ? 'The first `xAxis`'
                    : `The x-axis with id "${xAxisId}"`
                } should have data property to be able to display a line plot.`,
              );
            }
            if (xData.length < stackedData.length) {
              throw new Error(
                `MUI X: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
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
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [AreaPlot API](https://mui.com/x/api/charts/area-plot/)
 */
function AreaPlot(props: AreaPlotProps) {
  const { slots, slotProps, onItemClick, skipAnimation: inSkipAnimation, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const completedData = useAggregatedData();

  return (
    <AreaPlotRoot {...other}>
      {completedData.map(
        ({ d, seriesId, color, area, gradientId }) =>
          !!area && (
            <AreaElement
              key={seriesId}
              id={seriesId}
              d={d}
              color={color}
              gradientId={gradientId}
              slots={slots}
              slotProps={slotProps}
              onClick={onItemClick && ((event) => onItemClick(event, { type: 'line', seriesId }))}
              skipAnimation={skipAnimation}
            />
          ),
      )}
    </AreaPlotRoot>
  );
}

AreaPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line area item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { AreaPlot };
