'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../models/axis';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { ColorGetter } from '../internals/plugins/models/seriesConfig';
import { useSelector } from '../internals/store/useSelector';
import {
  selectorChartIsSeriesFaded,
  selectorChartIsSeriesHighlighted,
  selectorChartSeriesUnfadedItem,
  selectorChartSeriesHighlightedItem,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';

export interface FastScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  classes?: Partial<ScatterClasses>;
}

const MAX_POINTS_PER_PATH = 1000;
const ALMOST_ZERO = 0.01;

function appendAtKey(map: Map<string, string[]>, key: string, value: string) {
  let bucket = map.get(key);
  if (!bucket) {
    bucket = [value];
    map.set(key, bucket);
  } else {
    bucket.push(value);
  }
  return bucket;
}

function createPath(x: number, y: number, markerSize: number) {
  return `M${x - markerSize} ${y} a${markerSize} ${markerSize} 0 1 1 0 ${ALMOST_ZERO}`;
}

function useCreatePaths(
  seriesData: DefaultizedScatterSeriesType['data'],
  markerSize: number,
  xScale: D3Scale,
  yScale: D3Scale,
  color: string,
  colorGetter?: ColorGetter<'scatter'>,
) {
  const start = performance.now();
  const { instance } = useChartContext();
  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);

  const paths = new Map<string, string[]>();
  const temporaryPaths = new Map<string, string[]>();

  for (let i = 0; i < seriesData.length; i += 1) {
    const scatterPoint = seriesData[i];

    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);

    if (!instance.isPointInside(x, y)) {
      continue;
    }

    const path = createPath(x, y, markerSize);
    const fill = colorGetter ? colorGetter(i) : color;

    const tempPath = appendAtKey(temporaryPaths, fill, path);

    if (tempPath != null && tempPath.length >= MAX_POINTS_PER_PATH) {
      appendAtKey(paths, fill, tempPath.join(''));
      temporaryPaths.delete(fill);
    }
  }

  for (const [fill, tempPath] of temporaryPaths.entries()) {
    if (tempPath.length > 0) {
      appendAtKey(paths, fill, tempPath.join(''));
    }
  }

  performance.measure('useCreatePathsIteratively', { start });

  return paths;
}

const Group = styled('g')({
  '&[data-faded="true"]': {
    opacity: 0.3,
  },
  '& path': {
    /* The browser must do hit testing to know which element a pointer is interacting with.
     * With many data points, we create many paths causing significant time to be spent in the hit test phase.
     * To fix this issue, we disable pointer events for the descendant paths.
     *
     * Ideally, users should be able to override this in case they need pointer events to be enabled,
     * but it can affect performance negatively, especially with many data points. */
    pointerEvents: 'none',
  },
});

/**
 * A faster version of the Scatter component that uses SVG paths to render points.
 * This component is optimized for performance and is suitable for rendering large datasets, but has limitations:
 * - TODO: Explain limitations
 */
export function FastScatter(props: FastScatterProps) {
  const { series, xScale, yScale, color, colorGetter, classes: inClasses } = props;

  const { store } = useChartContext<[UseChartHighlightSignature]>();
  const isSeriesHighlighted = useSelector(store, selectorChartIsSeriesHighlighted, [series.id]);
  const isSeriesFaded = useSelector(store, selectorChartIsSeriesFaded, [series.id]);
  const seriesHighlightedItem = useSelector(store, selectorChartSeriesHighlightedItem, [series.id]);
  const seriesUnfadedItem = useSelector(store, selectorChartSeriesUnfadedItem, [series.id]);
  const highlightedModifier = 1.2;
  const markerSize = series.markerSize * (isSeriesHighlighted ? highlightedModifier : 1);

  const paths = useCreatePaths(series.data, markerSize, xScale, yScale, color, colorGetter);
  const classes = useUtilityClasses(inClasses);

  const start = performance.now();
  const children = [];

  let i = 0;
  for (const [fill, dArray] of paths.entries()) {
    for (const d of dArray) {
      children.push(<path key={i} fill={fill} d={d} />);
      i += 1;
    }
  }
  performance.measure('FastScatter paths.map', { start });

  const siblings = [];
  if (seriesHighlightedItem != null) {
    const datum = series.data[seriesHighlightedItem];
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);

    siblings.push(
      <path
        key={i}
        fill={colorGetter ? colorGetter(i) : color}
        d={createPath(
          getXPosition(datum.x),
          getYPosition(datum.y),
          markerSize * highlightedModifier,
        )}
      />,
    );
  }

  if (seriesUnfadedItem != null) {
    const datum = series.data[seriesUnfadedItem];
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);

    siblings.push(
      <path
        key={i}
        fill={colorGetter ? colorGetter(i) : color}
        d={createPath(getXPosition(datum.x), getYPosition(datum.y), markerSize)}
      />,
    );
  }

  return (
    <React.Fragment>
      <Group data-series={series.id} data-faded={isSeriesFaded} className={classes.root}>
        {children}
      </Group>
      {siblings}
    </React.Fragment>
  );
}
