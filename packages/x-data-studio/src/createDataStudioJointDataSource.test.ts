import { describe, expect, it, vi } from 'vitest';
import type { DataStudioDataSource } from './DataStudio/DataStudio.types';
import { DATA_STUDIO_SYNTHETIC_ID_FIELD, type DataStudioJoinDefinition } from './models';
import { createDataStudioJointDataSource } from './createDataStudioJointDataSource';

function createBaseSource(
  id: string,
  columns: { field: string; headerName?: string; type?: string }[],
  withConnector = true,
): DataStudioDataSource {
  return {
    id,
    label: id,
    columns: columns as any,
    supportsServerGrouping: true,
    ...(withConnector
      ? {
          connector: {
            getRows: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
          } as any,
        }
      : {}),
  };
}

const definition: DataStudioJoinDefinition = {
  base: 'orders',
  joins: [
    { sourceId: 'products', type: 'inner', on: [{ leftField: 'product_id', rightField: 'id' }] },
  ],
  columns: [
    { sourceId: 'orders', field: 'amount', as: 'amount' },
    { sourceId: 'products', field: 'name', as: 'product_name' },
  ],
};

function createBaseSources() {
  return [
    createBaseSource('orders', [
      { field: 'id' },
      { field: 'product_id' },
      { field: 'amount', headerName: 'Amount', type: 'number' },
    ]),
    createBaseSource('products', [
      { field: 'id' },
      { field: 'name', headerName: 'Product name' },
    ]),
  ];
}

describe('createDataStudioJointDataSource', () => {
  it('derives aliased output columns from the participating base sources', () => {
    const joint = createDataStudioJointDataSource({
      id: 'joint:orders-products',
      label: 'Orders + Products',
      definition,
      baseDataSources: createBaseSources(),
    });

    expect(joint.id).toBe('joint:orders-products');
    expect(joint.label).toBe('Orders + Products');
    expect(joint.columns).toEqual([
      { field: 'amount', headerName: 'Amount', type: 'number' },
      { field: 'product_name', headerName: 'Product name' },
    ]);
    expect(joint.rowIdField).toBe(DATA_STUDIO_SYNTHETIC_ID_FIELD);
    expect(joint.supportsServerGrouping).toBe(true);
  });

  it('injects the join definition into the base connector on every request', async () => {
    const baseSources = createBaseSources();
    const baseConnector = baseSources[0].connector as any;
    const joint = createDataStudioJointDataSource({
      id: 'joint',
      label: 'Joint',
      definition,
      baseDataSources: baseSources,
    });

    await joint.connector!.getRows({
      start: 0,
      end: 10,
      sortModel: [],
      filterModel: { items: [] },
      groupFields: ['product_name'],
    } as any);

    expect(baseConnector.getRows).toHaveBeenCalledTimes(1);
    const sentParams = baseConnector.getRows.mock.calls[0][0];
    expect(sentParams.join).toEqual(definition);
    expect(sentParams.groupFields).toEqual(['product_name']);
  });

  it('resolves the synthetic id field through getRowId', () => {
    const joint = createDataStudioJointDataSource({
      id: 'joint',
      label: 'Joint',
      definition,
      baseDataSources: createBaseSources(),
    });

    expect(joint.getRowId!({ [DATA_STUDIO_SYNTHETIC_ID_FIELD]: '1|2', id: 9 } as any)).toBe('1|2');
  });

  it('throws when the base source is unknown', () => {
    expect(() =>
      createDataStudioJointDataSource({
        id: 'joint',
        label: 'Joint',
        definition: { ...definition, base: 'ghost' },
        baseDataSources: createBaseSources(),
      }),
    ).toThrow(/unknown base data source "ghost"/);
  });

  it('throws when the base source has no connector', () => {
    const baseSources = [
      createBaseSource('orders', [{ field: 'id' }, { field: 'amount' }], false),
      createBaseSource('products', [{ field: 'id' }, { field: 'name' }]),
    ];
    expect(() =>
      createDataStudioJointDataSource({
        id: 'joint',
        label: 'Joint',
        definition,
        baseDataSources: baseSources,
      }),
    ).toThrow(/has no connector/);
  });
});
