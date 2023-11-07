import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { MarkElement, MarkElementProps } from './MarkElement';
import { getValueToPositionMapper } from '../hooks/useScale';

export interface MarkPlotSlotsComponent {
  mark?: React.JSXElementConstructor<MarkElementProps>;
}

export interface MarkPlotSlotComponentProps {
  mark?: Partial<MarkElementProps>;
}

export interface MarkPlotProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MarkPlotSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MarkPlotSlotComponentProps;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
function MarkPlot(props: MarkPlotProps) {
  const { slots, slotProps, ...other } = props;

  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  const Mark = slots?.mark ?? MarkElement;

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
            showMark = true,
          } = series[seriesId];

          if (showMark === false) {
            return null;
          }

          const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
          const yScale = yAxis[yAxisKey].scale;
          const xData = xAxis[xAxisKey].data;

          const xRange = xAxis[xAxisKey].scale.range();
          const yRange = yScale.range();

          const isInRange = ({ x, y }: { x: number; y: number }) => {
            if (x < Math.min(...xRange) || x > Math.max(...xRange)) {
              return false;
            }
            if (y < Math.min(...yRange) || y > Math.max(...yRange)) {
              return false;
            }
            return true;
          };

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot`,
            );
          }

          return xData
            ?.map((x, index) => {
              const value = data[index] == null ? null : stackedData[index][1];
              return {
                x: xScale(x),
                y: value === null ? null : yScale(value)!,
                position: x,
                value,
                index,
              };
            })
            .filter(({ x, y, index, position, value }) => {
              if (value === null || y === null) {
                // Remove missing data point
                return false;
              }
              if (!isInRange({ x, y })) {
                // Remove out of range
                return false;
              }
              if (showMark === true) {
                return true;
              }
              return showMark({
                x,
                y,
                index,
                position,
                value,
              });
            })
            .map(({ x, y, index }) => {
              return (
                <Mark
                  key={`${seriesId}-${index}`}
                  id={seriesId}
                  dataIndex={index}
                  shape="circle"
                  color={series[seriesId].color}
                  x={x}
                  y={y!} // Don't knwo why TS don't get from the filter that y can't be null
                  highlightScope={series[seriesId].highlightScope}
                  {...slotProps?.mark}
                />
              );
            });
        });
      })}
    </g>
  );
}

MarkPlot.propTypes = {
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

export { MarkPlot };
