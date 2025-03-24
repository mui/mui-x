'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { warnOnce } from '@mui/x-internals/warning';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import {
  LineElement,
  lineElementClasses,
  LineElementProps,
  LineElementSlotProps,
  LineElementSlots,
} from './LineElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import { getCurveFactory } from '../internals/getCurve';
import { isBandScale } from '../internals/isBandScale';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { LineItemIdentifier } from '../models/seriesType/line';
import { useLineSeriesContext } from '../hooks/useLineSeries';
import { useSkipAnimation } from '../context/AnimationProvider';
import { useChartGradientIdBuilder } from '../hooks/useChartGradientId';
import { useXAxes, useYAxes } from '../hooks';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';

export interface LinePlotSlots extends LineElementSlots {}

export interface LinePlotSlotProps extends LineElementSlotProps {}

export interface LinePlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<LineElementProps, 'slots' | 'slotProps' | 'skipAnimation'> {
  /**
   * Callback fired when a line item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemIdentifier,
  ) => void;
}

const LinePlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  [`& .${lineElementClasses.root}`]: {
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
              `MUI X: ${
                xAxisId === DEFAULT_X_AXIS_KEY
                  ? 'The first `xAxis`'
                  : `The x-axis with id "${xAxisId}"`
              } should have data property to be able to display a line plot.`,
            );
          }
          if (xData.length < stackedData.length) {
            warnOnce(
              `MUI X: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
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
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LinePlot API](https://mui.com/x/api/charts/line-plot/)
 */
function LinePlot(props: LinePlotProps) {
  const { slots, slotProps, skipAnimation: inSkipAnimation, onItemClick, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const completedData = useAggregatedData();
  return (
    <LinePlotRoot {...other}>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        return (
          <LineElement
            key={seriesId}
            id={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
            skipAnimation={skipAnimation}
            slots={slots}
            slotProps={slotProps}
            onClick={onItemClick && ((event) => onItemClick(event, { type: 'line', seriesId }))}
          />
        );
      })}
    </LinePlotRoot>
  );
}

LinePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line item is clicked.
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

export { LinePlot };
