'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { type D3Scale } from '../models/axis';
import { type ScatterClasses, useUtilityClasses } from './scatterClasses';
import { useChartContext } from '../context/ChartProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { type ColorGetter } from '../internals/plugins/models';
import {
  selectorChartIsSeriesFaded,
  selectorChartIsSeriesHighlighted,
  selectorChartSeriesUnfadedItem,
  selectorChartSeriesHighlightedItem,
  type UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { appendAtKey } from '../internals/appendAtKey';

export interface BatchScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  classes?: Partial<ScatterClasses>;
}

const MAX_POINTS_PER_PATH = 1000;
/* In an SVG arc, if the arc starts and ends at the same point, it is not rendered, so we add a tiny
 * value to one of the coordinates to ensure that the arc is rendered. */
const ALMOST_ZERO = 0.01;

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

    if (tempPath.length >= MAX_POINTS_PER_PATH) {
      appendAtKey(paths, fill, tempPath.join(''));
      temporaryPaths.delete(fill);
    }
  }

  for (const [fill, tempPath] of temporaryPaths.entries()) {
    if (tempPath.length > 0) {
      appendAtKey(paths, fill, tempPath.join(''));
    }
  }

  return paths;
}

export interface BatchScatterPathsProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  markerSize: number;
}

function BatchScatterPaths(props: BatchScatterPathsProps) {
  const { series, xScale, yScale, color, colorGetter, markerSize } = props;
  const paths = useCreatePaths(series.data, markerSize, xScale, yScale, color, colorGetter);

  const children: React.ReactNode[] = [];

  let i = 0;
  for (const [fill, dArray] of paths.entries()) {
    for (const d of dArray) {
      children.push(<path key={i} fill={fill} d={d} />);
      i += 1;
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
}

const MemoBatchScatterPaths = React.memo(BatchScatterPaths);

const Group = styled('g', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
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
 * @internal
 * A batch version of the Scatter component that uses SVG paths to render points.
 * This component is optimized for performance and is suitable for rendering large datasets, but has limitations. Some of the limitations include:
 * - Limited CSS styling;
 * - Overriding the `marker` slot is not supported;
 * - Highlight style must not contain opacity.
 *
 * You can read about all the limitations [here](https://mui.com/x/react-charts/scatter/#performance).
 */
export function BatchScatter(props: BatchScatterProps) {
  const { series, xScale, yScale, color, colorGetter, classes: inClasses } = props;

  const { store } = useChartContext<[UseChartHighlightSignature]>();
  const isSeriesHighlighted = store.use(selectorChartIsSeriesHighlighted, series.id);
  const isSeriesFaded = store.use(selectorChartIsSeriesFaded, series.id);
  const seriesHighlightedItem = store.use(selectorChartSeriesHighlightedItem, series.id);
  const seriesUnfadedItem = store.use(selectorChartSeriesUnfadedItem, series.id);
  const highlightedModifier = 1.2;
  const markerSize = series.markerSize * (isSeriesHighlighted ? highlightedModifier : 1);
  const classes = useUtilityClasses(inClasses);

  const siblings: React.ReactNode[] = [];
  if (seriesHighlightedItem != null) {
    const datum = series.data[seriesHighlightedItem];
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);

    siblings.push(
      <path
        key={`highlighted-${series.id}`}
        fill={colorGetter ? colorGetter(seriesHighlightedItem) : color}
        data-highlighted
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
        key={`unfaded-${series.id}`}
        fill={colorGetter ? colorGetter(seriesUnfadedItem) : color}
        d={createPath(getXPosition(datum.x), getYPosition(datum.y), markerSize)}
      />,
    );
  }

  return (
    <React.Fragment>
      <Group
        className={classes.root}
        data-series={series.id}
        data-faded={isSeriesFaded || undefined}
        data-highlighted={isSeriesHighlighted || undefined}
      >
        <MemoBatchScatterPaths
          series={series}
          xScale={xScale}
          yScale={yScale}
          color={color}
          colorGetter={colorGetter}
          markerSize={markerSize}
        />
      </Group>
      {siblings}
    </React.Fragment>
  );
}
