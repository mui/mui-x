'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { type ScatterProps } from '../Scatter';
import { ScatterAsyncBatch } from './ScatterAsyncBatch';
import { useScatterReveal } from './scatterAsyncReveal';
import { SCATTER_BATCH_SIZE } from './scatterRendererConstants';

/**
 * @ignore - internal component.
 */
function ScatterAsync(props: ScatterProps) {
  const { series, colorGetter, onItemClick, slots, slotProps, classes } = props;

  const count = series.data.length;
  const nBatches = Math.max(1, Math.ceil(count / SCATTER_BATCH_SIZE));

  // Reveal is driven by the plot-wide scheduler so the per-frame work is
  // bounded across all series, and batches are interleaved round-robin so every
  // series progresses together.
  const { getSeriesRevealedBatches } = useScatterReveal();
  const revealedBatches = getSeriesRevealedBatches(series.id);

  const batches: React.ReactNode[] = [];
  for (let b = 0; b < nBatches; b += 1) {
    const start = b * SCATTER_BATCH_SIZE;
    const end = Math.min(count, start + SCATTER_BATCH_SIZE);
    batches.push(
      <ScatterAsyncBatch
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

ScatterAsync.propTypes = {
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

export { ScatterAsync };
