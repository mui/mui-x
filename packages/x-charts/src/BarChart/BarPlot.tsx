'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { barElementClasses } from './barElementClasses';
import { BarElement, BarElementSlotProps, BarElementSlots } from './BarElement';
import { BarItemIdentifier } from '../models';
import { useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { BarLabelItemProps, BarLabelSlotProps, BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { BarStackMap, useBarPlotData } from './useBarPlotData';
import { useUtilityClasses } from './barClasses';
import { SeriesId } from '../models/seriesType/common';

export interface BarPlotSlots extends BarElementSlots, BarLabelSlots {}

export interface BarPlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface BarPlotProps extends Pick<BarLabelItemProps, 'barLabel'> {
  /**
   * If `true`, animations are skipped.
   * @default undefined
   */
  skipAnimation?: boolean;
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ) => void;
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius?: number;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarPlotSlots;
}

const BarPlotRoot = styled('g', {
  name: 'MuiBarPlot',
  slot: 'Root',
})({
  [`& .${barElementClasses.root}`]: {
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  },
});

/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarPlot API](https://mui.com/x/api/charts/bar-plot/)
 */
function BarPlot(props: BarPlotProps) {
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, barLabel, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const withoutBorderRadius = !borderRadius || borderRadius <= 0;
  const { completedData, positiveStacks, negativeStacks } = useBarPlotData(
    useDrawingArea(),
    xAxes,
    yAxes,
    withoutBorderRadius,
  );

  const classes = useUtilityClasses();

  return (
    <BarPlotRoot className={classes.root}>
      {completedData.map(({ seriesId, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(
              ({ dataIndex, color, layout, x, xOrigin, y, yOrigin, width, height, stackId }) => {
                return (
                  <BarElement
                    key={dataIndex}
                    id={seriesId}
                    dataIndex={dataIndex}
                    color={color}
                    skipAnimation={skipAnimation ?? false}
                    layout={layout ?? 'vertical'}
                    x={x}
                    xOrigin={xOrigin}
                    y={y}
                    yOrigin={yOrigin}
                    width={width}
                    height={height}
                    clipPath={
                      withoutBorderRadius
                        ? undefined
                        : generateClipPath(
                            positiveStacks,
                            negativeStacks,
                            layout ?? 'vertical',
                            stackId,
                            seriesId,
                            dataIndex,
                            borderRadius,
                            width,
                            height,
                          )
                    }
                    {...other}
                    onClick={
                      onItemClick &&
                      ((event) => {
                        onItemClick(event, { type: 'bar', seriesId, dataIndex });
                      })
                    }
                  />
                );
              },
            )}
          </g>
        );
      })}
      {barLabel && (
        <BarLabelPlot
          bars={completedData}
          skipAnimation={skipAnimation}
          barLabel={barLabel}
          {...other}
        />
      )}
    </BarPlotRoot>
  );
}

BarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius: PropTypes.number,
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default undefined
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

export { BarPlot };

function generateClipPath(
  positiveStacks: BarStackMap,
  negativeStacks: BarStackMap,
  layout: 'vertical' | 'horizontal',
  stackId: string | undefined,
  seriesId: SeriesId,
  dataIndex: number,
  borderRadius: number,
  width: number,
  height: number,
) {
  const id = `${stackId ?? seriesId}-${dataIndex}`;
  if (layout === 'vertical') {
    const positiveStack = positiveStacks.get(id);

    if (positiveStack && positiveStack.seriesId === seriesId) {
      return `path("M0,${height} v-${height - borderRadius} a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius} h${width - borderRadius * 2} a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius} v${height - borderRadius} Z")`;
    }

    const negativeStack = negativeStacks.get(id);
    if (negativeStack && negativeStack.seriesId === seriesId) {
      return `path("M0,0 v${height - borderRadius} a${borderRadius},${borderRadius} 0 0 0 ${borderRadius},${borderRadius} h${width - borderRadius * 2} a${borderRadius},${borderRadius} 0 0 0 ${borderRadius},-${borderRadius} v-${height - borderRadius} Z")`;
    }
  } else if (layout === 'horizontal') {
    const positiveStack = positiveStacks.get(id);

    if (positiveStack && positiveStack.seriesId === seriesId) {
      return `path("M0,0 h${width - borderRadius} a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius} v${height - borderRadius * 2} a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},${borderRadius} h-${width - borderRadius} Z")`;
    }

    const negativeStack = negativeStacks.get(id);
    if (negativeStack && negativeStack.seriesId === seriesId) {
      return `path("M${width},0 h-${width - borderRadius} a${borderRadius},${borderRadius} 0 0 0 -${borderRadius},${borderRadius} v${height - borderRadius * 2} a${borderRadius},${borderRadius} 0 0 0 ${borderRadius},${borderRadius} h${width - borderRadius} Z")`;
    }
  }

  return undefined;
}
