import { describe, it, expect } from 'vitest';
import type { DataStudioDataset } from '../../DataStudio/DataStudio.types';
import { createTestExecutor } from '../__testHarness__/createTestExecutor';

const DATASETS: ReadonlyArray<DataStudioDataset<any>> = [
  { id: 'products', label: 'Products', columns: [{ field: 'name' }], rows: [] },
  { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }], rows: [] },
];

function runCommands(commands: ReadonlyArray<{ type: string; params?: any }>) {
  return commands.map((c) => JSON.stringify(c)).join('\n');
}

describe('Studio copilot commands', () => {
  it('studio.addView creates a grid view bound to the active dataset', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialActiveDatasetId: 'products',
    });
    const result = executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.addView', params: { label: 'My View' } }]),
    });
    expect(result.applied).toHaveLength(1);
    expect(result.applied[0].kind).toBe('command');
    expect(fake.views).toHaveLength(1);
    expect(fake.views[0].label).toBe('My View');
    expect(fake.views[0].datasetId).toBe('products');
  });

  it('studio.addView with kind=chart creates a chart view', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialActiveDatasetId: 'orders',
    });
    executor.applyEnvelope({
      runCommands: runCommands([
        { type: 'studio.addView', params: { kind: 'chart', label: 'Sales Chart' } },
      ]),
    });
    expect(fake.views).toHaveLength(1);
    expect(fake.views[0].kind).toBe('chart');
  });

  it('studio.selectDataset switches the active dataset', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialActiveDatasetId: 'products',
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.selectDataset', params: { datasetId: 'orders' } }]),
    });
    expect(fake.api.activeDatasetId).toBe('orders');
  });

  it('studio.selectDataset rejects unknown datasetId via validation', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialActiveDatasetId: 'products',
    });
    const result = executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.selectDataset', params: { datasetId: 'ghost' } }]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0].reason).toBe('invalid');
    expect(fake.api.activeDatasetId).toBe('products');
  });

  it('studio.renameView updates the view label', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [
        { id: 'v1', label: 'Original', datasetId: 'products' },
      ],
    });
    executor.applyEnvelope({
      runCommands: runCommands([
        { type: 'studio.renameView', params: { viewId: 'v1', label: 'Renamed' } },
      ]),
    });
    expect(fake.views[0].label).toBe('Renamed');
  });

  it('studio.deleteView removes the view', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [
        { id: 'v1', label: 'Keep', datasetId: 'products' },
        { id: 'v2', label: 'Drop', datasetId: 'products' },
      ],
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.deleteView', params: { viewId: 'v2' } }]),
    });
    expect(fake.views.map((v) => v.id)).toEqual(['v1']);
  });

  it('studio.moveView reorders views by delta', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [
        { id: 'v1', label: 'A', datasetId: 'products' },
        { id: 'v2', label: 'B', datasetId: 'products' },
        { id: 'v3', label: 'C', datasetId: 'products' },
      ],
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.moveView', params: { viewId: 'v1', delta: 2 } }]),
    });
    expect(fake.views.map((v) => v.id)).toEqual(['v2', 'v3', 'v1']);
  });

  it('studio.duplicateView inserts a copy after the source', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'Source', datasetId: 'products' }],
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.duplicateView', params: { viewId: 'v1' } }]),
    });
    expect(fake.views).toHaveLength(2);
    expect(fake.views[0].id).toBe('v1');
    expect(fake.views[1].label).toBe('Source (copy)');
  });

  it('studio.updateView edits chart config on a chart view', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'Chart', datasetId: 'products', kind: 'chart' }],
    });
    executor.applyEnvelope({
      runCommands: runCommands([
        {
          type: 'studio.updateView',
          params: { viewId: 'v1', patch: { chartConfig: { type: 'bar' } as any } },
        },
      ]),
    });
    expect((fake.views[0] as any).chartConfig).toEqual({ type: 'bar' });
  });

  it('studio.invalidateDataset and studio.invalidateAll record calls', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialActiveDatasetId: 'products',
    });
    executor.applyEnvelope({
      runCommands: runCommands([
        { type: 'studio.invalidateDataset', params: { datasetId: 'orders' } },
        { type: 'studio.invalidateAll' },
      ]),
    });
    expect(fake.calls.map((c) => c.method)).toContain('invalidateDataset');
    expect(fake.calls.map((c) => c.method)).toContain('invalidateAll');
  });

  it('tier-3 commands are disabled when guards.mutations === false', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      guardOverrides: { mutations: false },
    });
    const result = executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.addView', params: { label: 'X' } }]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped[0].reason).toBe('unknown');
    expect(fake.views).toHaveLength(0);
  });
});
