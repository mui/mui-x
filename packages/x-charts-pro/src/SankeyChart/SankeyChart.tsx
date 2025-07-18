'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartDataProviderPro } from '../ChartDataProviderPro';
import { ChartContainerProProps } from '../ChartContainerPro';
import { useChartContainerProProps } from '../ChartContainerPro/useChartContainerProProps';
import { SankeySeriesType } from './sankey.types';
import { SankeyPlot, SankeyPlotProps } from './SankeyPlot';

// Create a type for the plugin signatures
export interface SankeyChartPluginsSignatures {}

export type SankeySeries = MakeOptional<SankeySeriesType, 'type'>;

export interface SankeyChartProps
  extends Omit<
    ChartContainerProProps<'funnel', readonly []>,
    'series' | 'plugins' | 'xAxis' | 'yAxis' | 'zAxis'
  > {
  /**
   * The series to display in the Sankey chart.
   */
  series: SankeySeries[];

  /**
   * Props passed to the Sankey plot component.
   */
  sankeyPlotProps?: Omit<SankeyPlotProps, 'data' | 'width' | 'height'>;
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
function SankeyChart(props: SankeyChartProps) {
  const {
    width,
    height,
    margin,
    sx,
    title,
    desc,
    series,
    colors,
    dataset,
    sankeyPlotProps,
    slotProps,
    slots,
    children,
    ...other
  } = useThemeProps({
    props,
    name: 'MuiSankeyChart',
  });

  const seriesWithDefaults = React.useMemo(
    () =>
      series.map((item) => ({
        type: 'sankey',
        ...item,
      })),
    [series],
  );

  const chartProps = {
    width,
    height,
    margin,
    sx,
    title,
    desc,
    colors,
    dataset,
    series: seriesWithDefaults,
    ...other,
  };

  const containerProps = useChartContainerProProps(chartProps, []);

  const firstSeries = seriesWithDefaults[0];

  if (!firstSeries || !firstSeries.data) {
    return null;
  }

  return (
    <ChartDataProviderPro {...containerProps}>
      <ChartsSurface>
        <SankeyPlot
          data={firstSeries.data}
          nodeColor={firstSeries.nodeColor}
          linkColor={firstSeries.linkColor}
          linkOpacity={firstSeries.linkOpacity}
          nodeGap={firstSeries.nodeGap}
          nodeWidth={firstSeries.nodeWidth}
          showNodeLabels={firstSeries.showNodeLabels}
          iterations={firstSeries.iterations}
          {...sankeyPlotProps}
        />
        {children}
      </ChartsSurface>
      <ChartsLegend />
      <ChartsTooltip />
    </ChartDataProviderPro>
  );
}

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
