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
import {
  selectorChartZoomIsInteracting,
  type UseChartCartesianAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { selectorScatterSeriesRenderData } from './scatterRenderData.selectors';

/**
 * Per-series points rendered while interacting. The first level is capped to a
 * short stable `dataIndex` prefix (a uniform sample for unsorted data) to keep
 * frames cheap; the rest fills in once the interaction settles.
 */
const INTERACTION_POINT_BUDGET = 2000;

/**
 * @ignore - internal component.
 */
function ScatterAsync(props: ScatterProps) {
  const { series, colorGetter, onItemClick, slots, slotProps, classes } = props;

  const store = useStore<[UseProgressiveRenderingSignature, UseChartCartesianAxisSignature]>();
  const batchSize = store.use(selectorProgressiveBatchSize);
  const revealedBatches = store.use(selectorProgressiveSeriesRevealedBatches, series.id);
  const isZoomInteracting = store.use(selectorChartZoomIsInteracting);
  const renderData = store.use(selectorScatterSeriesRenderData, series.id);
  // Batch by `dataIndex` range, not by visible count: fixes a point's batch
  // across zoom/pan so it can't pop. Off-screen points skipped at render time.
  const count = renderData?.count ?? 0;
  const nBatches = count === 0 ? 0 : Math.ceil(count / Math.max(1, batchSize));
  // Only the first level shows while interacting; skip mounting the rest (empty
  // `<g>` still re-renders every frame, bypassing `React.memo`).
  const mountedBatches = isZoomInteracting ? Math.min(1, nBatches) : nBatches;

  const batches: React.ReactNode[] = [];
  for (let b = 0; b < mountedBatches; b += 1) {
    const start = b * batchSize;
    // Shrink the first level to a smaller stable prefix while interacting.
    const cap = isZoomInteracting ? Math.min(batchSize, INTERACTION_POINT_BUDGET) : batchSize;
    const end = Math.min(count, start + cap);
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
        isInteracting={isZoomInteracting}
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
