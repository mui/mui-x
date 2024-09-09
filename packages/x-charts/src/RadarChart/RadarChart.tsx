import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useRadarChartProps } from './useRadarChartProps';

import {
  ResponsiveRadarChartContainer,
  ResponsiveRadarChartContainerProps,
} from './ResponsiveRadarChartContainer';
import { RadarGrid } from './RadarGrid';
import { RadarAreaPlot } from './RadarAreaPlot';

export interface RadarChartProps extends ResponsiveRadarChartContainerProps {
  children?: React.ReactNode;
}
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineChart API](https://mui.com/x/api/charts/line-chart/)
 */
export const RadarChart = React.forwardRef(function RadarChart(inProps: RadarChartProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadarChart' });
  const { children } = useRadarChartProps(props);

  const { radarChartContainerProps } = useRadarChartProps(props);

  return (
    <ResponsiveRadarChartContainer ref={ref} {...radarChartContainerProps}>
      {/* <ChartsRadarGrid />
      <ChartsOverlay />
      <ChartsRadarHighlight />

      <ChartsLegend />
      {!props.loading && <ChartsRadarTooltip />} */}

      <RadarGrid />
      <RadarAreaPlot />
      {children}
    </ResponsiveRadarChartContainer>
  );
});
