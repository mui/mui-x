import type { RefObject } from '@mui/x-internals/types';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { GridComputedColumnsModel } from '../computedColumns/gridComputedColumnsInterfaces';
import { createFormulaFunctionRegistry } from './engine';
import {
  ensureComputedColumnRecords,
  evaluateComputedCell,
  resetComputedResults,
} from './gridComputedColumnsRuntime';
import { createFormulaInternalCache, GRID_FORMULA_FUNCTIONS } from './gridFormulaUtils';

/**
 * Evaluation-layer harness: jsdom cannot render 100k rows, so the runtime is
 * driven directly against a stubbed apiRef. The evaluation only reads
 * `state.props.getRowId`, the columns lookup and the formula cache.
 */
function createHarness(model: GridComputedColumnsModel, dataColumns: GridColDef[]) {
  let evaluations = 0;
  const cache = createFormulaInternalCache(GRID_FORMULA_FUNCTIONS);
  cache.registry = createFormulaFunctionRegistry([
    ...Object.values(GRID_FORMULA_FUNCTIONS),
    {
      name: 'COUNTED',
      minArgs: 1,
      maxArgs: 1,
      apply: (args) => {
        evaluations += 1;
        return args[0] as number;
      },
    },
  ]);

  const lookup: Record<string, GridColDef> = {};
  const apiRef = {
    current: {
      state: { props: {}, columns: { lookup } },
      instanceId: { id: 0 },
      caches: { formula: cache },
    },
  } as unknown as RefObject<GridPrivateApiPremium>;

  ensureComputedColumnRecords(apiRef, cache, model, undefined);
  dataColumns.forEach((column) => {
    lookup[column.field] = column;
  });
  cache.computedColumns.records.forEach((record, field) => {
    lookup[field] = record.colDef;
  });

  return { apiRef, cache, lookup, getEvaluations: () => evaluations };
}

describe('gridComputedColumnsRuntime', () => {
  const model: GridComputedColumnsModel = [
    { field: 'total', headerName: 'Total', formula: '=COUNTED(price) * quantity', type: 'number' },
  ];
  const dataColumns: GridColDef[] = [{ field: 'price' }, { field: 'quantity' }];

  it('should evaluate each (row, column) once until the results are reset', () => {
    const { apiRef, cache, getEvaluations } = createHarness(model, dataColumns);
    const row = { id: 1, price: 2, quantity: 3 };

    expect(evaluateComputedCell(apiRef, row, 'total')).to.deep.equal({ type: 'value', value: 6 });
    evaluateComputedCell(apiRef, row, 'total');
    expect(getEvaluations()).to.equal(1);

    // An updated row is a new object.
    expect(evaluateComputedCell(apiRef, { ...row, price: 5 }, 'total')).to.deep.equal({
      type: 'value',
      value: 15,
    });
    expect(getEvaluations()).to.equal(2);

    resetComputedResults(cache);
    evaluateComputedCell(apiRef, row, 'total');
    expect(getEvaluations()).to.equal(3);
  });

  it('should only rebuild the records of the definitions that changed', () => {
    const { apiRef, cache } = createHarness(model, dataColumns);
    const record = cache.computedColumns.records.get('total')!;

    ensureComputedColumnRecords(apiRef, cache, [{ ...model[0] }], undefined);
    expect(cache.computedColumns.records.get('total')).to.equal(record);

    ensureComputedColumnRecords(apiRef, cache, [{ ...model[0], headerName: 'Sum' }], undefined);
    const renamed = cache.computedColumns.records.get('total')!;
    expect(renamed).not.to.equal(record);
    expect(renamed.colDef.valueGetter).to.equal(record.colDef.valueGetter);

    ensureComputedColumnRecords(apiRef, cache, [{ ...model[0], formula: '=price' }], undefined);
    expect(cache.computedColumns.records.get('total')!.colDef.valueGetter).not.to.equal(
      record.colDef.valueGetter,
    );
  });

  it('should follow the dependencies through the other computed columns', () => {
    const { cache } = createHarness(
      [
        { field: 'withTax', headerName: 'With tax', formula: '=total * rate', type: 'number' },
        { field: 'total', headerName: 'Total', formula: '=price * quantity', type: 'number' },
      ],
      dataColumns,
    );
    expect(
      Array.from(cache.computedColumns.dependencyClosure.get('withTax')!).sort(),
    ).to.deep.equal(['price', 'quantity', 'rate', 'total']);
    expect(cache.computedColumns.referencedFields.has('quantity')).to.equal(true);
  });

  it('should sort 100,000 rows by a computed column within the perf budget', () => {
    const ROW_COUNT = 100_000;
    const { apiRef, lookup, getEvaluations } = createHarness(model, dataColumns);
    const rows: GridValidRowModel[] = [];
    for (let i = 0; i < ROW_COUNT; i += 1) {
      rows.push({ id: i, price: (i * 7919) % 1000, quantity: (i % 13) + 1 });
    }
    const colDef = lookup.total;
    const comparator = colDef.getSortComparator!('desc')!;
    // Worst case: the value is read again for every comparison.
    const getValue = (row: GridValidRowModel) =>
      colDef.valueGetter!(undefined as never, row, colDef, apiRef as any);

    const start = performance.now();
    rows.sort((a, b) => comparator(getValue(a), getValue(b), {} as any, {} as any));
    const elapsed = performance.now() - start;

    expect(getValue(rows[0])).to.equal(999 * 13);
    expect(getEvaluations()).to.equal(ROW_COUNT);
    // Catastrophic-regression bound only: it catches an evaluation per comparison.
    expect(elapsed).to.be.lessThan(5_000);
  });
});
