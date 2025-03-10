'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import { styled } from '@mui/material/styles';
import { BarElement, barElementClasses, BarElementSlotProps, BarElementSlots } from './BarElement';
import { AxisDefaultized } from '../models/axis';
import { BarItemIdentifier } from '../models';
import getColor from './seriesConfig/getColor';
import { useChartId, useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { AnimationData, CompletedBarData, MaskData } from './types';
import { BarClipPath } from './BarClipPath';
import { BarLabelItemProps, BarLabelSlotProps, BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { checkScaleErrors } from './checkScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { useSkipAnimation } from '../context/AnimationProvider';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';

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

const useAggregatedData = (): {
  completedData: CompletedBarData[];
  masksData: MaskData[];
} => {
  const seriesData =
    useBarSeriesContext() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'bar'>);

  const drawingArea = useDrawingArea();
  const chartId = useChartId();

  const { series, stackingGroups } = seriesData;
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const masks: Record<string, MaskData> = {};

  const data = stackingGroups.flatMap(({ ids: groupIds }, groupIndex) => {
    const xMin = drawingArea.left;
    const xMax = drawingArea.left + drawingArea.width;

    const yMin = drawingArea.top;
    const yMax = drawingArea.top + drawingArea.height;

    return groupIds.flatMap((seriesId) => {
      const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
      const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;

      const xAxisConfig = xAxis[xAxisId];
      const yAxisConfig = yAxis[yAxisId];

      const verticalLayout = series[seriesId].layout === 'vertical';

      checkScaleErrors(verticalLayout, seriesId, series[seriesId], xAxisId, xAxis, yAxisId, yAxis);

      const baseScaleConfig = (
        verticalLayout ? xAxisConfig : yAxisConfig
      ) as AxisDefaultized<'band'>;

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;

      const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
      const bandWidth = baseScaleConfig.scale.bandwidth();

      const { barWidth, offset } = getBandSize({
        bandWidth,
        numberOfGroups: stackingGroups.length,
        gapRatio: baseScaleConfig.barGapRatio,
      });
      const barOffset = groupIndex * (barWidth + offset);

      const { stackedData, data: currentSeriesData, layout } = series[seriesId];

      return baseScaleConfig
        .data!.map((baseValue, dataIndex: number) => {
          const values = stackedData[dataIndex];
          const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

          const minValueCoord = Math.round(Math.min(...valueCoordinates));
          const maxValueCoord = Math.round(Math.max(...valueCoordinates));

          const stackId = series[seriesId].stack;

          const result = {
            seriesId,
            dataIndex,
            layout,
            x: verticalLayout ? xScale(baseValue)! + barOffset : minValueCoord,
            y: verticalLayout ? minValueCoord : yScale(baseValue)! + barOffset,
            xOrigin: xScale(0)!,
            yOrigin: yScale(0)!,
            height: verticalLayout ? maxValueCoord - minValueCoord : barWidth,
            width: verticalLayout ? barWidth : maxValueCoord - minValueCoord,
            color: colorGetter(dataIndex),
            value: currentSeriesData[dataIndex],
            maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
          };

          if (
            result.x > xMax ||
            result.x + result.width < xMin ||
            result.y > yMax ||
            result.y + result.height < yMin
          ) {
            return null;
          }

          if (!masks[result.maskId]) {
            masks[result.maskId] = {
              id: result.maskId,
              width: 0,
              height: 0,
              hasNegative: false,
              hasPositive: false,
              layout: result.layout,
              xOrigin: xScale(0)!,
              yOrigin: yScale(0)!,
              x: 0,
              y: 0,
            };
          }

          const mask = masks[result.maskId];
          mask.width = result.layout === 'vertical' ? result.width : mask.width + result.width;
          mask.height = result.layout === 'vertical' ? mask.height + result.height : result.height;
          mask.x = Math.min(mask.x === 0 ? Infinity : mask.x, result.x);
          mask.y = Math.min(mask.y === 0 ? Infinity : mask.y, result.y);
          mask.hasNegative = mask.hasNegative || (result.value ?? 0) < 0;
          mask.hasPositive = mask.hasPositive || (result.value ?? 0) > 0;

          return result;
        })
        .filter((rectangle) => rectangle !== null);
    });
  });

  return {
    completedData: data,
    masksData: Object.values(masks),
  };
};

const leaveStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: AnimationData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x,
        height: 0,
        width,
      }
    : {
        y,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const enterStyle = ({ x, width, y, height }: AnimationData) => ({
  y,
  x,
  height,
  width,
});

const BarPlotRoot = styled('g', {
  name: 'MuiBarPlot',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  [`& .${barElementClasses.root}`]: {
    [`&.${barElementClasses.vertical}`]: {
      transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, height 0.5s ease-in, y 0.5s ease-in',

      '@keyframes growHeight': {
        from: { transform: 'scaleY(0%)' },
        to: { transform: 'scaleY(100%)' },
      },

      transformOrigin: '0% 100%',
      animation: 'growHeight 0.5s ease',
    },

    [`&.${barElementClasses.horizontal}`]: {
      transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, width 0.5s ease-in, x 0.5s ease-in',

      '@keyframes growWidth': {
        from: { transform: 'scaleX(0%)' },
        to: { transform: 'scaleX(100%)' },
      },

      animation: 'growWidth 0.5s ease',
    },
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
  const { completedData, masksData } = useAggregatedData();
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, barLabel, ...other } = props;
  const skipAnimation = useSkipAnimation(inSkipAnimation);

  const withoutBorderRadius = !borderRadius || borderRadius <= 0;

  const maskTransition = useTransition(withoutBorderRadius ? [] : masksData, {
    keys: (v) => v.id,
    from: skipAnimation ? undefined : leaveStyle,
    leave: leaveStyle,
    enter: enterStyle,
    update: enterStyle,
    immediate: skipAnimation,
  });

  return (
    <BarPlotRoot>
      {!withoutBorderRadius &&
        maskTransition((style, { id, hasPositive, hasNegative, layout }) => {
          return (
            <BarClipPath
              maskId={id}
              borderRadius={borderRadius}
              hasNegative={hasNegative}
              hasPositive={hasPositive}
              layout={layout}
              style={style}
            />
          );
        })}
      {completedData.map(({ x, y, width, height, dataIndex, color, seriesId, maskId, layout }) => {
        const barElement = (
          <BarElement
            key={`${seriesId}-${dataIndex}`}
            id={seriesId}
            dataIndex={dataIndex}
            color={color}
            x={x}
            y={y}
            width={width}
            height={height}
            layout={layout}
            {...other}
            onClick={
              onItemClick &&
              ((event) => {
                onItemClick(event, { type: 'bar', seriesId, dataIndex });
              })
            }
          />
        );

        if (withoutBorderRadius) {
          return barElement;
        }

        return <g clipPath={`url(#${maskId})`}>{barElement}</g>;
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
