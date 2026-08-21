import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import { spy } from 'sinon';
import type { SinonSpy } from 'sinon';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi } from '@mui/x-data-grid-premium';
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

describe('<DataGridPremium /> - Formulas feature integration', () => {
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
});
