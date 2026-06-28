import { describe, it, expect } from 'vitest';
import type { ChartCopilotState } from './chartState';
import { snapshotState } from './chartState';

describe('snapshotState', () => {
  it('returns a serializable field-ref copy of the state', () => {
    const state: ChartCopilotState = {
      type: 'column',
      dimensions: [{ field: 'region', label: 'Region' }],
      values: [{ field: 'revenue', hidden: false }],
      configuration: { borderRadius: 4, stacked: true },
      label: 'Revenue by region',
    };

    const snapshot = snapshotState(state);

    expect(snapshot).toEqual(state);
    // Round-trips through JSON — proves it is serializable (no functions/refs).
    expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
  });

  it('produces a deep copy that does not share references with the source', () => {
    const state: ChartCopilotState = {
      type: 'bar',
      dimensions: [{ field: 'region' }],
      values: [{ field: 'revenue' }],
      configuration: { stacked: true },
    };

    const snapshot = snapshotState(state);

    expect(snapshot.dimensions).not.toBe(state.dimensions);
    expect(snapshot.dimensions[0]).not.toBe(state.dimensions[0]);
    expect(snapshot.values).not.toBe(state.values);
    expect(snapshot.configuration).not.toBe(state.configuration);

    // Mutating the snapshot must not affect the source.
    snapshot.dimensions.push({ field: 'extra' });
    snapshot.configuration.stacked = false;
    expect(state.dimensions).toHaveLength(1);
    expect(state.configuration.stacked).toBe(true);
  });

  it('omits optional item fields and label when undefined', () => {
    const state: ChartCopilotState = {
      type: 'pie',
      dimensions: [{ field: 'region' }],
      values: [],
      configuration: {},
    };

    const snapshot = snapshotState(state);

    expect(snapshot.dimensions[0]).toEqual({ field: 'region' });
    expect('label' in snapshot.dimensions[0]).toBe(false);
    expect('hidden' in snapshot.dimensions[0]).toBe(false);
    expect('label' in snapshot).toBe(false);
  });
});
