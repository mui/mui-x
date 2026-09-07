import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act, waitFor } from '@mui/internal-test-utils';
import { getColumnValues, microtasks } from 'test/utils/helperFn';
import { vi, onTestFinished, describe, it, expect } from 'vitest';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { GRID_FORMULA_FUNCTIONS, formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridApi,
  GridFormulaFunctionDefinition,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';
import type { GridFormulaPrivateApi } from '../hooks/features/formula/gridFormulaInterfaces';

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  rows: [
    { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=price * quantity' },
    { id: 1, item: 'Banana', price: 1, quantity: 5, total: '=price * quantity' },
    { id: 2, item: 'Cherry', price: 4, quantity: 2, total: 8 },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number' },
    { field: 'quantity', type: 'number' },
    { field: 'total', type: 'number', allowFormulas: true, editable: true },
  ],
};

describe('<DataGridPremium /> - Formulas', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  // The formula API methods are private for now.
  // The tests always inject the formula feature, so its private API methods are present.
  const formulaApi = () =>
    unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!) as GridPrivateApiPremium &
      GridFormulaPrivateApi;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('rendering', () => {
    it('should render evaluated values in `allowFormulas` columns and keep the source in the row data', async () => {
      await render(<Test />);
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
      // The stored row-data value stays the formula source…
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      // …but getCellValue only ever exposes the evaluated value.
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal(6);
      expect(apiRef.current!.getCellValue(2, 'total')).to.equal(8);
    });

    it('should treat `=` values in columns without `allowFormulas` as plain strings', async () => {
      await render(
        <Test
          rows={[{ id: 0, item: '=price', price: 2, quantity: 3, total: 1 }]}
          columns={baselineProps.columns}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['=price']);
    });

    it("should display the unescaped literal for `'=` escaped sources", async () => {
      await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: "'=not a formula" }]} />,
      );
      expect(getColumnValues(3)).to.deep.equal(['=not a formula']);
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal('=not a formula');
      expect(apiRef.current!.getRow(0).total).to.equal("'=not a formula");
    });

    it('should render each error code', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: '=1 +' },
            { id: 1, price: 2, total: '=NOPE(1)' },
            { id: 2, price: 2, total: '="a" * 2' },
            { id: 3, price: 2, total: '=1 / 0' },
            { id: 4, price: 2, total: '=missingField' },
            { id: 5, price: 2, total: '=total' },
          ]}
        />,
      );
      expect(getColumnValues(3)).to.deep.equal([
        '#ERROR!',
        '#NAME?',
        '#VALUE!',
        '#DIV/0!',
        '#REF!',
        '#CYCLE!',
      ]);
    });

    it('should bypass the column valueFormatter for error results but not for value results', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: '=price + 1' },
            { id: 1, price: 2, total: '=1 / 0' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            {
              field: 'total',
              type: 'number',
              allowFormulas: true,
              valueFormatter: (value) => `formatted:${value}`,
            },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['formatted:3', '#DIV/0!']);
    });
  });

  describe('dependencies and invalidation', () => {
    it('should re-evaluate dependents transitively on updateRows', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 2, a: '=price + 1', b: '=a * 2' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'a', type: 'number', allowFormulas: true },
            { field: 'b', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['3']);
      expect(getColumnValues(2)).to.deep.equal(['6']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 5 }]));

      expect(getColumnValues(1)).to.deep.equal(['6']);
      expect(getColumnValues(2)).to.deep.equal(['12']);
    });

    it('should mark mutual references as #CYCLE! and recover when one side is replaced', async () => {
      await render(
        <Test
          rows={[{ id: 0, a: '=b', b: '=a' }]}
          columns={[
            { field: 'a', allowFormulas: true },
            { field: 'b', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['#CYCLE!']);
      expect(getColumnValues(1)).to.deep.equal(['#CYCLE!']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, b: 5 }]));
      expect(getColumnValues(0)).to.deep.equal(['5']);
      expect(getColumnValues(1)).to.deep.equal(['5']);
    });

    it('should re-evaluate cross-row formula-to-formula chains', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, a: '=price * 2', b: 1 },
            { id: 1, price: 3, a: 1, b: '=REF(COLUMN("a"), ROW(0)) + 1' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'a', type: 'number', allowFormulas: true },
            { field: 'b', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['4', '1']);
      expect(getColumnValues(2)).to.deep.equal(['1', '5']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 10 }]));
      expect(getColumnValues(1)).to.deep.equal(['20', '1']);
      expect(getColumnValues(2)).to.deep.equal(['1', '21']);
    });

    it('should not mask a re-added row with the deleted row results', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: '=price * 2' },
            { id: 1, price: 3, total: 50 },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['4', '50']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]));
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.equal(null);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 9, total: 100 }]));
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal(100);
      expect(getColumnValues(1)).to.deep.equal(['50', '100']);
    });

    it('should re-evaluate when a referenced column is added or removed', async () => {
      const columnsWithoutTax = [
        { field: 'price', type: 'number' },
        { field: 'total', type: 'number', allowFormulas: true },
      ] as DataGridPremiumProps['columns'];
      const columnsWithTax = [
        { field: 'price', type: 'number' },
        { field: 'tax', type: 'number' },
        { field: 'total', type: 'number', allowFormulas: true },
      ] as DataGridPremiumProps['columns'];

      const { setProps } = await render(
        <Test
          rows={[{ id: 0, price: 2, tax: 5, total: '=tax * 2' }]}
          columns={columnsWithoutTax}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['#REF!']);

      setProps({ columns: columnsWithTax });
      await microtasks();
      expect(getColumnValues(2)).to.deep.equal(['10']);

      setProps({ columns: columnsWithoutTax });
      await microtasks();
      expect(getColumnValues(1)).to.deep.equal(['#REF!']);
    });

    it('should publish formulaEvaluated with the changed cells', async () => {
      await render(<Test />);
      const listener = vi.fn();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 10 }]));

      expect(listener.mock.calls.length).to.equal(1);
      expect(listener.mock.lastCall?.[0].changedCells).to.deep.equal([{ id: 0, field: 'total' }]);
    });

    it('should not re-evaluate when an unrelated cell changes', async () => {
      await render(<Test />);
      const listener = vi.fn();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, item: 'Apricot' }]));

      expect(listener.mock.calls.length).to.equal(0);
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });
  });

  describe('sorting and filtering', () => {
    it('should sort by evaluated values', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.setSortModel([{ field: 'total', sort: 'asc' }]));
      expect(getColumnValues(3)).to.deep.equal(['5', '6', '8']);
    });

    it('should filter and quick-filter on evaluated values', async () => {
      await render(<Test />);
      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'total', operator: '>', value: 5 }],
        }),
      );
      expect(getColumnValues(3)).to.deep.equal(['6', '8']);

      await act(async () => apiRef.current!.setFilterModel({ items: [] }));
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);

      await act(async () =>
        apiRef.current!.setFilterModel({ items: [], quickFilterValues: ['6'] }),
      );
      expect(getColumnValues(3)).to.deep.equal(['6']);
    });

    it('should keep sorting and filtering working after a dependency update', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.setSortModel([{ field: 'total', sort: 'asc' }]));
      await act(async () => apiRef.current!.updateRows([{ id: 1, price: 100 }]));
      // One-shot policy: values re-evaluate and re-sort within the same rows
      // update cascade.
      expect(getColumnValues(3)).to.deep.equal(['6', '8', '500']);
    });
  });

  describe('ranges and positional references', () => {
    const summaryColumns = [
      { field: 'price', type: 'number' },
      { field: 'summary', type: 'number', allowFormulas: true },
    ] as DataGridPremiumProps['columns'];

    it('should recompute only the range dependents on a single-cell edit', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, price: 3 },
            { id: 2, price: 5 },
          ]}
          columns={summaryColumns}
        />,
      );
      const listener = vi.fn();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 1, price: 10 }]));

      expect(getColumnValues(1)).to.deep.equal(['17', '', '']);
      expect(listener.mock.calls.length).to.equal(1);
      expect(listener.mock.lastCall?.[0].changedCells).to.deep.equal([{ id: 0, field: 'summary' }]);
    });

    it('should evaluate formula cells inside a range before the range consumer', async () => {
      await render(
        <Test
          rows={[
            { id: 0, base: 2, price: '=base * 2', summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, base: 3, price: 4 },
          ]}
          columns={[
            { field: 'base', type: 'number' },
            { field: 'price', type: 'number', allowFormulas: true },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(2)).to.deep.equal(['8', '']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, base: 10 }]));
      expect(getColumnValues(1)).to.deep.equal(['20', '4']);
      expect(getColumnValues(2)).to.deep.equal(['24', '']);
    });

    it('should materialize COLUMN_VALUES over the filtered row set', async () => {
      await render(
        <Test
          rows={[
            { id: 0, category: 'keep', price: 2, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, category: 'keep', price: 3 },
            { id: 2, category: 'drop', price: 5 },
          ]}
          columns={[
            { field: 'category' },
            { field: 'price', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(2)).to.deep.equal(['10', '', '']);

      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'category', operator: 'equals', value: 'keep' }],
        }),
      );
      expect(getColumnValues(2)).to.deep.equal(['5', '']);

      await act(async () => apiRef.current!.setFilterModel({ items: [] }));
      expect(getColumnValues(2)).to.deep.equal(['10', '', '']);
    });

    it('should sum COLUMN_VALUES of a hidden column', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, price: 3 },
          ]}
          columns={summaryColumns}
          initialState={{ columns: { columnVisibilityModel: { price: false } } }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['5', '']);
    });

    it('should evaluate RANGE_REF rectangles and track edits inside the bounds', async () => {
      await render(
        <Test
          rows={[
            {
              id: 0,
              p1: 1,
              p2: 2,
              // Columns 1..2 (p1, p2) over view positions 1..2 (ids 0 and 1).
              total: '=SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(2)))',
            },
            { id: 1, p1: 3, p2: 4 },
            { id: 2, p1: 100, p2: 100 },
          ]}
          columns={[
            { field: 'p1', type: 'number' },
            { field: 'p2', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(2)).to.deep.equal(['10', '', '']);

      const listener = vi.fn();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

      // A change inside the rectangle recomputes the consumer.
      await act(async () => apiRef.current!.updateRows([{ id: 1, p2: 14 }]));
      expect(getColumnValues(2)).to.deep.equal(['20', '', '']);
      expect(listener.mock.calls.length).to.equal(1);

      // A change outside the rectangle does not.
      await act(async () => apiRef.current!.updateRows([{ id: 2, p1: 7 }]));
      expect(listener.mock.calls.length).to.equal(1);
      expect(getColumnValues(2)).to.deep.equal(['20', '', '']);
    });

    it('should clip a RANGE_REF window to the filtered view and recover', async () => {
      await render(
        <Test
          rows={[
            {
              id: 0,
              category: 'keep',
              price: 2,
              // Column 2 (price) over view positions 1..3.
              summary: '=SUM(RANGE_REF(COLUMN_FROM(2), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3)))',
            },
            { id: 1, category: 'keep', price: 3 },
            { id: 2, category: 'drop', price: 5 },
          ]}
          columns={[
            { field: 'category' },
            { field: 'price', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(2)).to.deep.equal(['10', '', '']);

      // Position 3 no longer exists: the window clips to the two rows left in
      // the view instead of erroring.
      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'category', operator: 'equals', value: 'keep' }],
        }),
      );
      expect(getColumnValues(2)).to.deep.equal(['5', '']);
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 5,
      });

      await act(async () => apiRef.current!.setFilterModel({ items: [] }));
      expect(getColumnValues(2)).to.deep.equal(['10', '', '']);
    });

    it('should mark a COLUMN_VALUES aggregation over its own column as #CYCLE!', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: '=SUM(COLUMN_VALUES("total"))' },
            { id: 1, price: 3, total: 5 },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['#CYCLE!', '5']);
    });

    it('should rebind positional references after sorting', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 30, top: '=REF(COLUMN("price"), ROW_POSITION(1))' },
            { id: 1, price: 10, top: 5 },
            { id: 2, price: 20, top: 7 },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'top', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(formulaApi().getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 30,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));
      // The first view row is now id 1.
      expect(formulaApi().getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 10,
      });
    });

    it('should not re-sort after rebinding a position-dependent sorted column', async () => {
      await render(
        <Test
          rows={[
            { id: 0, item: 'a', price: 30, posVal: '=REF(COLUMN("price"), ROW_POSITION(3))' },
            { id: 1, item: 'b', price: 10, posVal: '=REF(COLUMN("price"), ROW_POSITION(2))' },
            { id: 2, item: 'c', price: 20, posVal: '=REF(COLUMN("price"), ROW_POSITION(1))' },
          ]}
          columns={[
            { field: 'item' },
            { field: 'price', type: 'number' },
            { field: 'posVal', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      // Initial view order [a, b, c]: posVal = [price@3, price@2, price@1].
      expect(getColumnValues(2)).to.deep.equal(['20', '10', '30']);

      const sortListener = vi.fn();
      apiRef.current!.subscribeEvent('sortedRowsSet', sortListener);

      await act(async () => apiRef.current!.setSortModel([{ field: 'posVal', sort: 'asc' }]));

      // The comparator consumed the values as of when it ran: [b, a, c].
      expect(getColumnValues(0)).to.deep.equal(['b', 'a', 'c']);
      // One-shot rebind (D4): the values re-evaluated against the new order
      // exactly once — and even though they now disagree with the ascending
      // sort, the grid did not re-sort.
      expect(getColumnValues(2)).to.deep.equal(['30', '20', '10']);
      expect(sortListener.mock.calls.length).to.equal(1);
    });

    it('should rebind COLUMN_POSITION references on visibility changes and column reorder', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 5, tax: 7, summary: '=REF(COLUMN_POSITION(1), ROW(0))' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'tax', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(2)).to.deep.equal(['5']);

      await act(async () => apiRef.current!.setColumnVisibility('price', false));
      // `tax` is the first visible column now.
      expect(getColumnValues(1)).to.deep.equal(['7']);

      await act(async () => apiRef.current!.setColumnVisibility('price', true));
      expect(getColumnValues(2)).to.deep.equal(['5']);

      // A programmatic reorder funnels into the same columns-changed →
      // context-rebuild path.
      await act(async () => apiRef.current!.setColumnIndex('tax', 0));
      expect(getColumnValues(2)).to.deep.equal(['7']);
    });

    it('should address pinned rows in the position context, ahead of and after the data band', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 5, top: '=REF(COLUMN("price"), ROW_POSITION(1))' }]}
          pinnedRows={{ top: [{ id: 99, price: 1000, top: 1 }] }}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'top', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      // Position 1 is the top-pinned row — the number the row-number column
      // shows next to it, so `$1`/`ROW_POSITION(1)` must resolve to it.
      expect(formulaApi().getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 1000,
      });
    });

    it('should never cover pinned rows with a range or COLUMN_VALUES', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 5 },
            { id: 1, price: 7 },
          ]}
          pinnedRows={{
            top: [{ id: 98, price: 1000 }],
            bottom: [{ id: 99, price: 2000, summary: '=SUM(COLUMN_VALUES("price"))' }],
          }}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      // The data band only: neither pinned row contributes, and the summary
      // does not aggregate itself.
      expect(formulaApi().getCellFormulaResult(99, 'summary')).to.deep.equal({
        type: 'value',
        value: 12,
      });
    });

    it('should mark an unpinned summary row swept into its own window as #CYCLE!', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 10 },
            { id: 1, price: 20 },
            {
              id: 2,
              price: 5,
              // Both columns over view positions 1..2 — the summary row sits at
              // position 3, outside its own window.
              summary: '=SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(2)))',
            },
          ]}
          columns={summaryColumns}
        />,
      );
      expect(formulaApi().getCellFormulaResult(2, 'summary')).to.deep.equal({
        type: 'value',
        value: 30,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));

      // View order is now [2, 0, 1]: the summary row moved to position 1, which
      // its own window covers.
      expect(getColumnValues(1)).to.deep.equal(['#CYCLE!', '', '']);
      const result = formulaApi().getCellFormulaResult(2, 'summary');
      expect(result?.type === 'error' && result.code).to.equal('#CYCLE!');
    });

    it('should track rows added and removed with updateRows in COLUMN_VALUES', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, price: 3 },
          ]}
          columns={summaryColumns}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['5', '']);

      await act(async () => apiRef.current!.updateRows([{ id: 2, price: 10 }]));
      expect(getColumnValues(1)).to.deep.equal(['15', '', '']);

      await act(async () => apiRef.current!.updateRows([{ id: 2, _action: 'delete' }]));
      expect(getColumnValues(1)).to.deep.equal(['5', '']);
    });

    it('should keep a RANGE_REF window on the same view positions across sorting', async () => {
      const windowFormula = '=SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(2)))';
      await render(
        <Test
          rows={[
            { id: 0, price: 1, summary: windowFormula },
            { id: 1, price: 8 },
            { id: 2, price: 2 },
            { id: 3, price: 4 },
          ]}
          columns={summaryColumns}
        />,
      );
      // Prices in view order are [1, 8, 2, 4]: positions 1..2 hold 1 and 8.
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 9,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));
      // View order is now [0, 2, 3, 1] — prices [1, 2, 4, 8]. The window still
      // covers positions 1..2, it just recomputes from whatever occupies them.
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 3,
      });
      // The window is stored positionally: sorting never rewrites the source.
      expect(apiRef.current!.getRow(0).summary).to.equal(windowFormula);
    });

    it('should keep an ANCHOR window relative to its formula across sorting', async () => {
      // "My own row, one column left of me" — the plain-A1 (no `$`) form.
      const anchoredFormula =
        '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-1)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0))))';
      await render(
        <Test
          rows={[
            { id: 0, price: 1, summary: anchoredFormula },
            { id: 1, price: 8 },
            { id: 2, price: 2 },
            { id: 3, price: 4 },
          ]}
          columns={summaryColumns}
        />,
      );
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 1,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'desc' }]));
      // The formula moved from view position 1 to 4 — its window moved with it,
      // so it still reads its own row's price (a positional window would now
      // read whatever occupies position 1 instead).
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 1,
      });
      // Movement never rewrites the source: the offsets are byte-stable.
      expect(apiRef.current!.getRow(0).summary).to.equal(anchoredFormula);
    });

    it('should keep a running total (FIXED start, ANCHOR end) correct across sorting', async () => {
      // The canonical form of `=SUM($A$1:A<my row>)` — identical text in every row.
      const runningTotal =
        '=SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0))))';
      await render(
        <Test
          rows={[
            { id: 0, price: 1, summary: runningTotal },
            { id: 1, price: 8, summary: runningTotal },
            { id: 2, price: 2, summary: runningTotal },
            { id: 3, price: 4, summary: runningTotal },
          ]}
          columns={summaryColumns}
        />,
      );
      // Prices in view order [1, 8, 2, 4]: each row sums positions 1..itself.
      expect(getColumnValues(1)).to.deep.equal(['1', '9', '11', '15']);

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));
      // View order [1, 2, 4, 8]: every copy re-anchors to its new position, so
      // the column stays a running total after the sort.
      expect(getColumnValues(1)).to.deep.equal(['1', '3', '7', '15']);
    });

    it('should report #REF! instead of re-shaping when sorting pushes an ANCHOR window out of the band', async () => {
      // "The two rows above me, one column left" — valid while the formula is
      // last, impossible once sorting moves it to the top.
      const aboveMe =
        '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-1)), ROW_FROM(ANCHOR(-2)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(-1))))';
      await render(
        <Test
          rows={[
            { id: 1, price: 1 },
            { id: 2, price: 2 },
            { id: 0, price: 9, summary: aboveMe },
          ]}
          columns={summaryColumns}
        />,
      );
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 3,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'desc' }]));
      // The formula is now first: "two rows above me" does not exist. The
      // window errors loudly instead of silently covering different rows —
      // and geometry preservation means a sort can never make it cover
      // its own cell (#CYCLE!).
      const result = formulaApi().getCellFormulaResult(0, 'summary');
      expect(result?.type).to.equal('error');
      expect((result as { code?: string }).code).to.equal('#REF!');
      expect(apiRef.current!.getRow(0).summary).to.equal(aboveMe);
    });

    it('should propagate #REF! to dependents when an ANCHOR formula loses its own row to a filter', async () => {
      const ownPrice =
        '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-1)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0))))';
      await render(
        <Test
          rows={[
            { id: 0, price: 1, summary: ownPrice },
            { id: 1, price: 5, summary: '=REF(COLUMN("summary"), ROW(0))' },
          ]}
          columns={summaryColumns}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['1', '1']);

      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'price', operator: '>=', value: 2 }],
        }),
      );
      // Row 0 is filtered out: its relative window has no anchor position, so
      // its (hidden) value is #REF! and the visible stable ref reports it
      // rather than silently reading a stale or empty window.
      expect(getColumnValues(1)).to.deep.equal(['#REF!']);
    });

    it('should not re-filter after rebinding a position-dependent filtered column', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 10, posVal: '=REF(COLUMN("price"), ROW_POSITION(1))' },
            { id: 1, price: 5, posVal: '=REF(COLUMN("price"), ROW_POSITION(2))' },
            { id: 2, price: 7, posVal: '=REF(COLUMN("price"), ROW_POSITION(3))' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'posVal', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['10', '5', '7']);

      const filterListener = vi.fn();
      apiRef.current!.subscribeEvent('filteredRowsSet', filterListener);

      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'posVal', operator: '>=', value: 7 }],
        }),
      );

      // The filter consumed [10, 5, 7] and kept rows 0 and 2. The rebind then
      // re-evaluated row 2 against the two-row view, where position 3 does not
      // exist — but the grid never re-filters (one-shot, D4): the row stays
      // visible showing #REF!.
      expect(getColumnValues(1)).to.deep.equal(['10', '#REF!']);
      expect(filterListener.mock.calls.length).to.equal(1);
    });

    it('should materialize COLUMN_VALUES over all pages', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 1, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, price: 2 },
            { id: 2, price: 4 },
            { id: 3, price: 8 },
          ]}
          columns={summaryColumns}
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 2, page: 0 } } }}
          pageSizeOptions={[2]}
        />,
      );
      // The position context ignores pagination: all 4 rows take part.
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 15,
      });
    });

    it('should resolve references with a custom getRowId', async () => {
      await render(
        <Test
          rows={[
            { code: 'a', price: 2, total: '=REF(COLUMN("price"), ROW("b")) + price' },
            { code: 'b', price: 5, total: '=REF(COLUMN("price"), ROW_POSITION(1))' },
          ]}
          getRowId={(row) => row.code}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['7', '2']);
    });

    it('should materialize escaped literals inside COLUMN_VALUES as their display value', async () => {
      await render(
        <Test
          rows={[
            { id: 0, note: "'=x", summary: '=CONCAT(COLUMN_VALUES("note"))' },
            { id: 1, note: 'y' },
          ]}
          columns={[
            { field: 'note', allowFormulas: true },
            { field: 'summary', allowFormulas: true },
          ]}
        />,
      );
      // The escaped literal contributes its unescaped display value, not the
      // raw `'=x` source.
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: '=xy',
      });
    });

    it('should give tree-data parents a row position', async () => {
      await render(
        <Test
          treeData
          getTreeDataPath={(row) => row.path}
          defaultGroupingExpansionDepth={-1}
          rows={[
            { id: 0, path: ['A'], price: 10, top: '=REF(COLUMN("price"), ROW_POSITION(1))' },
            { id: 1, path: ['A', 'B'], price: 5, top: '=REF(COLUMN("price"), ROW_POSITION(2))' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'top', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      // The parent is a real data row: position 1 is the parent, 2 the child.
      expect(formulaApi().getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 10,
      });
      expect(formulaApi().getCellFormulaResult(1, 'top')).to.deep.equal({
        type: 'value',
        value: 5,
      });
    });

    it('should exclude the checkbox selection column from column positions', async () => {
      await render(
        <Test
          checkboxSelection
          rows={[{ id: 0, price: 5, tax: 7, summary: '=REF(COLUMN_POSITION(1), ROW(0))' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'tax', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      // Position 1 is the first data column, not the `__check__` column.
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 5,
      });
    });

    it('should report #REF! in dependents only when a referenced row is removed', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2 },
            { id: 1, price: 3, calc: '=REF(COLUMN("price"), ROW(0))' },
            { id: 2, price: 4, calc: '=price * 2' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'calc', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['', '2', '8']);

      const listener = vi.fn();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]));

      expect(getColumnValues(1)).to.deep.equal(['#REF!', '8']);
      expect(listener.mock.calls.length).to.equal(1);
      expect(listener.mock.lastCall?.[0].changedCells).to.deep.equal([{ id: 1, field: 'calc' }]);
    });
  });

  describe('valueGetter interplay', () => {
    it('should resolve dependencies through the dependency column valueGetter', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 2, total: '=price' }]}
          columns={[
            {
              field: 'price',
              type: 'number',
              valueGetter: (value: number) => value * 10,
            },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['20']);
    });

    it('should ignore the valueGetter of the formula column for formula cells only', async () => {
      const warnSpy = vi.fn();
      const originalWarn = console.warn;
      console.warn = warnSpy;
      onTestFinished(() => {
        console.warn = originalWarn;
      });
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: '=price + 1' },
            { id: 1, price: 2, total: 7 },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            {
              field: 'total',
              type: 'number',
              allowFormulas: true,
              valueGetter: (value: number) => (typeof value === 'number' ? value * 100 : value),
            },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['3', '700']);
      expect(
        warnSpy.mock.calls.some((call) =>
          call.some(
            (arg) => typeof arg === 'string' && arg.includes('`allowFormulas` and `valueGetter`'),
          ),
        ),
      ).to.equal(true);
    });
  });

  describe('custom functions', () => {
    const DOUBLE: GridFormulaFunctionDefinition = {
      name: 'DOUBLE',
      minArgs: 1,
      maxArgs: 1,
      apply: ([first]) => (typeof first === 'number' ? first * 2 : 0),
    };

    it('should support user-registered functions', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 3, total: '=DOUBLE(price)' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
          formulaFunctions={{ ...GRID_FORMULA_FUNCTIONS, DOUBLE }}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['6']);
    });

    it('should replace, not merge, the built-in function set', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 3, total: '=SUM(price)' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
          formulaFunctions={{ DOUBLE }}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['#NAME?']);
    });
  });

  describe('api', () => {
    it('should set a formula with setCellFormula', async () => {
      await render(<Test />);
      await act(async () => formulaApi().setCellFormula(2, 'total', '=price + quantity'));
      expect(apiRef.current!.getRow(2).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '6']);
    });

    it('should expose the read-only api surface against a single grid', async () => {
      await render(<Test />);

      // setCellFormula guards.
      expect(() => formulaApi().setCellFormula(0, 'item', '=price')).to.throw(
        'does not allow formulas',
      );
      expect(() => formulaApi().setCellFormula(0, 'total', 'price')).to.throw(
        'expects a formula source starting with `=`',
      );

      // getCellFormula returns the source, and null for plain cells.
      expect(formulaApi().getCellFormula(0, 'total')).to.equal('=price * quantity');
      expect(formulaApi().getCellFormula(2, 'total')).to.equal(null);

      // getCellFormulaResult returns the evaluation result, and null for plain cells.
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.deep.equal({
        type: 'value',
        value: 6,
      });
      expect(formulaApi().getCellFormulaResult(2, 'total')).to.equal(null);

      // validateCellFormula.
      expect(formulaApi().validateCellFormula('=price * quantity').valid).to.equal(true);
      const invalid = formulaApi().validateCellFormula('=NOPE(1)');
      expect(invalid.valid).to.equal(false);
      expect(invalid.issues[0].code).to.equal('#NAME?');
    });

    it('should pick up in-place row mutations with reevaluateFormulas', async () => {
      // Local rows: the test mutates a row object in place.
      await render(
        <Test
          rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=price * quantity' }]}
        />,
      );
      expect(getColumnValues(3)).to.deep.equal(['6']);
      apiRef.current!.getRow(0).price = 100;
      await act(async () => formulaApi().reevaluateFormulas());
      expect(getColumnValues(3)).to.deep.equal(['300']);
    });
  });

  describe('guards', () => {
    it('should render raw strings when disableFormulas is enabled', async () => {
      await render(<Test disableFormulas />);
      expect(getColumnValues(3)).to.deep.equal(['=price * quantity', '=price * quantity', '8']);
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal('=price * quantity');
    });

    it('should toggle evaluation when disableFormulas changes', async () => {
      const { setProps } = await render(<Test />);
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);

      setProps({ disableFormulas: true });
      await microtasks();
      expect(getColumnValues(3)).to.deep.equal(['=price * quantity', '=price * quantity', '8']);

      setProps({ disableFormulas: false });
      await microtasks();
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should not evaluate formulas when dataSource is set', async () => {
      const warnSpy = vi.fn();
      const originalWarn = console.warn;
      console.warn = warnSpy;
      onTestFinished(() => {
        console.warn = originalWarn;
      });
      const getRows = vi.fn(async () => ({
        rows: baselineProps.rows as Record<string, unknown>[],
        rowCount: 3,
      }));
      await render(<Test rows={undefined} dataSource={{ getRows }} />);
      await waitFor(() => {
        expect(getColumnValues(3).length).to.be.greaterThan(0);
      });
      expect(getColumnValues(3)[0]).to.equal('=price * quantity');
    });
  });
});
