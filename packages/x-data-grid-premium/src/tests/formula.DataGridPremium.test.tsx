import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnHeaderCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import { spy } from 'sinon';
import type { SinonSpy } from 'sinon';
import { onTestFinished } from 'vitest';
import {
  DataGridPremium,
  GRID_FORMULA_FUNCTIONS,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridColDef,
  GridFormulaFunctionDefinition,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';
import { getCaretOffset, setCaretOffset } from '../components/formulaEditorCaret';

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

/**
 * A minimal user-supplied editor: a plain text input writing straight to the
 * edit state. It edits whatever it is seeded — the source for formula cells.
 */
function CustomFormulaEditor(props: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLInputElement>(null);
  React.useLayoutEffect(() => {
    if (props.hasFocus) {
      ref.current?.focus();
    }
  }, [props.hasFocus]);
  return (
    <input
      ref={ref}
      data-testid="custom-editor"
      value={(props.value as string | undefined) ?? ''}
      onChange={(event) =>
        apiRef.current.setEditCellValue({
          id: props.id,
          field: props.field,
          value: event.target.value,
        })
      }
    />
  );
}

const customEditorColumns: GridColDef[] = [
  { field: 'item' },
  { field: 'price', type: 'number' },
  { field: 'quantity', type: 'number' },
  {
    field: 'total',
    type: 'number',
    allowFormulas: true,
    editable: true,
    renderEditCell: (params) => <CustomFormulaEditor {...params} />,
  },
];

describe('<DataGridPremium /> - Formulas', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  // The formula API methods are private for now.
  const formulaApi = () => unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!);

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

  // The editable lives in the floating surface portaled into the virtual SCROLLER
  // (it overlays the cell but is not a DOM child of it — nor of the row). Only the
  // focused cell's surface is open at a time, so a document-scoped query is
  // unambiguous; the row/col args are kept for call-site readability.
  function getCellEditable(_rowIndex: number, _colIndex: number) {
    return document.querySelector<HTMLElement>(
      '.MuiDataGrid-formulaEditorSurface [contenteditable]',
    )!;
  }

  // The formula editor is a `contenteditable`, not an `<input>`: it has no
  // `.value` and no `change` event. Set the whole value by replacing the text and
  // firing the `input` event the editor listens to (works in jsdom and chromium).
  function setEditableValue(rowIndex: number, colIndex: number, value: string) {
    const editable = getCellEditable(rowIndex, colIndex);
    editable.textContent = value;
    fireEvent.input(editable);
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
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.deep.equal({
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
      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 10 }]));

      expect(listener.callCount).to.equal(1);
      expect(listener.lastCall.args[0].changedCells).to.deep.equal([{ id: 0, field: 'total' }]);
    });

    it('should not re-evaluate when an unrelated cell changes', async () => {
      await render(<Test />);
      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

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
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

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
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

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
      const result = formulaApi().getCellFormulaResult(0, 'summary');
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
      expect(formulaApi().getCellFormulaResult(0, 'top')).to.deep.equal({
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
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
        type: 'value',
        value: 9,
      });

      await act(async () => apiRef.current!.setSortModel([{ field: 'price', sort: 'asc' }]));
      // View order is now [0, 2, 3, 1]: the anchors sit at positions 1 and 4,
      // so the rectangle covers every row (D6: positional bind-time resolution).
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
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

      const listener = spy();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);

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
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.equal(null);
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
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
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
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
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
      expect(formulaApi().getCellFormulaResult(0, 'summary')).to.deep.equal({
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
      await act(async () => formulaApi().reevaluateFormulas());
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
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
    });

    it('should render the formula editor for formulas even on number columns', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // A number column would otherwise render a number `<input>`; the formula
      // editor is a contenteditable instead.
      expect(getCell(0, 3).querySelector('input')).to.equal(null);
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
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should preserve the formula when a row edit is committed without changes', async () => {
      const { user } = await render(<Test editMode="row" />);
      const cell = getCell(0, 3);
      await user.dblClick(cell);
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should discard changes on Escape', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + 100');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Escape' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should commit a new formula and re-evaluate', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + quantity');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);
    });

    it('should commit a plain value over a formula', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '42');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal(42);
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.equal(null);
      expect(getColumnValues(3)).to.deep.equal(['42', '5', '8']);
    });

    it('should commit invalid formulas permissively', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=1 +');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
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

      expect(getCellEditable(2, 3)).not.to.equal(null);
    });

    it('should clear a formula when committing an emptied editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(formulaApi().getCellFormula(0, 'total')).to.equal(null);
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.equal(null);
    });

    it('should round-trip an escaped literal through the editor', async () => {
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: "'=not a formula" }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal("'=not a formula");
      });

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
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

      expect(getCellEditable(0, 3).textContent).not.to.equal('=price * quantity');
    });

    it('should pass the formula source to processRowUpdate', async () => {
      const processRowUpdate = spy((newRow) => newRow);
      const { user } = await render(<Test processRowUpdate={processRowUpdate} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + 1');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
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
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + 1');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal(6);
    });

    it('should restore formulas through undo/redo', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + quantity');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
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
      await act(async () => formulaApi().setCellFormula(2, 'total', '=price + quantity'));
      expect(apiRef.current!.getRow(2).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '6']);
    });

    it('should throw when setCellFormula targets a column without allowFormulas', async () => {
      await render(<Test />);
      expect(() => formulaApi().setCellFormula(0, 'item', '=price')).to.throw(
        'does not allow formulas',
      );
    });

    it('should throw when setCellFormula receives a non-formula value', async () => {
      await render(<Test />);
      expect(() => formulaApi().setCellFormula(0, 'total', 'price')).to.throw(
        'expects a formula source starting with `=`',
      );
    });

    it('should return the source from getCellFormula and null for plain cells', async () => {
      await render(<Test />);
      expect(formulaApi().getCellFormula(0, 'total')).to.equal('=price * quantity');
      expect(formulaApi().getCellFormula(2, 'total')).to.equal(null);
    });

    it('should return the evaluation result from getCellFormulaResult', async () => {
      await render(<Test />);
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.deep.equal({
        type: 'value',
        value: 6,
      });
      expect(formulaApi().getCellFormulaResult(2, 'total')).to.equal(null);
    });

    it('should validate formulas with validateCellFormula', async () => {
      await render(<Test />);
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

  describe('custom edit cell renderer', () => {
    it('should use a custom renderEditCell even for formula values', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCell(0, 3).querySelector('[data-testid="custom-editor"]')).not.to.equal(null);
      });
    });

    it('should seed the custom editor with the formula source, not the evaluated value', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });
    });

    it('should preserve the formula when a custom editor commits it unchanged', async () => {
      const { user } = await render(
        <Test columns={customEditorColumns} processRowUpdate={(newRow) => newRow} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should commit a new formula edited through a custom editor', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
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

    it('should keep our formula editor for built-in column editors', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      expect(getCell(0, 3).querySelector('[data-testid="custom-editor"]')).to.equal(null);
    });

    it('should seed the canonical source (not A1) into a custom editor in A1 mode', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          columns={customEditorColumns}
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
        />,
      );
      // A1 on shifts data columns right by one (row-number column at index 0).
      await user.dblClick(getCell(0, 4));
      await waitFor(() => {
        expect(getCellInput(0, 4).value).to.equal('=REF(COLUMN("price"), ROW(0))');
      });
    });

    it('should round-trip the canonical source committed from a custom editor in A1 mode', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          processRowUpdate={(newRow) => newRow}
          columns={customEditorColumns}
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
        />,
      );
      await user.dblClick(getCell(0, 4));
      await waitFor(() => {
        expect(getCellInput(0, 4).value).to.equal('=REF(COLUMN("price"), ROW(0))');
      });

      fireEvent.keyDown(getCellInput(0, 4), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
    });
  });

  describe('reference highlighting', () => {
    const TOKEN_CLASS = '.MuiDataGrid-formulaReferenceToken';
    const OVERLAY_CLASS = '.MuiDataGrid-formulaReferenceOverlay';
    const RECT_CLASS = '.MuiDataGrid-formulaReferenceHighlight';

    const tokens = () => Array.from(document.querySelectorAll<HTMLElement>(TOKEN_CLASS));
    const rects = () => Array.from(document.querySelectorAll<HTMLElement>(RECT_CLASS));

    it('colors each distinct reference token in the editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
      });
      // Distinct targets → distinct palette colors.
      expect(tokens()[0].style.color).to.equal('var(--DataGrid-formulaRefColor-0)');
      expect(tokens()[1].style.color).to.equal('var(--DataGrid-formulaRefColor-1)');
    });

    it('outlines each referenced cell in the grid', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(2);
      });
    });

    it('shares one color between a token and its cell outline', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
        expect(rects()).to.have.length(2);
      });
      // `price` is the first token and the first outline — same shared color var.
      expect(rects()[0].style.borderColor).to.equal(tokens()[0].style.color);
    });

    it('draws a single outline for a repeated reference', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      setEditableValue(0, 3, '=price + price');
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
        expect(rects()).to.have.length(1);
      });
    });

    it('never highlights the cell being edited (self-reference)', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      setEditableValue(0, 3, '=total + price');
      await waitFor(() => {
        // Only `price` is colored and outlined; `total` is the edited cell.
        expect(tokens()).to.have.length(1);
        expect(rects()).to.have.length(1);
      });
    });

    it('clears the highlighting when editing stops', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(2);
      });
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Escape' });
      await microtasks();
      expect(document.querySelector(OVERLAY_CLASS)).to.equal(null);
      expect(tokens()).to.have.length(0);
    });

    it('does not highlight a column with a custom editor', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCell(0, 3).querySelector('[data-testid="custom-editor"]')).not.to.equal(null);
      });
      expect(document.querySelector(OVERLAY_CLASS)).to.equal(null);
      expect(tokens()).to.have.length(0);
    });

    it('does not highlight a plain non-formula edit', async () => {
      const { user } = await render(<Test />);
      // Row 2 `total` holds a plain number; double-click opens the number editor.
      await user.dblClick(getCell(2, 3));
      await microtasks();
      expect(document.querySelector(OVERLAY_CLASS)).to.equal(null);
      expect(tokens()).to.have.length(0);
    });

    it('does not highlight a reference to a filtered-out row', async () => {
      const { user } = await render(
        <Test
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(1))' },
            { id: 1, item: 'Banana', price: 1, quantity: 5, total: 5 },
          ]}
          filterModel={{ items: [{ field: 'item', operator: 'equals', value: 'Apple' }] }}
        />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.contain('REF(');
      });
      // Row 1 is filtered out → its cell cannot be resolved → no token, no outline.
      expect(tokens()).to.have.length(0);
      expect(rects()).to.have.length(0);
    });

    it.skipIf(isJSDOM)('aligns a cell outline with the referenced cell', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(2);
      });
      // The first reference (`price`) outlines the price cell of the edited row.
      const priceCell = getCell(0, 1).getBoundingClientRect();
      const outline = rects()[0].getBoundingClientRect();
      expect(Math.abs(outline.left - priceCell.left)).to.be.lessThan(2);
      expect(Math.abs(outline.top - priceCell.top)).to.be.lessThan(2);
      expect(Math.abs(outline.width - priceCell.width)).to.be.lessThan(2);
      expect(Math.abs(outline.height - priceCell.height)).to.be.lessThan(2);
    });

    it.skipIf(isJSDOM)('repositions outlines after a vertical scroll', async () => {
      const manyRows = Array.from({ length: 60 }, (_, index) => ({
        id: index,
        item: `Item ${index}`,
        price: index + 1,
        quantity: 2,
        total: index === 0 ? '=REF(COLUMN("price"), ROW(40))' : index + 1,
      }));
      const { user } = await render(<Test rows={manyRows} autoHeight={false} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(1);
      });
      apiRef.current!.scrollToIndexes({ rowIndex: 40, colIndex: 1 });
      await waitFor(() => {
        const target = getCell(40, 1).getBoundingClientRect();
        const outline = rects()[0].getBoundingClientRect();
        expect(Math.abs(outline.top - target.top)).to.be.lessThan(2);
      });
    });

    it.skipIf(isJSDOM)(
      'keeps outlines aligned with cells during native scroll (no lag)',
      async () => {
        const manyRows = Array.from({ length: 60 }, (_, index) => ({
          id: index,
          item: `Item ${index}`,
          price: index + 1,
          quantity: 2,
          total: index === 0 ? '=REF(COLUMN("price"), ROW(5))' : index + 1,
        }));
        const { user } = await render(<Test rows={manyRows} autoHeight={false} />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(rects()).to.have.length(1);
        });
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        // Scroll synchronously: a content-space overlay moves with the cell in the
        // same frame (no scroll listener). A JS-repositioned overlay would lag here.
        scroller.scrollTop = 40;
        const cell = getCell(5, 1).getBoundingClientRect();
        const outline = rects()[0].getBoundingClientRect();
        expect(Math.abs(outline.top - cell.top)).to.be.lessThan(2);
        expect(Math.abs(outline.left - cell.left)).to.be.lessThan(2);
      },
    );

    it('colors A1 references in the editor', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
        />,
      );
      // A1 on shifts data columns right by one (row-number column at index 0).
      await user.dblClick(getCell(0, 4));
      await waitFor(() => {
        expect(getCellEditable(0, 4).textContent).to.equal('=B1');
      });
      // The A1 reference `B1` is colored as one token.
      expect(tokens()).to.have.length(1);
      expect(tokens()[0].textContent).to.equal('B1');
      expect(tokens()[0].style.color).to.equal('var(--DataGrid-formulaRefColor-0)');
    });

    // The whole point of the single-layer editor: caret, native selection and the
    // colors share one element, so there is nothing to keep aligned. These run in
    // a real browser — jsdom has no layout, caret geometry or text selection.
    it.skipIf(isJSDOM)('keeps the caret put when typing in the middle of a formula', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // Place the caret right before `quantity` (offset 9) and type a character.
      act(() => setCaretOffset(editable, 9));
      await user.keyboard('z');

      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * zquantity');
      });
      // The character landed at the caret (not the end), and the caret sits just
      // after it — the classic contenteditable "jump to end" bug does not happen.
      expect(getCaretOffset(getCellEditable(0, 3))).to.equal(10);
    });

    it.skipIf(isJSDOM)('shows a native, colored text selection over a token', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
      });

      // Select the first colored token (`price`) natively.
      const token = tokens()[0];
      const range = document.createRange();
      range.selectNodeContents(token);
      const selection = document.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);

      // The selected text IS the colored token text — there is no separate
      // transparent layer and no backdrop mirror.
      expect(selection.toString()).to.equal('price');
      expect(document.querySelector('.MuiDataGrid-formulaReferenceBackdrop')).to.equal(null);
      const transparent = 'rgba(0, 0, 0, 0)';
      expect(getComputedStyle(editable).color).not.to.equal(transparent);
      expect(getComputedStyle(token).color).not.to.equal(transparent);
    });

    it.skipIf(isJSDOM)(
      'aligns the formula to the start edge in a right-aligned column',
      async () => {
        // `total` is `type: 'number'` (right-aligned). A formula must read from the
        // start edge regardless, like a string — not be pushed to the far edge.
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        const editable = getCellEditable(0, 3);
        await waitFor(() => {
          expect(editable.textContent).to.equal('=price * quantity');
        });
        setEditableValue(0, 3, '=price');
        await waitFor(() => {
          expect(tokens()).to.have.length(1);
        });
        // The single short token sits near the start (left) edge of the editor.
        const token = tokens()[0].getBoundingClientRect();
        const box = editable.getBoundingClientRect();
        expect(token.left - box.left).to.be.lessThan(box.width / 2);
      },
    );

    it.skipIf(isJSDOM)('keeps the colored token on the editable text line', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
      });
      // Single layer: the colored token sits within the editable's own text line
      // (no vertical drift between a token layer and a caret layer).
      const line = editable.getBoundingClientRect();
      const token = tokens()[0].getBoundingClientRect();
      expect(token.top).to.be.greaterThanOrEqual(line.top - 2);
      expect(token.bottom).to.be.lessThanOrEqual(line.bottom + 2);
    });

    it.skipIf(isJSDOM)('commits on Enter without inserting a newline', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      await user.keyboard('{Enter}');
      await microtasks();

      // The edit committed (the editor unmounted) and no newline was inserted.
      expect(getCellEditable(0, 3)).to.equal(null);
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it.skipIf(isJSDOM)('strips newlines from a pasted multi-line value', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
      // @ts-ignore the editor reads `text/plain` off the clipboard data.
      pasteEvent.clipboardData = { getData: () => 'a\nb' };
      act(() => {
        editable.dispatchEvent(pasteEvent);
      });

      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.contain('ab');
      });
      // The pasted newline never makes it into the single-line editor.
      expect(getCellEditable(0, 3).textContent).not.to.contain('\n');
    });

    it.skipIf(isJSDOM)('commits an IME composition exactly once, on compositionend', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // The committed edit-state value (not the manually-set DOM) is the source of
      // truth here — it changes only when the editor actually commits.
      const editValue = () =>
        (unwrapPrivateAPI(apiRef.current!).state.editRows as Record<string, any>)[0]?.total?.value;
      expect(editValue()).to.equal('=price * quantity');

      // A composition mutates the DOM mid-flight; committing then (which rebuilds the
      // DOM) would abort the composition, so the editor must defer until it ends.
      fireEvent.compositionStart(editable);
      editable.textContent = '=price * quantityあ';
      fireEvent.input(editable);
      // Still composing: the mid-flight input did NOT commit.
      expect(editValue()).to.equal('=price * quantity');

      // compositionend commits the composed text exactly once.
      fireEvent.compositionEnd(editable, { data: 'あ' });
      await waitFor(() => {
        expect(editValue()).to.equal('=price * quantityあ');
      });
      expect(getCellEditable(0, 3).textContent).to.equal('=price * quantityあ');
    });

    it.skipIf(isJSDOM)('shows and accepts a function suggestion', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // Replace the formula with a partial function name.
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('=SU');

      await waitFor(() => {
        const listbox = document.querySelector('[role="listbox"]');
        expect(listbox).not.to.equal(null);
        expect(listbox!.textContent).to.contain('SUM');
      });

      await user.keyboard('{Enter}');

      // Accepting `SUM` inserts `SUM(` and parks the caret inside the parens.
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=SUM(');
      });
      expect(getCaretOffset(getCellEditable(0, 3))).to.equal(5);
    });

    it.skipIf(isJSDOM)(
      'closes the popup on the first Escape and cancels on the second',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        const editable = getCellEditable(0, 3);
        await waitFor(() => {
          expect(editable.textContent).to.equal('=price * quantity');
        });

        await user.keyboard('{Control>}a{/Control}');
        await user.keyboard('=SU');
        await waitFor(() => {
          expect(document.querySelector('[role="listbox"]')).not.to.equal(null);
        });

        // First Escape closes the list but keeps editing.
        await user.keyboard('{Escape}');
        await waitFor(() => {
          expect(document.querySelector('[role="listbox"]')).to.equal(null);
        });
        expect(getCellEditable(0, 3)).not.to.equal(null);

        // Second Escape cancels the edit (no commit of the partial formula).
        await user.keyboard('{Escape}');
        await microtasks();
        expect(getCellEditable(0, 3)).to.equal(null);
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      },
    );
  });

  describe('column resize', () => {
    const RECT_CLASS = '.MuiDataGrid-formulaReferenceHighlight';
    const SEPARATOR_CLASS = '.MuiDataGrid-columnSeparator--resizable';

    const rects = () => Array.from(document.querySelectorAll<HTMLElement>(RECT_CLASS));
    const getSurface = () =>
      document.querySelector<HTMLElement>('.MuiDataGrid-formulaEditorSurface')!;
    // The separator inside header cell `colIndex` resizes that column.
    const separatorFor = (colIndex: number) =>
      getColumnHeaderCell(colIndex).querySelector(SEPARATOR_CLASS)!;

    const expectAligned = (rect: DOMRect, cell: DOMRect) => {
      expect(Math.abs(rect.left - cell.left)).to.be.lessThan(2);
      expect(Math.abs(rect.top - cell.top)).to.be.lessThan(2);
      expect(Math.abs(rect.width - cell.width)).to.be.lessThan(2);
      expect(Math.abs(rect.height - cell.height)).to.be.lessThan(2);
    };

    it('keeps the formula edit active through a resize gesture', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // The resize-ending mouseup lands on the separator — outside any cell —
      // which by stock focus semantics would clear the focus and commit the
      // draft. The formula `canUpdateFocus` veto keeps the edit alive instead.
      const separator = separatorFor(1);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(separator, { clientX: 150 });
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(getCellEditable(0, 3)).not.to.equal(null);
      // Nothing was committed by the gesture.
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it('keeps the formula edit active when the resize mouseup lands off the separator', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // The drag has no pointer capture: past the min/max-width clamp (or with
      // vertical drift below the header) the pointer overshoots the ~10px
      // separator strip and the mouseup lands on a cell. The veto must key on
      // the in-flight resize session, not on the mouseup target.
      const separator = separatorFor(1);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(getCell(1, 1), { clientX: 150 });
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(getCellEditable(0, 3)).not.to.equal(null);
    });

    it('still ends a plain (non-formula) edit on a resize gesture', async () => {
      const { user } = await render(<Test />);
      // Row 2 `total` holds a plain number → the stock number editor renders, no
      // formula edit is active, and the stock focus semantics are preserved.
      await user.dblClick(getCell(2, 3));
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(2, 'total')).to.equal('edit');
      });
      const separator = separatorFor(1);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(separator, { clientX: 150 });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(2, 'total')).to.equal('view');
      });
    });

    it.skipIf(isJSDOM)(
      'keeps the reference outlines on their cells during a live resize',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(rects()).to.have.length(2);
        });
        // Drag the `price` separator +50: `price` widens in place, `quantity`
        // shifts right. State stays stale until pointer-up, so only the live
        // per-event sync can keep the outlines on the moved cells.
        const separator = separatorFor(1);
        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        expectAligned(rects()[0].getBoundingClientRect(), getCell(0, 1).getBoundingClientRect());
        expectAligned(rects()[1].getBoundingClientRect(), getCell(0, 2).getBoundingClientRect());
        fireEvent.mouseUp(separator, { clientX: 150 });
        // The pointer-up state commit re-renders the canonical styles — still
        // aligned (and, with the focus veto, the edit is still alive to show them).
        await waitFor(() => {
          expectAligned(rects()[0].getBoundingClientRect(), getCell(0, 1).getBoundingClientRect());
          expectAligned(rects()[1].getBoundingClientRect(), getCell(0, 2).getBoundingClientRect());
        });
      },
    );

    it.skipIf(isJSDOM)(
      'keeps the floating surface on its cell when a column before it is resized',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        const surfaceBefore = getSurface().getBoundingClientRect();
        const cellBefore = getCell(0, 3).getBoundingClientRect();
        const separator = separatorFor(1);
        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 160, buttons: 1 });
        const surfaceDuring = getSurface().getBoundingClientRect();
        const cellDuring = getCell(0, 3).getBoundingClientRect();
        // Sanity: the drag really moved the editing cell.
        expect(cellDuring.left - cellBefore.left).to.be.greaterThan(50);
        // The surface moved by exactly the same delta, and its width is untouched.
        expect(
          Math.abs(surfaceDuring.left - surfaceBefore.left - (cellDuring.left - cellBefore.left)),
        ).to.be.lessThan(2);
        expect(Math.abs(surfaceDuring.width - surfaceBefore.width)).to.be.lessThan(2);
        fireEvent.mouseUp(separator, { clientX: 160 });
      },
    );

    it.skipIf(isJSDOM)("tracks the editing column's own width during a live resize", async () => {
      // Short formula: no content growth, so the surface width is the cell's
      // width (+1 for the gridline borders) and must track the drag live.
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=1' }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const before = getSurface().getBoundingClientRect();
      const separator = separatorFor(3);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 140, buttons: 1 });
      const during = getSurface().getBoundingClientRect();
      const cell = getCell(0, 3).getBoundingClientRect();
      expect(during.width - before.width).to.be.greaterThan(30);
      expect(Math.abs(during.width - (cell.width + 1))).to.be.lessThan(2);
      // The start edge stays pinned — only the inline-end follows the drag.
      expect(Math.abs(during.left - before.left)).to.be.lessThan(2);
      fireEvent.mouseUp(separator, { clientX: 140 });
    });
  });

  describe('editor virtualization and scrolling', () => {
    const manyRows = Array.from({ length: 60 }, (_, index) => ({
      id: index,
      item: `Item ${index}`,
      price: index + 1,
      quantity: 2,
      total: index === 0 ? '=price * quantity' : index + 1,
    }));

    function getEditableByRow(_id: number | string) {
      // The editable lives in the scroller-portaled floating surface, not inside
      // the row; only the focused cell's surface is open at a time.
      return document.querySelector<HTMLElement>(
        '.MuiDataGrid-formulaEditorSurface [contenteditable]',
      );
    }

    it('focuses the editor without scrolling the grid into view', async () => {
      // Shadow `focus` on HTMLDivElement (the editable is a div) with a
      // recording wrapper. A plain sinon spy cannot wrap it here: the test
      // environment turns `HTMLElement.prototype.focus` into an accessor.
      const focusCalls: { element: Element; options?: FocusOptions }[] = [];
      const divProto = HTMLDivElement.prototype;
      Object.defineProperty(divProto, 'focus', {
        configurable: true,
        writable: true,
        value(this: HTMLElement, options?: FocusOptions) {
          focusCalls.push({ element: this, options });
          return Object.getPrototypeOf(divProto).focus.call(this, options);
        },
      });
      onTestFinished(() => {
        delete (divProto as Partial<HTMLDivElement>).focus;
      });
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const editable = getCellEditable(0, 3);
      // The browser scrolls a focused element into view by default — during a
      // virtualization remount of the editing cell that would yank the viewport
      // back on every scroll tick. Every editor focus must opt out.
      const editorCalls = focusCalls.filter((call) => call.element === editable);
      expect(editorCalls.length).to.be.greaterThan(0);
      editorCalls.forEach((call) => {
        expect(call.options?.preventScroll).to.equal(true);
      });
    });

    it.skipIf(isJSDOM)(
      'keeps the scroll position when scrolling away from the edited cell',
      async () => {
        const { user } = await render(
          <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
        );
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        // Push the edited row far past the render window (viewport + buffer).
        scroller.scrollTop = 1500;
        // Let the render context update and any focus restoration settle. The
        // remount+refocus race is timing-dependent (headless chromium usually
        // keeps the editor mounted), so this guards the invariant whenever the
        // environment does exercise it; the preventScroll argument itself is
        // pinned deterministically by the focus-spy test above.
        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 300);
          });
        });
        expect(scroller.scrollTop).to.equal(1500);
        // The editing session survives the excursion.
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      },
    );

    it.skipIf(isJSDOM)('keeps accepting input while the edited cell is out of view', async () => {
      const { user } = await render(
        <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      scroller.scrollTop = 1500;
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
      });
      // The editor keeps DOM focus while out of view, so typing still lands in
      // the formula (the browser may scroll back to reveal the caret — that is
      // the native, Excel-like behavior and not asserted here).
      await user.keyboard('9');
      await waitFor(() => {
        expect(getEditableByRow(0)!.textContent).to.equal('=price * quantity9');
      });
    });

    it('resumes the caret when the editing cell remounts mid-edit', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const before = getEditableByRow(0)!;
      // Engage the session: typing mirrors the caret through the input path.
      await user.keyboard('9');
      // A click placing the caret mirrors through the mouseup path (jsdom fires
      // no selectionchange to observe, so the caret is set directly).
      act(() => {
        setCaretOffset(before, 4);
      });
      fireEvent.mouseUp(before);
      expect(formulaApi().caches.formula.editorSession?.caret).to.equal(4);
      // An arrow-key caret move mirrors through the keyup path.
      act(() => {
        setCaretOffset(before, 6);
      });
      fireEvent.keyUp(before, { key: 'ArrowLeft' });
      expect(formulaApi().caches.formula.editorSession?.caret).to.equal(6);
      // Remount the editing cell for real — pinning moves it into the pinned
      // section, exactly like virtualization moves it into the virtual-focus
      // slot when the edited row leaves the render window.
      await act(async () => {
        apiRef.current!.setPinnedColumns({ left: ['total'] });
      });
      await waitFor(() => {
        const after = getEditableByRow(0);
        expect(after).not.to.equal(null);
        expect(after).not.to.equal(before);
      });
      const after = getEditableByRow(0)!;
      // The session survived the remount: caret restored, not snapped to the end.
      expect(getCaretOffset(after)).to.equal(6);
      // The suggestion popup does not reopen on its own after the remount.
      expect(document.querySelector('[role="listbox"]')).to.equal(null);
      // Typing continues at the restored caret ("=price| * quantity9").
      await user.keyboard('X');
      await waitFor(() => {
        expect(getEditableByRow(0)!.textContent).to.equal('=priceX * quantity9');
      });
    });

    it('clears the captured session when editing stops', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // Plant a session as a mid-edit interaction would; committing the edit
      // must clear it so it cannot resume into a later edit.
      formulaApi().caches.formula.editorSession = {
        id: 0,
        field: 'total',
        engaged: true,
        caret: 2,
        surfaceWidth: null,
        surfaceClamp: null,
      };
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(formulaApi().caches.formula.editorSession).to.equal(null);
    });

    it('clears the session when the commit keyup lands after an async processRowUpdate commit', async () => {
      // With an async processRowUpdate the editor stays mounted and focused
      // after `cellEditStop` (which clears the mirror on the Enter keydown), so
      // the Enter keyup re-writes it — the modes-model prune must clear it once
      // the cell finally leaves edit mode.
      const { user } = await render(
        <Test
          processRowUpdate={async (row) => {
            await new Promise((resolve) => {
              setTimeout(resolve, 10);
            });
            return row;
          }}
        />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      const editable = getEditableByRow(0)!;
      fireEvent.keyDown(editable, { key: 'Enter' });
      fireEvent.keyUp(editable, { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
      });
      expect(formulaApi().caches.formula.editorSession).to.equal(null);
    });

    it('clears the session when a row edit stops (no cellEditStop in row edit mode)', async () => {
      const { user } = await render(<Test editMode="row" />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      expect(formulaApi().caches.formula.editorSession).not.to.equal(null);
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
      });
      expect(formulaApi().caches.formula.editorSession).to.equal(null);
    });

    it('clears the session on a programmatic stopCellEditMode', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      expect(formulaApi().caches.formula.editorSession).not.to.equal(null);
      await act(async () => {
        apiRef.current!.stopCellEditMode({ id: 0, field: 'total' });
      });
      expect(formulaApi().caches.formula.editorSession).to.equal(null);
    });
  });

  describe('floating editor surface', () => {
    const SURFACE_SELECTOR = '.MuiDataGrid-formulaEditorSurface';

    function getSurface() {
      return document.querySelector<HTMLElement>(SURFACE_SELECTOR);
    }

    // The formula column is NOT last here, so the surface's growth has column
    // gridlines to snap to (the price and quantity column edges).
    const growColumns: GridColDef[] = [
      { field: 'item' },
      { field: 'total', type: 'number', allowFormulas: true, editable: true },
      { field: 'price', type: 'number' },
      { field: 'quantity', type: 'number' },
    ];
    const growRows = [{ id: 0, item: 'Apple', total: '=1', price: 2, quantity: 3 }];

    it('opens a dialog surface portaled into the virtual scroller', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      const surface = getSurface()!;
      expect(surface.getAttribute('role')).to.equal('dialog');
      expect(surface.getAttribute('aria-label')).to.equal('total');
      // Portaled into the scroller, NOT the row: the render zone (which contains
      // the rows) is a stacking context (`translate3d`), so a row-portaled surface
      // could never paint above the reference-highlight overlay — a later scroller
      // child. At scroller level the surface's z-index wins.
      expect(surface.parentElement).to.equal(
        document.querySelector('.MuiDataGrid-virtualScroller'),
      );
      expect(surface.closest('[role="row"]')).to.equal(null);
      expect(getCell(0, 3).contains(surface)).to.equal(false);
      // The in-cell anchor advertises the surface.
      const anchor = getCell(0, 3).querySelector('.MuiDataGrid-formulaEditor')!;
      expect(anchor.getAttribute('aria-expanded')).to.equal('true');
      expect(anchor.getAttribute('aria-controls')).to.equal(surface.id);
    });

    it('derives its geometry from grid state as first-paint CSS', async () => {
      // `=1` fits the cell, so the initial content-fit pass leaves the width alone.
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=1' }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      // Position and width are inline styles computed from the column positions in
      // grid state — there is no positioning engine that could move the surface
      // after paint (the popper-based prototype flashed at the row origin until
      // its async transform landed).
      const surface = getSurface()!;
      const columns = apiRef.current!.getVisibleColumns();
      const cellStart =
        columns[0].computedWidth + columns[1].computedWidth + columns[2].computedWidth;
      expect(surface.style.insetInlineStart).to.equal(`${cellStart}px`);
      expect(surface.style.width).to.equal(`${columns[3].computedWidth + 1}px`);
      // Block geometry: content-space row position below the sticky top container
      // (the reference overlay's own coordinate recipe).
      const { dimensions, rowsMeta } = apiRef.current!.state;
      expect(surface.style.top).to.equal(
        `${dimensions.topContainerHeight + rowsMeta.positions[0]}px`,
      );
      // Single-row fixture: the last row's height comes from the page total.
      expect(surface.style.height).to.equal(
        `${rowsMeta.currentPageTotalHeight - rowsMeta.positions[0] + 1}px`,
      );
    });

    it('mirrors the live draft in the in-cell anchor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      setEditableValue(0, 3, '=1 + 2');
      await waitFor(() => {
        expect(getCell(0, 3).querySelector('.MuiDataGrid-formulaEditor')!.textContent).to.equal(
          '=1 + 2',
        );
      });
    });

    it('keeps editing when a mouseup lands inside the surface without a cell mousedown', async () => {
      // The surface is row-portaled, so the grid's document-mouseup focus logic
      // does not recognize it as part of the editing cell — the formula feature's
      // `canUpdateFocus` pipe processor must keep such a mouseup (e.g. a drag
      // released over the editor) from clearing the focus and stopping the edit.
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      fireEvent.mouseUp(getCellEditable(0, 3));
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(formulaApi().caches.formula.editorSession).not.to.equal(null);
    });

    it('opens only the focused cell surface in row edit mode and hands it over on Tab', async () => {
      const columns: GridColDef[] = [
        { field: 'item' },
        { field: 'total', type: 'number', allowFormulas: true, editable: true },
        { field: 'price', type: 'number', allowFormulas: true, editable: true },
        { field: 'quantity', type: 'number' },
      ];
      // Both cells hold formulas so both render the formula editor.
      const rows = [{ id: 0, item: 'Apple', total: '=1 + 1', price: '=2', quantity: 3 }];
      const { user } = await render(<Test editMode="row" rows={rows} columns={columns} />);
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(document.querySelectorAll(SURFACE_SELECTOR)).to.have.length(1);
      });
      expect(getSurface()!.getAttribute('aria-label')).to.equal('total');
      // Tab (handled by the grid's row editing) moves the focus — and with it the
      // single open surface — to the next editable cell.
      fireEvent.keyDown(getCellEditable(0, 1), { key: 'Tab' });
      await waitFor(() => {
        expect(getSurface()!.getAttribute('aria-label')).to.equal('price');
      });
      expect(document.querySelectorAll(SURFACE_SELECTOR)).to.have.length(1);
      // The unfocused formula cell keeps showing its live draft in the anchor.
      expect(getCell(0, 1).querySelector('.MuiDataGrid-formulaEditor')!.textContent).to.equal(
        '=1 + 1',
      );
      // Tab back, dispatched on the currently open editable (the `price` cell's):
      // the `total` editable remounts with the caret at the end.
      fireEvent.keyDown(getSurface()!.querySelector<HTMLElement>('[contenteditable]')!, {
        key: 'Tab',
        shiftKey: true,
      });
      await waitFor(() => {
        expect(getSurface()!.getAttribute('aria-label')).to.equal('total');
      });
      expect(getCaretOffset(getCellEditable(0, 1))).to.equal('=1 + 1'.length);
    });

    it.skipIf(isJSDOM)('overlays the edited cell exactly on entry', async () => {
      // `=1` fits the cell: the surface must be exactly cell-sized at open (a
      // longer seeded formula legitimately opens pre-grown to show it in full).
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=1' }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      // The surface's interior is flush with the cell: its 1px border paints on
      // the gridlines around the cell, so entering the edit shows no jump.
      const cell = getCell(0, 3).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.left - (cell.left - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.top - (cell.top - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.right - cell.right)).to.be.lessThan(1.5);
      expect(Math.abs(surface.bottom - cell.bottom)).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)('grows to the next column gridline and never shrinks', async () => {
      const { user } = await render(<Test rows={growRows} columns={growColumns} />);
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      // `=1` fits: the surface is exactly cell-sized at open.
      const cell = getCell(0, 1).getBoundingClientRect();
      expect(Math.abs(getSurface()!.getBoundingClientRect().right - cell.right)).to.be.lessThan(
        1.5,
      );
      // Overflow the cell: the inline-end border steps to the NEXT column
      // gridline (the surface now covers the whole neighboring cell).
      setEditableValue(0, 1, '=111111111111');
      await waitFor(() => {
        const surface = getSurface()!.getBoundingClientRect();
        expect(
          Math.abs(surface.right - getCell(0, 2).getBoundingClientRect().right),
        ).to.be.lessThan(1.5);
      });
      // The surface paints opaquely over the covered neighbor.
      const covered = getCell(0, 2).getBoundingClientRect();
      const onTop = document.elementFromPoint(covered.left + 5, covered.top + covered.height / 2);
      expect(getSurface()!.contains(onTop)).to.equal(true);
      // Growing further lands on the following gridline.
      setEditableValue(0, 1, '=111111111111111111111111111');
      await waitFor(() => {
        const surface = getSurface()!.getBoundingClientRect();
        expect(
          Math.abs(surface.right - getCell(0, 3).getBoundingClientRect().right),
        ).to.be.lessThan(1.5);
      });
      // Deleting never shrinks the box mid-edit — its edges must not wobble.
      setEditableValue(0, 1, '=1');
      await microtasks();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.right - getCell(0, 3).getBoundingClientRect().right)).to.be.lessThan(
        1.5,
      );
    });

    it.skipIf(isJSDOM)(
      'clamps the growth at the viewport edge and scrolls internally',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        setEditableValue(0, 3, `=${'1'.repeat(60)}`);
        // The single line scrolls inside the clamped surface, keeping the caret
        // visible without scrolling the grid.
        await waitFor(() => {
          const editable = getCellEditable(0, 3);
          expect(editable.scrollWidth).to.be.greaterThan(editable.clientWidth);
        });
        const scroller = document
          .querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!
          .getBoundingClientRect();
        const surface = getSurface()!.getBoundingClientRect();
        expect(surface.right).to.be.lessThan(scroller.right + 1);
        // It still grew as far as the viewport allows.
        expect(surface.right).to.be.greaterThan(getCell(0, 3).getBoundingClientRect().right + 50);
      },
    );

    it.skipIf(isJSDOM)(
      'paints above the reference-highlight rectangles it grows over',
      async () => {
        // The formula references `price`, whose highlight rectangle sits on the
        // cell the surface grows over — the surface must cover the rectangle, not
        // the other way around (regression: the row-portaled surface was trapped
        // in the render zone's stacking context and the overlay painted through
        // the editor).
        const rows = [
          { id: 0, item: 'Apple', total: '=price + 111111111111', price: 2, quantity: 3 },
        ];
        const { user } = await render(<Test rows={rows} columns={growColumns} />);
        await user.dblClick(getCell(0, 1));
        await waitFor(() => {
          expect(getCellEditable(0, 1)).not.to.equal(null);
        });
        // The rectangle over the referenced price cell exists...
        await waitFor(() => {
          expect(
            document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight'),
          ).to.have.length(1);
        });
        // ...and the surface grew over that cell...
        await waitFor(() => {
          const surface = getSurface()!.getBoundingClientRect();
          expect(surface.right).to.be.greaterThan(getCell(0, 2).getBoundingClientRect().left + 20);
        });
        // ...so the topmost element there is the surface, not the overlay rect.
        const covered = getCell(0, 2).getBoundingClientRect();
        const onTop = document.elementFromPoint(
          covered.left + 10,
          covered.top + covered.height / 2,
        );
        expect(getSurface()!.contains(onTop)).to.equal(true);
      },
    );

    it.skipIf(isJSDOM)(
      'reveals the caret at the end of a formula longer than the maximum width on entry',
      async () => {
        // Longer than the whole grid viewport: the surface opens at its clamp and
        // the line scrolls internally. The entry caret goes to the END — and must
        // be scrolled into view (programmatic caret placement gets no native
        // reveal from the browser).
        const longFormula = `=${'1'.repeat(160)}`;
        const { user } = await render(
          <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: longFormula }]} />,
        );
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3).textContent).to.equal(longFormula);
        });
        const editable = getCellEditable(0, 3);
        expect(editable.scrollWidth).to.be.greaterThan(editable.clientWidth);
        expect(getCaretOffset(editable)).to.equal(longFormula.length);
        // The view shows the end of the formula, not the start.
        await waitFor(() => {
          expect(editable.scrollLeft).to.be.greaterThan(
            editable.scrollWidth - editable.clientWidth - 10,
          );
        });
      },
    );

    it.skipIf(isJSDOM)('moves with the row during native scroll (no repositioning)', async () => {
      const manyRows = Array.from({ length: 60 }, (_, index) => ({
        id: index,
        item: `Item ${index}`,
        price: index + 1,
        quantity: 2,
        total: index === 0 ? '=price * quantity' : index + 1,
      }));
      const { user } = await render(
        <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      const topBefore = getCell(0, 3).getBoundingClientRect().top;
      // Scroll synchronously: the surface is a row child in content space, so it
      // moves with the cell in the same frame. A JS-repositioned popup lags here.
      scroller.scrollTop = 30;
      expect(scroller.scrollTop).to.equal(30);
      const cell = getCell(0, 3).getBoundingClientRect();
      // The scroll took effect — the cell really moved (guards a vacuous pass).
      expect(cell.top).to.be.lessThan(topBefore);
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.top - (cell.top - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.left - (cell.left - 1))).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)(
      'hides and disables pointer events while the edited row is out of the render window',
      async () => {
        const manyRows = Array.from({ length: 60 }, (_, index) => ({
          id: index,
          item: `Item ${index}`,
          price: index + 1,
          quantity: 2,
          total: index === 0 ? '=price * quantity' : index + 1,
        }));
        const { user } = await render(
          <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
        );
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        // Open the suggestion popup: unlike the surface, it is body-portaled and
        // inherits neither the row's opacity nor the surface's pointer-events, so
        // it must close explicitly while the row is hidden. The caret must sit at
        // the end of the typed prefix for the suggestion context to see it.
        const editable = getCellEditable(0, 3);
        editable.textContent = '=SU';
        setCaretOffset(editable, 3);
        fireEvent.input(editable);
        await waitFor(() => {
          expect(document.querySelector('[role="listbox"]')).not.to.equal(null);
        });
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        scroller.scrollTop = 1500;
        // The edited row renders as the zero-size virtual-focus row: `opacity: 0`
        // hides the surface with it (focus preserved); the surface additionally
        // drops pointer events so the invisible box cannot swallow clicks, and
        // the suggestion popup closes.
        await waitFor(() => {
          const surface = getSurface();
          expect(surface).not.to.equal(null);
          expect(getComputedStyle(surface!).pointerEvents).to.equal('none');
        });
        const row = document.querySelector<HTMLElement>('[data-id="0"]')!;
        expect(getComputedStyle(row).opacity).to.equal('0');
        expect(document.querySelector('[role="listbox"]')).to.equal(null);
        // Scrolling back restores visibility and interactivity.
        scroller.scrollTop = 0;
        await waitFor(() => {
          expect(getComputedStyle(getSurface()!).pointerEvents).not.to.equal('none');
        });
      },
    );

    it.skipIf(isJSDOM)(
      'reopens at the exact cell position with the grown width when the editing cell remounts',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        // Grow the box, then delete: the box must keep its grown width — across
        // the remount too, via the session mirror (a content-fit remount would
        // shrink it back to the cell width).
        setEditableValue(0, 3, `=${'1'.repeat(40)}`);
        await waitFor(() => {
          expect(getSurface()!.offsetWidth).to.be.greaterThan(
            getCell(0, 3).getBoundingClientRect().width + 50,
          );
        });
        setEditableValue(0, 3, '=19');
        await microtasks();
        const widthBefore = getSurface()!.offsetWidth;
        // Pinning the column mid-edit remounts the editing cell — the same class of
        // remount virtualization causes. The remounted surface must paint at the
        // (now pinned) cell's exact position on its first frame, draft and grown
        // width intact.
        await act(async () => {
          apiRef.current!.setPinnedColumns({ left: ['total'] });
        });
        await waitFor(() => {
          // Pinned left: `total` is now the first column.
          const cell = getCell(0, 0).getBoundingClientRect();
          const surface = getSurface();
          expect(surface).not.to.equal(null);
          const surfaceRect = surface!.getBoundingClientRect();
          expect(Math.abs(surfaceRect.left - (cell.left - 1))).to.be.lessThan(1.5);
          expect(Math.abs(surfaceRect.top - (cell.top - 1))).to.be.lessThan(1.5);
        });
        expect(getCellEditable(0, 0).textContent).to.equal('=19');
        expect(Math.abs(getSurface()!.offsetWidth - widthBefore)).to.be.lessThan(2);
      },
    );

    it.skipIf(isJSDOM)('anchors to the inline start and grows leftward in RTL', async () => {
      const rtlTheme = createTheme({ direction: 'rtl' });
      const { user } = await render(
        <ThemeProvider theme={rtlTheme}>
          <div dir="rtl">
            <Test rows={growRows} columns={growColumns} />
          </div>
        </ThemeProvider>,
      );
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      // The inline start in RTL is the RIGHT edge: the surface pins there and
      // never moves it.
      const cell = getCell(0, 1).getBoundingClientRect();
      expect(
        Math.abs(getSurface()!.getBoundingClientRect().right - (cell.right + 1)),
      ).to.be.lessThan(1.5);
      // Growth extends toward the inline end (leftward), landing on the next
      // column gridline.
      setEditableValue(0, 1, '=111111111111');
      await waitFor(() => {
        const surface = getSurface()!.getBoundingClientRect();
        expect(Math.abs(surface.left - getCell(0, 2).getBoundingClientRect().left)).to.be.lessThan(
          1.5,
        );
      });
      // The RTL clamp: growth stops at the viewport's LEFT edge and the line
      // scrolls internally beyond it.
      setEditableValue(0, 1, `=${'1'.repeat(60)}`);
      await waitFor(() => {
        const editable = getCellEditable(0, 1);
        expect(editable.scrollWidth).to.be.greaterThan(editable.clientWidth);
      });
      const scroller = document
        .querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!
        .getBoundingClientRect();
      expect(getSurface()!.getBoundingClientRect().left).to.be.greaterThan(scroller.left - 1);
    });

    it.skipIf(isJSDOM)('overlays a right-pinned formula cell at its stuck position', async () => {
      // Content is wider than the viewport, so the right-pinned cell's sticky
      // (visual) position diverges from its content-space layout slot — the
      // surface must be measured onto the stuck cell, not the layout slot.
      const wideColumns: GridColDef[] = [
        { field: 'item' },
        { field: 'price', type: 'number' },
        { field: 'quantity', type: 'number' },
        { field: 'extra1' },
        { field: 'extra2' },
        { field: 'total', type: 'number', allowFormulas: true, editable: true },
      ];
      const rows = [
        { id: 0, item: 'Apple', price: 2, quantity: 3, extra1: 'a', extra2: 'b', total: '=1' },
      ];
      const { user } = await render(
        <Test
          rows={rows}
          columns={wideColumns}
          initialState={{ pinnedColumns: { right: ['total'] } }}
        />,
      );
      await user.dblClick(getCell(0, 5));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      const cell = getCell(0, 5).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.left - (cell.left - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.top - (cell.top - 1))).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)('follows a custom row height', async () => {
      const { user } = await render(<Test rowHeight={70} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      const cell = getCell(0, 3).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.height - (cell.height + 1))).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)('stops growing at the right-pinned column seam', async () => {
      const { user } = await render(
        <Test
          rows={growRows}
          columns={growColumns}
          initialState={{ pinnedColumns: { right: ['quantity'] } }}
        />,
      );
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      setEditableValue(0, 1, `=${'1'.repeat(60)}`);
      // The clamp subtracts the pinned section: the surface stops at the seam
      // instead of covering the frozen column.
      await waitFor(() => {
        const editable = getCellEditable(0, 1);
        expect(editable.scrollWidth).to.be.greaterThan(editable.clientWidth);
      });
      const pinned = getCell(0, 3).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(surface.right).to.be.lessThan(pinned.left + 2);
      expect(surface.right).to.be.greaterThan(getCell(0, 1).getBoundingClientRect().right);
    });
  });

  describe('A1 notation', () => {
    const LETTER_CLASS = '.MuiDataGrid-formulaColumnHeaderLetter';
    const ROW_NUMBER_FIELD = '__formula_row_number__';

    // With A1 on, the pinned-left row-number column takes data-colindex 0, so the
    // data columns shift right by one: item=1, price=2, quantity=3, total=4.

    describe('prop off (default)', () => {
      it('should not render the row-number column or header letters', async () => {
        await render(<Test />);
        expect(
          apiRef.current!.getAllColumns().some((column) => column.field === ROW_NUMBER_FIELD),
        ).to.equal(false);
        expect(getColumnHeaderCell(0).querySelector(LETTER_CLASS)).to.equal(null);
        // Unchanged data layout: item is the first column.
        expect(getColumnValues(0)).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
      });
    });

    describe('header letters', () => {
      it('should label data columns A, B, C… and skip the row-number column', async () => {
        await render(<Test formulaA1Notation />);
        // colindex 0 is the row-number column: no letter, empty header.
        expect(getColumnHeaderCell(0).querySelector(LETTER_CLASS)).to.equal(null);
        expect(getColumnHeaderCell(1).querySelector(LETTER_CLASS)!.textContent).to.equal('A');
        expect(getColumnHeaderCell(2).querySelector(LETTER_CLASS)!.textContent).to.equal('B');
        expect(getColumnHeaderCell(3).querySelector(LETTER_CLASS)!.textContent).to.equal('C');
        expect(getColumnHeaderCell(4).querySelector(LETTER_CLASS)!.textContent).to.equal('D');
      });
    });

    describe('row-number column', () => {
      it('should show sequential numbers that stay put after a re-sort', async () => {
        await render(<Test formulaA1Notation />);
        expect(getColumnValues(0)).to.deep.equal(['1', '2', '3']);
        expect(getColumnValues(1)).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        expect(getColumnValues(4)).to.deep.equal(['6', '5', '8']);

        await act(async () => apiRef.current!.setSortModel([{ field: 'total', sort: 'asc' }]));

        // Rows move between the numbers; the numbers themselves never travel.
        expect(getColumnValues(0)).to.deep.equal(['1', '2', '3']);
        expect(getColumnValues(1)).to.deep.equal(['Banana', 'Apple', 'Cherry']);
        expect(getColumnValues(4)).to.deep.equal(['5', '6', '8']);
      });

      it('should match the positions ROW_POSITION resolves to', async () => {
        await render(
          <Test
            formulaA1Notation
            rows={[
              {
                id: 0,
                item: 'Apple',
                price: 2,
                quantity: 3,
                top: '=REF(COLUMN("item"), ROW_POSITION(1))',
              },
              {
                id: 1,
                item: 'Banana',
                price: 1,
                quantity: 5,
                top: '=REF(COLUMN("item"), ROW_POSITION(1))',
              },
            ]}
            columns={[
              { field: 'item' },
              { field: 'price', type: 'number' },
              { field: 'quantity', type: 'number' },
              { field: 'top', allowFormulas: true },
            ]}
          />,
        );
        // Row showing number 1 is Apple, and ROW_POSITION(1) resolves to it.
        expect(getColumnValues(0)).to.deep.equal(['1', '2']);
        expect(getColumnValues(4)).to.deep.equal(['Apple', 'Apple']);

        await act(async () => apiRef.current!.setSortModel([{ field: 'item', sort: 'desc' }]));

        // Number 1 now shows Banana — and ROW_POSITION(1) re-binds to it.
        expect(getColumnValues(0)).to.deep.equal(['1', '2']);
        expect(getColumnValues(1)).to.deep.equal(['Banana', 'Apple']);
        expect(getColumnValues(4)).to.deep.equal(['Banana', 'Banana']);
      });

      it('should be excluded from CSV export', async () => {
        await render(<Test formulaA1Notation />);
        const csv = apiRef.current!.getDataAsCsv();
        // The first column of every row is `item`, not an empty row-number cell.
        expect(csv.split('\n')[1].startsWith('Apple')).to.equal(true);
      });
    });

    describe('entry and storage', () => {
      it('should store an A1 formula as canonical, never as A1', async () => {
        const { user } = await render(<Test formulaA1Notation processRowUpdate={(row) => row} />);
        const cell = getCell(0, 4);
        await user.dblClick(cell);
        setEditableValue(0, 4, '=B1');
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();

        // B = price (column 2), row 1 = id 0 → frozen to the stable reference.
        expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
        expect(getColumnValues(4)).to.deep.equal(['2', '5', '8']);
      });

      it('should keep showing the typed A1 text in the editor, not its canonical form', async () => {
        const { user } = await render(<Test formulaA1Notation processRowUpdate={(row) => row} />);
        const cell = getCell(0, 4);
        await user.dblClick(cell);

        // `valueParser` runs on every keystroke and its result is what the user
        // sees — converting A1→canonical there surfaced `=REF(...)` mid-edit.
        setEditableValue(0, 4, '=A2');
        expect(getCellEditable(0, 4).textContent).to.equal('=A2');

        setEditableValue(0, 4, '=A2 + B1');
        expect(getCellEditable(0, 4).textContent).to.equal('=A2 + B1');

        // The freeze to canonical happens at commit, never before.
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();
        const stored = apiRef.current!.getRow(0).total as string;
        expect(stored).to.contain('REF(');
        expect(stored).not.to.contain('A2');
        expect(stored).not.to.contain('B1');
      });

      it('should seed the editor with the A1 rendering of a stored canonical formula', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            rows={[
              {
                id: 0,
                item: 'Apple',
                price: 2,
                quantity: 3,
                total: '=REF(COLUMN("price"), ROW(0))',
              },
            ]}
          />,
        );
        await user.dblClick(getCell(0, 4));
        await waitFor(() => {
          expect(getCellEditable(0, 4).textContent).to.equal('=B1');
        });
      });

      it('should not re-freeze a stored formula on an unchanged commit', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            processRowUpdate={(row) => row}
            rows={[
              {
                id: 0,
                item: 'Apple',
                price: 2,
                quantity: 3,
                total: '=REF(COLUMN("price"), ROW(0))',
              },
            ]}
          />,
        );
        const cell = getCell(0, 4);
        await user.dblClick(cell);
        await waitFor(() => {
          expect(getCellEditable(0, 4).textContent).to.equal('=B1');
        });
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();

        expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
      });
    });

    describe('paste', () => {
      it('should freeze pasted A1 formulas with the Excel fill offset', async () => {
        const { user } = await render(
          <Test formulaA1Notation cellSelection disableRowSelectionOnClick />,
        );
        const cell = getCell(0, 4);
        await user.click(cell);

        const pasteEvent = new Event('paste');
        // @ts-ignore
        pasteEvent.clipboardData = { getData: () => '=B1\n=B1' };
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
        await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
        });
        // The second target shifted its relative row by +1 → frozen to row id 1.
        expect(apiRef.current!.getRow(1).total).to.equal('=REF(COLUMN("price"), ROW(1))');
        expect(getColumnValues(4)).to.deep.equal(['2', '1', '8']);
      });

      it('should anchor the fill offset to the top-left cell even when it is not a formula', async () => {
        const { user } = await render(
          <Test formulaA1Notation cellSelection disableRowSelectionOnClick />,
        );
        const cell = getCell(0, 4);
        await user.click(cell);

        const pasteEvent = new Event('paste');
        // Top-left target is a plain literal — it never reaches the A1 paste
        // transform, so the offset origin must still be this cell, not the
        // formula one row below it.
        // @ts-ignore
        pasteEvent.clipboardData = { getData: () => '5\n=B1' };
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
        await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal(5);
        });
        // Origin is row 0; the formula one row down freezes to row id 1, not id 0.
        expect(apiRef.current!.getRow(1).total).to.equal('=REF(COLUMN("price"), ROW(1))');
      });
    });

    describe('single-pass policy', () => {
      it('should not re-sort a position-dependent column with the prop on', async () => {
        await render(
          <Test
            formulaA1Notation
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
        // item is colindex 1, posVal colindex 3 (row-number column at 0).
        expect(getColumnValues(3)).to.deep.equal(['20', '10', '30']);

        const sortListener = spy();
        apiRef.current!.subscribeEvent('sortedRowsSet', sortListener);

        await act(async () => apiRef.current!.setSortModel([{ field: 'posVal', sort: 'asc' }]));

        expect(getColumnValues(1)).to.deep.equal(['b', 'a', 'c']);
        expect(getColumnValues(3)).to.deep.equal(['30', '20', '10']);
        expect(sortListener.callCount).to.equal(1);
      });
    });
  });
});
