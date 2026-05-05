import * as React from 'react';

interface AsyncScatterProps {
  /**
   * Flat Float64 buffer of (x, y) pairs. Length = 2 * pointCount.
   */
  data: Float64Array;
  width: number;
  height: number;
  markerSize?: number;
  padding?: number;
}

interface WorkerResult {
  paths: string[];
  processingMs: number;
  pointCount: number;
}

/**
 * POC scatter renderer that offloads scale computation + path generation to a Web Worker.
 * Renders a skeleton (border + "loading" label) while the worker computes, then swaps in the
 * full path elements when the worker returns.
 *
 * Intentionally bypasses the lib's ChartProvider pipeline — this is an architecture spike, not
 * a production-shape integration.
 */
export function AsyncScatter(props: AsyncScatterProps) {
  const { data, width, height, markerSize = 2, padding = 20 } = props;
  const [result, setResult] = React.useState<WorkerResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const worker = new Worker(new URL('./scatterWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      if (cancelled) {
        return;
      }
      setResult(event.data);
    };

    // Transfer the buffer (zero-copy out). Caller must not reuse `data` after this.
    worker.postMessage({ data, width, height, padding, markerSize }, [data.buffer]);

    return () => {
      cancelled = true;
      worker.terminate();
    };
  }, [data, width, height, padding, markerSize]);

  return (
    <React.Fragment>
      <svg width={width} height={height} style={{ border: '1px solid #ddd' }}>
        {result === null ? (
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
            >
              loading…
            </text>
          </React.Fragment>
        ) : (
          result.paths.map((d, i) => <path key={i} fill="#1976d2" d={d} />)
        )}
      </svg>
      {result !== null && (
        <span
          elementtiming="async-done"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            opacity: 0.01,
            pointerEvents: 'none',
            fontSize: 1,
          }}
        >
          {'\xA0'}
        </span>
      )}
    </React.Fragment>
  );
}
