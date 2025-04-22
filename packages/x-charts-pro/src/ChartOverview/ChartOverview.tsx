import * as React from 'react';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { ChartAxisOverview } from './ChartAxisOverview';

/**
 * Renders the overview for all x and y axes that have an overview enabled.
 */
export function ChartOverview() {
  const { xAxisIds, xAxis: xAxes } = useXAxes();
  const { yAxisIds, yAxis: yAxes } = useYAxes();

  return (
    <React.Fragment>
      {xAxisIds.map((axisId) => {
        const xAxis = xAxes[axisId];

        const overview = typeof xAxis?.zoom === 'object' ? xAxis.zoom.overview : undefined;

        if (!overview?.enabled) {
          return null;
        }

        return (
          <ChartAxisOverview key={axisId} size={overview.size} axisId={axisId} axisDirection="x" />
        );
      })}
      {yAxisIds.map((axisId) => {
        const yAxis = yAxes[axisId];

        const overview = typeof yAxis?.zoom === 'object' ? yAxis.zoom.overview : undefined;

        if (!overview?.enabled) {
          return null;
        }

        return (
          <ChartAxisOverview key={axisId} size={overview.size} axisId={axisId} axisDirection="y" />
        );
      })}
    </React.Fragment>
  );
}
