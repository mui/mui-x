'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { D3Scale } from '../models/axis';
import {
  selectorChartsVoronoiIsVoronoiEnabled,
  UseChartVoronoiSignature,
} from '../internals/plugins/featurePlugins/useChartVoronoi';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { getValueToPositionMapper } from '../hooks/useScale';
import { useInteractionGroupProps } from '../hooks/useInteractionItemProps';
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

function useCreatePathsIteratively(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  performance.mark('useCreatePathsIteratively-start');
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  performance.mark('useCreatePathsIteratively-setup-start');
  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const radius = series.markerSize;
  performance.mark('useCreatePathsIteratively-setup-end');
  performance.measure(
    'useCreatePathsIteratively-setup',
    'useCreatePathsIteratively-setup-start',
    'useCreatePathsIteratively-setup-end',
  );

  const paths: string[] = [];
  let temporaryPaths: string[] = [];
  let timeSpentGettingPosition = 0;
  let timeSpentCheckingRange = 0;
  let timeSpentCreatingPath = 0;
  let timeSpentPushingPath = 0;
  let positionsGetters = 0;

  performance.mark('useCreatePathsIteratively-loop-start');
  for (let i = 0; i < series.data.length; i += 1) {
    const scatterPoint = series.data[i];

    let start = performance.now();
    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);
    let end = performance.now();
    positionsGetters += 1;
    timeSpentGettingPosition += end - start;

    start = performance.now();
    const isInRange = instance.isPointInside(x, y);
    end = performance.now();
    timeSpentCheckingRange += end - start;

    if (!isInRange) {
      continue;
    }

    start = performance.now();
    temporaryPaths.push(`M${x - radius} ${y} a${radius} ${radius} 0 1 1 0 ${ALMOST_ZERO}`);
    end = performance.now();
    timeSpentCreatingPath += end - start;

    if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
      start = performance.now();
      paths.push(temporaryPaths.join(''));
      end = performance.now();
      timeSpentPushingPath += end - start;
      temporaryPaths = [];
    }
  }

  if (temporaryPaths.length > 0) {
    const start = performance.now();
    paths.push(temporaryPaths.join(''));
    const end = performance.now();
    timeSpentPushingPath += end - start;
  }
  performance.mark('useCreatePathsIteratively-loop-end');
  performance.measure(
    'useCreatePathsIteratively-loop',
    'useCreatePathsIteratively-loop-start',
    'useCreatePathsIteratively-loop-end',
  );
  performance.mark('useCreatePathsIteratively-end');
  performance.measure(
    'useCreatePathsIteratively',
    'useCreatePathsIteratively-start',
    'useCreatePathsIteratively-end',
  );

  console.log('iteratively', {
    timeSpentGettingPosition,
    timeSpentCheckingRange,
    timeSpentCreatingPath,
    timeSpentPushingPath,
    positionsGetters,
  });

  return paths;
}

function useCreatePathsFlatbush(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  performance.mark('useCreatePathsFlatbush-start');
  const { store } = useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  performance.mark('useCreatePathsFlatbush-setup-start');
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

  performance.mark('useCreatePathsFlatbush-setup-end');
  performance.measure(
    'useCreatePathsFlatbush-setup',
    'useCreatePathsFlatbush-setup-start',
    'useCreatePathsFlatbush-setup-end',
  );

  const paths: string[] = [];
  let temporaryPaths: string[] = [];
  let timeSpentGettingPosition = 0;
  let timeSpentCreatingPath = 0;
  let timeSpentPushingPath = 0;
  let positionsGetters = 0;

  performance.mark('useCreatePathsFlatbush-search-start');
  let start = performance.now();
  const points = flatbush?.search(xZoomStart, yZoomStart, xZoomEnd, yZoomEnd) ?? [];
  let end = performance.now();
  performance.mark('useCreatePathsFlatbush-search-end');
  performance.measure(
    'useCreatePathsFlatbush-search',
    'useCreatePathsFlatbush-search-start',
    'useCreatePathsFlatbush-search-end',
  );
  const timeSpentCheckingRange = end - start;

  performance.mark('useCreatePathsFlatbush-loop-start');
  for (let i = 0; i < points.length; i += 2) {
    start = performance.now();
    const x = xMin + fx * points[i];
    const y = yMin + fy * points[i + 1];
    end = performance.now();
    positionsGetters += 1;
    timeSpentGettingPosition += end - start;

    start = performance.now();
    temporaryPaths.push(`M${x - radius} ${y} a${radius} ${radius} 0 1 1 0 ${ALMOST_ZERO}`);
    end = performance.now();
    timeSpentCreatingPath += end - start;

    if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
      start = performance.now();
      paths.push(temporaryPaths.join(''));
      end = performance.now();
      timeSpentPushingPath += end - start;
      temporaryPaths = [];
    }
  }

  if (temporaryPaths.length > 0) {
    start = performance.now();
    paths.push(temporaryPaths.join(''));
    end = performance.now();
    timeSpentPushingPath += end - start;
  }
  performance.mark('useCreatePathsFlatbush-loop-end');
  performance.measure(
    'useCreatePathsFlatbush-loop',
    'useCreatePathsFlatbush-loop-start',
    'useCreatePathsFlatbush-loop-end',
  );
  performance.mark('useCreatePathsFlatbush-end');
  performance.measure(
    'useCreatePathsFlatbush',
    'useCreatePathsFlatbush-start',
    'useCreatePathsFlatbush-end',
  );

  console.log('flatbush', {
    timeSpentGettingPosition,
    timeSpentCheckingRange,
    timeSpentCreatingPath,
    timeSpentPushingPath,
    positionsGetters,
  });

  return paths;
}

function useCreatePaths(series: DefaultizedScatterSeriesType, xScale: D3Scale, yScale: D3Scale) {
  useCreatePathsIteratively(series, xScale, yScale);
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

  const groupRef = React.useRef<SVGGElement>(null);
  const store = useStore<[UseChartVoronoiSignature]>();
  const isVoronoiEnabled = useSelector(store, selectorChartsVoronoiIsVoronoiEnabled);
  const skipInteractionHandlers = Boolean(isVoronoiEnabled || series.disableHover);

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const eventHandlers = useInteractionGroupProps(
    series.id,
    series.data,
    getXPosition,
    getYPosition,
    series.markerSize,
    skipInteractionHandlers,
  );

  const paths = useCreatePaths(series, xScale, yScale);
  const classes = useUtilityClasses(inClasses);

  const start = performance.now();
  const children = paths.map((d, i) => <path key={i} fill={color} d={d} />);
  const end = performance.now();
  performance.measure('FastScatter paths.map', { start, end });

  return (
    <Group
      ref={groupRef}
      data-series={series.id}
      className={classes.root}
      onPointerMove={eventHandlers?.onPointerMove}
      onPointerLeave={eventHandlers?.onPointerLeave}
    >
      {children}
    </Group>
  );
}

export { FastScatter };
