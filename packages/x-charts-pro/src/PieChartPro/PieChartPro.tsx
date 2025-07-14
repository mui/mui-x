import { ChartsWrapper, DEFAULT_PIE_CHART_MARGIN, defaultizeMargin } from '@mui/x-charts/internals';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import * as React from 'react';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { PieChartProps, PieChartSlotProps, PieChartSlots, PiePlot } from '@mui/x-charts/PieChart';
import { useChartContainerProProps } from '../ChartContainerPro/useChartContainerProProps';
import { ChartDataProviderPro } from '../ChartDataProviderPro';
import { ChartsSlotsPro, ChartsSlotPropsPro } from '../internals/material';
import { ChartsToolbarPro } from '../ChartsToolbarPro';
import { ChartContainerProProps } from '../ChartContainerPro';
import { PIE_CHART_PRO_PLUGINS, PieChartProPluginSignatures } from './PieChartPro.plugins';
import {
  ChartsToolbarProSlotProps,
  ChartsToolbarProSlots,
} from '../ChartsToolbarPro/Toolbar.types';

export interface PieChartProSlots
  extends Omit<PieChartSlots, 'toolbar'>,
    ChartsToolbarProSlots,
    Partial<ChartsSlotsPro> {}
export interface PieChartProSlotProps
  extends Omit<PieChartSlotProps, 'toolbar'>,
    ChartsToolbarProSlotProps,
    Partial<ChartsSlotPropsPro> {}

export interface PieChartProProps
  extends Omit<PieChartProps, 'apiRef' | 'slots' | 'slotProps'>,
    Omit<
      ChartContainerProProps<'pie', PieChartProPluginSignatures>,
      'series' | 'plugins' | 'seriesConfig' | 'slots' | 'slotProps' | 'experimentalFeatures'
    > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PieChartProSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PieChartProSlotProps;
}

const PieChartPro = React.forwardRef<SVGSVGElement, PieChartProProps>(
  function PieChartPro(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiPieChartPro' });
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

    const { chartDataProviderProProps, chartsSurfaceProps } = useChartContainerProProps<
      'pie',
      PieChartProPluginSignatures
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
        plugins: PIE_CHART_PRO_PLUGINS,
      },
      ref,
    );

    const Tooltip = slots?.tooltip ?? ChartsTooltip;
    const Toolbar = props.slots?.toolbar ?? ChartsToolbarPro;

    return (
      <ChartDataProviderPro<'pie', PieChartProPluginSignatures> {...chartDataProviderProProps}>
        <ChartsWrapper
          legendPosition={props.slotProps?.legend?.position}
          legendDirection={props?.slotProps?.legend?.direction ?? 'vertical'}
          sx={sx}
        >
          {showToolbar ? <Toolbar /> : null}
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
      </ChartDataProviderPro>
    );
  },
);

PieChartPro.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      exportAsImage: PropTypes.func.isRequired,
      exportAsPrint: PropTypes.func.isRequired,
    }),
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

export { PieChartPro };
