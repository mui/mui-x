import * as React from 'react';
import PropTypes from 'prop-types';
import { Scatter, ScatterProps } from './Scatter';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';

export interface ScatterPlotSlotsComponent {
  scatter?: React.JSXElementConstructor<ScatterProps>;
}

export interface ScatterPlotSlotComponentProps {
  scatter?: Partial<ScatterProps>;
}

export interface ScatterPlotProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ScatterPlotSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterPlotSlotComponentProps;
}

function ScatterPlot(props: ScatterPlotProps) {
  const { slots, slotProps } = props;
  const seriesData = React.useContext(SeriesContext).scatter;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, seriesOrder } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const ScatterItems = slots?.scatter ?? Scatter;

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisKey, yAxisKey, markerSize, color } = series[seriesId];

        const xScale = xAxis[xAxisKey ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisKey ?? defaultYAxisId].scale;
        return (
          <ScatterItems
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            markerSize={markerSize ?? 4}
            series={series[seriesId]}
            {...slotProps?.scatter}
          />
        );
      })}
    </React.Fragment>
  );
}

ScatterPlot.propTypes = {
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

export { ScatterPlot };
