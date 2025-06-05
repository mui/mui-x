import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

export interface ChartsRendererProps {
  categories: { id: string; label: string; data: (string | number | null)[] }[];
  series: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: Record<string, any>;
}

function ChartsRenderer({ categories, series, chartType, configuration }: ChartsRendererProps) {
  const categoryData = categories[0]?.data || [];

  if (chartType === 'bar') {
    // TODO: instead of returning charts directly, each chart can have a helper that will get the configuration and set the props (and add the defaults)
    return <BarChart xAxis={[{ data: categoryData }]} series={series} height={350} />;
  }

  if (chartType === 'line') {
    return (
      <LineChart
        xAxis={[{ data: categoryData, scaleType: 'point' }]}
        yAxis={[{ min: 0 }]}
        series={series}
        height={350}
      />
    );
  }

  if (chartType === 'pie') {
    return (
      <PieChart
        series={[
          {
            // TODO: should not be here
            data: series[0]?.data.map((item, index) => ({
              id: index,
              value: item || 0,
              label: categories[index].label,
            })),
            outerRadius: 120,
          },
        ]}
        width={350}
        height={350}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {
              vertical: 'bottom',
              horizontal: 'center',
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
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  chartType: PropTypes.string.isRequired,
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { ChartsRenderer };
