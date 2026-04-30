'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { useThemeProps } from '@mui/material/styles';
import { type MakeOptional } from '@mui/x-internals/types';
import {
  useChartsContainerProps,
  type ChartsSlots,
  type ChartsSlotProps,
} from '@mui/x-charts/internals';
import {
  Unstable_ChartsRadialGrid as ChartsRadialGrid,
  type ChartsRadialGridProps,
} from '@mui/x-charts/ChartsRadialGrid';
import {
  ChartsLegend,
  type ChartsLegendSlots,
  type ChartsLegendSlotProps,
  type ChartsLegendSlotExtension,
} from '../ChartsLegend';
import { ChartsSurface } from '../ChartsSurface';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '../ChartsTooltip';
import { ChartsWrapper, type ChartsWrapperProps } from '../ChartsWrapper';
import { ChartsClipPath, type ChartsClipPathProps } from '../ChartsClipPath';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlots,
  type ChartsOverlaySlotProps,
} from '../ChartsOverlay';
import { type ChartsToolbarSlots, type ChartsToolbarSlotProps } from '../Toolbar';
import { radialBarSeriesConfig } from './seriesConfig';
import {
  ChartsRadialDataProviderPremium,
  type ChartsRadialDataProviderPremiumProps,
} from '../ChartsRadialDataProviderPremium';
import { type ChartsRadialDataProviderProps } from '../ChartsRadialDataProvider';
import type { RadialBarSeriesType } from '../models/seriesType/radialBar';
import { DEFAULT_ROTATION_AXIS_KEY } from '../constants';
import {
  RADIAL_BAR_CHART_PLUGINS,
  type RadialBarChartPluginSignatures,
} from './RadialBarChart.plugins';
import { RadialBarPlot } from './RadialBarPlot';

export type RadialBarSeries = MakeOptional<RadialBarSeriesType, 'type'>;

export interface RadialBarChartSlots
  extends
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface RadialBarChartSlotProps
  extends
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export interface RadialBarChartProps
  extends
    Omit<
      ChartsRadialDataProviderPremiumProps<'radialBar', RadialBarChartPluginSignatures>,
      'series' | 'plugins' | 'zAxis' | 'slots' | 'slotProps'
    >,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the radial bar chart.
   * An array of [[RadialBarSeries]] objects.
   */
  series: Readonly<RadialBarSeries[]>;
  /**
   * Option to display a radial grid in the background.
   */
  grid?: Pick<ChartsRadialGridProps, 'radius' | 'rotation'>;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RadialBarChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RadialBarChartSlotProps;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
}

const seriesConfig = { radialBar: radialBarSeriesConfig };

/**
 * Demos:
 *
 * - [Radial bar demonstration](https://mui.com/x/react-charts/radial-bar/)
 *
 * API:
 *
 * - [RadialBarChart API](https://mui.com/x/api/charts/radial-bar-chart/)
 */
const RadialBarChart = React.forwardRef(function RadialBarChart(
  inProps: RadialBarChartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadialBarChart' });
  const {
    rotationAxis,
    radiusAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    hideLegend,
    grid,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    showToolbar,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const seriesWithDefault = React.useMemo(
    () =>
      series.map((s) => ({
        type: 'radialBar' as const,
        ...s,
      })),
    [series],
  );

  const chartsContainerProps: ChartsRadialDataProviderProps<
    'radialBar',
    RadialBarChartPluginSignatures
  > = {
    ...other,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    dataset,
    rotationAxis: rotationAxis ?? [
      {
        id: DEFAULT_ROTATION_AXIS_KEY,
        scaleType: 'band',
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ],
    radiusAxis,
    skipAnimation,
    plugins: RADIAL_BAR_CHART_PLUGINS,
  };

  const gridProps: ChartsRadialGridProps | undefined = grid;

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
    hideLegend: props.hideLegend ?? false,
  };

  const { chartsDataProviderProps, chartsSurfaceProps } = useChartsContainerProps<
    'radialBar',
    RadialBarChartPluginSignatures
  >(chartsContainerProps);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartsRadialDataProviderPremium<'radialBar', RadialBarChartPluginSignatures>
      {...chartsDataProviderProps}
      seriesConfig={seriesConfig}
    >
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        {props.showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsRadialGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <RadialBarPlot />
            <ChartsOverlay {...overlayProps} />
          </g>
          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsRadialDataProviderPremium>
  );
});

RadialBarChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
} as any;

export { RadialBarChart as Unstable_RadialBarChart };
