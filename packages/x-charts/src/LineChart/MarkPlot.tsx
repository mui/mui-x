'use client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { type LineItemIdentifier } from '../models/seriesType/line';
import { CircleMarkElement } from './CircleMarkElement';
import { MarkElement, type MarkElementProps } from './MarkElement';
import { useItemHighlightedGetter, useXAxes, useYAxes } from '../hooks';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import {
  selectorChartsHighlightXAxisIndex,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type AxisId } from '../models/axis';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import { useChartContext } from '../context/ChartProvider';
import { useMarkPlotData } from './useMarkPlotData';

export interface MarkPlotSlots {
  mark?: React.JSXElementConstructor<MarkElementProps>;
}

export interface MarkPlotSlotProps {
  mark?: Partial<MarkElementProps>;
}

export interface MarkPlotProps
  extends React.SVGAttributes<SVGSVGElement>, Pick<MarkElementProps, 'skipAnimation'> {
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
  const { slots, slotProps, skipAnimation: inSkipAnimation, onItemClick, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();

  const { store } = useChartContext<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const { isFaded, isHighlighted } = useItemHighlightedGetter();
  const xAxisHighlightIndexes = store.use(selectorChartsHighlightXAxisIndex);

  const highlightedItems = React.useMemo(() => {
    const rep: Record<AxisId, Set<number>> = {};

    for (const { dataIndex, axisId } of xAxisHighlightIndexes) {
      if (rep[axisId] === undefined) {
        rep[axisId] = new Set([dataIndex]);
      } else {
        rep[axisId].add(dataIndex);
      }
    }
    return rep;
  }, [xAxisHighlightIndexes]);

  const completedData = useMarkPlotData(xAxis, yAxis);

  return (
    <g {...other}>
      {completedData.map(({ seriesId, clipId, shape, xAxisId, marks }) => {
        const Mark = slots?.mark ?? (shape === 'circle' ? CircleMarkElement : MarkElement);

        const isSeriesHighlighted = isHighlighted({ type: 'line', seriesId });
        const isSeriesFaded = !isSeriesHighlighted && isFaded({ type: 'line', seriesId });

        return (
          <g key={seriesId} clipPath={`url(#${clipId})`} data-series={seriesId}>
            {marks.map(({ x, y, index, color }) => {
              return (
                <Mark
                  key={`${seriesId}-${index}`}
                  id={seriesId}
                  dataIndex={index}
                  shape={shape}
                  color={color}
                  x={x}
                  y={y}
                  skipAnimation={skipAnimation}
                  onClick={
                    onItemClick &&
                    ((event) => onItemClick(event, { type: 'line', seriesId, dataIndex: index }))
                  }
                  isHighlighted={highlightedItems[xAxisId]?.has(index) || isSeriesHighlighted}
                  isFaded={isSeriesFaded}
                  {...slotProps?.mark}
                />
              );
            })}
          </g>
        );
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
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
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
