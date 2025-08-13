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

function createPathV2(buffer: Uint8Array, index: number, x: number, y: number, markerSize: number) {
  /* eslint-disable no-plusplus */
  buffer[index++] = 77; // 'M'
  const startX = (x - markerSize).toString();

  for (const char of startX) {
    buffer[index++] = char.charCodeAt(0);
  }

  buffer[index++] = 32; // ' '

  for (const char of y.toString()) {
    buffer[index++] = char.charCodeAt(0);
  }

  buffer[index++] = 97; // 'a'

  for (const char of markerSize.toString()) {
    buffer[index++] = char.charCodeAt(0);
  }

  buffer[index++] = 32; // ' '

  for (const char of markerSize.toString()) {
    buffer[index++] = char.charCodeAt(0);
  }

  buffer[index++] = 32; // ' '
  buffer[index++] = 48; // '0'
  buffer[index++] = 32; // ' '
  buffer[index++] = 49; // '1'
  buffer[index++] = 32; // ' '
  buffer[index++] = 49; // '1'
  buffer[index++] = 32; // ' '
  buffer[index++] = 48; // '0'
  buffer[index++] = 32; // ' '
  buffer[index++] = 48; // '0'
  buffer[index++] = 46; // '.'
  buffer[index++] = 48; // '0'
  buffer[index++] = 49; // '1'

  return index++; // Return the new index after writing the path
}

function useCreatePathsV2(
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

  const start = performance.now();
  const bufferPaths = new Map<string, string[]>();
  const temporaryBuffers = new Map<string, Uint8Array>();
  const temporaryBufferIndices = new Map<string, number>();
  const textDecoder = new TextDecoder();

  for (let i = 0; i < seriesData.length; i += 1) {
    const scatterPoint = seriesData[i];

    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);

    if (!instance.isPointInside(x, y)) {
      continue;
    }

    const fill = colorGetter ? colorGetter(i) : color;

    let buffer = temporaryBuffers.get(fill);

    if (!buffer) {
      buffer = new Uint8Array(70_000); // Initial buffer size, can be adjusted
      temporaryBuffers.set(fill, buffer);
    }

    const bufferIndex = temporaryBufferIndices.get(fill) ?? 0;

    const newBufferIndex = createPathV2(buffer, bufferIndex, x, y, markerSize);

    temporaryBufferIndices.set(fill, newBufferIndex);

    if (newBufferIndex > 60_000) {
      appendAtKey(bufferPaths, fill, textDecoder.decode(buffer.slice(0, newBufferIndex)));
      temporaryBuffers.delete(fill);
      temporaryBufferIndices.delete(fill);
    }
  }

  for (const [fill, tempBuffer] of temporaryBuffers.entries()) {
    appendAtKey(
      bufferPaths,
      fill,
      textDecoder.decode(tempBuffer.slice(0, temporaryBufferIndices.get(fill))),
    );
  }

  performance.measure('useCreatePaths-buffer', { start });

  return bufferPaths;
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

  const start = performance.now();
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

  performance.measure('useCreatePaths-string', { start });
  return paths;
}

export interface FastScatterPathsProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  markerSize: number;
}

function FastScatterPaths(props: FastScatterPathsProps) {
  const { series, xScale, yScale, color, colorGetter, markerSize } = props;
  const paths = useCreatePathsV2(series.data, markerSize, xScale, yScale, color, colorGetter);

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

const MemoFastScatterPaths = React.memo(FastScatterPaths);

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
 * @internal
 * A faster version of the Scatter component that uses SVG paths to render points.
 * This component is optimized for performance and is suitable for rendering large datasets, but has limitations. Some of the limitations include:
 * - Limited CSS styling;
 * - Overriding the `marker` slot is not supported;
 * - Highlight style must not contain opacity.
 *
 * You can read about all the limitations [here](https://mui.com/x/react-charts/fast-scatter/).
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
        <MemoFastScatterPaths
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
