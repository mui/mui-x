'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsOverlay, type ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { MakeOptional } from '@mui/x-internals/types';
import { ChartsWrapper, type ChartSeriesConfig } from '@mui/x-charts/internals';
import { ChartDataProviderPro } from '../ChartDataProviderPro';
import { ChartContainerProProps } from '../ChartContainerPro';
import { useChartContainerProProps } from '../ChartContainerPro/useChartContainerProProps';
import { SankeyPlot, type SankeyPlotProps } from './SankeyPlot';
import { useSankeyChartProps } from './useSankeyChartProps';
import { SANKEY_CHART_PLUGINS, type SankeyChartPluginsSignatures } from './SankeyChart.plugins';
import type { SankeySeriesType } from './sankey.types';
import { seriesConfig as sankeySeriesConfig } from './seriesConfig';

export type SankeySeries = MakeOptional<SankeySeriesType, 'type'>;

const seriesConfig: ChartSeriesConfig<'sankey'> = { sankey: sankeySeriesConfig };

export interface SankeyChartProps
  extends Omit<
      ChartContainerProProps<'sankey', SankeyChartPluginsSignatures>,
      'plugins' | 'series'
    >,
    Omit<SankeyPlotProps, 'data'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the Sankey chart.
   * A single object is expected.
   */
  series: SankeySeries;
  /**
   * If `true`, the legend is not rendered.
   * @default false
   */
  hideLegend?: boolean;
}

/**
 * Sankey Chart component
 *
 * Displays a Sankey diagram, visualizing flows between nodes where the width
 * of the links is proportional to the flow quantity.
 *
 * Demos:
 *
 * - [Sankey Chart](https://mui.com/x/react-charts/sankey/)
 *
 * API:
 *
 * - [SankeyChart API](https://mui.com/x/api/charts/sankey-chart/)
 */
const SankeyChart = React.forwardRef(function SankeyChart(
  props: SankeyChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const themedProps = useThemeProps({ props, name: 'MuiSankeyChart' });

  const {
    chartContainerProps,
    sankeyPlotProps,
    overlayProps,
    legendProps,
    chartsWrapperProps,
    children,
  } = useSankeyChartProps(themedProps);
  const { chartDataProviderProProps, chartsSurfaceProps } = useChartContainerProProps(
    chartContainerProps,
    ref,
  );

  // const Tooltip = themedProps.slots?.tooltip ?? ChartsTooltip;
  const Tooltip = ChartsTooltip;

  return (
    <ChartDataProviderPro<'sankey', SankeyChartPluginsSignatures>
      {...chartDataProviderProProps}
      seriesConfig={seriesConfig}
      plugins={SANKEY_CHART_PLUGINS}
    >
      <ChartsWrapper {...chartsWrapperProps}>
        {!themedProps.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <SankeyPlot {...sankeyPlotProps} />
          <ChartsOverlay {...overlayProps} />
          {children}
        </ChartsSurface>
        {/* {!themedProps.loading && <Tooltip {...themedProps.slotProps?.tooltip} trigger="item" />} */}
        <Tooltip trigger="item" />
      </ChartsWrapper>
    </ChartDataProviderPro>
  );
});

SankeyChart.propTypes = {
  // ----------------------------- Warning -----------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The colors to apply to the chart series.
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * The data set to use for the chart.
   */
  dataset: PropTypes.array,
  /**
   * Description of the chart for screen readers.
   */
  desc: PropTypes.string,
  /**
   * The height of the chart in px.
   * @default 400
   */
  height: PropTypes.number,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for the axes.
   * @default { top: 20, right: 20, bottom: 20, left: 20 }
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * Props passed to the Sankey plot component.
   */
  sankeyPlotProps: PropTypes.object,
  /**
   * The series to display in the Sankey chart.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Title of the chart for screen readers.
   */
  title: PropTypes.string,
  /**
   * The width of the chart in px.
   * @default 600
   */
  width: PropTypes.number,
};

export { SankeyChart };
