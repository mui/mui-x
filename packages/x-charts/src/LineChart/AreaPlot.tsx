import * as React from 'react';
import PropTypes from 'prop-types';
import { area as d3Area } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { AreaElement, AreaElementProps } from './AreaElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';

export interface AreaPlotSlotsComponent {
  area?: React.JSXElementConstructor<AreaElementProps>;
}

export interface AreaPlotSlotComponentProps {
  area?: Partial<AreaElementProps>;
}

export interface AreaPlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<AreaElementProps, 'slots' | 'slotProps'> {}

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
  const { slots, slotProps, ...other } = props;

  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return (
    <g {...other}>
      {stackingGroups.flatMap(({ ids: groupIds }) => {
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
                `Axis of id "${xAxisKey}" should have data property to be able to display a line plot.`,
              );
            }
            if (xData.length < stackedData.length) {
              throw new Error(
                `MUI: data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items)`,
              );
            }
          }

          const areaPath = d3Area<{
            x: any;
            y: [number, number];
          }>()
            .x((d) => xScale(d.x))
            .defined((_, i) => connectNulls || data[i] != null)
            .y0((d) => d.y && yScale(d.y[0]))
            .y1((d) => d.y && yScale(d.y[1]));

          const curve = getCurveFactory(series[seriesId].curve);
          const formattedData = xData?.map((x, index) => ({ x, y: stackedData[index] })) ?? [];
          const d3Data = connectNulls
            ? formattedData.filter((_, i) => data[i] != null)
            : formattedData;

          return (
            !!series[seriesId].area && (
              <AreaElement
                key={seriesId}
                id={seriesId}
                d={areaPath.curve(curve)(d3Data) || undefined}
                color={series[seriesId].color}
                highlightScope={series[seriesId].highlightScope}
                slots={slots}
                slotProps={slotProps}
              />
            )
          );
        });
      })}
    </g>
  );
}

AreaPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
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
