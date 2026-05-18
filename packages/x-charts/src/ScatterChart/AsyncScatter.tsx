'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { type ScatterProps } from './Scatter';
import { useUtilityClasses } from './scatterClasses';
import { ScatterBatch } from './ScatterBatch';
import { useStore } from '../internals/store/useStore';
import { selectorScatterSeriesRenderData } from './scatterRenderData.selectors';
import {
  SCATTER_BATCH_SIZE,
  SCATTER_REVEAL_BATCHES_PER_FRAME,
} from './scatterRendererConstants';

/**
 * Async, batched implementation of the default (`svg-single`) scatter renderer.
 *
 * Used automatically by `ScatterPlot` instead of `Scatter` when the total
 * point count exceeds `SCATTER_ASYNC_THRESHOLD`. It splits the series into
 * fixed-size batches; every batch `<g>` mounts immediately (cheap) while its
 * markers are rendered lazily from a zero-copy view on the packed coordinates
 * typed array. Once the async series/axes processors settle, batches are
 * revealed a few per animation frame, so the points paint progressively and
 * the main thread is not blocked committing every point in one frame.
 *
 * Note: the public API (`ScatterProps`, slots, interactions) is identical to
 * `Scatter`, so it is a drop-in replacement.
 */
function AsyncScatter(props: ScatterProps) {
  const { series, colorGetter, onItemClick, slots, slotProps, classes: inClasses } = props;
  const classes = useUtilityClasses({ classes: inClasses });

  const count = series.data.length;
  const nBatches = Math.max(1, Math.ceil(count / SCATTER_BATCH_SIZE));

  const store = useStore();
  // Render data is only available once the (async) series/axes processors have
  // settled. Until then there is nothing to reveal.
  const isReady = store.use(selectorScatterSeriesRenderData, series.id) !== undefined;

  // Number of batches whose markers are allowed to render. All batch `<g>`
  // elements always mount; this counter is ramped up a few batches per
  // animation frame so the points paint progressively and the main thread
  // stays responsive instead of committing every point in a single frame.
  const [revealedBatches, setRevealedBatches] = React.useState(0);

  // Reset synchronously during render when the data changes, so the new points
  // are never committed all at once for a frame before the effect below resets
  // the counter. This is React's "adjust state when a prop changes" pattern.
  const previousDataRef = React.useRef(series.data);
  if (previousDataRef.current !== series.data) {
    previousDataRef.current = series.data;
    setRevealedBatches(0);
  }

  React.useEffect(() => {
    setRevealedBatches(0);

    if (!isReady) {
      return undefined;
    }

    if (typeof requestAnimationFrame !== 'function') {
      // SSR / environments without rAF: reveal everything at once.
      setRevealedBatches(nBatches);
      return undefined;
    }

    let frame = 0;
    let cancelled = false;
    const step = () => {
      if (cancelled) {
        return;
      }
      setRevealedBatches((current) => {
        const next = Math.min(nBatches, current + SCATTER_REVEAL_BATCHES_PER_FRAME);
        if (next < nBatches) {
          // Reveal on every other frame: skip one animation frame between
          // commits so the browser keeps an idle frame for layout, paint and
          // input handling instead of revealing on back-to-back frames.
          frame = requestAnimationFrame(() => {
            if (cancelled) {
              return;
            }
            frame = requestAnimationFrame(step);
          });
        }
        return next;
      });
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // `series.data` is the actual source: it gets a new reference only when the
    // developer supplies new data (and once the async processors settle it
    // through). Keying the reset on it restarts the progressive paint on a data
    // change/reshuffle, while NOT replaying it on unrelated recomputes such as
    // zoom or resize (those keep the same `series.data` reference).
  }, [isReady, nBatches, series.data]);

  const batches: React.ReactNode[] = [];
  for (let b = 0; b < nBatches; b += 1) {
    const start = b * SCATTER_BATCH_SIZE;
    const end = Math.min(count, start + SCATTER_BATCH_SIZE);
    batches.push(
      <ScatterBatch
        key={b}
        series={series}
        colorGetter={colorGetter}
        onItemClick={onItemClick}
        slots={slots}
        slotProps={slotProps}
        start={start}
        end={end}
        classes={classes}
        revealed={b < revealedBatches}
      />,
    );
  }

  return <React.Fragment>{batches}</React.Fragment>;
}

AsyncScatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  colorGetter: PropTypes.func.isRequired,
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
} as any;

export { AsyncScatter };
