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
import { MarkPlotProps } from '@mui/x-charts';
import { ResponsiveChartContainerPro } from '../ResponsiveChartContainerPro';
import { ZoomSetup } from '../context/ZoomProvider/ZoomSetup';
import { useZoom } from '../context/ZoomProvider/useZoom';

export interface LineChartProProps extends LineChartProps {
  /**
   * If `true`, the chart will be zoomable.
   */
  zoom?: boolean;
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
  const { zoom, ...restProps } = props;
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
  } = useLineChartProps(restProps);

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
      <MarkPlotZoom {...markPlotProps} />
      <LineHighlightPlot {...lineHighlightPlotProps} />
      <ChartsLegend {...legendProps} />
      {!props.loading && <ChartsTooltip {...tooltipProps} />}
      <ChartsClipPath {...clipPathProps} />
      {zoom && <ZoomSetup />}
      {children}
    </ResponsiveChartContainerPro>
  );
});

function MarkPlotZoom(props: MarkPlotProps) {
  const { isInteracting } = useZoom();
  return <MarkPlot {...props} skipAnimation={isInteracting ? true : props.skipAnimation} />;
}

export { LineChartPro };
