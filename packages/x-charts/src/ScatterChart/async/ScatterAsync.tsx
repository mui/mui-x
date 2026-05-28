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
import { selectorScatterSeriesRenderData } from './scatterRenderData.selectors';

/**
 * @ignore - internal component.
 */
function ScatterAsync(props: ScatterProps) {
  const { series, colorGetter, onItemClick, slots, slotProps, classes } = props;

  const store = useStore<[UseProgressiveRenderingSignature]>();
  const batchSize = store.use(selectorProgressiveBatchSize);
  const revealedBatches = store.use(selectorProgressiveSeriesRevealedBatches, series.id);
  // Size batches by the number of *visible* points so that zooming in (which
  // shrinks the filtered set in the selector) collapses the progressive wave
  // into a single tick once everything fits in one batch.
  const renderData = store.use(selectorScatterSeriesRenderData, series.id);
  const count = renderData?.count ?? 0;
  const nBatches = count === 0 ? 0 : Math.ceil(count / Math.max(1, batchSize));

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
