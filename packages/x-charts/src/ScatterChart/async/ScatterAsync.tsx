'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { type ScatterProps } from '../Scatter';
import { ScatterAsyncBatch } from './ScatterAsyncBatch';
import { useStore } from '../../internals/store/useStore';
import {
  selectorProgressiveBatchSize,
  selectorProgressiveSeriesRevealedBatches,
  type UseProgressiveRenderingSignature,
} from '../../internals/plugins/featurePlugins/useProgressiveRendering';

/**
 * @ignore - internal component.
 */
function ScatterAsync(props: ScatterProps) {
  const { series, colorGetter, onItemClick, slots, slotProps, classes } = props;

  const count = series.data.length;

  const store = useStore<[UseProgressiveRenderingSignature]>();
  const batchSize = store.use(selectorProgressiveBatchSize);
  const revealedBatches = store.use(selectorProgressiveSeriesRevealedBatches, series.id);
  const nBatches = Math.max(1, Math.ceil(count / Math.max(1, batchSize)));

  const batches: React.ReactNode[] = [];
  for (let b = 0; b < nBatches; b += 1) {
    const start = b * batchSize;
    const end = Math.min(count, start + batchSize);
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
