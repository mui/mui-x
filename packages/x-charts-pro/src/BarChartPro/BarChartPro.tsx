import * as React from 'react';
import { BarChartProps, BarPlot } from '@mui/x-charts/BarChart';
import { ChartsOnAxisClickHandler } from '@mui/x-charts/ChartsOnAxisClickHandler';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { useBarChartProps } from '@mui/x-charts/internals';
import { BarPlotProps } from '@mui/x-charts';
import { ResponsiveChartContainerPro } from '../ResponsiveChartContainerPro';
import { ZoomSetup } from '../context/ZoomProvider/ZoomSetup';
import { useZoom } from '../context/ZoomProvider/useZoom';

export interface BarChartProProps extends BarChartProps {
  /**
   * If `true`, the chart will be zoomable.
   */
  zoom?: boolean;
}

/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarChart API](https://mui.com/x/api/charts/bar-chart/)
 */
const BarChartPro = React.forwardRef(function BarChartPro(props: BarChartProProps, ref) {
  const { zoom, ...restProps } = props;
  const {
    chartContainerProps,
    barPlotProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    legendProps,
    tooltipProps,
    children,
  } = useBarChartProps(restProps);

  return (
    <ResponsiveChartContainerPro ref={ref} {...chartContainerProps}>
      {props.onAxisClick && <ChartsOnAxisClickHandler {...axisClickHandlerProps} />}
      {props.grid && <ChartsGrid {...gridProps} />}
      <g {...clipPathGroupProps}>
        <BarChartPlotZoom {...barPlotProps} />
        <ChartsOverlay {...overlayProps} />
      </g>
      <ChartsAxis {...chartsAxisProps} />
      <ChartsLegend {...legendProps} />
      <ChartsAxisHighlight {...axisHighlightProps} />
      {!props.loading && <ChartsTooltip {...tooltipProps} />}
      <ChartsClipPath {...clipPathProps} />
      {zoom && <ZoomSetup />}
      {children}
    </ResponsiveChartContainerPro>
  );
});

function BarChartPlotZoom(props: BarPlotProps) {
  const { isInteracting } = useZoom();

  return <BarPlot {...props} skipAnimation={isInteracting ? true : props.skipAnimation} />;
}

export { BarChartPro };
