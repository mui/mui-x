import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { BarElement, BarElementProps } from './BarElement';
import { isBandScaleConfig } from '../models/axis';

/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth The width available to place bars.
 * @param numberOfGroups The number of bars to place in that space.
 * @param gapRatio The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
function getBandSize({
  bandWidth: W,
  numberOfGroups: N,
  gapRatio: r,
}: {
  bandWidth: number;
  numberOfGroups: number;
  gapRatio: number;
}) {
  if (r === 0) {
    return {
      barWidth: W / N,
      offset: 0,
    };
  }
  const barWidth = W / (N + (N - 1) * r);
  const offset = r * barWidth;
  return {
    barWidth,
    offset,
  };
}

export interface BarPlotSlotsComponent {
  bar?: React.JSXElementConstructor<BarElementProps>;
}

export interface BarPlotSlotComponentProps {
  bar?: Partial<BarElementProps>;
}

export interface BarPlotProps extends Pick<BarElementProps, 'slots' | 'slotProps'> {}

function BarPlot(props: BarPlotProps) {
  const seriesData = React.useContext(SeriesContext).bar;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return (
    <React.Fragment>
      {stackingGroups.flatMap(({ ids: groupIds }, groupIndex) => {
        return groupIds.flatMap((seriesId) => {
          const xAxisKey = series[seriesId].xAxisKey ?? defaultXAxisId;
          const yAxisKey = series[seriesId].yAxisKey ?? defaultYAxisId;

          const xAxisConfig = xAxis[xAxisKey];
          const yAxisConfig = yAxis[yAxisKey];
          if (!isBandScaleConfig(xAxisConfig)) {
            throw new Error(
              `Axis with id "${xAxisKey}" shoud be of type "band" to display the bar series of id "${seriesId}"`,
            );
          }

          if (xAxis[xAxisKey].data === undefined) {
            throw new Error(`Axis with id "${xAxisKey}" shoud have data property`);
          }

          const xScale = xAxisConfig.scale;
          const yScale = yAxisConfig.scale;

          // Currently assuming all bars are vertical
          const bandWidth = xScale.bandwidth();

          const { barWidth, offset } = getBandSize({
            bandWidth,
            numberOfGroups: stackingGroups.length,
            gapRatio: xAxisConfig.barGapRatio,
          });

          // @ts-ignore TODO: fix when adding a correct API for customisation
          const { stackedData, color } = series[seriesId];

          return stackedData.map((values, dataIndex: number) => {
            const baseline = Math.min(...values);
            const value = Math.max(...values);
            return (
              <BarElement
                key={`${seriesId}-${dataIndex}`}
                id={seriesId}
                dataIndex={dataIndex}
                x={xScale(xAxis[xAxisKey].data?.[dataIndex])! + groupIndex * (barWidth + offset)}
                y={yScale(value)}
                height={yScale(baseline) - yScale(value)}
                width={barWidth}
                color={color}
                highlightScope={series[seriesId].highlightScope}
                {...props}
              />
            );
          });
        });
      })}
    </React.Fragment>
  );
}

BarPlot.propTypes = {
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

export { BarPlot };
