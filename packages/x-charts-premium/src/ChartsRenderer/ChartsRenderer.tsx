import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { configurationOptions } from './configuration';
import { colorPaletteLookup } from './colors';

export interface ChartsRendererProps {
  categories: { id: string; label: string; data: (string | number | null)[] }[];
  series: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: Record<string, any>;
  onRender?: (
    type: string,
    props: Record<string, any>,
    Component: React.ComponentType<any>,
  ) => React.ReactNode;
}

const CATEGORY_TICK_SIZE = 20;

function ChartsRenderer({
  categories,
  series,
  chartType,
  configuration,
  onRender,
}: ChartsRendererProps) {
  const hasMultipleCategories = categories.length > 1;
  const categoryDataRaw = categories.length > 0 ? categories[categories.length - 1].data : [];

  // for single category: make sure that the category items are unique. for repeated values add the count to the value
  // for multiple categories: create an array of indexes. these will be used in the group value getters to get the correct value from the categories
  const itemCount = new Map<string, number>();
  const categoryData = hasMultipleCategories
    ? Array.from({ length: categoryDataRaw.length }, (_, i) => i)
    : categoryDataRaw.map((item) => {
        const currentCount = itemCount.get(String(item)) || 1;
        itemCount.set(String(item), currentCount + 1);
        return currentCount > 1 ? `${item} (${currentCount})` : item;
      });

  // for multiple categories, create groups and height props for the axis
  const groups = hasMultipleCategories
    ? categories
        .map((category, categoryIndex) => ({
          getValue: (index: number) => category.data[index] || '',
          tickSize: CATEGORY_TICK_SIZE * (categories.length - 1 - categoryIndex),
        }))
        .reverse()
    : undefined;
  const height = hasMultipleCategories ? CATEGORY_TICK_SIZE * (categories.length - 1) : undefined;

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
          valueFormatter: (value: number) => {
            if (hasMultipleCategories) {
              let formattedValue = '';
              categories.forEach((category, index) => {
                if (index > 0) {
                  formattedValue += ' - ';
                }
                formattedValue += category.data[value];
              });
              return formattedValue;
            }

            return value;
          },
          groups,
          height,
        },
      ],
    };
    const seriesProp = chartConfiguration.stacked
      ? series.map((ser) => ({ ...ser, stack: 'stack' }))
      : series;

    const props = {
      ...axisProp,
      series: seriesProp,
      hideLegend: chartConfiguration.hideLegend,
      height: chartConfiguration.height,
      layout: layout as 'horizontal' | 'vertical',
      borderRadius: chartConfiguration.borderRadius,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      grid: {
        vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
        horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
      },
      skipAnimation: chartConfiguration.skipAnimation,
    };

    return onRender ? onRender(chartType, props, BarChart) : <BarChart {...props} />;
  }

  if (chartType === 'line' || chartType === 'area') {
    const area = chartType === 'area';
    const seriesProp = series.map((ser) => ({
      ...ser,
      area,
      showMark: chartConfiguration.showMark,
      stack: chartConfiguration.stacked ? 'stack' : undefined,
    }));

    const props = {
      xAxis: [{ data: categoryData, scaleType: 'point' as const, groups, height }],
      series: seriesProp,
      hideLegend: chartConfiguration.hideLegend,
      height: chartConfiguration.height,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      skipAnimation: chartConfiguration.skipAnimation,
    };

    return onRender ? onRender(chartType, props, LineChart) : <LineChart {...props} />;
  }

  if (chartType === 'pie') {
    // - `chartConfiguration.outerRadius - chartConfiguration.innerRadius` is available radius for the whole chart
    // - to get the radius for each series, we need to substract all the gaps
    //   between the series from that number (`chartConfiguration.seriesGap * series.length - 1` - there is always
    //   one gap less than the number of series)
    // - then we divide the result by the number of series to get the radius for each series
    const radiusPerSeries =
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
        seriesIndex * radiusPerSeries +
        chartConfiguration.seriesGap * seriesIndex,
      // each series ends at the radius that is the same as start plus the radius of one series
      outerRadius:
        chartConfiguration.innerRadius +
        (seriesIndex + 1) * radiusPerSeries +
        chartConfiguration.seriesGap * seriesIndex,
    }));

    const props = {
      series: seriesProp,
      height: chartConfiguration.height,
      width: chartConfiguration.width,
      hideLegend: chartConfiguration.hideLegend,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      slotProps: {
        legend: {
          sx: {
            overflowY: 'scroll',
            flexWrap: 'nowrap',
            height: chartConfiguration.height,
          },
        },
      },
    };

    return onRender ? onRender(chartType, props, PieChart) : <PieChart {...props} />;
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
