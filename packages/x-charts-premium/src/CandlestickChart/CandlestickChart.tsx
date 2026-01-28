import * as React from 'react';
import {
  ChartsAxis,
  type ChartsAxisProps,
  type ChartsAxisSlotProps,
  type ChartsAxisSlots,
} from '@mui/x-charts/ChartsAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsGrid, type ChartsGridProps } from '@mui/x-charts/ChartsGrid';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '@mui/x-charts/ChartsTooltip';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlotProps,
  type ChartsOverlaySlots,
} from '@mui/x-charts/ChartsOverlay';
import type { MakeOptional } from '@mui/x-internals/types';
import { useThemeProps } from '@mui/material/styles';
import { type ChartsSlotProps, type ChartsSlots } from '@mui/x-charts/internals';
import {
  ChartsAxisHighlight,
  type ChartsAxisHighlightProps,
} from '@mui/x-charts/ChartsAxisHighlight';
import { type ChartContainerPremiumProps } from '../ChartContainerPremium';
import { ChartDataProviderPremium } from '../ChartDataProviderPremium';
import { type OHLCSeriesType } from '../models';
import { type CandlestickChartPluginSignatures } from './CandlestickChart.plugins';
import { CandlestickPlot, type CandlestickPlotProps } from './CandlestickPlot';
import { useCandlestickChartProps } from './useCandlestickChartProps';
import { useChartContainerPremiumProps } from '../ChartContainerPremium/useChartContainerPremiumProps';

export interface CandlestickChartSlots
  extends ChartsAxisSlots, ChartsOverlaySlots, ChartsTooltipSlots, Partial<ChartsSlots> {}
export interface CandlestickChartSlotProps
  extends
    ChartsAxisSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    Partial<ChartsSlotProps> {}

export type OHLCSeries = MakeOptional<OHLCSeriesType, 'type'>;

export interface CandlestickChartProps
  extends
    Omit<
      ChartContainerPremiumProps<'ohlc', CandlestickChartPluginSignatures>,
      'series' | 'plugins' | 'experimentalFeatures'
    >,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<CandlestickPlotProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the bar chart.
   * An array of [[OHLCSeries]] objects.
   */
  series: ReadonlyArray<OHLCSeries>;
  /**
   * Option to display a cartesian grid in the background.
   */
  grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line', y: 'line' }
   */
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: CandlestickChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: CandlestickChartSlotProps;
}

/**
 * Demos:
 *
 * - [Candlestick](https://mui.com/x/react-charts/candlestick/)
 *
 * API:
 *
 * - [CandlestickChart API](https://mui.com/x/api/charts/candlestick/)
 */
export const CandlestickChart = React.forwardRef(function CandlestickChart(
  inProps: CandlestickChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiCandlestickChart' });
  const {
    chartsWrapperProps,
    chartContainerProps,
    candlestickPlotProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    children,
  } = useCandlestickChartProps(props);
  const { chartDataProviderPremiumProps, chartsSurfaceProps } = useChartContainerPremiumProps(
    chartContainerProps,
    ref,
  );

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;

  return (
    <ChartDataProviderPremium<'ohlc', CandlestickChartPluginSignatures>
      {...chartDataProviderPremiumProps}
    >
      <ChartsWrapper {...chartsWrapperProps}>
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <CandlestickPlot {...candlestickPlotProps} />
            <ChartsOverlay {...overlayProps} />
            <ChartsAxisHighlight {...axisHighlightProps} />
          </g>
          <ChartsAxis {...chartsAxisProps} />
          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && (
          <Tooltip
            // TODO: Do we want trigger item to be the default?
            trigger="item"
            {...props.slotProps?.tooltip}
          />
        )}
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
});
