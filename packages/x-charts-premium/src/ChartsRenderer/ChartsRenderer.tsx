import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { configurationOptions } from './configuration';
import { colorPaletteLookup } from './colors';

const getLegendPosition = (position: string) => {
  switch (position) {
    case 'top':
      return { vertical: 'top' as const };
    case 'bottom':
      return { vertical: 'bottom' as const };
    case 'left':
      return { horizontal: 'start' as const };
    case 'right':
      return { horizontal: 'end' as const };
    default:
      return undefined;
  }
};

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

function ChartsRenderer({
  categories,
  series,
  chartType,
  configuration,
  onRender,
}: ChartsRendererProps) {
  const hasMultipleCategories = categories.length > 1;
  const categoryDataRaw = categories.length > 0 ? categories[categories.length - 1].data : [];
  const categoryLabel = [...categories.map((category) => category.label)].reverse().join(' - ');

  // for single category: make sure that the category items are unique. for repeated values add the count to the value
  // for multiple categories: transpose the data and create a array of arrays with the data per index
  // this will allow easier data management in the groups value getter function
  const itemCount = new Map<string, number>();
  const categoryData = hasMultipleCategories
    ? Array.from({ length: categories[0].data.length }, (_, dataIndex) =>
        categories.map((category) => category.data[dataIndex]),
      )
    : categoryDataRaw.map((item) => {
        const currentCount = itemCount.get(String(item)) || 1;
        itemCount.set(String(item), currentCount + 1);
        return currentCount > 1 ? `${item} (${currentCount})` : item;
      });

  // for multiple categories, create groups and height props for the axis
  const groups = hasMultipleCategories
    ? Array.from({ length: categories.length }, (_, categoryIndex) => ({
        getValue: (value: string[]) => value[categoryIndex],
      })).reverse()
    : undefined;
  const valueFormatter = (value: string | string[] | number): string => {
    if (Array.isArray(value)) {
      return value.join(' - ');
    }

    return String(value);
  };

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
    const { categoriesAxis, categoriesAxisPosition, seriesAxis, seriesAxisPosition } =
      layout === 'vertical'
        ? {
            categoriesAxis: 'xAxis',
            categoriesAxisPosition: chartConfiguration.xAxisPosition,
            seriesAxis: 'yAxis',
            seriesAxisPosition: chartConfiguration.yAxisPosition,
          }
        : {
            categoriesAxis: 'yAxis',
            categoriesAxisPosition: chartConfiguration.yAxisPosition,
            seriesAxis: 'xAxis',
            seriesAxisPosition: chartConfiguration.xAxisPosition,
          };

    // Build axis configuration
    const categoriesAxisConfig = {
      data: categoryData,
      categoryGapRatio: chartConfiguration.categoryGapRatio,
      barGapRatio: chartConfiguration.barGapRatio,
      tickPlacement: chartConfiguration.tickPlacement,
      tickLabelPlacement: chartConfiguration.tickLabelPlacement,
      valueFormatter,
      groups,
      label: chartConfiguration.categoriesAxisLabel || categoryLabel,
      position: categoriesAxisPosition,
    };

    const seriesAxisConfig = {
      label: chartConfiguration.seriesAxisLabel,
      position: seriesAxisPosition,
      reverse: chartConfiguration.seriesAxisReverse,
    };

    const axisProp = {
      [categoriesAxis]: [categoriesAxisConfig],
      [seriesAxis]: [seriesAxisConfig],
    };

    const seriesProp = chartConfiguration.stacked
      ? series.map((ser) => ({ ...ser, stack: 'stack' }))
      : series;

    const barLabel = chartConfiguration.itemLabel === 'value' ? ('value' as const) : undefined;
    const legendPosition = getLegendPosition(chartConfiguration.legendPosition);

    const props = {
      ...axisProp,
      series: seriesProp,
      hideLegend: legendPosition === undefined,
      height: chartConfiguration.height,
      layout: layout as 'horizontal' | 'vertical',
      borderRadius: chartConfiguration.borderRadius,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      grid: {
        vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
        horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
      },
      skipAnimation: chartConfiguration.skipAnimation,
      barLabel,
      slotProps: {
        tooltip: {
          trigger: chartConfiguration.tooltipTrigger,
          placement: chartConfiguration.tooltipPlacement,
        },
        legend: {
          direction: chartConfiguration.legendDirection,
          position: legendPosition,
        },
      },
    };

    return onRender ? onRender(chartType, props, BarChart) : <BarChart {...props} />;
  }

  if (chartType === 'line' || chartType === 'area') {
    const area = chartType === 'area';
    const seriesProp = series.map((ser) => ({
      ...ser,
      area,
      curve: chartConfiguration.interpolation,
      showMark: chartConfiguration.showMark,
      stack: chartConfiguration.stacked ? 'stack' : undefined,
    }));

    // Build axis configuration
    const xAxisConfig = {
      data: categoryData,
      scaleType: 'point' as const,
      valueFormatter,
      groups,
      label: chartConfiguration.categoriesAxisLabel || categoryLabel,
      position: chartConfiguration.xAxisPosition,
    };

    const yAxisConfig = {
      label: chartConfiguration.seriesAxisLabel,
      position: chartConfiguration.yAxisPosition,
      reverse: chartConfiguration.seriesAxisReverse,
    };

    const legendPosition = getLegendPosition(chartConfiguration.legendPosition);
    const props = {
      xAxis: [xAxisConfig],
      yAxis: [yAxisConfig],
      series: seriesProp,
      hideLegend: legendPosition === undefined,
      height: chartConfiguration.height,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      skipAnimation: chartConfiguration.skipAnimation,
      grid: {
        vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
        horizontal: chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
      },
      slotProps: {
        tooltip: {
          trigger: chartConfiguration.tooltipTrigger,
          placement: chartConfiguration.tooltipPlacement,
        },
        legend: {
          direction: chartConfiguration.legendDirection,
          position: legendPosition,
        },
      },
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
        label: `${String(categoryData[itemIndex])} - ${seriesItem.label}`,
      })),
      arcLabel: chartConfiguration.itemLabel === 'value' ? ('value' as const) : undefined,
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
      cornerRadius: chartConfiguration.cornerRadius,
      startAngle: chartConfiguration.startAngle,
      endAngle: chartConfiguration.endAngle,
      paddingAngle: chartConfiguration.paddingAngle,
    }));

    const legendPosition = getLegendPosition(chartConfiguration.pieLegendPosition);
    const props = {
      series: seriesProp,
      height: chartConfiguration.height,
      width: chartConfiguration.width,
      skipAnimation: chartConfiguration.skipAnimation,
      hideLegend: legendPosition === undefined,
      colors: colorPaletteLookup.get(chartConfiguration.colors),
      slotProps: {
        legend: {
          direction: chartConfiguration.pieLegendDirection,
          position: legendPosition,
          sx: {
            overflowY: 'scroll',
            flexWrap: 'nowrap',
            height: chartConfiguration.height,
          },
        },
        tooltip: {
          trigger: chartConfiguration.pieTooltipTrigger,
          placement: chartConfiguration.tooltipPlacement,
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
