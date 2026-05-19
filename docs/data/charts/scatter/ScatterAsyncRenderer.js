import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Chance from 'chance';

const NUMBER_OF_SERIES = 2;

const POINT_COUNT = 20000;

// Gaussian-ish blobs so the progressive, batched paint is easy to see. Points
// are split into `NUMBER_OF_SERIES` contiguous series, each offset into its
// own region.
function makeSeries(chance, count) {
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
  const ref = React.useRef(null);

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

export default function ScatterAsyncRenderer() {
  const [mode, setMode] = React.useState('sync');
  const series = mode === 'sync' ? syncSeries : asyncSeries;

  // Time from a button click to the first DOM update of the chart.
  const [elapsedMs, setElapsedMs] = React.useState(null);
  const containerRef = React.useRef(null);
  // Bumped on every click; the measurement effect keys off it.
  const [runId, setRunId] = React.useState(0);
  const startRef = React.useRef(null);

  const select = (next) => {
    startRef.current = performance.now();
    setElapsedMs(null);
    setRunId((id) => id + 1);
    setMode(next);
  };

  React.useEffect(() => {
    if (runId === 0 || startRef.current === null) {
      return undefined;
    }
    let frame = 0;
    const check = () => {
      const count = containerRef.current?.querySelectorAll('circle').length ?? 0;
      if (count > 0) {
        setElapsedMs(performance.now() - startRef.current);
        return;
      }
      frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [runId]);

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
        <Typography variant="body2" sx={{ minWidth: 130 }}>
          first paint: {elapsedMs === null ? '—' : `${elapsedMs.toFixed(0)} ms`}
        </Typography>
      </Stack>
      <div ref={containerRef} style={{ width: '100%' }}>
        <ScatterChart
          key={runId}
          series={series}
          height={400}
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
