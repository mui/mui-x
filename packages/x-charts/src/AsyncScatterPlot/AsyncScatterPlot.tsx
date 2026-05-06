'use client';
import * as React from 'react';

export interface AsyncScatterPlotDomain {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface AsyncScatterPlotProps {
  /**
   * The data points. Either:
   * - a `Float64Array` of `(x, y)` pairs (length = 2 * point count). The buffer is
   *   transferred to the worker (zero-copy); after passing it to this component, it must
   *   not be reused on the caller side.
   * - an array of `{ x, y }` objects. This shape is structured-cloned to the worker, which
   *   is convenient but adds ~50–100 ms of copy cost at 1M points.
   */
  data: Float64Array | readonly { x: number; y: number }[];
  /**
   * The chart width in pixels.
   */
  width: number;
  /**
   * The chart height in pixels.
   */
  height: number;
  /**
   * Marker radius in pixels.
   * @default 2
   */
  markerSize?: number;
  /**
   * Marker fill color.
   * @default '#1976d2'
   */
  color?: string;
  /**
   * Inset between the SVG edge and the plot area.
   * @default 20
   */
  padding?: number;
  /**
   * Optional content rendered while the worker is computing. If omitted, a default
   * "loading" placeholder is shown.
   */
  loading?: React.ReactNode;
  /**
   * Called once the worker finishes processing the data.
   */
  onLoadEnd?: (info: {
    pointCount: number;
    processingMs: number;
    domain: AsyncScatterPlotDomain;
  }) => void;
  /**
   * Called if the worker errors.
   */
  onError?: (error: ErrorEvent | Error) => void;
}

interface WorkerOutput {
  paths: string[];
  processingMs: number;
  pointCount: number;
  domain: AsyncScatterPlotDomain;
}

function toFloat64(data: AsyncScatterPlotProps['data']): Float64Array {
  if (data instanceof Float64Array) {
    return data;
  }
  const out = new Float64Array(data.length * 2);
  for (let i = 0; i < data.length; i += 1) {
    out[2 * i] = data[i].x;
    out[2 * i + 1] = data[i].y;
  }
  return out;
}

/**
 * **Experimental.** A scatter renderer that offloads scale computation and SVG path
 * generation to a Web Worker, rendering a skeleton placeholder until the worker returns.
 * Suitable for very large datasets (~50k points and up) where the regular `ScatterChart`
 * blocks the main thread for too long.
 *
 * Trade-offs versus `ScatterChart`:
 * - Bypasses the chart provider pipeline — no axes, no legend, no highlight/tooltip.
 *   This is a renderer, not a full chart component.
 * - Renders a single-color, single-series scatter plot.
 * - Requires the consumer's bundler to support `new Worker(new URL(...), { type: 'module' })`
 *   (Vite, Webpack 5, Next, esbuild all do).
 *
 * The skeleton state is fully customisable via the `loading` prop.
 */
export function AsyncScatterPlot(props: AsyncScatterPlotProps) {
  const {
    data,
    width,
    height,
    markerSize = 2,
    color = '#1976d2',
    padding = 20,
    loading,
    onLoadEnd,
    onError,
  } = props;

  const [output, setOutput] = React.useState<WorkerOutput | null>(null);
  const onLoadEndRef = React.useRef(onLoadEnd);
  const onErrorRef = React.useRef(onError);
  React.useEffect(() => {
    onLoadEndRef.current = onLoadEnd;
    onErrorRef.current = onError;
  });

  React.useEffect(() => {
    if (typeof Worker === 'undefined') {
      // Server-side rendering or environment without Web Worker support — leave the
      // skeleton in place. Consumers can detect this via the absence of an `onLoadEnd`
      // call.
      return undefined;
    }

    let cancelled = false;
    setOutput(null);

    const worker = new Worker(new URL('./scatterWorker', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<WorkerOutput>) => {
      if (cancelled) {
        return;
      }
      setOutput(event.data);
      onLoadEndRef.current?.({
        pointCount: event.data.pointCount,
        processingMs: event.data.processingMs,
        domain: event.data.domain,
      });
    };
    worker.onerror = (event) => {
      if (cancelled) {
        return;
      }
      onErrorRef.current?.(event);
    };

    const flat = toFloat64(data);
    worker.postMessage({ data: flat, width, height, padding, markerSize }, [flat.buffer]);

    return () => {
      cancelled = true;
      worker.terminate();
    };
  }, [data, width, height, padding, markerSize]);

  if (output === null) {
    return (
      <svg width={width} height={height} role="img" aria-label="loading scatter plot">
        {loading ?? (
          <React.Fragment>
            <rect
              x={padding}
              y={padding}
              width={width - 2 * padding}
              height={height - 2 * padding}
              fill="#f5f5f5"
            />
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fill="#666"
            >
              Loading…
            </text>
          </React.Fragment>
        )}
      </svg>
    );
  }

  return (
    <svg width={width} height={height} role="img">
      {output.paths.map((d, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <path key={i} fill={color} d={d} />
      ))}
    </svg>
  );
}
