import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import {
  getCell,
  getColumnHeadersTextContent,
  getColumnValues,
  microtasks,
} from 'test/utils/helperFn';
import type { MockInstance } from 'vitest';
import {
  DataGridPremium,
  useGridApiRef,
  gridClasses,
  gridColumnFieldsSelector,
  gridColumnVisibilityModelSelector,
  gridComputedColumnsSelector,
  gridVisibleColumnFieldsSelector,
} from '@mui/x-data-grid-premium';
import { GRID_FORMULA_FUNCTIONS, formulaFeature } from '@mui/x-data-grid-premium/formula';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import type {
  DataGridPremiumProps,
  GridApi,
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect, afterEach } from 'vitest';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';

const total: GridComputedColumnDefinition = {
  field: 'total',
  headerName: 'Total',
  formula: '=price * quantity',
  type: 'number',
};

const ratio: GridComputedColumnDefinition = {
  field: 'ratio',
  headerName: 'Ratio',
  formula: '=price / quantity',
  type: 'number',
};

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  rows: [
    { id: 0, item: 'Apple', price: 2, quantity: 3 },
    { id: 1, item: 'Banana', price: 10, quantity: 5 },
    { id: 2, item: 'Cherry', price: 4, quantity: 2 },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number' },
    { field: 'quantity', type: 'number' },
  ],
};

