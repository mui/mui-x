import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import Chance from 'chance';

const NUMBER_OF_SERIES = 3;

const POINT_COUNT = 20000;

// Gaussian-ish blobs so the progressive, batched paint is easy to see. Points
// are split into `NUMBER_OF_SERIES` contiguous series, each offset into its
// own region.
function makeSeries(chance: Chance.Chance, count: number) {
  const remainder = count % NUMBER_OF_SERIES;
  return Array.from({ length: NUMBER_OF_SERIES }, (_, seriesIndex) => {
    const size =
      Math.floor(count / NUMBER_OF_SERIES) + (seriesIndex < remainder ? 1 : 0);
    const offsetX = (seriesIndex % 2) * 50;
    const offsetY = seriesIndex * 25;
    const data = Array.from({ length: size }, () => {
      const angle = chance.floating({ min: 0, max: 2 * Math.PI });
      const radius = Math.sqrt(chance.floating({ min: 0, max: 1 })) * 100;
      const noiseX = chance.floating({ min: -100, max: 10 });
      const noiseY = chance.floating({ min: -100, max: 10 });
      return {
        x: offsetX + radius * Math.cos(angle) + noiseX,
        y: offsetY + radius * Math.sin(angle) + noiseY,
      };
    });
    return {
      id: `series-${seriesIndex}`,
      label: `Series ${seriesIndex + 1}`,
      data,
      markerSize: 2,
    };
  });
}

// Built once outside the component so toggling does not regenerate the points
// and the series keep stable references.
const syncSeries = makeSeries(new Chance(42), POINT_COUNT);
const asyncSeries = makeSeries(new Chance(43), POINT_COUNT);

// A spinner whose rotation is advanced in JS on every animation frame (not a
// CSS animation, which runs on the compositor and stays smooth regardless).
// If the main thread is blocked, this visibly stutters — a live indicator of
// whether the progressive render keeps the main thread responsive.
function MainThreadSpinner() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let frame = 0;
    let angle = 0;
    const tick = () => {
      angle = (angle + 6) % 360;
      if (ref.current) {
        ref.current.style.transform = `rotate(${angle}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={ref}
      aria-label="main thread activity"
      style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        opacity: 0.6,
      }}
    />
  );
}

// Renders the timing readout in its own component so that updating the
// measured values does NOT re-render the (heavy) chart — otherwise each
// state update would reconcile thousands of points and stall the main
// thread, making the spinner stutter exactly when a value appears.
function RenderTimers(props: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  startRef: React.RefObject<number | null>;
  runId: number;
}) {
  const { containerRef, startRef, runId } = props;
  const [firstMs, setFirstMs] = React.useState<number | null>(null);
  const [totalMs, setTotalMs] = React.useState<number | null>(null);
  // Number of distinct paint steps (frames on which the point count grew).
  const [paints, setPaints] = React.useState(0);

  React.useEffect(() => {
    setFirstMs(null);
    setTotalMs(null);
    setPaints(0);
    if (runId === 0 || startRef.current === null) {
      return undefined;
    }
    // Rendering is considered complete when the point count stops growing for
    // this many consecutive frames (longer than the gap between batches).
    const STABLE_FRAMES = 12;
    let frame = 0;
    let firstSeen = false;
    let lastCount = 0;
    let stableFrames = 0;
    let paintCount = 0;
    // Time of the most recent point-count change, so the reported total is the
    // moment the last batch painted, not when stability was confirmed.
    let lastChangeAt = 0;
    const check = () => {
      const now = performance.now();
      const count = containerRef.current?.querySelectorAll('circle').length ?? 0;

      if (!firstSeen && count > 0) {
        firstSeen = true;
        setFirstMs(now - startRef.current!);
      }

      if (firstSeen) {
        if (count === lastCount) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
          lastCount = count;
          lastChangeAt = now;
          paintCount += 1;
          setPaints(paintCount);
        }
        if (stableFrames >= STABLE_FRAMES) {
          setTotalMs(lastChangeAt - startRef.current!);
          return;
        }
      }

      frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [runId, containerRef, startRef]);

  return (
    <React.Fragment>
      <Typography variant="body2" sx={{ minWidth: 110 }}>
        first paint: {firstMs === null ? '—' : `${firstMs.toFixed(0)} ms`}
      </Typography>
      <Typography variant="body2" sx={{ minWidth: 110 }}>
        total: {totalMs === null ? '—' : `${totalMs.toFixed(0)} ms`}
      </Typography>
      <Typography variant="body2" sx={{ minWidth: 90 }}>
        paints: {paints}
      </Typography>
    </React.Fragment>
  );
}

export default function ScatterAsyncRenderer() {
  const [mode, setMode] = React.useState<'sync' | 'async'>('sync');
  const series = mode === 'sync' ? syncSeries : asyncSeries;

  const containerRef = React.useRef<HTMLDivElement>(null);
  // Bumped on every click; `RenderTimers` keys its measurement off it.
  const [runId, setRunId] = React.useState(0);
  const startRef = React.useRef<number | null>(null);

  const select = (next: 'sync' | 'async') => {
    startRef.current = performance.now();
    setRunId((id) => id + 1);
    setMode(next);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {mode === 'sync'
            ? `${POINT_COUNT.toLocaleString()} points`
            : `${POINT_COUNT.toLocaleString()} points`}
        </Typography>
        <Button
          variant={mode === 'sync' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => select('sync')}
        >
          Single
        </Button>
        <Button
          variant={mode === 'async' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => select('async')}
        >
          Progressive
        </Button>
        <MainThreadSpinner />
        <RenderTimers
          containerRef={containerRef}
          startRef={startRef}
          runId={runId}
        />
      </Stack>
      <div ref={containerRef} style={{ width: '100%' }}>
        <ScatterChartPro
          key={runId}
          series={series}
          height={400}
          xAxis={[{ zoom: true }]}
          yAxis={[{ zoom: true }]}
          // Force the renderer so the two modes are directly comparable:
          // - `svg-single`: original synchronous per-item renderer.
          // - `svg-progressive`: batched renderer that paints over several
          //   animation frames to keep the main thread responsive.
          // (Leaving `renderer` unset would pick automatically by point count.)
          renderer={mode === 'sync' ? 'svg-single' : 'svg-progressive'}
        />
      </div>
    </Stack>
  );
}
