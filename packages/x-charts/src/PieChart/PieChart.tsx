'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { MakeOptional } from '@mui/x-internals/types';
import { DEFAULT_PIE_CHART_MARGIN } from '../internals/constants';
import { ChartsToolbarSlotProps, ChartsToolbarSlots } from '../Toolbar';
import { ChartsSlotProps, ChartsSlots } from '../internals/material';
import { ChartContainerProps } from '../ChartContainer';
import { PieSeriesType } from '../models/seriesType';
import { ChartsTooltip } from '../ChartsTooltip';
import { ChartsTooltipSlots, ChartsTooltipSlotProps } from '../ChartsTooltip/ChartTooltip.types';
import { ChartsLegend, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import { PiePlot, PiePlotProps, PiePlotSlotProps, PiePlotSlots } from './PiePlot';
import { PieValueType } from '../models/seriesType/pie';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '../ChartsOverlay';
import { ChartsSurface } from '../ChartsSurface';
import { ChartDataProvider } from '../ChartDataProvider';
import { useChartContainerProps } from '../ChartContainer/useChartContainerProps';
import { ChartsWrapper } from '../internals/components/ChartsWrapper';
import { PIE_CHART_PLUGINS, PieChartPluginSignatures } from './PieChart.plugins';
import { defaultizeMargin } from '../internals/defaultizeMargin';

export interface PieChartSlots
  extends PiePlotSlots,
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}

export interface PieChartSlotProps
  extends PiePlotSlotProps,
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export interface PieChartProps
  extends Omit<
      ChartContainerProps<'pie', PieChartPluginSignatures>,
      'series' | 'slots' | 'slotProps'
    >,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'>,
    Pick<PiePlotProps, 'skipAnimation'> {
  /**
   * The series to display in the pie chart.
   * An array of [[PieSeriesType]] objects.
   */
  series: Readonly<MakeOptional<PieSeriesType<MakeOptional<PieValueType, 'id'>>, 'type'>[]>;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * Callback fired when a pie arc is clicked.
   */
  onItemClick?: PiePlotProps['onItemClick'];
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PieChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PieChartSlotProps;
}

/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PieChart API](https://mui.com/x/api/charts/pie-chart/)
 */
const PieChart = React.forwardRef(function PieChart(
  inProps: PieChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPieChart' });
  const {
    series,
    width,
    height,
    margin: marginProps,
    colors,
    sx,
    skipAnimation,
    hideLegend,
    children,
    slots,
    slotProps,
    onItemClick,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    showToolbar,
    ...other
  } = props;
  const margin = defaultizeMargin(marginProps, DEFAULT_PIE_CHART_MARGIN);

  const { chartDataProviderProps, chartsSurfaceProps } = useChartContainerProps<
    'pie',
    PieChartPluginSignatures
  >(
    {
      ...other,
      series: series.map((s) => ({ type: 'pie', ...s })),
      width,
      height,
      margin,
      colors,
      highlightedItem,
      onHighlightChange,
      className,
      skipAnimation,
      plugins: PIE_CHART_PLUGINS,
    },
    ref,
  );

  const Tooltip = slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartDataProvider<'pie', PieChartPluginSignatures> {...chartDataProviderProps}>
      <ChartsWrapper
        legendPosition={props.slotProps?.legend?.position}
        legendDirection={props?.slotProps?.legend?.direction ?? 'vertical'}
        sx={sx}
      >
        {showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!hideLegend && (
          <ChartsLegend
            direction={props?.slotProps?.legend?.direction ?? 'vertical'}
            slots={slots}
            slotProps={slotProps}
          />
        )}
        <ChartsSurface {...chartsSurfaceProps}>
          <PiePlot slots={slots} slotProps={slotProps} onItemClick={onItemClick} />
          <ChartsOverlay loading={loading} slots={slots} slotProps={slotProps} />
          {children}
        </ChartsSurface>
        {!loading && <Tooltip trigger="item" {...slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartDataProvider>
  );
});

PieChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Localized text for chart components.
   */
  localeText: PropTypes.object,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when a pie arc is clicked.
   */
  onItemClick: PropTypes.func,
  /**
   * The series to display in the pie chart.
   * An array of [[PieSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar: PropTypes.bool,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  theme: PropTypes.oneOf(['dark', 'light']),
  title: PropTypes.string,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { PieChart };
