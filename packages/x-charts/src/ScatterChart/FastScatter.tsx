'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { useSelector } from '../internals/store/useSelector';
import { D3Scale } from '../models/axis';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import {
  selectorChartAxisZoomData,
  selectorChartSeriesFlatbush,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';

export interface FastScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  classes?: Partial<ScatterClasses>;
}

const MAX_POINTS_PER_PATH = 1000;
const ALMOST_ZERO = 0.01;

function useCreatePathsFlatbush(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  performance.mark('useCreatePathsFlatbush-start');
  const { store } = useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const flatbush = useSelector(store, selectorChartSeriesFlatbush, [series.id]);
  const radius = series.markerSize;
  const xAxisZoom = useSelector(store, selectorChartAxisZoomData, [
    series.xAxisId ?? 'defaultized-x-axis-0',
  ]);
  const yAxisZoom = useSelector(store, selectorChartAxisZoomData, [
    series.yAxisId ?? 'defaultized-y-axis-0',
  ]);
  const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
  const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
  const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
  const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;
  const fx = xScale.range()[1] - xScale.range()[0];
  const fy = yScale.range()[1] - yScale.range()[0];
  const xMin = xScale.range()[0];
  const yMin = yScale.range()[0];

  const paths: string[] = [];
  let temporaryPaths: string[] = [];

  const points = flatbush?.search(xZoomStart, yZoomStart, xZoomEnd, yZoomEnd) ?? [];

  for (let i = 0; i < points.length; i += 2) {
    const x = xMin + fx * points[i];
    const y = yMin + fy * points[i + 1];

    temporaryPaths.push(`M${x - radius} ${y} a${radius} ${radius} 0 1 1 0 ${ALMOST_ZERO}`);

    if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
      paths.push(temporaryPaths.join(''));
      temporaryPaths = [];
    }
  }

  if (temporaryPaths.length > 0) {
    paths.push(temporaryPaths.join(''));
  }

  performance.mark('useCreatePathsFlatbush-end');
  performance.measure(
    'useCreatePathsFlatbush',
    'useCreatePathsFlatbush-start',
    'useCreatePathsFlatbush-end',
  );

  return paths;
}

function useCreatePaths(series: DefaultizedScatterSeriesType, xScale: D3Scale, yScale: D3Scale) {
  return useCreatePathsFlatbush(series, xScale, yScale);
}

const Group = styled('g')({
  '& path': {
    pointerEvents: 'none',
  },
});

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function FastScatter(props: FastScatterProps) {
  const { series, xScale, yScale, color, classes: inClasses } = props;

  const paths = useCreatePaths(series, xScale, yScale);
  const classes = useUtilityClasses(inClasses);

  const start = performance.now();
  const children = paths.map((d, i) => <path key={i} fill={color} d={d} />);
  const end = performance.now();
  performance.measure('FastScatter paths.map', { start, end });

  return (
    <Group data-series={series.id} className={classes.root}>
      {children}
    </Group>
  );
}

export { FastScatter };
