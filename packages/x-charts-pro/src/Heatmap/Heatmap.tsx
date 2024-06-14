import * as React from 'react';
import useId from '@mui/utils/useId';
import { ChartsAxis, ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import {
  ChartsTooltip,
  ChartsTooltipProps,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '@mui/x-charts/ChartsTooltip';
import {
  MakeOptional,
  ChartsAxisSlots,
  ChartsAxisSlotProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisConfig,
} from '@mui/x-charts/internals';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import {
  ChartsOnAxisClickHandler,
  ChartsOnAxisClickHandlerProps,
} from '@mui/x-charts/ChartsOnAxisClickHandler';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '@mui/x-charts/ChartsOverlay';
import {
  ResponsiveChartContainerPro,
  ResponsiveChartContainerProProps,
} from '../ResponsiveChartContainerPro';
import { HeatmapSeriesType } from '../models/seriesType/heatmap';
import { HeatmapPlot } from './HeatmapPlot';
import { plugin as heatmapPlugin } from './plugin';
import { DefaultHeatmapTooltip } from './DefaultHeatmapTooltip';

export interface HeatmapSlots
  extends ChartsAxisSlots,
    Omit<ChartsTooltipSlots<'heatmap'>, 'axisContent'>,
    ChartsOverlaySlots {}
export interface HeatmapSlotProps
  extends ChartsAxisSlotProps,
    Omit<ChartsTooltipSlotProps, 'axisContent'>,
    ChartsOverlaySlotProps {}

export interface HeatmapProps
  extends Omit<ResponsiveChartContainerProProps, 'series' | 'plugins' | 'xAxis' | 'yAxis'>,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'>,
    ChartsOnAxisClickHandlerProps {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: MakeOptional<AxisConfig<'band', any, ChartsXAxisProps>, 'id' | 'scaleType'>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: MakeOptional<AxisConfig<'band', any, ChartsYAxisProps>, 'id' | 'scaleType'>[];
  /**
   * The series to display in the bar chart.
   * An array of [[HeatmapSeriesType]] objects.
   */
  series: MakeOptional<HeatmapSeriesType, 'type'>[];
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip?: ChartsTooltipProps<'heatmap'>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: HeatmapSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: HeatmapSlotProps;
}

export const Heatmap = React.forwardRef(function Heatmap(props: HeatmapProps, ref) {
  const {
    xAxis,
    yAxis,
    zAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    tooltip,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    onAxisClick,
    children,
    slots,
    slotProps,
    loading,
    highlightedItem,
    onHighlightChange,
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const defaultizedXAxis = React.useMemo(
    () => xAxis.map((axis) => ({ scaleType: 'band' as const, categoryGapRatio: 0, ...axis })),
    [xAxis],
  );

  const defaultizedYAxis = React.useMemo(
    () => yAxis.map((axis) => ({ scaleType: 'band' as const, categoryGapRatio: 0, ...axis })),
    [yAxis],
  );

  const defaultizedZAxis = React.useMemo(
    () =>
      zAxis ?? [
        {
          colorMap: {
            type: 'continuous',
            min: 0,
            max: 10,
            color: ['blue', 'red'],
          },
        } as const,
      ],
    [zAxis],
  );

  return (
    <ResponsiveChartContainerPro
      ref={ref}
      plugins={[heatmapPlugin]}
      series={series.map((s) => ({
        type: 'heatmap',
        ...s,
      }))}
      width={width}
      height={height}
      margin={margin}
      xAxis={defaultizedXAxis}
      yAxis={defaultizedYAxis}
      zAxis={defaultizedZAxis}
      colors={colors}
      dataset={dataset}
      sx={sx}
      disableAxisListener
      highlightedItem={highlightedItem}
      onHighlightChange={onHighlightChange}
    >
      {onAxisClick && <ChartsOnAxisClickHandler onAxisClick={onAxisClick} />}
      <g clipPath={`url(#${clipPathId})`}>
        <HeatmapPlot />
        <ChartsOverlay loading={loading} slots={slots} slotProps={slotProps} />
      </g>
      <ChartsAxis
        topAxis={topAxis}
        leftAxis={leftAxis}
        rightAxis={rightAxis}
        bottomAxis={bottomAxis}
        slots={slots}
        slotProps={slotProps}
      />

      {!loading && (
        <ChartsTooltip
          trigger="item"
          slots={{ itemContent: DefaultHeatmapTooltip, ...slots }}
          slotProps={slotProps}
        />
      )}
      <ChartsClipPath id={clipPathId} />
      {children}
    </ResponsiveChartContainerPro>
  );
});
