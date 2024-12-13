'use client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { useSkipAnimation } from '../context/AnimationProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { useChartId } from '../hooks/useChartId';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { getValueToPositionMapper } from '../hooks/useScale';
import { useLineSeries } from '../hooks/useSeries';
import { cleanId } from '../internals/cleanId';
import { LineItemIdentifier } from '../models/seriesType/line';
import { CircleMarkElement } from './CircleMarkElement';
import getColor from './getColor';
import { MarkElement, MarkElementProps } from './MarkElement';

export interface MarkPlotSlots {
  mark?: React.JSXElementConstructor<MarkElementProps>;
}

export interface MarkPlotSlotProps {
  mark?: Partial<MarkElementProps>;
}

export interface MarkPlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<MarkElementProps, 'skipAnimation'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MarkPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MarkPlotSlotProps;
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemIdentifier,
  ) => void;
  /**
   * If `true` the mark element will only be able to render circle.
   * Giving fewer customization options, but saving around 40ms per 1.000 marks.
   * @default false
   */
  experimentalRendering?: boolean;
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
  const {
    slots,
    slotProps,
    skipAnimation: inSkipAnimation,
    onItemClick,
    experimentalRendering,
    ...other
  } = props;
  const skipAnimation = useSkipAnimation(inSkipAnimation);

  const seriesData = useLineSeries();
  const axisData = useCartesianContext();
  const chartId = useChartId();
  const drawingArea = useDrawingArea();

  const Mark = slots?.mark ?? (experimentalRendering ? CircleMarkElement : MarkElement);

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
        return groupIds.map((seriesId) => {
          const {
            xAxisId = defaultXAxisId,
            yAxisId = defaultYAxisId,
            stackedData,
            data,
            showMark = true,
          } = series[seriesId];

          if (showMark === false) {
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

          const clipId = cleanId(`${chartId}-${seriesId}-line-clip`); // We assume that if displaying line mark, the line will also be rendered

          const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);

          return (
            <g key={seriesId} clipPath={`url(#${clipId})`}>
              {xData
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
                  if (!drawingArea.isPointInside({ x, y })) {
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
                      color={colorGetter(index)}
                      x={x}
                      y={y!} // Don't know why TS doesn't get from the filter that y can't be null
                      skipAnimation={skipAnimation}
                      onClick={
                        onItemClick &&
                        ((event) =>
                          onItemClick(event, { type: 'line', seriesId, dataIndex: index }))
                      }
                      {...slotProps?.mark}
                    />
                  );
                })}
            </g>
          );
        });
      })}
    </g>
  );
}

MarkPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true` the mark element will only be able to render circle.
   * Giving fewer customization options, but saving around 40ms per 1.000 marks.
   * @default false
   */
  experimentalRendering: PropTypes.bool,
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
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

export { MarkPlot };