describe('<DataGridPremium /> - Computed columns', () => {
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
      <div style={{ width: 800, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  const getColumn = (field: string) => apiRef.current!.getColumn(field)!;
  const getFields = () => gridColumnFieldsSelector(apiRef as RefObject<GridApi>);
  const getColumnValuesOf = (field: string) => getColumnValues(getFields().indexOf(field));

  describe('column', () => {
    it('should add a read-only column after the columns of the `columns` prop', async () => {
      await render(<Test computedColumns={[total]} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['item', 'price', 'quantity', 'ƒxTotal']);
      const column = getColumn('total');
      expect(column.computed).to.equal(true);
      expect(column.editable).to.equal(false);
      expect(column.type).to.equal('number');
      expect(apiRef.current!.isCellEditable(apiRef.current!.getCellParams(0, 'total'))).to.equal(
        false,
      );
    });

    it('should evaluate the formula for every row', async () => {
      await render(<Test computedColumns={[total]} />);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(apiRef.current!.getCellValue(1, 'total')).to.equal(50);
      expect(apiRef.current!.getRowValue(apiRef.current!.getRow(2)!, getColumn('total'))).to.equal(
        8,
      );
    });

    it('should seed the columns from `initialState.computedColumns.model`', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
    });

    it('should use the column type of the definition', async () => {
      await render(
        <Test
          computedColumns={[
            total,
            { field: 'label', headerName: 'Label', formula: '=item & "!"', type: 'string' },
            { field: 'cheap', headerName: 'Cheap', formula: '=price < 5', type: 'boolean' },
          ]}
        />,
      );
      expect(getCell(0, getFields().indexOf('total'))).to.have.class(
        gridClasses['cell--textRight'],
      );
      expect(getCell(0, getFields().indexOf('label'))).to.have.class(gridClasses['cell--textLeft']);
      expect(getColumnValuesOf('label')).to.deep.equal(['Apple!', 'Banana!', 'Cherry!']);
      expect(apiRef.current!.getCellValue(1, 'cheap')).to.equal(false);
      const operators = getColumn('total').filterOperators!.map((op) => op.value);
      expect(operators).to.include('>');
    });

    it('should format numbers with `numberFormat`', async () => {
      await render(
        <Test
          computedColumns={[
            {
              ...total,
              numberFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
            },
          ]}
        />,
      );
      const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });
      expect(getColumnValuesOf('total')).to.deep.equal([6, 50, 8].map((v) => formatter.format(v)));
    });

    it('should mark the computed cells and the error cells with a class', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 4, quantity: 2 },
            { id: 1, price: 4, quantity: 0 },
          ]}
          computedColumns={[ratio]}
        />,
      );
      const index = getFields().indexOf('ratio');
      expect(getColumnValuesOf('ratio')).to.deep.equal(['2', '#DIV/0!']);
      expect(getCell(0, index)).to.have.class(gridClasses['cell--computed']);
      expect(getCell(0, index)).not.to.have.class(gridClasses['cell--computedError']);
      expect(getCell(1, index)).to.have.class(gridClasses['cell--computedError']);
    });

    it('should report a result of the wrong type as `#VALUE!`', async () => {
      await render(
        <Test
          computedColumns={[
            { field: 'wrong', headerName: 'Wrong', formula: '=item', type: 'date' },
            { field: 'text', headerName: 'Text', formula: '=price', type: 'string' },
          ]}
        />,
      );
      expect(getColumnValuesOf('wrong')).to.deep.equal(['#VALUE!', '#VALUE!', '#VALUE!']);
      expect(apiRef.current!.getCellValue(0, 'text')).to.equal('2');
    });

    it('should evaluate formulas that cannot run per row to an error in every row', async () => {
      await render(
        <Test
          computedColumns={[
            { field: 'broken', headerName: 'Broken', formula: '=price *', type: 'number' },
            {
              field: 'range',
              headerName: 'Range',
              formula: '=SUM(COLUMN_VALUES("price"))',
              type: 'number',
            },
            { field: 'missing', headerName: 'Missing', formula: '=unknown + 1', type: 'number' },
          ]}
        />,
      );
      expect(getColumnValuesOf('broken')).to.deep.equal(['#ERROR!', '#ERROR!', '#ERROR!']);
      expect(getColumnValuesOf('range')).to.deep.equal(['#REF!', '#REF!', '#REF!']);
      expect(getColumnValuesOf('missing')).to.deep.equal(['#REF!', '#REF!', '#REF!']);
    });

    it('should apply `computedColDef` without letting it make the column editable', async () => {
      await render(
        <Test
          computedColumns={[total]}
          computedColDef={(definition) => ({
            width: 222,
            editable: true,
            cellClassName: `custom-${definition.field}`,
          })}
        />,
      );
      const column = getColumn('total');
      expect(column.width).to.equal(222);
      expect(column.editable).to.equal(false);
      const cell = getCell(0, getFields().indexOf('total'));
      expect(cell).to.have.class('custom-total');
      expect(cell).to.have.class(gridClasses['cell--computed']);
    });

    it('should skip a definition that uses the field of an existing column and warn', async () => {
      expect(() => {
        originalRender(<Test computedColumns={[{ ...total, field: 'price' }]} />);
      }).toWarnDev([
        'MUI X Data Grid: The computed column "price" uses the field of an existing column',
      ]);
      await microtasks();
      expect(getColumnHeadersTextContent()).to.deep.equal(['item', 'price', 'quantity']);
      expect(getColumnValuesOf('price')).to.deep.equal(['2', '10', '4']);
    });
  });

  describe('model updates', () => {
    it('should add, update and remove the columns with the model', async () => {
      await render(<Test />);
      act(() => apiRef.current!.addComputedColumn(total));
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);

      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=price + quantity' }));
      expect(getColumnValuesOf('total')).to.deep.equal(['5', '15', '6']);

      act(() => apiRef.current!.updateComputedColumn('total', { headerName: 'Sum' }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['item', 'price', 'quantity', 'ƒxSum']);

      act(() => apiRef.current!.removeComputedColumn('total'));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
    });

    it('should follow the controlled model', async () => {
      const { setProps } = await render(<Test computedColumns={[total]} />);
      setProps({ computedColumns: [{ ...total, formula: '=price - quantity' }, ratio] });
      await microtasks();
      expect(getColumnValuesOf('total')).to.deep.equal(['-1', '5', '2']);
      expect(getColumnValuesOf('ratio')).to.deep.equal(['0.667', '2', '2']);
    });

    it('should re-evaluate when a referenced field is updated', async () => {
      await render(<Test computedColumns={[total]} />);
      act(() => apiRef.current!.updateRows([{ id: 0, price: 7 }]));
      expect(getColumnValuesOf('total')).to.deep.equal(['21', '50', '8']);
    });

    it('should keep the identity of `valueGetter` when the formula does not change', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      const valueGetter = getColumn('total').valueGetter;
      act(() => apiRef.current!.updateComputedColumn('total', { headerName: 'Sum' }));
      expect(getColumn('total').valueGetter).to.equal(valueGetter);
      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=price' }));
      expect(getColumn('total').valueGetter).not.to.equal(valueGetter);
    });

    it('should re-evaluate when `formulaFunctions` changes', async () => {
      const definition: GridComputedColumnDefinition = {
        field: 'custom',
        headerName: 'Custom',
        formula: '=BOOST(price)',
        type: 'number',
      };
      const boost = (factor: number) => ({
        ...GRID_FORMULA_FUNCTIONS,
        BOOST: {
          name: 'BOOST',
          minArgs: 1,
          maxArgs: 1,
          apply: (args: any[]) => (args[0] as number) * factor,
        },
      });
      const { setProps } = await render(
        <Test computedColumns={[definition]} formulaFunctions={boost(2) as any} />,
      );
      expect(getColumnValuesOf('custom')).to.deep.equal(['4', '20', '8']);
      setProps({ formulaFunctions: boost(3) });
      await microtasks();
      expect(getColumnValuesOf('custom')).to.deep.equal(['6', '30', '12']);
    });
  });

  describe('references', () => {
    it('should let a computed column reference another computed column', async () => {
      await render(
        <Test
          initialState={{
            computedColumns: {
              model: [
                { field: 'withTax', headerName: 'With tax', formula: '=total * 2', type: 'number' },
                total,
              ],
            },
          }}
        />,
      );
      expect(getColumnValuesOf('withTax')).to.deep.equal(['12', '100', '16']);
      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=price' }));
      expect(getColumnValuesOf('withTax')).to.deep.equal(['4', '20', '8']);
    });

    it('should evaluate circular computed columns to `#CYCLE!`', async () => {
      await render(
        <Test
          computedColumns={[
            { field: 'a', headerName: 'A', formula: '=b + 1', type: 'number' },
            { field: 'b', headerName: 'B', formula: '=a + 1', type: 'number' },
            { field: 'self', headerName: 'Self', formula: '=self', type: 'number' },
          ]}
        />,
      );
      expect(getColumnValuesOf('a')).to.deep.equal(['#CYCLE!', '#CYCLE!', '#CYCLE!']);
      expect(getColumnValuesOf('b')).to.deep.equal(['#CYCLE!', '#CYCLE!', '#CYCLE!']);
      expect(getColumnValuesOf('self')).to.deep.equal(['#CYCLE!', '#CYCLE!', '#CYCLE!']);
    });

    const formulaColumns: DataGridPremiumProps['columns'] = [
      { field: 'price', type: 'number' },
      { field: 'net', type: 'number', allowFormulas: true, editable: true },
    ];

    it('should read the evaluated value of a formula cell and follow its re-evaluation', async () => {
      await render(
        <Test
          columns={formulaColumns}
          rows={[
            { id: 0, price: 2, net: '=price + 1' },
            { id: 1, price: 10, net: '=REF(COLUMN("net"), ROW(0)) * 2' },
          ]}
          computedColumns={[
            { field: 'double', headerName: 'Double', formula: '=net * 2', type: 'number' },
          ]}
        />,
      );
      expect(getColumnValuesOf('double')).to.deep.equal(['6', '12']);

      // Row 1 is not updated: its formula cell changes through its dependency on row 0.
      act(() => apiRef.current!.updateRows([{ id: 0, price: 4 }]));
      expect(getColumnValuesOf('net')).to.deep.equal(['5', '10']);
      expect(getColumnValuesOf('double')).to.deep.equal(['10', '20']);
    });

    it('should let a cell formula reference a computed column and follow its updates', async () => {
      await render(
        <Test
          columns={[
            { field: 'price', type: 'number' },
            { field: 'quantity', type: 'number' },
            { field: 'note', type: 'number', allowFormulas: true, editable: true },
          ]}
          rows={[
            { id: 0, price: 2, quantity: 3, note: '=total + 1' },
            { id: 1, price: 10, quantity: 5, note: '=REF(COLUMN("total"), ROW(0))' },
          ]}
          initialState={{ computedColumns: { model: [total] } }}
        />,
      );
      expect(getColumnValuesOf('note')).to.deep.equal(['7', '6']);

      act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }]));
      expect(getColumnValuesOf('note')).to.deep.equal(['16', '15']);

      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=price + quantity' }));
      expect(getColumnValuesOf('note')).to.deep.equal(['9', '8']);
    });

    describe('errors read by a cell formula', () => {
      const errorColumns: DataGridPremiumProps['columns'] = [
        { field: 'price', type: 'number' },
        { field: 'quantity', type: 'number' },
        { field: 'net', type: 'number', allowFormulas: true, editable: true },
      ];

      it('should let `IFERROR` catch the error of a computed cell', async () => {
        await render(
          <Test
            columns={errorColumns}
            rows={[
              { id: 0, price: 4, quantity: 0, net: '=IFERROR(ratio, 0)' },
              { id: 1, price: 4, quantity: 2, net: '=IFERROR(ratio, 0)' },
            ]}
            computedColumns={[ratio]}
          />,
        );
        expect(getColumnValuesOf('ratio')).to.deep.equal(['#DIV/0!', '2']);
        expect(getColumnValuesOf('net')).to.deep.equal(['0', '2']);

        // The caught error follows the data of the row.
        act(() => apiRef.current!.updateRows([{ id: 0, quantity: 4 }]));
        expect(getColumnValuesOf('net')).to.deep.equal(['1', '2']);
        act(() => apiRef.current!.updateRows([{ id: 1, quantity: 0 }]));
        expect(getColumnValuesOf('net')).to.deep.equal(['1', '0']);
      });

      it('should propagate the error of a computed cell through a range', async () => {
        await render(
          <Test
            columns={errorColumns}
            rows={[
              { id: 0, price: 4, quantity: 2, net: '=SUM(COLUMN_VALUES("ratio"))' },
              { id: 1, price: 4, quantity: 0 },
            ]}
            computedColumns={[ratio]}
          />,
        );
        expect(getColumnValuesOf('net')).to.deep.equal(['#DIV/0!', '']);

        act(() => apiRef.current!.updateRows([{ id: 1, quantity: 4 }]));
        expect(getColumnValuesOf('net')).to.deep.equal(['3', '']);
      });

      it('should let `IFERROR` catch the static error of an invalid computed column', async () => {
        await render(
          <Test
            columns={errorColumns}
            rows={[{ id: 0, price: 4, quantity: 2, net: '=IFERROR(broken, -1)' }]}
            computedColumns={[{ ...ratio, field: 'broken', formula: '=price +' }]}
          />,
        );
        expect(getColumnValuesOf('broken')).to.deep.equal(['#ERROR!']);
        expect(getColumnValuesOf('net')).to.deep.equal(['-1']);
      });

      it('should not treat the text of an error code as an error', async () => {
        await render(
          <Test
            columns={errorColumns}
            rows={[{ id: 0, price: 4, quantity: 2, net: '=IFERROR(label, 0)' }]}
            computedColumns={[
              { field: 'label', headerName: 'Label', formula: '="#DIV/0!"', type: 'string' },
            ]}
          />,
        );
        expect(getColumnValuesOf('label')).to.deep.equal(['#DIV/0!']);
        expect(getColumnValuesOf('net')).to.deep.equal(['#DIV/0!']);
      });

      it('should let `IFERROR` catch the error of another formula cell', async () => {
        await render(
          <Test
            columns={[
              { field: 'price', type: 'number' },
              { field: 'quantity', type: 'number' },
              { field: 'ratio', type: 'number', allowFormulas: true },
              { field: 'net', type: 'number', allowFormulas: true },
            ]}
            rows={[
              {
                id: 0,
                price: 4,
                quantity: 0,
                ratio: '=price / quantity',
                net: '=IFERROR(ratio, 0)',
              },
            ]}
          />,
        );
        expect(getColumnValuesOf('net')).to.deep.equal(['0']);
      });

      it('should let a computed column catch the error of another computed column', async () => {
        await render(
          <Test
            rows={[{ id: 0, item: 'Apple', price: 4, quantity: 0 }]}
            computedColumns={[
              ratio,
              { field: 'safe', headerName: 'Safe', formula: '=IFERROR(ratio, 0)', type: 'number' },
            ]}
          />,
        );
        expect(getColumnValuesOf('safe')).to.deep.equal(['0']);
      });
    });

    it('should not re-evaluate the cell formulas when a column is resized', async () => {
      await render(
        <Test
          columns={formulaColumns}
          rows={[{ id: 0, price: 2, net: '=price + 1' }]}
          computedColumns={[{ ...total, formula: '=price * 2' }]}
        />,
      );
      const listener = vi.fn();
      apiRef.current!.subscribeEvent('formulaEvaluated', listener);
      const valueGetter = getColumn('total').valueGetter;
      act(() => apiRef.current!.setColumnWidth('total', 300));
      act(() => apiRef.current!.setColumnWidth('price', 300));
      expect(listener.mock.calls.length).to.equal(0);
      expect(getColumn('total').valueGetter).to.equal(valueGetter);
      expect(getColumn('total').width).to.equal(300);
    });
  });

  describe('sorting and filtering', () => {
    const rowsWithError = [
      { id: 0, item: 'Apple', price: 6, quantity: 3 },
      { id: 1, item: 'Banana', price: 10, quantity: 0 },
      { id: 2, item: 'Cherry', price: 4, quantity: 4 },
    ];

    it('should sort by the computed values and keep the errors last in both directions', async () => {
      await render(<Test rows={rowsWithError} computedColumns={[ratio]} />);
      act(() => apiRef.current!.sortColumn('ratio', 'asc'));
      expect(getColumnValuesOf('ratio')).to.deep.equal(['1', '2', '#DIV/0!']);
      act(() => apiRef.current!.sortColumn('ratio', 'desc'));
      expect(getColumnValuesOf('ratio')).to.deep.equal(['2', '1', '#DIV/0!']);
    });

    it('should filter with the operators of the type', async () => {
      await render(
        <Test
          rows={rowsWithError}
          computedColumns={[ratio]}
          initialState={{
            filter: {
              filterModel: { items: [{ field: 'ratio', operator: '>', value: '1' }] },
            },
          }}
        />,
      );
      expect(getColumnValuesOf('item')).to.deep.equal(['Apple']);
    });

    it('should not pass the errors to the operators of a date column', async () => {
      await render(
        <Test
          computedColumns={[{ field: 'when', headerName: 'When', formula: '=item', type: 'date' }]}
          initialState={{
            filter: {
              filterModel: { items: [{ field: 'when', operator: 'after', value: '2020-01-01' }] },
            },
          }}
        />,
      );
      expect(getColumnValuesOf('item')).to.deep.equal([]);
    });

    it('should match the quick filter against the values and the error codes', async () => {
      await render(<Test rows={rowsWithError} computedColumns={[ratio]} />);
      act(() => apiRef.current!.setQuickFilterValues(['#DIV']));
      expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
      act(() => apiRef.current!.setQuickFilterValues(['2']));
      expect(getColumnValuesOf('item')).to.deep.equal(['Apple']);
    });
  });

  describe('export and clipboard', () => {
    let writeText: MockInstance<typeof navigator.clipboard.writeText> | undefined;

    afterEach(() => {
      writeText?.mockRestore();
      writeText = undefined;
    });

    it('should export the computed values as CSV', async () => {
      await render(<Test computedColumns={[total]} />);
      expect(apiRef.current!.getDataAsCsv()).to.equal(
        ['item,price,quantity,Total', 'Apple,2,3,6', 'Banana,10,5,50', 'Cherry,4,2,8'].join('\r\n'),
      );
    });

    it('should export the values and the error codes of a date computed column to Excel', async () => {
      await render(
        <Test
          columns={[{ field: 'item' }, { field: 'day', type: 'date' }]}
          rows={[
            { id: 0, item: 'Apple', day: new Date(2024, 0, 15) },
            { id: 1, item: 'Banana', day: 'not a date' },
          ]}
          computedColumns={[{ field: 'when', headerName: 'When', formula: '=day', type: 'date' }]}
          columnVisibilityModel={{ day: false }}
        />,
      );
      const workbook = await apiRef.current!.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];
      expect(worksheet.getCell('B2').value).to.be.instanceOf(Date);
      expect(worksheet.getCell('B3').value).to.equal('#VALUE!');
    });

    it('should copy the computed value', async () => {
      const { user } = await render(
        <Test computedColumns={[total]} cellSelection disableRowSelectionOnClick />,
      );
      writeText = vi.spyOn(navigator.clipboard, 'writeText');
      const cell = getCell(1, getFields().indexOf('total'));
      await user.click(cell);
      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.mock.lastCall?.[0]).to.equal('50');
    });
  });

  describe('aggregation, row grouping and row spanning', () => {
    it('should aggregate a computed column and follow its updates', async () => {
      await render(
        <Test
          initialState={{
            computedColumns: { model: [total] },
            aggregation: { model: { total: 'sum' } },
          }}
        />,
      );
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8', '64']);

      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=price + quantity' }));
      expect(getColumnValuesOf('total')).to.deep.equal(['5', '15', '6', '26']);

      act(() => apiRef.current!.updateRows([{ id: 0, price: 12 }]));
      expect(getColumnValuesOf('total')).to.deep.equal(['15', '15', '6', '36']);
    });

    it('should group the rows by a computed column and leave the group rows blank', async () => {
      await render(
        <Test
          computedColumns={[
            {
              field: 'size',
              headerName: 'Size',
              formula: '=IF(price > 5, "big", "small")',
              type: 'string',
            },
            total,
          ]}
          initialState={{ rowGrouping: { model: ['size'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['small (2)', '', '', 'big (1)', '']);
      expect(getColumnValuesOf('total')).to.deep.equal(['', '6', '8', '', '50']);
    });

    it('should rebuild the groups when the formula of the grouped computed column changes', async () => {
      await render(
        <Test
          initialState={{
            computedColumns: {
              model: [
                {
                  field: 'size',
                  headerName: 'Size',
                  formula: '=IF(price > 5, "big", "small")',
                  type: 'string',
                },
              ],
            },
            rowGrouping: { model: ['size'] },
          }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['small (2)', '', '', 'big (1)', '']);
      act(() =>
        apiRef.current!.updateComputedColumn('size', { formula: '=IF(price > 1, "big", "small")' }),
      );
      expect(getColumnValues(0)).to.deep.equal(['big (3)', '', '', '']);
    });

    it('should rebuild the groups when a formula cell read by the grouped computed column changes', async () => {
      await render(
        <Test
          columns={[
            { field: 'price', type: 'number' },
            { field: 'net', type: 'number', allowFormulas: true, editable: true },
          ]}
          rows={[
            { id: 0, price: 2, net: '=price + 1' },
            { id: 1, price: 10, net: '=REF(COLUMN("net"), ROW(0)) * 5' },
          ]}
          computedColumns={[
            {
              field: 'size',
              headerName: 'Size',
              formula: '=IF(net > 5, "big", "small")',
              type: 'string',
            },
          ]}
          initialState={{ rowGrouping: { model: ['size'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['small (1)', '', 'big (1)', '']);
      // `net` of row 1 goes from 15 to 5 without an update of row 1.
      act(() => apiRef.current!.updateRows([{ id: 0, price: 0 }]));
      expect(getColumnValues(0)).to.deep.equal(['small (2)', '', '']);
    });

    describe('grouping column metadata', () => {
      // The grouping column is built before the computed columns are injected: a
      // record rebuilt without a getter change (name, format) must still reach it.
      const createProbe = () => {
        const apply = vi.fn((args: any[]) => args[0]);
        const PROBE = { name: 'PROBE', minArgs: 1, maxArgs: 1, apply };
        return { apply, functions: { ...GRID_FORMULA_FUNCTIONS, PROBE } as any };
      };
      const double: GridComputedColumnDefinition = {
        field: 'double',
        headerName: 'Double',
        formula: '=PROBE(price) * 2',
        type: 'number',
      };
      const groupedRows = [
        { id: 1, price: 2 },
        { id: 2, price: 3 },
      ];
      const groupedColumns: DataGridPremiumProps['columns'] = [{ field: 'price', type: 'number' }];

      const renderGrouped = async (
        probe: ReturnType<typeof createProbe>,
        props: Partial<DataGridPremiumProps> = {},
      ) => {
        const utils = await render(
          <Test
            rows={groupedRows}
            columns={groupedColumns}
            formulaFunctions={probe.functions}
            initialState={{
              computedColumns: { model: [double] },
              rowGrouping: { model: ['double'] },
            }}
            defaultGroupingExpansionDepth={-1}
            {...props}
          />,
        );
        const counters = {
          columnsChange: 0,
          formulaEvaluated: 0,
          apply: probe.apply.mock.calls.length,
        };
        apiRef.current!.subscribeEvent('columnsChange', () => {
          counters.columnsChange += 1;
        });
        apiRef.current!.subscribeEvent('formulaEvaluated', () => {
          counters.formulaEvaluated += 1;
        });
        return { ...utils, counters };
      };
      const getGroupingHeader = () => getColumnHeadersTextContent()[0];

      it('should rename the grouping column with a name-only edit', async () => {
        const probe = createProbe();
        const { counters } = await renderGrouped(probe);
        expect(getGroupingHeader()).to.equal('Double');
        expect(getColumnValues(0)).to.deep.equal(['4 (1)', '', '6 (1)', '']);

        act(() => apiRef.current!.updateComputedColumn('double', { headerName: 'Renamed' }));
        expect(getGroupingHeader()).to.equal('Renamed');
        expect(getColumnValues(0)).to.deep.equal(['4 (1)', '', '6 (1)', '']);
        // Exactly one extra hydration, no re-evaluation.
        expect(counters.columnsChange).to.equal(2);
        expect(counters.formulaEvaluated).to.equal(0);
        expect(probe.apply.mock.calls.length).to.equal(counters.apply);
      });

      it('should format the group labels with a format-only edit', async () => {
        const probe = createProbe();
        const { counters } = await renderGrouped(probe);

        act(() =>
          apiRef.current!.updateComputedColumn('double', {
            numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
          }),
        );
        expect(getColumnValues(0)).to.deep.equal(['4.00 (1)', '', '6.00 (1)', '']);
        expect(getGroupingHeader()).to.equal('Double');
        expect(counters.columnsChange).to.equal(2);
        expect(counters.formulaEvaluated).to.equal(0);
        expect(probe.apply.mock.calls.length).to.equal(counters.apply);
      });

      it('should follow a name and format edit in the `multiple` grouping column mode', async () => {
        const probe = createProbe();
        const { counters } = await renderGrouped(probe, { rowGroupingColumnMode: 'multiple' });
        expect(getGroupingHeader()).to.equal('Double');
        expect(getColumnValues(0)).to.deep.equal(['4 (1)', '', '6 (1)', '']);

        act(() =>
          apiRef.current!.updateComputedColumn('double', {
            headerName: 'Renamed',
            numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
          }),
        );
        expect(getGroupingHeader()).to.equal('Renamed');
        expect(getColumnValues(0)).to.deep.equal(['4.00 (1)', '', '6.00 (1)', '']);
        expect(counters.columnsChange).to.equal(2);
        expect(counters.formulaEvaluated).to.equal(0);
        expect(probe.apply.mock.calls.length).to.equal(counters.apply);
      });

      it('should keep the grouping column name when only the formula changes', async () => {
        const probe = createProbe();
        const { counters } = await renderGrouped(probe);

        act(() => apiRef.current!.updateComputedColumn('double', { formula: '=PROBE(price) * 3' }));
        expect(getGroupingHeader()).to.equal('Double');
        expect(getColumnValues(0)).to.deep.equal(['6 (1)', '', '9 (1)', '']);
        expect(counters.columnsChange).to.equal(2);
        expect(probe.apply.mock.calls.length).to.be.greaterThan(counters.apply);
      });

      it('should keep the grouping column when the `columns` prop is replaced', async () => {
        const probe = createProbe();
        const { counters, setProps } = await renderGrouped(probe);

        setProps({ columns: [...groupedColumns, { field: 'extra' }] });
        await microtasks();
        expect(getFields()).to.deep.equal([
          '__row_group_by_columns_group__',
          'price',
          'double',
          'extra',
        ]);
        expect(getGroupingHeader()).to.equal('Double');
        expect(getColumnValues(0)).to.deep.equal(['4 (1)', '', '6 (1)', '']);
        // The records did not change, so no extra hydration: two `columnsChange`
        // is what the replacement publishes on its own.
        expect(counters.columnsChange).to.equal(2);
      });
    });

    it('should span the rows of a computed column', async () => {
      await render(
        <Test
          rowSpanning
          rows={[
            { id: 0, price: 2, quantity: 3 },
            { id: 1, price: 3, quantity: 2 },
            { id: 2, price: 4, quantity: 2 },
          ]}
          computedColumns={[total]}
        />,
      );
      const index = getFields().indexOf('total');
      expect(getCell(0, index).style.height).to.equal('calc(var(--height) * 2)');
      expect(getCell(2, index).style.height).to.equal('');
    });
  });

  describe('position', () => {
    it('should insert the column at `columnIndex`', async () => {
      await render(<Test />);
      act(() => apiRef.current!.addComputedColumn(total, { columnIndex: 1 }));
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      act(() => apiRef.current!.addComputedColumn(ratio));
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity', 'ratio']);
    });

    it('should insert the column at `columnIndex` once a controlled model is echoed', async () => {
      function ControlledTest() {
        const [model, setModel] = React.useState<GridComputedColumnsModel>([]);
        return <Test computedColumns={model} onComputedColumnsChange={setModel} />;
      }
      await render(<ControlledTest />);
      await act(async () => apiRef.current!.addComputedColumn(total, { columnIndex: 1 }));
      expect(gridComputedColumnsSelector(apiRef as RefObject<GridApi>)).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
    });

    it('should forget the index of an insertion the parent rejected', async () => {
      const { setProps } = await render(<Test computedColumns={[]} />);
      act(() => apiRef.current!.addComputedColumn(total, { columnIndex: 0 }));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      setProps({ computedColumns: [ratio] });
      await microtasks();
      setProps({ computedColumns: [ratio, total] });
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'ratio', 'total']);
    });

    it('should keep the position and the width when the `columns` prop changes', async () => {
      const { setProps } = await render(<Test />);
      act(() => apiRef.current!.addComputedColumn(total, { columnIndex: 2 }));
      act(() => apiRef.current!.setColumnWidth('total', 321));
      setProps({ columns: [...baselineProps.columns, { field: 'id' }] });
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'total', 'quantity', 'id']);
      expect(getColumn('total').width).to.equal(321);
    });

    it('should apply `columns.orderedFields` of the initial state to the computed columns', async () => {
      await render(
        <Test
          initialState={{
            computedColumns: { model: [total] },
            columns: { orderedFields: ['item', 'total', 'price', 'quantity'] },
          }}
        />,
      );
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
    });

    it('should restore the computed columns before the columns order', async () => {
      await render(<Test />);
      act(() =>
        apiRef.current!.restoreState({
          computedColumns: { model: [total] },
          columns: {
            orderedFields: ['item', 'total', 'price', 'quantity'],
            dimensions: { total: { width: 250 } },
          },
        }),
      );
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(getColumn('total').width).to.equal(250);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
    });

    describe('controlled `restoreState`', () => {
      const getPendingLayout = () => {
        const { pendingColumnIndexes, pendingColumnDimensions } = unwrapPrivateAPI<
          GridPrivateApiPremium,
          GridApi
        >(apiRef.current!).caches.computedColumns;
        return { indexes: pendingColumnIndexes.size, dimensions: pendingColumnDimensions.size };
      };

      function ControlledTest({
        initialModel = [],
        accept = () => true,
        ...props
      }: Partial<DataGridPremiumProps> & {
        initialModel?: GridComputedColumnsModel;
        accept?: (model: GridComputedColumnsModel) => boolean;
      }) {
        const [model, setModel] = React.useState<GridComputedColumnsModel>(initialModel);
        return (
          <Test
            {...props}
            computedColumns={model}
            onComputedColumnsChange={(nextModel) => {
              if (accept(nextModel)) {
                setModel(nextModel);
              }
            }}
          />
        );
      }

      it('should restore the order, the dimensions and the visibility once the parent echoes', async () => {
        await render(<ControlledTest />);
        await act(async () =>
          apiRef.current!.restoreState({
            computedColumns: { model: [total] },
            columns: {
              orderedFields: ['item', 'total', 'price', 'quantity'],
              dimensions: { total: { width: 250, minWidth: 120 } },
              columnVisibilityModel: { total: false },
            },
          }),
        );
        expect(gridComputedColumnsSelector(apiRef as RefObject<GridApi>)).to.deep.equal([total]);
        expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
        expect(getColumn('total').width).to.equal(250);
        expect(getColumn('total').minWidth).to.equal(120);
        expect(getColumn('total').hasBeenResized).to.equal(true);
        expect(gridColumnVisibilityModelSelector(apiRef as RefObject<GridApi>)).to.deep.equal({
          total: false,
        });
        expect(gridVisibleColumnFieldsSelector(apiRef as RefObject<GridApi>)).to.deep.equal([
          'item',
          'price',
          'quantity',
        ]);
        expect(getPendingLayout()).to.deep.equal({ indexes: 0, dimensions: 0 });
      });

      it('should restore into a model that already has computed columns', async () => {
        await render(<ControlledTest initialModel={[ratio]} />);
        expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'ratio']);
        await act(async () =>
          apiRef.current!.restoreState({
            computedColumns: { model: [ratio, total] },
            columns: {
              orderedFields: ['total', 'item', 'ratio', 'price', 'quantity'],
              dimensions: { total: { width: 250 }, ratio: { width: 260 } },
            },
          }),
        );
        expect(getFields()).to.deep.equal(['total', 'item', 'ratio', 'price', 'quantity']);
        expect(getColumn('total').width).to.equal(250);
        expect(getColumn('ratio').width).to.equal(260);
        expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      });

      it('should place two columns whose model order differs from the column order', async () => {
        await render(<ControlledTest />);
        await act(async () =>
          apiRef.current!.restoreState({
            computedColumns: { model: [total, ratio] },
            columns: { orderedFields: ['ratio', 'item', 'total', 'price', 'quantity'] },
          }),
        );
        expect(getFields()).to.deep.equal(['ratio', 'item', 'total', 'price', 'quantity']);
      });

      it('should leave nothing behind when the parent rejects the restored model', async () => {
        await render(
          <ControlledTest accept={(model) => !model.some((item) => item.field === 'total')} />,
        );
        await act(async () =>
          apiRef.current!.restoreState({
            computedColumns: { model: [total] },
            columns: {
              orderedFields: ['total', 'item', 'price', 'quantity'],
              dimensions: { total: { width: 250 } },
            },
          }),
        );
        expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
        expect(getPendingLayout()).to.deep.equal({ indexes: 1, dimensions: 1 });

        await act(async () => apiRef.current!.addComputedColumn(ratio, { columnIndex: 1 }));
        expect(getFields()).to.deep.equal(['item', 'ratio', 'price', 'quantity']);
        expect(getColumn('ratio').hasBeenResized).to.equal(false);
        expect(getPendingLayout()).to.deep.equal({ indexes: 0, dimensions: 0 });
      });

      it('should not give the dimensions of a rejected restore to a later insertion of the field', async () => {
        let acceptTotal = false;
        await render(
          <ControlledTest
            accept={(model) => acceptTotal || !model.some((item) => item.field === 'total')}
          />,
        );
        await act(async () =>
          apiRef.current!.restoreState({
            computedColumns: { model: [total] },
            columns: {
              orderedFields: ['total', 'item', 'price', 'quantity'],
              dimensions: { total: { width: 250 } },
            },
          }),
        );
        expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);

        acceptTotal = true;
        await act(async () => apiRef.current!.addComputedColumn(total));
        expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
        expect(getColumn('total').width).not.to.equal(250);
        expect(getColumn('total').hasBeenResized).to.equal(false);
      });

      it('should restore the state exported by an uncontrolled grid', async () => {
        const { unmount } = await render(
          <Test initialState={{ computedColumns: { model: [total, ratio] } }} />,
        );
        act(() => apiRef.current!.setColumnIndex('total', 1));
        act(() => apiRef.current!.setColumnWidth('total', 333));
        act(() => apiRef.current!.setColumnVisibility('ratio', false));
        const exportedState = apiRef.current!.exportState();
        expect(exportedState.columns!.dimensions!.total).to.include({ width: 333, maxWidth: -1 });
        unmount();

        await render(<ControlledTest />);
        await act(async () => apiRef.current!.restoreState(exportedState));
        expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity', 'ratio']);
        expect(getColumn('total').width).to.equal(333);
        expect(getColumn('total').maxWidth).to.equal(Infinity);
        expect(gridVisibleColumnFieldsSelector(apiRef as RefObject<GridApi>)).to.deep.equal([
          'item',
          'total',
          'price',
          'quantity',
        ]);
        expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      });
    });
  });

  describe('gates', () => {
    it('should not add the columns with `disableComputedColumns` and add them back when it is lifted', async () => {
      const { setProps } = await render(<Test computedColumns={[total]} disableComputedColumns />);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      setProps({ disableComputedColumns: false });
      await microtasks();
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      setProps({ disableFormulas: true });
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
    });

    it('should not add the columns with `dataSource` and warn', async () => {
      const dataSource = {
        getRows: async () => ({ rows: baselineProps.rows as any[], rowCount: 3 }),
      };
      expect(() => {
        originalRender(<Test rows={undefined} dataSource={dataSource} computedColumns={[total]} />);
      }).toWarnDev([
        'MUI X Data Grid: Computed columns are not supported with the `dataSource` prop.',
      ]);
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
    });

    it('should remove the columns while pivoting is active and warn', async () => {
      let setProps: (props: Partial<DataGridPremiumProps>) => void;
      expect(() => {
        ({ setProps } = originalRender(
          <Test
            computedColumns={[total]}
            pivotModel={{
              rows: [{ field: 'item' }],
              columns: [],
              values: [{ field: 'price', aggFunc: 'sum' }],
            }}
            pivotActive
          />,
        ));
      }).toWarnDev([
        'MUI X Data Grid: Computed columns are not supported while pivoting is active.',
      ]);
      await microtasks();
      expect(getFields()).not.to.include('total');

      setProps!({ pivotActive: false });
      await microtasks();
      expect(getFields()).to.include('total');
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
    });
  });
});
