import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { configurationOptions } from './configuration';
import { getColorPalette } from './colors';

export interface ChartsRendererProps {
  categories: { id: string; label: string; data: (string | number | null)[] }[];
  series: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: Record<string, any>;
}

function ChartsRenderer({ categories, series, chartType, configuration }: ChartsRendererProps) {
  // TODO: support multiple categories
  const categoryDataRaw = categories[0]?.data || [];

  // make sure that the category items are unique
  // for repeated values add the count to the value
  const itemCount = new Map<string, number>();
  const categoryData = categoryDataRaw.map((item) => {
    const currentCount = itemCount.get(String(item)) || 1;
    itemCount.set(String(item), currentCount + 1);
    return currentCount > 1 ? `${item} (${currentCount})` : item;
  });

  const sections = (configurationOptions as any)[chartType]?.customization || [];
  const defaultOptions = Object.fromEntries(
    sections.flatMap((section: any) =>
      Object.entries(section.controls).map(([key, value]) => [key, (value as any).default]),
    ),
  );

  // merge passed options with the defaults
  const chartConfiguration = React.useMemo(() => {
    return {
      ...defaultOptions,
      ...configuration,
    };
  }, [defaultOptions, configuration]);

  if (chartType === 'bar' || chartType === 'column') {
    const layout = chartType === 'bar' ? 'horizontal' : 'vertical';
    const axis = layout === 'vertical' ? 'xAxis' : 'yAxis';
    const axisProp = {
      [axis]: [
        {
          data: categoryData,
          categoryGapRatio: chartConfiguration.categoryGapRatio,
          barGapRatio: chartConfiguration.barGapRatio,
          tickPlacement: chartConfiguration.tickPlacement,
          tickLabelPlacement: chartConfiguration.tickLabelPlacement,
        },
      ],
    };
    const seriesProp = chartConfiguration.stacked
      ? series.map((ser) => ({ ...ser, stack: 'stack' }))
      : series;

    return (
      <BarChart
        {...axisProp}
        series={seriesProp}
        hideLegend={chartConfiguration.hideLegend}
        height={chartConfiguration.height}
        layout={layout}
        borderRadius={chartConfiguration.borderRadius}
        colors={getColorPalette(chartConfiguration.colors)}
        grid={{
          vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
          horizontal:
            chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
        }}
        skipAnimation={chartConfiguration.skipAnimation}
      />
    );
  }

  if (chartType === 'line' || chartType === 'area') {
    const area = chartType === 'area';
    const showMark = !area;
    const seriesProp = series.map((ser) => ({
      ...ser,
      area,
      showMark,
      stack: chartConfiguration.stacked ? 'stack' : undefined,
    }));

    return (
      <LineChart
        xAxis={[{ data: categoryData, scaleType: 'point' }]}
        yAxis={[{ min: 0 }]}
        series={seriesProp}
        hideLegend={chartConfiguration.hideLegend}
        height={chartConfiguration.height}
        colors={getColorPalette(chartConfiguration.colors)}
        skipAnimation={chartConfiguration.skipAnimation}
      />
    );
  }

  if (chartType === 'pie') {
    // - `chartConfiguration.outerRadius - chartConfiguration.innerRadius` is available radius for the whole chart
    // - to get the radius for each series, we need to substract all the gaps
    //   between the series from that number (`chartConfiguration.seriesGap * series.length - 1` - there is always
    //   one gap less than the number of series)
    // - then we divide the result by the number of series to get the radius for each series
    const radiusPerSerie =
      (chartConfiguration.outerRadius -
        chartConfiguration.innerRadius -
        chartConfiguration.seriesGap * series.length -
        1) /
      series.length;

    const seriesProp = series.map((seriesItem, seriesIndex) => ({
      data: seriesItem.data.map((item, itemIndex) => ({
        id: `${seriesItem.id}-${itemIndex}`,
        value: item || 0,
        label: String(categoryData[itemIndex]),
      })),
      // each series starts from
      // - inner radius of the chart
      // - plus all the series before
      // - plus the gap between the series
      innerRadius:
        chartConfiguration.innerRadius +
        seriesIndex * radiusPerSerie +
        chartConfiguration.seriesGap * seriesIndex,
      // each series ends at the radius that is the same as start plus the radius of one series
      outerRadius:
        chartConfiguration.innerRadius +
        (seriesIndex + 1) * radiusPerSerie +
        chartConfiguration.seriesGap * seriesIndex,
    }));

    return (
      <PieChart
        series={seriesProp}
        height={chartConfiguration.height}
        width={chartConfiguration.width}
        hideLegend={chartConfiguration.hideLegend}
        colors={getColorPalette(chartConfiguration.colors)}
        slotProps={{
          legend: {
            sx: {
              overflowY: 'scroll',
              flexWrap: 'nowrap',
              height: chartConfiguration.height,
            },
          },
        }}
      />
    );
  }

  return null;
}

ChartsRenderer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  chartType: PropTypes.string.isRequired,
  configuration: PropTypes.object.isRequired,
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { ChartsRenderer };
