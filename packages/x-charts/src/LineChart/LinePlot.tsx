import * as React from 'react';
import PropTypes from 'prop-types';
import { line as d3Line } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { LineElement, LineElementProps } from './LineElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';

export interface LinePlotSlotsComponent {
  line?: React.JSXElementConstructor<LineElementProps>;
}

export interface LinePlotSlotComponentProps {
  line?: Partial<LineElementProps>;
}

export interface LinePlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<LineElementProps, 'slots' | 'slotProps'> {}

function LinePlot(props: LinePlotProps) {
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
          } = series[seriesId];

          const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
          const yScale = yAxis[yAxisKey].scale;
          const xData = xAxis[xAxisKey].data;

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot`,
            );
          }

          const linePath = d3Line<{
            x: any;
            y: any[];
          }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y[1]));

          if (process.env.NODE_ENV !== 'production') {
            if (xData.length !== stackedData.length) {
              throw new Error(
                `MUI: data length of the x axis (${xData.length} items) does not match length of series (${stackedData.length} items)`,
              );
            }
          }
          const curve = getCurveFactory(series[seriesId].curve);
          const d3Data = xData?.map((x, index) => ({ x, y: stackedData[index] ?? [0, 0] }));

          return (
            <LineElement
              key={seriesId}
              id={seriesId}
              d={linePath.curve(curve)(d3Data) || undefined}
              color={series[seriesId].color}
              highlightScope={series[seriesId].highlightScope}
              slots={slots}
              slotProps={slotProps}
            />
          );
        });
      })}
    </g>
  );
}

LinePlot.propTypes = {
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

export { LinePlot };
