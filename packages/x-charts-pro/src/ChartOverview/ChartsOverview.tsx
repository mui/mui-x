import * as React from 'react';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { ChartAxisOverview } from './ChartAxisOverview';

export function ChartsOverview() {
  const { xAxisIds, xAxis: xAxes } = useXAxes();
  const { yAxisIds, yAxis: yAxes } = useYAxes();

  return (
    <React.Fragment>
      {xAxisIds.map((axisId) => {
        const xAxis = xAxes[axisId];

        const overview = xAxis?.zoom?.overview;

        if (!overview?.enabled) {
          return null;
        }

        return (
          <ChartAxisOverview key={axisId} size={overview.size} axisId={axisId} axisDirection="x" />
        );
      })}
      {yAxisIds.map((axisId) => {
        const yAxis = yAxes[axisId];

        const overview = yAxis?.zoom?.overview;

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
