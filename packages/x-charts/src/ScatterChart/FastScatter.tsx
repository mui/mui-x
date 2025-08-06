'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../models/axis';
import { ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { getValueToPositionMapper } from '../hooks/useScale';

export interface FastScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  classes?: Partial<ScatterClasses>;
}

const MAX_POINTS_PER_PATH = 1000;
const ALMOST_ZERO = 0.01;

function useCreatePaths(series: DefaultizedScatterSeriesType, xScale: D3Scale, yScale: D3Scale) {
  const start = performance.now();
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

    if (!instance.isPointInside(x, y)) {
      continue;
    }

    temporaryPaths.push(`M${x - radius} ${y} a${radius} ${radius} 0 1 1 0 ${ALMOST_ZERO}`);

    if (temporaryPaths.length >= MAX_POINTS_PER_PATH) {
      paths.push(temporaryPaths.join(''));
      temporaryPaths = [];
    }
  }

  if (temporaryPaths.length > 0) {
    paths.push(temporaryPaths.join(''));
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
