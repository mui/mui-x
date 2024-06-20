import * as React from 'react';
import {
  AreaPlot,
  LineChartProps,
  LineHighlightPlot,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts/LineChart';
import { ChartsOnAxisClickHandler } from '@mui/x-charts/ChartsOnAxisClickHandler';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { useLineChartProps } from '@mui/x-charts/internals';
import { ResponsiveChartContainerPro } from '../ResponsiveChartContainerPro';

export interface LineChartProProps extends LineChartProps {
  // TODO: Add zoom props
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
const LineChartPro = React.forwardRef(function LineChartPro(props: LineChartProProps, ref) {
  const {
    chartContainerProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    areaPlotProps,
    linePlotProps,
    markPlotProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    lineHighlightPlotProps,
    legendProps,
    tooltipProps,

    children,
  } = useLineChartProps(props);

  return (
    <ResponsiveChartContainerPro ref={ref} {...chartContainerProps}>
      {props.onAxisClick && <ChartsOnAxisClickHandler {...axisClickHandlerProps} />}
      {props.grid && <ChartsGrid {...gridProps} />}
      <g {...clipPathGroupProps}>
        <AreaPlot {...areaPlotProps} />
        <LinePlot {...linePlotProps} />
        <ChartsOverlay {...overlayProps} />
      </g>
      <ChartsAxis {...chartsAxisProps} />
      <ChartsAxisHighlight {...axisHighlightProps} />
      <MarkPlot {...markPlotProps} />
      <LineHighlightPlot {...lineHighlightPlotProps} />
      <ChartsLegend {...legendProps} />
      {!props.loading && <ChartsTooltip {...tooltipProps} />}
      <ChartsClipPath {...clipPathProps} />
      {children}
    </ResponsiveChartContainerPro>
  );
});

export { LineChartPro };
