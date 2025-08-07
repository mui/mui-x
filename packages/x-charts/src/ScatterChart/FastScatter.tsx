'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../models/axis';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { ColorGetter } from '../internals/plugins/models/seriesConfig';

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
  const existing = map.get(key);
  if (existing) {
    existing.push(value);
    return existing;
  }

  const array = [value];
  map.set(key, array);
  return array;
}

function useCreatePaths(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
  color: string,
  colorGetter?: ColorGetter<'scatter'>,
) {
  const start = performance.now();
  const { instance } = useChartContext();
  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const radius = series.markerSize;

  const paths = new Map<string, string[]>();
  const temporaryPaths = new Map<string, string[]>();

  for (let i = 0; i < series.data.length; i += 1) {
    const scatterPoint = series.data[i];

    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);

    if (!instance.isPointInside(x, y)) {
      continue;
    }

    const path = `M${x - radius} ${y} a${radius} ${radius} 0 1 1 0 ${ALMOST_ZERO}`;
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
function FastScatter(props: FastScatterProps) {
  const { series, xScale, yScale, color, colorGetter, classes: inClasses } = props;

  const paths = useCreatePaths(series, xScale, yScale, color, colorGetter);
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

  return (
    <Group data-series={series.id} className={classes.root}>
      {children}
    </Group>
  );
}

export { FastScatter };
