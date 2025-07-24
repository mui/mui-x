'use client';
import * as React from 'react';
import type { Quadtree, QuadtreeLeaf } from '@mui/x-charts-vendor/d3-quadtree';
import { useXAxes, useYAxes } from '../hooks/useAxis';
import { DefaultizedScatterSeriesType, ScatterValueType } from '../models/seriesType/scatter';
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
  selectorChartSeriesKdbush,
  selectorChartSeriesQuadtree,
} from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartAxisZoomData } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';

export interface FastScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  classes?: Partial<ScatterClasses>;
}

function visitVisiblePoints(
  quadtree: Quadtree<ScatterValueType>,
  xDomain: [number, number],
  yDomain: [number, number],
  visit: ({ x, y }: { x: number; y: number }) => void,
) {
  const [xmin, xmax] = xDomain;
  const [ymin, ymax] = yDomain;

  quadtree?.visit((n, x1, y1, x2, y2) => {
    if (n.length === undefined) {
      const node = n as QuadtreeLeaf<ScatterValueType>;
      do {
        const d = node.data;
        if (d.x >= xmin && d.x < xmax && d.y >= ymin && d.y < ymax) {
          visit(d);
        }
        n = node.next!;
      } while (n);
    }

    return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
  });
}

const MAX_POINTS_PER_PATH = 1000;

function useCreatePathsQuadtree(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  performance.mark('quadtreeStart');
  const store = useStore<[UseChartVoronoiSignature]>();
  const quadtree = useSelector(store, selectorChartSeriesQuadtree, [series.id]);

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const radius = series.markerSize;

  const paths: string[] = [];
  let temporaryPaths: string[] = [];

  visitVisiblePoints(
    quadtree!,
    xScale.domain() as [number, number],
    yScale.domain() as [number, number],
    (d) => {
      const x = getXPosition(d.x);
      const y = getYPosition(d.y);

      temporaryPaths.push(
        `M${x + radius} ${y + radius} A${radius} ${radius} 0 1 1 ${x + radius} ${y + radius - 0.01}`,
      );

      if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
        paths.push(temporaryPaths.join(''));
        temporaryPaths = [];
      }
    },
  );

  if (temporaryPaths.length > 0) {
    paths.push(temporaryPaths.join(''));
  }
  performance.mark('quadtreeEnd');
  performance.measure('quadtree', 'quadtreeStart', 'quadtreeEnd');

  return paths;
}

function useCreatePathsKdbush(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  performance.mark('kdbushStart');
  const store = useStore<[UseChartVoronoiSignature]>();
  const { xAxisIds } = useXAxes();
  const { yAxisIds } = useYAxes();
  const xAxisZoom = useSelector(store, selectorChartAxisZoomData, [
    series.xAxisId ?? xAxisIds[0],
  ]) ?? {
    start: 0,
    end: 100,
  };
  const yAxisZoom = useSelector(store, selectorChartAxisZoomData, [
    series.yAxisId ?? yAxisIds[0],
  ]) ?? {
    start: 0,
    end: 100,
  };
  const kdbush = useSelector(store, selectorChartSeriesKdbush, [series.id]);

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const radius = series.markerSize;

  const xDomain = xScale.domain() as [number, number];
  const yDomain = yScale.domain() as [number, number];
  const xDomainRange = xDomain[1] - xDomain[0];
  const yDomainRange = yDomain[1] - yDomain[0];
  const xMin = xDomain[0] + (xAxisZoom.start / 100) * xDomainRange;
  const xMax = xDomain[0] + (xAxisZoom.end / 100) * xDomainRange;
  const yMin = xDomain[0] + (yAxisZoom.start / 100) * yDomainRange;
  const yMax = xDomain[0] + (yAxisZoom.end / 100) * yDomainRange;

  const indices = kdbush?.range(xMin, yMin, xMax, yMax) ?? [];

  const paths: string[] = [];
  let temporaryPaths: string[] = [];

  for (const i of indices) {
    const scatterPoint = series.data[i];

    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);

    temporaryPaths.push(
      `M${x + radius} ${y + radius} A${radius} ${radius} 0 1 1 ${x + radius} ${y + radius - 0.01}`,
    );

    if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
      paths.push(temporaryPaths.join(''));
      temporaryPaths = [];
    }
  }

  if (temporaryPaths.length > 0) {
    paths.push(temporaryPaths.join(''));
  }

  performance.mark('kdbushEnd');
  performance.measure('kdbush', 'kdbushStart', 'kdbushEnd');

  return paths;
}

function useCreatePathsIteratively(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
) {
  performance.mark('useCreatePathsIteratively-start');
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const radius = series.markerSize;

  const paths: string[] = [];
  let temporaryPaths: string[] = [];

  for (let i = 0; i < series.data.length; i += 1) {
    const scatterPoint = series.data[i];

    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);

    const isInRange = instance.isPointInside(x, y);

    if (isInRange) {
      temporaryPaths.push(
        `M${x + radius} ${y + radius} A${radius} ${radius} 0 1 1 ${x + radius} ${y + radius - 0.01}`,
      );
    }

    if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
      paths.push(temporaryPaths.join(''));
      temporaryPaths = [];
    }
  }

  if (temporaryPaths.length > 0) {
    paths.push(temporaryPaths.join(''));
  }
  performance.mark('useCreatePathsIteratively-end');
  performance.measure(
    'useCreatePathsIteratively',
    'useCreatePathsIteratively-start',
    'useCreatePathsIteratively-end',
  );

  return paths;
}

function useCreatePaths(series: DefaultizedScatterSeriesType, xScale: D3Scale, yScale: D3Scale) {
  return useCreatePathsIteratively(series, xScale, yScale);
  // useCreatePathsQuadtree(series, xScale, yScale);
  // return useCreatePathsKdbush(series, xScale, yScale);
}

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

  return (
    <g
      ref={groupRef}
      data-series={series.id}
      className={classes.root}
      onPointerMove={eventHandlers?.onPointerMove}
      onPointerLeave={eventHandlers?.onPointerLeave}
    >
      {paths.map((d, i) => (
        <path key={i} fill={color} d={d} />
      ))}
    </g>
  );
}

function ZoomHandlingGroups({ children }: React.PropsWithChildren<{}>) {
  const store = useStore<[UseChartVoronoiSignature]>();
  const { xAxisIds } = useXAxes();
  const { yAxisIds } = useYAxes();
  const xAxisZoom = useSelector(store, selectorChartAxisZoomData, [xAxisIds[0]]) ?? {
    start: 0,
    end: 100,
  };
  const yAxisZoom = useSelector(store, selectorChartAxisZoomData, [yAxisIds[0]]) ?? {
    start: 0,
    end: 100,
  };
  const xAxisRange = (xAxisZoom.end - xAxisZoom.start) / 100;
  const yAxisRange = (yAxisZoom.end - yAxisZoom.start) / 100;

  return (
    <g transform={`scale(${xAxisRange}, ${yAxisRange})`}>
      <g transform={`scale(${1 / xAxisRange}, ${1 / yAxisRange})`}>{children}</g>
    </g>
  );
}

export { FastScatter };
