'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { ScatterProps } from '../Scatter';
import { ScatterAsyncBatch } from './ScatterAsyncBatch';
import { useStore } from '../../internals/store/useStore';
import {
  selectorProgressiveBatchSize,
  selectorProgressiveSeriesRevealedBatches,
} from '../../internals/plugins/featurePlugins/useProgressiveRendering';
import type { UseProgressiveRenderingSignature } from '../../internals/plugins/featurePlugins/useProgressiveRendering';
import { selectorChartZoomIsInteracting } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import type { UseChartCartesianAxisSignature } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { selectorScatterSeriesRenderData } from './scatterRenderData.selectors';
import { useRegisterItemActivation } from '../../internals/useRegisterItemActivation';

/** Per-series points sampled while interacting; the rest fills in on settle. */
const INTERACTION_POINT_BUDGET = 2000;

/**
 * Interacting sample stride. Multiple of `nBatches` (batch 0's stride) so the
 * sample is a subset of batch 0 — settling only adds points, no jump. Coarsened
 * to stay within `budget`.
 */
export function getInteractionStep(count: number, nBatches: number, budget: number): number {
  if (nBatches <= 0) {
    return 1;
  }
  return nBatches * Math.max(1, Math.ceil(count / (budget * nBatches)));
}

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
  // Batch `b` = every `nBatches`-th point from `b`: a uniform sample whose
  // membership depends only on `dataIndex` (stable across zoom/pan, no popping).
  const nBatches = count === 0 ? 0 : Math.ceil(count / Math.max(1, batchSize));
  // Only the first level shows while interacting; skip mounting the rest (empty
  // `<g>` still re-renders every frame, bypassing `React.memo`).
  const mountedBatches = isZoomInteracting ? Math.min(1, nBatches) : nBatches;
  // `count` (total points) is constant across zoom/pan, so the sampled set is
  // stable while panning.
  const interactionStep = getInteractionStep(count, nBatches, INTERACTION_POINT_BUDGET);

  useRegisterItemActivation(
    { type: 'scatter', seriesId: series.id },
    onItemClick &&
      ((event, item) =>
        onItemClick(event, {
          type: 'scatter',
          seriesId: series.id,
          dataIndex: item.dataIndex,
        })),
  );

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
