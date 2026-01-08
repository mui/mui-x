'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSkipAnimation } from '@mui/x-charts/internals';
import {
  BarElement,
  type BarElementSlotProps,
  type BarElementSlots,
  barElementClasses,
  type BarLabelSlots,
  type BarLabelSlotProps,
} from '@mui/x-charts/BarChart';
import { useDrawingArea, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { useIsZoomInteracting } from '@mui/x-charts-pro/hooks';
import { useUtilityClasses } from './useUtilityClasses';
import { useRangeBarPlotData } from './useRangeBarPlotData';
import { AnimatedRangeBarElement } from './AnimatedRangeBarElement';
import { type RangeBarItemIdentifier } from '../../models';

export interface RangeBarPlotSlots extends BarElementSlots, BarLabelSlots {}

export interface RangeBarPlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface RangeBarPlotProps {
  /**
   * If `true`, animations are skipped.
   * @default undefined
   */
  skipAnimation?: boolean;
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {RangeBarItemIdentifier} barItemIdentifier The range bar item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: RangeBarItemIdentifier,
  ) => void;
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius?: number;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RangeBarPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RangeBarPlotSlots;
}

const RangeBarPlotRoot = styled('g', {
  name: 'MuiRangeBarPlot',
  slot: 'Root',
})({
  [`& .${barElementClasses.root}`]: {
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  },
});

/**
 * Demos:
 *
 * - [Range Bar](https://mui.com/x/react-charts/range-bar/)
 *
 * API:
 *
 * - [RangeBarPlot API](https://mui.com/x/api/charts/range-bar-plot/)
 */
function RangeBarPlot(props: RangeBarPlotProps): React.JSX.Element {
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, ...other } = props;
  const isZoomInteracting = useIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const completedData = useRangeBarPlotData(useDrawingArea(), xAxes, yAxes);

  const classes = useUtilityClasses();
  const slots: BarElementSlots = {
    ...props.slots,
    bar: props.slots?.bar ?? AnimatedRangeBarElement,
  };

  return (
    <RangeBarPlotRoot className={classes.root}>
      {completedData.map(({ seriesId, layout, xOrigin, yOrigin, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(({ dataIndex, color, x, y, width, height, hidden }) => {
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
                  hidden={hidden}
                  rx={borderRadius}
                  ry={borderRadius}
                  {...other}
                  slots={slots}
                  onClick={
                    onItemClick &&
                    ((event) => {
                      onItemClick(event, { type: 'rangeBar', seriesId, dataIndex });
                    })
                  }
                />
              );
            })}
          </g>
        );
      })}
    </RangeBarPlotRoot>
  );
}

RangeBarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius: PropTypes.number,
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {RangeBarItemIdentifier} barItemIdentifier The range bar item identifier.
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

export { RangeBarPlot };
