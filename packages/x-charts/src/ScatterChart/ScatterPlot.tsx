import * as React from 'react';
import PropTypes from 'prop-types';
import { Scatter, ScatterProps } from './Scatter';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import getColor from './getColor';
import { ZAxisContext } from '../context/ZAxisContextProvider';

export interface ScatterPlotSlots {
  scatter?: React.JSXElementConstructor<ScatterProps>;
}

export interface ScatterPlotSlotProps {
  scatter?: Partial<ScatterProps>;
}

export interface ScatterPlotProps extends Pick<ScatterProps, 'onItemClick'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ScatterPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterPlotSlotProps;
}

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterPlot API](https://mui.com/x/api/charts/scatter-plot/)
 */
function ScatterPlot(props: ScatterPlotProps) {
  const { slots, slotProps, onItemClick } = props;
  const seriesData = React.useContext(SeriesContext).scatter;
  const axisData = React.useContext(CartesianContext);
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, seriesOrder } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const defaultZAxisId = zAxisIds[0];

  const ScatterItems = slots?.scatter ?? Scatter;

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisKey, yAxisKey, zAxisKey, markerSize, color } = series[seriesId];

        const colorGetter = getColor(
          series[seriesId],
          xAxis[xAxisKey ?? defaultXAxisId],
          yAxis[yAxisKey ?? defaultYAxisId],
          zAxis[zAxisKey ?? defaultZAxisId],
        );
        const xScale = xAxis[xAxisKey ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisKey ?? defaultYAxisId].scale;
        return (
          <ScatterItems
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            colorGetter={colorGetter}
            markerSize={markerSize ?? 4}
            series={series[seriesId]}
            onItemClick={onItemClick}
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
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
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
