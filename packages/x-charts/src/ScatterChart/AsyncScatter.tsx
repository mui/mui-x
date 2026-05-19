'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { type ScatterProps } from './Scatter';
import { useUtilityClasses } from './scatterClasses';
import { ScatterBatch } from './ScatterBatch';
import { useScatterReveal } from './scatterAsyncReveal';
import { SCATTER_BATCH_SIZE } from './scatterRendererConstants';

/**
 * Async, batched implementation of the default (`svg-single`) scatter renderer.
 *
 * Used automatically by `ScatterPlot` instead of `Scatter` when the total
 * point count exceeds `SCATTER_ASYNC_THRESHOLD`. It splits the series into
 * fixed-size batches; every batch `<g>` mounts immediately (cheap) while its
 * markers are rendered lazily from a zero-copy view on the packed coordinates
 * typed array. A single scheduler shared by all series of the plot (see
 * `ScatterAsyncRevealProvider`) reveals one batch across all series per tick,
 * so the points paint progressively and the per-frame work stays bounded no
 * matter how many series there are.
 *
 * Note: the public API (`ScatterProps`, slots, interactions) is identical to
 * `Scatter`, so it is a drop-in replacement.
 */
function AsyncScatter(props: ScatterProps) {
  const { series, colorGetter, onItemClick, slots, slotProps, classes: inClasses } = props;
  const classes = useUtilityClasses({ classes: inClasses });

  const count = series.data.length;
  const nBatches = Math.max(1, Math.ceil(count / SCATTER_BATCH_SIZE));

  // Reveal is driven by the plot-wide scheduler so the per-frame work is
  // bounded across all series. This series' batches occupy the global range
  // `[offset, offset + nBatches)`.
  const { revealedGlobalBatches, getSeriesBatchOffset } = useScatterReveal();
  const offset = getSeriesBatchOffset(series.id);

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
        revealed={offset + b < revealedGlobalBatches}
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
