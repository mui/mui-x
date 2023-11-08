import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { LineHighlightElement, LineHighlightElementProps } from './LineHighlightElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import { InteractionContext } from '../context/InteractionProvider';

export interface LineHighlightPlotSlotsComponent {
  lineHighlight?: React.JSXElementConstructor<LineHighlightElementProps>;
}

export interface LineHighlightPlotSlotComponentProps {
  lineHighlight?: Partial<LineHighlightElementProps>;
}

export interface LineHighlightPlotProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: LineHighlightPlotSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: LineHighlightPlotSlotComponentProps;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightPlot API](https://mui.com/x/api/charts/line-highlight-plot/)
 */
function LineHighlightPlot(props: LineHighlightPlotProps) {
  const { slots, slotProps, ...other } = props;

  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);
  const { axis } = React.useContext(InteractionContext);

  const highlightedIndex = axis.x?.index;
  if (highlightedIndex === undefined) {
    return null;
  }

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const Element = slots?.lineHighlight ?? LineHighlightElement;

  return (
    <g {...other}>
      {stackingGroups.flatMap(({ ids: groupIds }) => {
        return groupIds.flatMap((seriesId) => {
          const {
            xAxisKey = defaultXAxisId,
            yAxisKey = defaultYAxisId,
            stackedData,
            data,
            disableHighlight,
          } = series[seriesId];

          if (disableHighlight || data[highlightedIndex] == null) {
            return null;
          }
          const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
          const yScale = yAxis[yAxisKey].scale;
          const xData = xAxis[xAxisKey].data;

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot.`,
            );
          }
          const x = xScale(xData[highlightedIndex]);
          const y = yScale(stackedData[highlightedIndex][1])!; // This should not be undefined since y should not be a band scale
          return (
            <Element
              key={`${seriesId}`}
              id={seriesId}
              color={series[seriesId].color}
              x={x}
              y={y}
              {...slotProps?.lineHighlight}
            />
          );
        });
      })}
    </g>
  );
}

LineHighlightPlot.propTypes = {
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

export { LineHighlightPlot };
