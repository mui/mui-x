import { describe, expect, it } from 'vitest';
import type { RenderedItem } from './chartState';
import type { RenderedValueItem } from './resolveForRenderer';
import { resolveAnnotations, resolveOverlaySeries } from './resolveAnnotations';
import type { AnnotationSpec, OverlaySpec } from './annotations/types';

const VALUES: RenderedValueItem[] = [
  { id: 'coffee', label: 'Coffee', data: [10, 50, 20, 40, 30, 60] },
];
const DIMENSIONS: RenderedItem[] = [
  { id: 'month', label: 'Month', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
];

const overlays = (...specs: OverlaySpec[]): Record<string, OverlaySpec> =>
  Object.fromEntries(specs.map((s) => [s.id, s]));
const annotations = (...specs: AnnotationSpec[]): Record<string, AnnotationSpec> =>
  Object.fromEntries(specs.map((s) => [s.id, s]));

describe('resolveOverlaySeries', () => {
  it('computes a trend overlay aligned to the source series', () => {
    const result = resolveOverlaySeries(overlays({ id: 'o', kind: 'trend', target: 'coffee' }), VALUES);
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('o');
    expect(result[0].data).to.have.length(VALUES[0].data.length);
  });

  it('computes a cumulative overlay', () => {
    const result = resolveOverlaySeries(
      overlays({ id: 'c', kind: 'cumulative', target: 'coffee' }),
      VALUES,
    );
    expect(result[0].data).to.deep.equal([10, 60, 80, 120, 150, 210]);
  });

  it('emits one series for SMA and multiple for bollinger', () => {
    const sma = resolveOverlaySeries(
      overlays({ id: 's', kind: 'sma', target: 'coffee', period: 3 }),
      VALUES,
    );
    expect(sma).to.have.length(1);
    const bollinger = resolveOverlaySeries(
      overlays({ id: 'b', kind: 'bollinger', target: 'coffee', period: 3 }),
      VALUES,
    );
    expect(bollinger.length).to.be.greaterThan(1);
  });

  it('skips overlays whose target series is missing', () => {
    const result = resolveOverlaySeries(
      overlays({ id: 'x', kind: 'sma', target: 'nope', period: 3 }),
      VALUES,
    );
    expect(result).to.have.length(0);
  });

  it('returns nothing when there are no overlays', () => {
    expect(resolveOverlaySeries(undefined, VALUES)).to.have.length(0);
  });
});

describe('resolveAnnotations', () => {
  it('resolves a y-axis reference line', () => {
    const result = resolveAnnotations(
      annotations({ id: 'target', kind: 'refLine', axis: 'y', value: 45, text: 'Target' }),
      DIMENSIONS,
      VALUES,
    );
    expect(result).to.deep.equal([{ id: 'target', axis: 'y', value: 45, label: 'Target' }]);
  });

  it('resolves a band into two reference lines', () => {
    const result = resolveAnnotations(
      annotations({ id: 'sla', kind: 'band', from: 20, to: 50 }),
      DIMENSIONS,
      VALUES,
    );
    expect(result.map((r) => r.value)).to.deep.equal([20, 50]);
    expect(result.every((r) => r.axis === 'y')).to.equal(true);
  });

  it('resolves a max marker to the peak category', () => {
    const result = resolveAnnotations(
      annotations({ id: 'peak', kind: 'marker', at: 'max', target: 'coffee' }),
      DIMENSIONS,
      VALUES,
    );
    // max value 60 is at index 5 -> 'Jun'
    expect(result[0]).to.deep.equal({ id: 'peak', axis: 'x', value: 'Jun', label: 'Peak: 60' });
  });

  it('resolves a min marker to the lowest category', () => {
    const result = resolveAnnotations(
      annotations({ id: 'low', kind: 'marker', at: 'min', target: 'coffee' }),
      DIMENSIONS,
      VALUES,
    );
    // min value 10 is at index 0 -> 'Jan'
    expect(result[0].value).to.equal('Jan');
  });

  it('returns nothing when there are no annotations', () => {
    expect(resolveAnnotations(undefined, DIMENSIONS, VALUES)).to.have.length(0);
  });
});
