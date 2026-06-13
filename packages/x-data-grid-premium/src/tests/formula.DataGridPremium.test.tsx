import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import { spy, type SinonSpy } from 'sinon';
import { onTestFinished } from 'vitest';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridFormulaFunctionDefinition,
  GRID_FORMULA_FUNCTIONS,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
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

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  function getCellInput(rowIndex: number, colIndex: number) {
    return getCell(rowIndex, colIndex).querySelector('input')!;
  }

  describe('rendering', () => {
    it('should render evaluated values in `allowFormulas` columns', async () => {
      await render(<Test />);
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should keep the formula source as the stored row-data value', async () => {
      await render(<Test />);
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it('should never expose the raw source through getCellValue', async () => {
      await render(<Test />);
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

    it('should resolve positional references against the view order', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 2, total: '=REF(COLUMN("price"), ROW_POSITION(1))' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['2']);
      expect(apiRef.current!.getCellFormulaResult(0, 'total')).to.deep.equal({
        type: 'value',
        value: 2,
      });
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

    it('should evaluate stable cross-row REF() references and track their changes', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: 1 },
            { id: 1, price: 3, total: '=REF(COLUMN("price"), ROW(0)) * 10' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['1', '20']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 7 }]));
      expect(getColumnValues(1)).to.deep.equal(['1', '70']);
    });

    it('should resolve references to a removed row as #REF!', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, total: 1 },
            { id: 1, price: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['1', '2']);

      await act(async () => apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]));
      expect(getColumnValues(1)).to.deep.equal(['#REF!']);
    });

    it('should mark mutual references as #CYCLE!', async () => {
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
    });

    it('should recover from a cycle when one side is replaced', async () => {
      await render(
        <Test
          rows={[{ id: 0, a: '=b', b: '=a' }]}
          columns={[
            { field: 'a', allowFormulas: true },
            { field: 'b', allowFormulas: true },
          ]}
        />,
      );
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
      expect(apiRef.current!.getCellFormulaResult(0, 'total')).to.equal(null);

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

    it('should publish formulaEvaluationEnd with the changed cells', async () => {
      await render(<Test />);
      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluationEnd', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 10 }]));

      expect(listener.callCount).to.equal(1);
      expect(listener.lastCall.args[0].changedCells).to.deep.equal([{ id: 0, field: 'total' }]);
    });

    it('should not re-evaluate when an unrelated cell changes', async () => {
      await render(<Test />);
      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluationEnd', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, item: 'Apricot' }]));

      expect(listener.callCount).to.equal(0);
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });
  });

  describe('sorting and filtering', () => {
    it('should sort by evaluated values', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.setSortModel([{ field: 'total', sort: 'asc' }]));
      expect(getColumnValues(3)).to.deep.equal(['5', '6', '8']);
    });

    it('should filter on evaluated values', async () => {
      await render(<Test />);
      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'total', operator: '>', value: 5 }],
        }),
      );
      expect(getColumnValues(3)).to.deep.equal(['6', '8']);
    });

    it('should quick-filter on evaluated values', async () => {
      await render(<Test />);
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

    it('should sum a column with COLUMN_VALUES', async () => {
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
      expect(getColumnValues(1)).to.deep.equal(['10', '', '']);
    });

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
      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluationEnd', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 1, price: 10 }]));

      expect(getColumnValues(1)).to.deep.equal(['17', '', '']);
      expect(listener.callCount).to.equal(1);
      expect(listener.lastCall.args[0].changedCells).to.deep.equal([{ id: 0, field: 'summary' }]);
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

    it('should evaluate RANGE rectangles and track edits inside the bounds', async () => {
      await render(
        <Test
          rows={[
            {
              id: 0,
              p1: 1,
              p2: 2,
              total: '=SUM(RANGE(REF(COLUMN("p1"), ROW(0)), REF(COLUMN("p2"), ROW(1))))',
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

      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluationEnd', listener);

      // A change inside the rectangle recomputes the consumer.
      await act(async () => apiRef.current!.updateRows([{ id: 1, p2: 14 }]));
      expect(getColumnValues(2)).to.deep.equal(['20', '', '']);
      expect(listener.callCount).to.equal(1);

      // A change outside the rectangle does not.
      await act(async () => apiRef.current!.updateRows([{ id: 2, p1: 7 }]));
      expect(listener.callCount).to.equal(1);
      expect(getColumnValues(2)).to.deep.equal(['20', '', '']);
    });

    it('should resolve a RANGE anchor without a view position as #REF! and recover', async () => {
      await render(
        <Test
          rows={[
            {
              id: 0,
              category: 'keep',
              price: 2,
              summary: '=SUM(RANGE(REF(COLUMN("price"), ROW(0)), REF(COLUMN("price"), ROW(2))))',
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

      // The anchor row is filtered out — it has no position to resolve against.
      await act(async () =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'category', operator: 'equals', value: 'keep' }],
        }),
      );
      expect(getColumnValues(2)).to.deep.equal(['#REF!', '']);
      const result = apiRef.current!.getCellFormulaResult(0, 'summary');
      expect(result?.type === 'error' && result.message).to.include(
        'has no position in the current view',
      );

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
      expect(apiRef.current!.getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 30,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));
      // The first view row is now id 1.
      expect(apiRef.current!.getCellFormulaResult(0, 'top')).to.deep.equal({
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

      const sortListener = spy();
      apiRef.current!.subscribeEvent('sortedRowsSet', sortListener);

      await act(async () => apiRef.current!.setSortModel([{ field: 'posVal', sort: 'asc' }]));

      // The comparator consumed the values as of when it ran: [b, a, c].
      expect(getColumnValues(0)).to.deep.equal(['b', 'a', 'c']);
      // One-shot rebind (D4): the values re-evaluated against the new order
      // exactly once — and even though they now disagree with the ascending
      // sort, the grid did not re-sort.
      expect(getColumnValues(2)).to.deep.equal(['30', '20', '10']);
      expect(sortListener.callCount).to.equal(1);
    });

    it('should rebind COLUMN_POSITION references when column visibility changes', async () => {
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
    });

    it('should rebind COLUMN_POSITION references on programmatic column reorder', async () => {
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

      await act(async () => apiRef.current!.setColumnIndex('tax', 0));
      expect(getColumnValues(2)).to.deep.equal(['7']);
    });

    it('should exclude pinned rows from the position context', async () => {
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
      expect(apiRef.current!.getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 5,
      });
    });

    it('should include rows added with updateRows in COLUMN_VALUES', async () => {
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
    });

    it('should drop rows removed with updateRows from COLUMN_VALUES', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, price: 3 },
            { id: 2, price: 10 },
          ]}
          columns={summaryColumns}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['15', '', '']);

      await act(async () => apiRef.current!.updateRows([{ id: 2, _action: 'delete' }]));
      expect(getColumnValues(1)).to.deep.equal(['5', '']);
    });

    it('should resolve RANGE rectangles positionally: a re-sort changes the covered rows', async () => {
      await render(
        <Test
          rows={[
            {
              id: 0,
              price: 1,
              summary: '=SUM(RANGE(REF(COLUMN("price"), ROW(0)), REF(COLUMN("price"), ROW(1))))',
            },
            { id: 1, price: 8 },
            { id: 2, price: 2 },
            { id: 3, price: 4 },
          ]}
          columns={summaryColumns}
        />,
      );
      // Anchors at view positions 1 and 2: rows 0 and 1.
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 9,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));
      // View order is now [0, 2, 3, 1]: the anchors sit at positions 1 and 4,
      // so the rectangle covers every row (D6: positional bind-time resolution).
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 15,
      });
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

      const filterListener = spy();
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
      expect(filterListener.callCount).to.equal(1);
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
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
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
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
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
      expect(apiRef.current!.getCellFormulaResult(0, 'top')).to.deep.equal({
        type: 'value',
        value: 10,
      });
      expect(apiRef.current!.getCellFormulaResult(1, 'top')).to.deep.equal({
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
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
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

      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluationEnd', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]));

      expect(getColumnValues(1)).to.deep.equal(['#REF!', '8']);
      expect(listener.callCount).to.equal(1);
      expect(listener.lastCall.args[0].changedCells).to.deep.equal([{ id: 1, field: 'calc' }]);
    });
  });

  describe('export', () => {
    it('should export evaluated values to CSV', async () => {
      await render(<Test />);
      const csv = apiRef.current!.getDataAsCsv();
      expect(csv).to.include('6');
      expect(csv).not.to.include('price * quantity');
    });

    it('should escape string results starting with `=` in CSV exports', async () => {
      await render(
        <Test
          rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=CONCAT("=", price)' }]}
          columns={[
            { field: 'item' },
            { field: 'price', type: 'number' },
            { field: 'quantity', type: 'number' },
            { field: 'total', allowFormulas: true },
          ]}
        />,
      );
      const csv = apiRef.current!.getDataAsCsv();
      expect(csv).to.include("'=2");
    });

    it('should export error codes to CSV, bypassing the valueFormatter', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 2, total: '=1 / 0' }]}
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
      const csv = apiRef.current!.getDataAsCsv();
      expect(csv).to.include('#DIV/0!');
      expect(csv).not.to.include('formatted:');
    });

    it('should export evaluated values to Excel', async () => {
      await render(<Test />);
      const workbook = await act(() => apiRef.current!.getDataAsExcel());
      const worksheet = workbook!.worksheets[0];
      // Column D is `total`, data starts at row 2.
      expect(worksheet.getCell('D2').value).to.equal(6);
      expect(worksheet.getCell('D3').value).to.equal(5);
      expect(worksheet.getCell('D4').value).to.equal(8);
    });
  });

  describe('clipboard', () => {
    let writeText: SinonSpy | undefined;

    afterEach(function afterEachHook() {
      writeText?.restore();
      writeText = undefined;
    });

    it('should copy the evaluated value, not the formula source', async () => {
      const { user } = await render(<Test cellSelection disableRowSelectionOnClick />);
      writeText = spy(navigator.clipboard, 'writeText');

      const cell = getCell(0, 3);
      await user.click(cell);
      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });

      expect(writeText.lastCall.args[0]).to.equal('6');
    });

    it('should paste `=` strings as formulas', async () => {
      const { user } = await render(<Test cellSelection disableRowSelectionOnClick />);

      const cell = getCell(2, 3);
      await user.click(cell);

      const pasteEvent = new Event('paste');
      // @ts-ignore
      pasteEvent.clipboardData = { getData: () => '=price + quantity' };
      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
      await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

      await waitFor(() => {
        expect(apiRef.current!.getRow(2).total).to.equal('=price + quantity');
      });
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '6']);
    });

    it('should paste range formulas and bind them to the current view', async () => {
      const { user } = await render(<Test cellSelection disableRowSelectionOnClick />);

      const cell = getCell(2, 3);
      await user.click(cell);

      const pasteEvent = new Event('paste');
      // @ts-ignore
      pasteEvent.clipboardData = { getData: () => '=SUM(COLUMN_VALUES("price"))' };
      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
      await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

      await waitFor(() => {
        expect(apiRef.current!.getRow(2).total).to.equal('=SUM(COLUMN_VALUES("price"))');
      });
      // price column: 2 + 1 + 4.
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '7']);
    });

    it('should paste a plain value over an existing formula', async () => {
      const { user } = await render(<Test cellSelection disableRowSelectionOnClick />);

      const cell = getCell(0, 3);
      await user.click(cell);

      const pasteEvent = new Event('paste');
      // @ts-ignore
      pasteEvent.clipboardData = { getData: () => '42' };
      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
      await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

      await waitFor(() => {
        expect(apiRef.current!.getRow(0).total).to.equal(42);
      });
      expect(apiRef.current!.getCellFormulaResult(0, 'total')).to.equal(null);
      expect(getColumnValues(3)).to.deep.equal(['42', '5', '8']);
    });
  });

  describe('aggregation', () => {
    it('should aggregate evaluated formula values', async () => {
      await render(<Test initialState={{ aggregation: { model: { total: 'sum' } } }} />);
      await waitFor(() => {
        expect(getColumnValues(3)).to.deep.equal(['6', '5', '8', '19' /* footer */]);
      });
    });
  });

  describe('row grouping', () => {
    const bucketRows = [
      { id: 0, price: 2, bucket: '=IF(price > 2, "high", "low")' },
      { id: 1, price: 3, bucket: '=IF(price > 2, "high", "low")' },
      { id: 2, price: 1, bucket: 'low' },
    ];
    const bucketColumns = [
      { field: 'price', type: 'number' },
      { field: 'bucket', allowFormulas: true },
    ] as DataGridPremiumProps['columns'];

    it('should group by evaluated values from the initial render', async () => {
      await render(
        <Test
          rows={bucketRows}
          columns={bucketColumns}
          initialState={{ rowGrouping: { model: ['bucket'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      // Plain `'low'` cells and formula cells evaluating to `'low'` share a group.
      expect(getColumnValues(0)).to.deep.equal(['low (2)', '', '', 'high (1)', '']);
    });

    it('should move rows between groups when a dependency changes', async () => {
      await render(
        <Test
          rows={bucketRows}
          columns={bucketColumns}
          initialState={{ rowGrouping: { model: ['bucket'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['low (2)', '', '', 'high (1)', '']);

      await act(async () => apiRef.current!.updateRows([{ id: 1, price: 0 }]));
      expect(getColumnValues(0)).to.deep.equal(['low (3)', '', '', '']);
    });

    it('should group error results by their error code', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, bucket: '=1 / 0' },
            { id: 1, price: 3, bucket: '=1 / 0' },
          ]}
          columns={bucketColumns}
          initialState={{ rowGrouping: { model: ['bucket'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['#DIV/0! (2)', '', '']);
    });

    it('should pass the evaluated value to groupingValueGetter', async () => {
      await render(
        <Test
          rows={bucketRows}
          columns={[
            { field: 'price', type: 'number' },
            {
              field: 'bucket',
              allowFormulas: true,
              groupingValueGetter: (value) => `bucket-${value}`,
            },
          ]}
          initialState={{ rowGrouping: { model: ['bucket'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['bucket-low (2)', '', '', 'bucket-high (1)', '']);
    });

    it('should exclude autogenerated group rows from COLUMN_VALUES', async () => {
      await render(
        <Test
          rows={[
            { id: 0, category: 'x', price: 2, summary: '=SUM(COLUMN_VALUES("price"))' },
            { id: 1, category: 'x', price: 3 },
            { id: 2, category: 'y', price: 5 },
          ]}
          columns={[
            { field: 'category' },
            { field: 'price', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
          initialState={{ rowGrouping: { model: ['category'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 10,
      });
    });

    it('should exclude autogenerated group rows from row positions', async () => {
      await render(
        <Test
          rows={[
            { id: 0, category: 'x', price: 2, summary: '=REF(COLUMN("price"), ROW_POSITION(1))' },
            { id: 1, category: 'x', price: 3 },
            { id: 2, category: 'y', price: 5 },
          ]}
          columns={[
            { field: 'category' },
            { field: 'price', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
          initialState={{ rowGrouping: { model: ['category'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      // Position 1 is the first leaf, not the autogenerated group header
      // (whose `price` would resolve to null).
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 2,
      });
    });

    it('should exclude the grouping column from column positions', async () => {
      await render(
        <Test
          rows={[
            { id: 0, category: 'x', price: 5, summary: '=REF(COLUMN_POSITION(1), ROW(0))' },
            { id: 1, category: 'y', price: 7 },
          ]}
          columns={[
            { field: 'category' },
            { field: 'price', type: 'number' },
            { field: 'summary', type: 'number', allowFormulas: true },
          ]}
          initialState={{ rowGrouping: { model: ['category'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      // The autogenerated grouping column takes no position: position 1 is
      // the first data column, `category` (a leaf cell of the grouping
      // column would resolve to null).
      expect(apiRef.current!.getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 'x',
      });
    });
  });

  describe.skipIf(isJSDOM)('row spanning', () => {
    function getSpannedCells() {
      const privateApi = unwrapPrivateAPI(apiRef.current!);
      return privateApi.virtualizer.store.state.rowSpanning.caches.spannedCells;
    }

    const spanColumns = [
      { field: 'price', type: 'number' },
      { field: 'quantity', type: 'number' },
      { field: 'total', type: 'number', allowFormulas: true },
    ] as DataGridPremiumProps['columns'];

    it('should span cells whose evaluated values are equal', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, quantity: 3, total: '=price * quantity' },
            { id: 1, price: 3, quantity: 2, total: '=6' },
            { id: 2, price: 4, quantity: 1, total: 8 },
          ]}
          columns={spanColumns}
          rowSpanning
        />,
      );
      await waitFor(() => {
        // Different sources, equal evaluated values (6): rows 0 and 1 span.
        expect(getSpannedCells()).to.deep.equal({ 0: { 2: 2 } });
      });
    });

    it('should not span identical sources with different evaluated values', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, quantity: 3, total: '=price * quantity' },
            { id: 1, price: 3, quantity: 5, total: '=price * quantity' },
          ]}
          columns={spanColumns}
          rowSpanning
        />,
      );
      await microtasks();
      expect(getSpannedCells()).to.deep.equal({});
    });

    it('should split the span when an edit changes an evaluated value', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, quantity: 3, total: '=price * quantity' },
            { id: 1, price: 3, quantity: 2, total: '=6' },
          ]}
          columns={spanColumns}
          rowSpanning
        />,
      );
      await waitFor(() => {
        expect(getSpannedCells()).to.deep.equal({ 0: { 2: 2 } });
      });

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 5 }]));
      await waitFor(() => {
        expect(getSpannedCells()).to.deep.equal({});
      });
    });

    it('should refresh spans after reevaluateFormulas', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 2, quantity: 3, total: '=price * quantity' },
            { id: 1, price: 3, quantity: 2, total: '=6' },
          ]}
          columns={spanColumns}
          rowSpanning
        />,
      );
      await waitFor(() => {
        expect(getSpannedCells()).to.deep.equal({ 0: { 2: 2 } });
      });

      // In-place mutation: no rows cascade runs, the formula pass triggers
      // the row spanning reset itself.
      apiRef.current!.getRow(0).price = 5;
      await act(async () => apiRef.current!.reevaluateFormulas());
      await waitFor(() => {
        expect(getSpannedCells()).to.deep.equal({});
      });
    });
  });

  describe('editing', () => {
    it('should seed the editor with the formula source', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });
    });

    it('should render a text input for formulas even on number columns', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      expect(getCellInput(0, 3).type).to.equal('text');
    });

    it('should keep the default editor for plain cells of `allowFormulas` columns', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(2, 3));
      expect(getCellInput(2, 3).type).to.equal('number');
    });

    it('should preserve the formula when the edit is committed without changes', async () => {
      const { user } = await render(<Test processRowUpdate={(newRow) => newRow} />);
      const cell = getCell(0, 3);
      await user.dblClick(cell);
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should preserve the formula when a row edit is committed without changes', async () => {
      const { user } = await render(<Test editMode="row" />);
      const cell = getCell(0, 3);
      await user.dblClick(cell);
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should discard changes on Escape', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=price + 100' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Escape' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should commit a new formula and re-evaluate', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=price + quantity' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);
    });

    it('should commit a plain value over a formula', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '42' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal(42);
      expect(apiRef.current!.getCellFormulaResult(0, 'total')).to.equal(null);
      expect(getColumnValues(3)).to.deep.equal(['42', '5', '8']);
    });

    it('should commit invalid formulas permissively', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=1 +' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=1 +');
      expect(getColumnValues(3)).to.deep.equal(['#ERROR!', '5', '8']);
    });

    it('should open the formula editor when typing `=` on a plain cell', async () => {
      await render(<Test />);
      const cell = getCell(2, 3); // plain value 8 in the number column
      await act(async () => cell.focus());
      fireEvent.keyDown(cell, { key: '=' });
      await microtasks();

      expect(getCellInput(2, 3).type).to.equal('text');
    });

    it('should clear a formula when committing an emptied editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getCellFormula(0, 'total')).to.equal(null);
      expect(apiRef.current!.getCellFormulaResult(0, 'total')).to.equal(null);
    });

    it('should round-trip an escaped literal through the editor', async () => {
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: "'=not a formula" }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal("'=not a formula");
      });

      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal("'=not a formula");
      expect(getColumnValues(3)).to.deep.equal(['=not a formula']);
    });

    it('should not seed the source when the edit starts by typing', async () => {
      await render(<Test />);
      const cell = getCell(0, 3);
      await act(async () => cell.focus());
      fireEvent.keyDown(cell, { key: '5' });
      await microtasks();

      expect(getCellInput(0, 3).value).not.to.equal('=price * quantity');
    });

    it('should pass the formula source to processRowUpdate', async () => {
      const processRowUpdate = spy((newRow) => newRow);
      const { user } = await render(<Test processRowUpdate={processRowUpdate} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=price + 1' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(processRowUpdate.lastCall.args[0].total).to.equal('=price + 1');
    });

    it('should keep the evaluation consistent when processRowUpdate rejects', async () => {
      const { user } = await render(
        <Test
          processRowUpdate={() => Promise.reject(new Error('Rejected'))}
          onProcessRowUpdateError={() => {}}
        />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=price + 1' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal(6);
    });

    it('should restore formulas through undo/redo', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=price + quantity' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);

      await act(() => apiRef.current!.history.undo());
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);

      await act(() => apiRef.current!.history.redo());
      expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);
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
      const warnSpy = spy();
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
        warnSpy
          .getCalls()
          .some((call) =>
            call.args.some(
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
      await act(async () => apiRef.current!.setCellFormula(2, 'total', '=price + quantity'));
      expect(apiRef.current!.getRow(2).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '6']);
    });

    it('should throw when setCellFormula targets a column without allowFormulas', async () => {
      await render(<Test />);
      expect(() => apiRef.current!.setCellFormula(0, 'item', '=price')).to.throw(
        'does not allow formulas',
      );
    });

    it('should throw when setCellFormula receives a non-formula value', async () => {
      await render(<Test />);
      expect(() => apiRef.current!.setCellFormula(0, 'total', 'price')).to.throw(
        'expects a formula source starting with `=`',
      );
    });

    it('should return the source from getCellFormula and null for plain cells', async () => {
      await render(<Test />);
      expect(apiRef.current!.getCellFormula(0, 'total')).to.equal('=price * quantity');
      expect(apiRef.current!.getCellFormula(2, 'total')).to.equal(null);
    });

    it('should return the evaluation result from getCellFormulaResult', async () => {
      await render(<Test />);
      expect(apiRef.current!.getCellFormulaResult(0, 'total')).to.deep.equal({
        type: 'value',
        value: 6,
      });
      expect(apiRef.current!.getCellFormulaResult(2, 'total')).to.equal(null);
    });

    it('should validate formulas with validateCellFormula', async () => {
      await render(<Test />);
      expect(apiRef.current!.validateCellFormula('=price * quantity').valid).to.equal(true);
      const invalid = apiRef.current!.validateCellFormula('=NOPE(1)');
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
      await act(async () => apiRef.current!.reevaluateFormulas());
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
      const warnSpy = spy();
      const originalWarn = console.warn;
      console.warn = warnSpy;
      onTestFinished(() => {
        console.warn = originalWarn;
      });
      const getRows = spy(async () => ({
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
