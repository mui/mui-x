import * as React from 'react';
import PropTypes from 'prop-types';
import { area as d3Area } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import {
  AreaElement,
  AreaElementProps,
  AreaElementSlotProps,
  AreaElementSlots,
} from './AreaElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { LineItemIdentifier } from '../models/seriesType/line';

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

const useAggregatedData = () => {
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return [];
  }

  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return stackingGroups.flatMap(({ ids: groupIds }) => {
    return groupIds.flatMap((seriesId) => {
      const {
        xAxisKey = defaultXAxisId,
        yAxisKey = defaultYAxisId,
        stackedData,
        data,
        connectNulls,
      } = series[seriesId];

      const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
      const yScale = yAxis[yAxisKey].scale;
      const xData = xAxis[xAxisKey].data;

      if (process.env.NODE_ENV !== 'production') {
        if (xData === undefined) {
          throw new Error(
            `MUI X Charts: ${
              xAxisKey === DEFAULT_X_AXIS_KEY
                ? 'The first `xAxis`'
                : `The x-axis with id "${xAxisKey}"`
            } should have data property to be able to display a line plot.`,
          );
        }
        if (xData.length < stackedData.length) {
          throw new Error(
            `MUI X Charts: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
          );
        }
      }

      const areaPath = d3Area<{
        x: any;
        y: [number, number];
      }>()
        .x((d) => xScale(d.x))
        .defined((_, i) => connectNulls || data[i] != null)
        .y0((d) => d.y && yScale(d.y[0])!)
        .y1((d) => d.y && yScale(d.y[1])!);

      const curve = getCurveFactory(series[seriesId].curve);
      const formattedData = xData?.map((x, index) => ({ x, y: stackedData[index] })) ?? [];
      const d3Data = connectNulls ? formattedData.filter((_, i) => data[i] != null) : formattedData;

      const d = areaPath.curve(curve)(d3Data) || '';
      return {
        ...series[seriesId],
        d,
        seriesId,
      };
    });
  });
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
  const { slots, slotProps, onItemClick, skipAnimation, ...other } = props;

  const completedData = useAggregatedData();

  return (
    <g {...other}>
      {completedData
        .reverse()
        .map(
          ({ d, seriesId, color, highlightScope, area }) =>
            !!area && (
              <AreaElement
                key={seriesId}
                id={seriesId}
                d={d}
                color={color}
                highlightScope={highlightScope}
                slots={slots}
                slotProps={slotProps}
                onClick={onItemClick && ((event) => onItemClick(event, { type: 'line', seriesId }))}
                skipAnimation={skipAnimation}
              />
            ),
        )}
    </g>
  );
}

AreaPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
