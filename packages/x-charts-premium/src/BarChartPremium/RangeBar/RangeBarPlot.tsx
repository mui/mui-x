'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSkipAnimation, useRegisterItemActivation } from '@mui/x-charts/internals';
import { BarElement, barClasses } from '@mui/x-charts/BarChart';
import type {
  BarElementSlotProps,
  BarElementSlots,
  BarLabelSlots,
  BarLabelSlotProps,
} from '@mui/x-charts/BarChart';
import { useDrawingArea, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { useIsZoomInteracting } from '@mui/x-charts-pro/hooks';
import { useUtilityClasses } from './useUtilityClasses';
import { useRangeBarPlotData } from './useRangeBarPlotData';
import { AnimatedRangeBarElement } from './AnimatedRangeBarElement';
import { RangeBarWebGLPlot } from './RangeBarWebGLPlot';
import type { RangeBarItemIdentifier } from '../../models';

export type RangeBarPlotRenderer = 'svg-single' | 'webgl';

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
   * The type of renderer to use for the range bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `webgl`: Renders bars using WebGL for better performance with very large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer?: RangeBarPlotRenderer;
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
  [`& .${barClasses.element}`]: {
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
  const { renderer, borderRadius, ...other } = props;
  if (renderer === 'webgl') {
    return <RangeBarWebGLPlot borderRadius={borderRadius} />;
  }
  return <RangeBarSvgPlot borderRadius={borderRadius} {...other} />;
}

function RangeBarSvgPlot(props: Omit<RangeBarPlotProps, 'renderer'>): React.JSX.Element {
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, ...other } = props;
  const isZoomInteracting = useIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const completedData = useRangeBarPlotData(useDrawingArea(), xAxes, yAxes);

  const classes = useUtilityClasses();

  useRegisterItemActivation(
    { type: 'rangeBar' },
    onItemClick &&
      ((event, item) =>
        onItemClick(event, {
          type: 'rangeBar',
          seriesId: item.seriesId,
          dataIndex: item.dataIndex,
        })),
  );

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
                  seriesId={seriesId}
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

RangeBarSvgPlot.propTypes /* remove-proptypes */ = {
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

RangeBarPlot.propTypes /* remove-proptypes */ = {
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
   * The type of renderer to use for the range bar plot.
   * - `svg-single`: Renders every bar in a `<rect />` element.
   * - `webgl`: Renders bars using WebGL for better performance with very large datasets, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/bars/#performance
   *
   * @default 'svg-single'
   */
  renderer: PropTypes.oneOf(['svg-single', 'webgl']),
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
