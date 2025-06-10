import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { configurationOptions } from './configuration';
import { getColorPallete } from './colors';

export interface ChartsRendererProps {
  categories: { id: string; label: string; data: (string | number | null)[] }[];
  series: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: Record<string, any>;
}

function ChartsRenderer({ categories, series, chartType, configuration }: ChartsRendererProps) {
  // TODO: support multiple categories
  const categoryData = categories[0]?.data || [];
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

  if (chartType === 'bar') {
    const axis = chartConfiguration.layout === 'vertical' ? 'xAxis' : 'yAxis';
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
        layout={chartConfiguration.layout}
        borderRadius={chartConfiguration.borderRadius}
        colors={getColorPallete(chartConfiguration.colors)}
        grid={{
          vertical: chartConfiguration.grid === 'vertical' || chartConfiguration.grid === 'both',
          horizontal:
            chartConfiguration.grid === 'horizontal' || chartConfiguration.grid === 'both',
        }}
        skipAnimation={chartConfiguration.skipAnimation}
      />
    );
  }

  if (chartType === 'line') {
    return (
      <LineChart
        xAxis={[{ data: categoryData, scaleType: 'point' }]}
        yAxis={[{ min: 0 }]}
        series={series}
        {...chartConfiguration}
        colors={getColorPallete(chartConfiguration.colors)}
      />
    );
  }

  if (chartType === 'pie') {
    return (
      <PieChart
        series={[
          {
            data: series[0]?.data.map((item, index) => ({
              id: index,
              value: item || 0,
              label: String(categories[0].data[index]),
            })),
            outerRadius: chartConfiguration.outerRadius,
          },
        ]}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          },
        }}
        {...chartConfiguration}
        colors={getColorPallete(chartConfiguration.colors)}
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
