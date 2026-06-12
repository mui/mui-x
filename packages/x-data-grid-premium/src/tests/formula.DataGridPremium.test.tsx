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

    it('should report positional references as not supported yet', async () => {
      await render(
        <Test
          rows={[{ id: 0, price: 2, total: '=REF(COLUMN("price"), ROW_POSITION(1))' }]}
          columns={[
            { field: 'price', type: 'number' },
            { field: 'total', type: 'number', allowFormulas: true },
          ]}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['#REF!']);
      const result = apiRef.current!.getCellFormulaResult(0, 'total');
      expect(result?.type).to.equal('error');
      expect(result?.type === 'error' && result.message).to.include('not supported yet');
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
