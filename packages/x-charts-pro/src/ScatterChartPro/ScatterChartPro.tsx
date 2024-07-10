import * as React from 'react';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ScatterChartProps, ScatterPlot } from '@mui/x-charts/ScatterChart';
import { ZAxisContextProvider } from '@mui/x-charts/context';
import { ChartsVoronoiHandler } from '@mui/x-charts/ChartsVoronoiHandler';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { useScatterChartProps } from '@mui/x-charts/internals';
import { ResponsiveChartContainerPro } from '../ResponsiveChartContainerPro';
import { ZoomSetup } from '../context/ZoomProvider/ZoomSetup';

export interface ScatterChartProProps extends ScatterChartProps {
  /**
   * If `true`, the chart will be zoomable.
   */
  zoom?: boolean;
}

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterChart API](https://mui.com/x/api/charts/scatter-chart/)
 */
const ScatterChartPro = React.forwardRef(function ScatterChartPro(
  props: ScatterChartProProps,
  ref,
) {
  const { zoom, ...restProps } = props;
  const {
    chartContainerProps,
    zAxisProps,
    voronoiHandlerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    tooltipProps,
    children,
  } = useScatterChartProps(restProps);
  return (
    <ResponsiveChartContainerPro ref={ref} {...chartContainerProps}>
      <ZAxisContextProvider {...zAxisProps}>
        {!props.disableVoronoi && <ChartsVoronoiHandler {...voronoiHandlerProps} />}
        <ChartsAxis {...chartsAxisProps} />
        {props.grid && <ChartsGrid {...gridProps} />}
        <ScatterPlot {...scatterPlotProps} />
        <ChartsOverlay {...overlayProps} />
        <ChartsLegend {...legendProps} />
        <ChartsAxisHighlight {...axisHighlightProps} />
        {!props.loading && <ChartsTooltip {...tooltipProps} />}
        {zoom && <ZoomSetup />}
        {children}
      </ZAxisContextProvider>
    </ResponsiveChartContainerPro>
  );
});

export { ScatterChartPro };
