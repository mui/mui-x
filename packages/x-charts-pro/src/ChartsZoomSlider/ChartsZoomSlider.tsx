import * as React from 'react';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { ChartsAxisZoomSlider } from './internals/ChartsAxisZoomSlider';

/**
 * Renders the zoom slider for all x and y axes that have it enabled.
 */
export function ChartsZoomSlider() {
  const { xAxisIds, xAxis: xAxes } = useXAxes();
  const { yAxisIds, yAxis: yAxes } = useYAxes();

  return (
    <React.Fragment>
      {xAxisIds.map((axisId) => {
        const xAxis = xAxes[axisId];

        const slider = xAxis.zoom?.slider;

        if (!slider?.enabled) {
          return null;
        }

        return <ChartsAxisZoomSlider key={axisId} axisId={axisId} axisDirection="x" />;
      })}
      {yAxisIds.map((axisId) => {
        const yAxis = yAxes[axisId];

        const slider = yAxis.zoom?.slider;

        if (!slider?.enabled) {
          return null;
        }

        return <ChartsAxisZoomSlider key={axisId} axisId={axisId} axisDirection="y" />;
      })}
    </React.Fragment>
  );
}
