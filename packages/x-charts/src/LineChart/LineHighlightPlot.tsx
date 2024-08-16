import * as React from 'react';
import PropTypes from 'prop-types';
import { SlotComponentPropsFromProps } from '../internals/SlotComponentPropsFromProps';
import { useCartesianContext } from '../context/CartesianProvider';
import { LineHighlightElement, LineHighlightElementProps } from './LineHighlightElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import { InteractionContext } from '../context/InteractionProvider';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import getColor from './getColor';
import { useLineSeries } from '../hooks/useSeries';
import { useDrawingArea } from '../hooks/useDrawingArea';

export interface LineHighlightPlotSlots {
  lineHighlight?: React.JSXElementConstructor<LineHighlightElementProps>;
}

export interface LineHighlightPlotSlotProps {
  lineHighlight?: SlotComponentPropsFromProps<LineHighlightElementProps, {}, {}>;
}

export interface LineHighlightPlotProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: LineHighlightPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: LineHighlightPlotSlotProps;
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

  const seriesData = useLineSeries();
  const axisData = useCartesianContext();
  const drawingArea = useDrawingArea();
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
            xAxisId: xAxisIdProp,
            yAxisId: yAxisIdProp,
            xAxisKey = defaultXAxisId,
            yAxisKey = defaultYAxisId,
            stackedData,
            data,
            disableHighlight,
          } = series[seriesId];

          const xAxisId = xAxisIdProp ?? xAxisKey;
          const yAxisId = yAxisIdProp ?? yAxisKey;

          if (disableHighlight || data[highlightedIndex] == null) {
            return null;
          }
          const xScale = getValueToPositionMapper(xAxis[xAxisId].scale);
          const yScale = yAxis[yAxisId].scale;
          const xData = xAxis[xAxisId].data;

          if (xData === undefined) {
            throw new Error(
              `MUI X: ${
                xAxisId === DEFAULT_X_AXIS_KEY
                  ? 'The first `xAxis`'
                  : `The x-axis with id "${xAxisId}"`
              } should have data property to be able to display a line plot.`,
            );
          }

          const x = xScale(xData[highlightedIndex]);
          const y = yScale(stackedData[highlightedIndex][1])!; // This should not be undefined since y should not be a band scale

          if (!drawingArea.isPointInside({ x, y })) {
            return null;
          }

          const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
          return (
            <Element
              key={`${seriesId}`}
              id={seriesId}
              color={colorGetter(highlightedIndex)}
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
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
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
