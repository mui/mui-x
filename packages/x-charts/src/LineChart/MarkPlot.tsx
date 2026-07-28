'use client';
import { styled } from '@mui/material/styles';
import type { WithDataAttributes } from '@mui/utils/types';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useChartsContext } from '../context/ChartsProvider';
import { useItemHighlightStateGetter, useXAxes, useYAxes } from '../hooks';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import type { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { selectorChartsHighlightXAxisIndex } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import type { AxisId } from '../models/axis';
import type { MarkPropsOverrides } from '../models/chartsSlotsComponentsProps';
import type { ChartsActivationEvent } from '../models/events';
import type { LineItemClickIdentifier } from '../models/seriesType/line';
import { CircleMarkElement } from './CircleMarkElement';
import { useUtilityClasses } from './lineClasses';
import type { MarkElementProps } from './MarkElement';
import { MarkElement } from './MarkElement';
import { LINE_ACTIVATION_PRIORITY, useRegisterLineItemActivation } from './useLineItemClickHandler';
import { useMarkPlotData } from './useMarkPlotData';

export interface MarkPlotSlots {
  mark?: React.JSXElementConstructor<MarkElementProps & MarkPropsOverrides>;
}

export interface MarkPlotSlotProps {
  mark?: WithDataAttributes<Partial<MarkElementProps> & MarkPropsOverrides>;
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
   * @param {ChartsActivationEvent<SVGElement>} event The event source of the callback.
   * @param {LineItemClickIdentifier} lineItemIdentifier The line mark item identifier.
   */
  onItemClick?: (
    event: ChartsActivationEvent<SVGElement>,
    lineItemIdentifier: LineItemClickIdentifier,
  ) => void;
}

const MarkPlotRoot = styled('g', {
  name: 'MuiMarkPlot',
  slot: 'Root',
})({});

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
    className,
    ...other
  } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();

  const { store } = useChartsContext<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const getHighlightState = useItemHighlightStateGetter();
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

  // A mark is activatable only where it is actually rendered, so a hidden mark falls through to the
  // line, then the area, matching what a pointer would hit.
  const isMarkRendered = ({ seriesId, dataIndex }: LineItemClickIdentifier) =>
    completedData.some(
      (series) =>
        series.seriesId === seriesId &&
        !series.hidden &&
        series.marks.some((mark) => mark.index === dataIndex),
    );
  useRegisterLineItemActivation(onItemClick, LINE_ACTIVATION_PRIORITY.mark, isMarkRendered);

  const classes = useUtilityClasses();

  return (
    <MarkPlotRoot className={clsx(classes.markPlot, className)} {...other}>
      {completedData.map(({ seriesId, clipId, shape, xAxisId, marks, hidden }) => {
        const Mark = slots?.mark ?? (shape === 'circle' ? CircleMarkElement : MarkElement);

        const identifier = { type: 'line' as const, seriesId };

        const seriesHighlightState = getHighlightState(identifier);
        const isSeriesHighlighted = seriesHighlightState === 'highlighted';
        const isSeriesFaded = seriesHighlightState === 'faded';

        return (
          <g key={seriesId} clipPath={`url(#${clipId})`} data-series={seriesId}>
            {marks.map(({ x, y, index, color }) => {
              return (
                <Mark
                  key={`${seriesId}-${index}`}
                  seriesId={seriesId}
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
                  hidden={hidden}
                  {...slotProps?.mark}
                />
              );
            })}
          </g>
        );
      })}
    </MarkPlotRoot>
  );
}

MarkPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line mark item is clicked.
   * @param {ChartsActivationEvent<SVGElement>} event The event source of the callback.
   * @param {LineItemClickIdentifier} lineItemIdentifier The line mark item identifier.
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
