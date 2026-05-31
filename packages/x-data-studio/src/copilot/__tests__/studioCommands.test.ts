import { describe, it, expect } from 'vitest';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
import { createTestExecutor } from '../__testHarness__/createTestExecutor';

const DATASETS: ReadonlyArray<DataStudioDataSource<any>> = [
  { id: 'products', label: 'Products', columns: [{ field: 'name' }], rows: [] },
  { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }], rows: [] },
];

function runCommands(commands: ReadonlyArray<{ type: string; params?: any }>) {
  return commands.map((c) => JSON.stringify(c)).join('\n');
}

describe('Studio copilot commands', () => {
  it('studio.addSheet creates a grid sheet bound to the active dataSource', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
    });
    const result = executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.addSheet', params: { label: 'My View' } }]),
    });
    expect(result.applied).toHaveLength(1);
    expect(result.applied[0].kind).toBe('command');
    expect(fake.sheets).toHaveLength(1);
    expect(fake.sheets[0].label).toBe('My View');
    expect(fake.sheets[0].dataSourceId).toBe('products');
  });

  it('studio.selectDataSource switches the active dataSource', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.selectDataSource', params: { dataSourceId: 'orders' } }]),
    });
    expect(fake.api.activeDataSourceId).toBe('orders');
  });

  it('studio.selectDataSource rejects unknown dataSourceId via validation', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
    });
    const result = executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.selectDataSource', params: { dataSourceId: 'ghost' } }]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0].reason).toBe('invalid');
    expect(fake.api.activeDataSourceId).toBe('products');
  });

  it('studio.renameSheet updates the sheet label', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [
        { id: 'v1', label: 'Original', dataSourceId: 'products' },
      ],
    });
    executor.applyEnvelope({
      runCommands: runCommands([
        { type: 'studio.renameSheet', params: { viewId: 'v1', label: 'Renamed' } },
      ]),
    });
    expect(fake.sheets[0].label).toBe('Renamed');
  });

  it('studio.deleteSheet removes the sheet', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [
        { id: 'v1', label: 'Keep', dataSourceId: 'products' },
        { id: 'v2', label: 'Drop', dataSourceId: 'products' },
      ],
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.deleteSheet', params: { viewId: 'v2' } }]),
    });
    expect(fake.sheets.map((v) => v.id)).toEqual(['v1']);
  });

  it('studio.moveSheet reorders sheets by delta', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [
        { id: 'v1', label: 'A', dataSourceId: 'products' },
        { id: 'v2', label: 'B', dataSourceId: 'products' },
        { id: 'v3', label: 'C', dataSourceId: 'products' },
      ],
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.moveSheet', params: { viewId: 'v1', delta: 2 } }]),
    });
    expect(fake.sheets.map((v) => v.id)).toEqual(['v2', 'v3', 'v1']);
  });

  it('studio.duplicateSheet inserts a copy after the source', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'Source', dataSourceId: 'products' }],
    });
    executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.duplicateSheet', params: { viewId: 'v1' } }]),
    });
    expect(fake.sheets).toHaveLength(2);
    expect(fake.sheets[0].id).toBe('v1');
    expect(fake.sheets[1].label).toBe('Source (copy)');
  });

  it('studio.invalidateDataSource and studio.invalidateAll record calls', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
    });
    executor.applyEnvelope({
      runCommands: runCommands([
        { type: 'studio.invalidateDataSource', params: { dataSourceId: 'orders' } },
        { type: 'studio.invalidateAll' },
      ]),
    });
    expect(fake.calls.map((c) => c.method)).toContain('invalidateDataSource');
    expect(fake.calls.map((c) => c.method)).toContain('invalidateAll');
  });

  it('tier-3 commands are disabled when guards.mutations === false', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      guardOverrides: { mutations: false },
    });
    const result = executor.applyEnvelope({
      runCommands: runCommands([{ type: 'studio.addSheet', params: { label: 'X' } }]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped[0].reason).toBe('unknown');
    expect(fake.sheets).toHaveLength(0);
  });
});
