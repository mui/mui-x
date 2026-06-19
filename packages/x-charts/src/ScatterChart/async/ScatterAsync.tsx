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
 * Per-series points rendered while interacting. A single uniform sample across
 * the whole series (every `step`-th `dataIndex`) is drawn to keep frames light;
 * the rest fills in once the interaction settles. Sampling by `dataIndex` keeps
 * the sample uniform regardless of how the data is ordered.
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
  const count = renderData?.count ?? 0;
  // Strided batches: batch `b` renders every `nBatches`-th point starting at
  // `b`, so each batch is a uniform sample of the whole series and a point's
  // batch depends only on its `dataIndex` (stable across zoom/pan, no popping).
  const nBatches = count === 0 ? 0 : Math.ceil(count / Math.max(1, batchSize));
  // Only the first level shows while interacting; skip mounting the rest (empty
  // `<g>` still re-renders every frame, bypassing `React.memo`).
  const mountedBatches = isZoomInteracting ? Math.min(1, nBatches) : nBatches;
  // While interacting, draw one uniform sample of ~INTERACTION_POINT_BUDGET
  // points. `count` is the total point count (constant across zoom/pan), so the
  // step is stable and the sampled set doesn't churn while panning.
  const interactionStep = Math.max(1, Math.ceil(count / INTERACTION_POINT_BUDGET));

  const batches: React.ReactNode[] = [];
  for (let b = 0; b < mountedBatches; b += 1) {
    batches.push(
      <ScatterAsyncBatch
        key={b}
        series={series}
        colorGetter={colorGetter}
        onItemClick={onItemClick}
        slots={slots}
        slotProps={slotProps}
        start={isZoomInteracting ? 0 : b}
        step={isZoomInteracting ? interactionStep : nBatches}
        classes={classes}
        revealed={isZoomInteracting || b < revealedBatches}
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
