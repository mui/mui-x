import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { configurationOptions } from './configuration';

export interface ChartsRendererProps {
  categories: { id: string; label: string; data: (string | number | null)[] }[];
  series: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: Record<string, any>;
}

function ChartsRenderer({ categories, series, chartType, configuration }: ChartsRendererProps) {
  const categoryData = categories[0]?.data || [];
  const chartOptions = (configurationOptions as any)[chartType]?.customization || {};
  const defaultOptions = Object.fromEntries(
    Object.entries(chartOptions).map(([key, value]) => [key, (value as any).default]),
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
    const axisProp = { [axis]: [{ data: categoryData }] };
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
