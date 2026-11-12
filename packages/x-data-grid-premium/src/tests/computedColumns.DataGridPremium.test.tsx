import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, screen } from '@mui/internal-test-utils';
import {
  getCell,
  getColumnHeaderCell,
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
  getGridDateOperators,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { GRID_FORMULA_FUNCTIONS, formulaFeature } from '@mui/x-data-grid-premium/formula';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import type {
  DataGridPremiumProps,
  GridApi,
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridSortCellParams,
  GridSortModel,
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
  // Clicks a cell without the timers of `user`. The grid focuses the cell it saw on mouse down when
  // the mouse goes up; `focus()` stands in for the focus move of a native mouse down.
  const clickCell = async (cell: HTMLElement) => {
    fireEvent.mouseDown(cell);
    await act(async () => cell.focus());
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
  };

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

    it('should report a `NaN`, an infinite number or an invalid date passed through as `#VALUE!`', async () => {
      await render(
        <Test
          columns={[
            { field: 'amount', type: 'number' },
            { field: 'day', type: 'date' },
          ]}
          rows={[
            { id: 0, amount: 5, day: new Date(2024, 0, 2) },
            { id: 1, amount: Number.NaN, day: new Date('garbage') },
            { id: 2, amount: Number.POSITIVE_INFINITY, day: null },
            { id: 3, amount: 1, day: null },
          ]}
          computedColumns={[
            {
              field: 'pass',
              headerName: 'Pass',
              formula: '=amount',
              type: 'number',
              numberFormat: { style: 'currency', currency: 'USD' },
            },
            { field: 'when', headerName: 'When', formula: '=day', type: 'date' },
          ]}
        />,
      );
      expect(getColumnValuesOf('pass')).to.deep.equal(['$5.00', '#VALUE!', '#VALUE!', '$1.00']);
      expect(getColumnValuesOf('when')).to.deep.equal(['1/2/2024', '#VALUE!', '', '']);
      // The number comparator never sees `NaN`: the order stays consistent.
      act(() => apiRef.current!.sortColumn('pass', 'asc'));
      expect(getColumnValuesOf('pass')).to.deep.equal(['$1.00', '$5.00', '#VALUE!', '#VALUE!']);
      act(() => apiRef.current!.sortColumn('pass', 'desc'));
      expect(getColumnValuesOf('pass')).to.deep.equal(['$5.00', '$1.00', '#VALUE!', '#VALUE!']);
    });

    it('should render a text result equal to an error code as text', async () => {
      await render(
        <Test
          rows={[
            { id: 0, price: 4, quantity: 0 },
            { id: 1, price: 4, quantity: 2 },
          ]}
          computedColumns={[
            ratio,
            { field: 'label', headerName: 'Label', formula: '="#DIV/0!"', type: 'string' },
          ]}
        />,
      );
      const ratioIndex = getFields().indexOf('ratio');
      const labelIndex = getFields().indexOf('label');
      expect(getColumnValuesOf('label')).to.deep.equal(['#DIV/0!', '#DIV/0!']);
      expect(getCell(0, ratioIndex)).to.have.class(gridClasses['cell--computedError']);
      expect(getCell(0, ratioIndex).querySelector('[title]')).not.to.equal(null);
      expect(getCell(0, labelIndex)).to.have.class(gridClasses['cell--computed']);
      expect(getCell(0, labelIndex)).not.to.have.class(gridClasses['cell--computedError']);
      expect(getCell(0, labelIndex).querySelector('[title]')).to.equal(null);
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

    it('should apply `computedColDef` without letting it make the column editable, and warn', async () => {
      expect(() => {
        originalRender(
          <Test
            computedColumns={[total]}
            // @ts-expect-error `GridComputedColDefOverrides` leaves `editable` out: JavaScript only
            computedColDef={(definition) => ({
              width: 222,
              editable: true,
              cellClassName: `custom-${definition.field}`,
            })}
          />,
        );
      }).toWarnDev([
        'MUI X Data Grid: The `editable` property of `computedColDef` is ignored: the cells of a computed column are never editable.\n' +
          'To prevent users from editing a computed column, set `editable: false` on its definition in the `computedColumns` model.\n' +
          'See https://mui.com/x/react-data-grid/computed-columns/#prevent-changes',
      ]);
      await microtasks();
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

    it('should skip a definition whose field is a member of `Object.prototype`, warn and report it', async () => {
      expect(() => {
        originalRender(<Test computedColumns={[{ ...total, field: 'constructor' }]} />);
      }).toWarnDev([
        'MUI X Data Grid: The computed column "constructor" uses a reserved field name',
      ]);
      await microtasks();
      expect(getColumnHeadersTextContent()).to.deep.equal(['item', 'price', 'quantity']);
      expect(
        unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!).getComputedColumnIssues!(
          'constructor',
        ).map((issue) => issue.code),
      ).to.deep.equal(['fieldInvalid']);
    });
  });

  describe('computedColDef overrides', () => {
    // `margin` divides by zero for Keyboard; `shipped` reads a number for Monitor.
    const sampleProps: Partial<DataGridPremiumProps> = {
      rows: [
        { id: 1, product: 'Keyboard', price: 40, quantity: 3, shippedAt: new Date(2026, 0, 12) },
        { id: 2, product: 'Mouse', price: 25, quantity: 10, shippedAt: new Date(2026, 1, 3) },
        { id: 3, product: 'Monitor', price: 220, quantity: 2, shippedAt: 42 },
        { id: 4, product: 'Cable', price: 5, quantity: 50, shippedAt: new Date(2026, 2, 21) },
        { id: 5, product: 'Dock', price: 130, quantity: 1, shippedAt: new Date(2026, 3, 8) },
      ],
      columns: [
        { field: 'product' },
        { field: 'price', type: 'number' },
        { field: 'quantity', type: 'number' },
        // Not a date column: the date formatter of the grid throws on the number of Monitor.
        { field: 'shippedAt' },
      ],
      columnVisibilityModel: { shippedAt: false },
    };
    const margin: GridComputedColumnDefinition = {
      field: 'margin',
      headerName: 'Margin',
      formula: '=price / (quantity - 3)',
      type: 'number',
    };
    const shipped: GridComputedColumnDefinition = {
      field: 'shipped',
      headerName: 'Shipped',
      formula: '=shippedAt',
      type: 'date',
    };
    // Mouse has no date: the null checks tell it apart from the error of Monitor.
    const rowsWithEmptyDate = sampleProps.rows!.map((row) =>
      row.id === 2 ? { ...row, shippedAt: null } : row,
    );
    const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
    const formatDate = (value: Date) => dateFormat.format(value);
    const formattedDates = [
      'Jan 12, 2026',
      'Feb 3, 2026',
      '#VALUE!',
      'Mar 21, 2026',
      'Apr 8, 2026',
    ];
    const isErrorCode = (value: unknown) =>
      typeof value === 'string' && value.startsWith('#') && value.endsWith('!');
    // `shippedAt` is hidden: the cells are found by their visible column index.
    const getVisibleIndex = (field: string) =>
      gridVisibleColumnFieldsSelector(apiRef as RefObject<GridApi>).indexOf(field);
    const getVisibleValuesOf = (field: string) => getColumnValues(getVisibleIndex(field));
    const receivedCodes = (spy: { mock: { calls: unknown[][] } }, argCount: number) =>
      spy.mock.calls.some((args) => args.slice(0, argCount).some(isErrorCode));

    it('should sort with a `sortComparator` override and keep the errors last', async () => {
      const sortComparator = vi.fn((value1: number, value2: number) => value2 - value1);
      await render(
        <Test {...sampleProps} computedColumns={[margin]} computedColDef={{ sortComparator }} />,
      );
      act(() => apiRef.current!.sortColumn('margin', 'asc'));
      expect(getVisibleValuesOf('product')).to.deep.equal([
        'Mouse',
        'Cable',
        'Dock',
        'Monitor',
        'Keyboard',
      ]);
      act(() => apiRef.current!.sortColumn('margin', 'desc'));
      expect(getVisibleValuesOf('product')).to.deep.equal([
        'Monitor',
        'Dock',
        'Cable',
        'Mouse',
        'Keyboard',
      ]);
      expect(sortComparator.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(sortComparator, 2)).to.equal(false);
    });

    it('should sort with a `getSortComparator` override and keep the errors last', async () => {
      const comparator = vi.fn((value1: number, value2: number) => value2 - value1);
      await render(
        <Test
          {...sampleProps}
          computedColumns={[margin]}
          computedColDef={{
            getSortComparator: (direction) =>
              direction === 'asc' ? comparator : (value1, value2) => -comparator(value1, value2),
          }}
        />,
      );
      act(() => apiRef.current!.sortColumn('margin', 'asc'));
      expect(getVisibleValuesOf('product')).to.deep.equal([
        'Mouse',
        'Cable',
        'Dock',
        'Monitor',
        'Keyboard',
      ]);
      act(() => apiRef.current!.sortColumn('margin', 'desc'));
      expect(getVisibleValuesOf('product')).to.deep.equal([
        'Monitor',
        'Dock',
        'Cable',
        'Mouse',
        'Keyboard',
      ]);
      expect(comparator.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(comparator, 2)).to.equal(false);
    });

    it('should render the errors without passing them to a `valueFormatter` override', async () => {
      const valueFormatter = vi.fn(formatDate);
      await render(
        <Test {...sampleProps} computedColumns={[shipped]} computedColDef={{ valueFormatter }} />,
      );
      expect(getVisibleValuesOf('shipped')).to.deep.equal(formattedDates);
      const errorCell = getCell(2, getVisibleIndex('shipped'));
      expect(errorCell).to.have.class(gridClasses['cell--computedError']);
      expect(errorCell.querySelector('[title]')).not.to.equal(null);
      expect(valueFormatter.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(valueFormatter, 1)).to.equal(false);
    });

    describe('export and clipboard', () => {
      let writeText: MockInstance<typeof navigator.clipboard.writeText> | undefined;

      afterEach(() => {
        writeText?.mockRestore();
        writeText = undefined;
      });

      it('should export and copy the values formatted by a `valueFormatter` override and the error codes', async () => {
        const valueFormatter = vi.fn(formatDate);
        await render(
          <Test
            {...sampleProps}
            computedColumns={[shipped]}
            computedColDef={{ valueFormatter }}
            cellSelection
            disableRowSelectionOnClick
          />,
        );
        expect(apiRef.current!.getDataAsCsv({ fields: ['product', 'shipped'] })).to.equal(
          [
            'product,Shipped',
            'Keyboard,"Jan 12, 2026"',
            'Mouse,"Feb 3, 2026"',
            'Monitor,#VALUE!',
            'Cable,"Mar 21, 2026"',
            'Dock,"Apr 8, 2026"',
          ].join('\r\n'),
        );

        writeText = vi.spyOn(navigator.clipboard, 'writeText');
        const shippedIndex = getVisibleIndex('shipped');
        await clickCell(getCell(0, shippedIndex));
        fireEvent.keyDown(getCell(0, shippedIndex), { key: 'c', keyCode: 67, ctrlKey: true });
        expect(writeText.mock.lastCall?.[0]).to.equal('Jan 12, 2026');
        await clickCell(getCell(2, shippedIndex));
        fireEvent.keyDown(getCell(2, shippedIndex), { key: 'c', keyCode: 67, ctrlKey: true });
        expect(writeText.mock.lastCall?.[0]).to.equal('#VALUE!');

        // Excel keeps the dates as dates.
        const workbook = await apiRef.current!.getDataAsExcel({ fields: ['product', 'shipped'] });
        const worksheet = workbook!.worksheets[0];
        expect(worksheet.getCell('B2').value).to.be.instanceOf(Date);
        expect(worksheet.getCell('B4').value).to.equal('#VALUE!');

        expect(receivedCodes(valueFormatter, 1)).to.equal(false);
      });
    });

    it('should format with a `valueFormatter` override instead of `numberFormat`', async () => {
      await render(
        <Test
          {...sampleProps}
          computedColumns={[{ ...margin, numberFormat: { style: 'currency', currency: 'USD' } }]}
          computedColDef={{ valueFormatter: (value: number) => `${value.toFixed(1)} units` }}
        />,
      );
      expect(getVisibleValuesOf('margin')).to.deep.equal([
        '#DIV/0!',
        '3.6 units',
        '-220.0 units',
        '0.1 units',
        '-65.0 units',
      ]);
    });

    it('should render the errors with the error cell instead of a `renderCell` override', async () => {
      await render(
        <Test
          {...sampleProps}
          computedColumns={[
            shipped,
            { field: 'label', headerName: 'Label', formula: '="#VALUE!"', type: 'string' },
          ]}
          computedColDef={(definition) => ({
            renderCell: (params) => (
              <span className="custom-cell">
                {definition.type === 'date'
                  ? (params.value as Date).toLocaleDateString('en-US')
                  : String(params.value)}
              </span>
            ),
          })}
        />,
      );
      const shippedIndex = getVisibleIndex('shipped');
      const labelIndex = getVisibleIndex('label');
      expect(getCell(0, shippedIndex).querySelector('.custom-cell')).to.have.text('1/12/2026');
      const errorCell = getCell(2, shippedIndex);
      expect(errorCell.querySelector('.custom-cell')).to.equal(null);
      expect(errorCell).to.have.class(gridClasses['cell--computedError']);
      expect(errorCell.querySelector('[title]')).not.to.equal(null);
      expect(errorCell).to.have.text('#VALUE!');
      // A text result that reads like an error code is not an error.
      expect(getCell(2, labelIndex).querySelector('.custom-cell')).to.have.text('#VALUE!');
    });

    it('should not pass the errors to the `filterOperators` override', async () => {
      const receivedValues: unknown[] = [];
      const filterOperators = getGridDateOperators().map((operator) => ({
        ...operator,
        getApplyFilterFn: (
          filterItem: Parameters<typeof operator.getApplyFilterFn>[0],
          column: Parameters<typeof operator.getApplyFilterFn>[1],
        ) => {
          const applyFilterFn = operator.getApplyFilterFn(filterItem, column);
          if (!applyFilterFn) {
            return applyFilterFn;
          }
          return (...args: Parameters<typeof applyFilterFn>) => {
            receivedValues.push(args[0]);
            return applyFilterFn(...args);
          };
        },
      }));
      await render(
        <Test {...sampleProps} computedColumns={[shipped]} computedColDef={{ filterOperators }} />,
      );
      act(() =>
        apiRef.current!.setFilterModel({
          items: [{ field: 'shipped', operator: 'after', value: '2026-02-01' }],
        }),
      );
      expect(getVisibleValuesOf('product')).to.deep.equal(['Mouse', 'Cable', 'Dock']);
      expect(receivedValues.length).to.be.greaterThan(0);
      expect(receivedValues.some(isErrorCode)).to.equal(false);

      // The null checks count the errors as values.
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'shipped', operator: 'isNotEmpty' }] }),
      );
      expect(getVisibleValuesOf('product')).to.deep.equal([
        'Keyboard',
        'Mouse',
        'Monitor',
        'Cable',
        'Dock',
      ]);
    });

    it('should not pass the errors to an `isEmpty` override', async () => {
      const applyIsEmpty = vi.fn(
        (value: Date | null) => value == null || Number.isNaN(value.getTime()),
      );
      const filterOperators = getGridDateOperators().map((operator) =>
        operator.value === 'isEmpty'
          ? { ...operator, getApplyFilterFn: () => applyIsEmpty }
          : operator,
      );
      await render(
        <Test
          {...sampleProps}
          rows={rowsWithEmptyDate}
          computedColumns={[shipped]}
          computedColDef={{ filterOperators }}
        />,
      );
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'shipped', operator: 'isEmpty' }] }),
      );
      expect(getVisibleValuesOf('product')).to.deep.equal(['Mouse']);
      expect(applyIsEmpty.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(applyIsEmpty, 1)).to.equal(false);
    });

    it('should not pass the errors to an `isNotEmpty` override', async () => {
      const applyIsNotEmpty = vi.fn(
        (value: Date | null) => value != null && !Number.isNaN(value.getTime()),
      );
      const filterOperators = getGridDateOperators().map((operator) =>
        operator.value === 'isNotEmpty'
          ? { ...operator, getApplyFilterFn: () => applyIsNotEmpty }
          : operator,
      );
      await render(
        <Test
          {...sampleProps}
          rows={rowsWithEmptyDate}
          computedColumns={[shipped]}
          computedColDef={{ filterOperators }}
        />,
      );
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'shipped', operator: 'isNotEmpty' }] }),
      );
      expect(getVisibleValuesOf('product')).to.deep.equal(['Keyboard', 'Monitor', 'Cable', 'Dock']);
      expect(applyIsNotEmpty.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(applyIsNotEmpty, 1)).to.equal(false);
    });

    it('should count the errors as values for the `isEmpty` and `isNotEmpty` operators of a date column', async () => {
      await render(<Test {...sampleProps} rows={rowsWithEmptyDate} computedColumns={[shipped]} />);
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'shipped', operator: 'isEmpty' }] }),
      );
      expect(getVisibleValuesOf('product')).to.deep.equal(['Mouse']);
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'shipped', operator: 'isNotEmpty' }] }),
      );
      expect(getVisibleValuesOf('product')).to.deep.equal(['Keyboard', 'Monitor', 'Cable', 'Dock']);
    });

    it('should match the error codes without passing them to a `getApplyQuickFilterFn` override', async () => {
      const applyQuickFilter = vi.fn(
        (value: unknown, search: number) =>
          typeof value === 'number' && Math.round(value) === search,
      );
      await render(
        <Test
          {...sampleProps}
          computedColumns={[margin]}
          computedColDef={{
            getApplyQuickFilterFn: (search) => {
              const searchNumber = Number(search);
              if (search === '' || Number.isNaN(searchNumber)) {
                return null;
              }
              return (value) => applyQuickFilter(value, searchNumber);
            },
          }}
        />,
      );
      act(() => apiRef.current!.setQuickFilterValues(['#DIV']));
      expect(getVisibleValuesOf('product')).to.deep.equal(['Keyboard']);
      act(() => apiRef.current!.setQuickFilterValues(['-65']));
      expect(getVisibleValuesOf('product')).to.deep.equal(['Dock']);
      expect(applyQuickFilter.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(applyQuickFilter, 1)).to.equal(false);
    });

    it('should not pass the errors to the `sortComparator` override when grouping by the column', async () => {
      const sortComparator = vi.fn((value1: number, value2: number) => value2 - value1);
      await render(
        <Test
          {...sampleProps}
          computedColumns={[
            {
              field: 'bucket',
              headerName: 'Bucket',
              formula: '=IF(price > 100, 1, IF(price > 20, 2, 1 / 0))',
              type: 'number',
            },
          ]}
          computedColDef={{ sortComparator }}
          initialState={{
            rowGrouping: { model: ['bucket'] },
            sorting: {
              sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'asc' }],
            },
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['2 (2)', '1 (2)', '#DIV/0! (1)']);
      expect(sortComparator.mock.calls.length).to.be.greaterThan(0);
      expect(receivedCodes(sortComparator, 2)).to.equal(false);
    });

    it('should render a group of errors as text instead of calling the `renderCell` override', async () => {
      const renderCell = vi.fn((params: { value?: unknown }) => (
        <span className="custom-cell">{(params.value as number).toFixed(1)}</span>
      ));
      await render(
        <Test
          {...sampleProps}
          computedColumns={[
            {
              field: 'bucket',
              headerName: 'Bucket',
              formula: '=IF(price > 100, 1, IF(price > 20, 2, 1 / 0))',
              type: 'number',
            },
          ]}
          computedColDef={{ renderCell }}
          initialState={{ rowGrouping: { model: ['bucket'] } }}
          // The cells of the column itself receive `null` on the group rows, like any column.
          columnVisibilityModel={{ shippedAt: false, bucket: false }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['2.0 (2)', '1.0 (2)', '#DIV/0! (1)']);
      expect(renderCell.mock.calls.some(([params]) => isErrorCode(params.value))).to.equal(false);
    });

    it('should pass a text result equal to an error code to the `valueFormatter` override of a `string` column', async () => {
      const valueFormatter = vi.fn((value: string) => `<${value}>`);
      await render(
        <Test
          {...sampleProps}
          computedColumns={[
            { field: 'label', headerName: 'Label', formula: '="#VALUE!"', type: 'string' },
            {
              field: 'status',
              headerName: 'Status',
              formula: '=IF(quantity = 3, 1 / 0, "ok")',
              type: 'string',
            },
          ]}
          computedColDef={{ valueFormatter }}
        />,
      );
      expect(getVisibleValuesOf('label')).to.deep.equal(Array(5).fill('<#VALUE!>'));
      expect(getVisibleValuesOf('status')).to.deep.equal([
        '#DIV/0!',
        '<ok>',
        '<ok>',
        '<ok>',
        '<ok>',
      ]);
      expect(valueFormatter.mock.calls.some(([value]) => value === '#DIV/0!')).to.equal(false);
    });
  });

  describe('computedColDef changes', () => {
    const getRecordColDef = (field: string) =>
      unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(
        apiRef.current!,
      ).caches.formula!.computedColumns.records.get(field)!.colDef;
    const getHeader = (field: string) => getColumnHeaderCell(getFields().indexOf(field));
    const subscribeColumnsChange = () => {
      const columnsChange = vi.fn();
      apiRef.current!.subscribeEvent('columnsChange', columnsChange);
      return columnsChange;
    };

    it('should apply a new `computedColDef` right away', async () => {
      const { setProps } = await render(
        <Test computedColumns={[total]} computedColDef={{ width: 100 }} />,
      );
      expect(getColumn('total').width).to.equal(100);

      setProps({ computedColDef: { width: 350, headerAlign: 'center' } });
      await microtasks();
      expect(getColumn('total').width).to.equal(350);
      expect(getHeader('total')).to.have.class(gridClasses['columnHeader--alignCenter']);

      setProps({ computedColDef: { width: 100 } });
      await microtasks();
      expect(getColumn('total').width).to.equal(100);
      expect(getHeader('total')).not.to.have.class(gridClasses['columnHeader--alignCenter']);
    });

    it('should not re-create the columns for an inline object with the same content', async () => {
      const { setProps } = await render(
        <Test computedColumns={[total]} computedColDef={{ width: 120 }} />,
      );
      const colDef = getRecordColDef('total');
      const columnsChange = subscribeColumnsChange();

      setProps({ computedColDef: { width: 120 } });
      await microtasks();
      expect(columnsChange).toHaveBeenCalledTimes(0);

      // An unrelated hydration keeps the column built from the same overrides.
      act(() => apiRef.current!.updateColumns([{ field: 'item', width: 80 }]));
      expect(getRecordColDef('total')).to.equal(colDef);
    });

    it('should not re-create the columns for a function returning the same content', async () => {
      const { setProps } = await render(
        <Test
          computedColumns={[total, ratio]}
          computedColDef={(definition) => ({ width: 120, description: definition.field })}
        />,
      );
      const colDef = getRecordColDef('total');
      const columnsChange = subscribeColumnsChange();

      setProps({
        computedColDef: (definition: GridComputedColumnDefinition) => ({
          width: 120,
          description: definition.field,
        }),
      });
      await microtasks();
      expect(columnsChange).toHaveBeenCalledTimes(0);

      act(() => apiRef.current!.updateColumns([{ field: 'item', width: 80 }]));
      expect(getRecordColDef('total')).to.equal(colDef);
    });

    it('should only re-create the columns whose overrides changed', async () => {
      const { setProps } = await render(
        <Test computedColumns={[total, ratio]} computedColDef={() => ({ width: 120 })} />,
      );
      const ratioColDef = getRecordColDef('ratio');

      setProps({
        computedColDef: (definition: GridComputedColumnDefinition) => ({
          width: definition.field === 'total' ? 300 : 120,
        }),
      });
      await microtasks();
      expect(getColumn('total').width).to.equal(300);
      expect(getColumn('ratio').width).to.equal(120);
      expect(getRecordColDef('ratio')).to.equal(ratioColDef);
    });

    it('should resolve the overrides again when only the `editable` flag of a definition changes', async () => {
      const computedColDef = (definition: GridComputedColumnDefinition) => ({
        headerClassName:
          definition.field === 'total' && definition.editable === false ? 'locked' : 'open',
      });
      await render(
        <Test
          initialState={{ computedColumns: { model: [total, ratio] } }}
          computedColDef={computedColDef}
        />,
      );
      expect(getHeader('total')).to.have.class('open');

      act(() => apiRef.current!.updateComputedColumn('total', { editable: false }));
      expect(getHeader('total')).to.have.class('locked');

      // A flag change that resolves to the same overrides keeps the column.
      const ratioColDef = getRecordColDef('ratio');
      act(() => apiRef.current!.updateComputedColumn('ratio', { editable: false }));
      expect(getRecordColDef('ratio')).to.equal(ratioColDef);

      act(() => apiRef.current!.updateComputedColumn('total', { editable: undefined }));
      expect(getHeader('total')).to.have.class('open');
    });

    it('should not hydrate the columns without computed columns and apply the prop to the next one', async () => {
      const { setProps } = await render(<Test computedColDef={{ width: 120 }} />);
      const columnsChange = subscribeColumnsChange();

      setProps({ computedColDef: { width: 300 } });
      await microtasks();
      expect(columnsChange).toHaveBeenCalledTimes(0);

      act(() => apiRef.current!.addComputedColumn(total));
      expect(getColumn('total').width).to.equal(300);
    });

    it('should hydrate the columns once when another prop that hydrates them changes in the same render', async () => {
      // `setProps` starts from the first props: the props kept between the steps are repeated.
      const model = [total, ratio];
      const formulaFunctions = { ...GRID_FORMULA_FUNCTIONS };
      const { setProps } = await render(
        <Test computedColumns={[total]} computedColDef={{ width: 100 }} />,
      );
      const columnsChange = subscribeColumnsChange();

      setProps({ computedColumns: model, computedColDef: { width: 300 } });
      await microtasks();
      expect(columnsChange).toHaveBeenCalledTimes(1);
      expect(getColumn('total').width).to.equal(300);
      expect(getColumn('ratio').width).to.equal(300);

      columnsChange.mockClear();
      setProps({ computedColumns: model, computedColDef: { width: 200 }, formulaFunctions });
      await microtasks();
      expect(columnsChange).toHaveBeenCalledTimes(1);
      expect(getColumn('total').width).to.equal(200);

      columnsChange.mockClear();
      setProps({
        computedColumns: model,
        computedColDef: { width: 250 },
        formulaFunctions,
        disableComputedColumns: true,
      });
      await microtasks();
      expect(columnsChange).toHaveBeenCalledTimes(1);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);

      setProps({ computedColumns: model, computedColDef: { width: 250 }, formulaFunctions });
      await microtasks();
      expect(getColumn('total').width).to.equal(250);
    });

    it('should keep the width set by the user', async () => {
      const { setProps } = await render(
        <Test computedColumns={[total]} computedColDef={{ width: 100 }} />,
      );
      act(() => apiRef.current!.setColumnWidth('total', 200));

      setProps({ computedColDef: { width: 350, headerAlign: 'center' } });
      await microtasks();
      expect(getColumn('total').width).to.equal(200);
      expect(getHeader('total')).to.have.class(gridClasses['columnHeader--alignCenter']);
    });

    it('should keep the values and the position of the columns', async () => {
      const apply = vi.fn((args: any[]) => args[0]);
      const formulaFunctions = {
        ...GRID_FORMULA_FUNCTIONS,
        PROBE: { name: 'PROBE', minArgs: 1, maxArgs: 1, apply },
      } as any;
      const { setProps } = await render(
        <Test
          computedColumns={[{ ...total, formula: '=PROBE(price) * quantity' }]}
          formulaFunctions={formulaFunctions}
          computedColDef={{ width: 100 }}
        />,
      );
      act(() => apiRef.current!.setColumnIndex('total', 0));
      const applications = apply.mock.calls.length;
      expect(applications).to.be.greaterThan(0);

      setProps({ computedColDef: { width: 350 } });
      await microtasks();
      expect(getColumn('total').width).to.equal(350);
      expect(getFields()).to.deep.equal(['total', 'item', 'price', 'quantity']);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(apply.mock.calls.length).to.equal(applications);
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

    describe('columns signature', () => {
      const createProbe = () => {
        const apply = vi.fn((args: any[]) => args[0]);
        const PROBE = { name: 'PROBE', minArgs: 1, maxArgs: 1, apply };
        return { apply, functions: { ...GRID_FORMULA_FUNCTIONS, PROBE } as any };
      };
      const probed: GridComputedColumnDefinition = {
        field: 'double',
        headerName: 'Double',
        formula: '=PROBE(price) * 2',
        type: 'number',
      };
      const priceColumn: DataGridPremiumProps['columns'][number] = {
        field: 'price',
        type: 'number',
      };
      const extraColumn = (valueGetter: () => string): DataGridPremiumProps['columns'][number] => ({
        field: 'extra',
        valueGetter,
      });

      it('should not re-evaluate when an unrelated column gets a new `valueGetter`', async () => {
        const probe = createProbe();
        const { setProps } = await render(
          <Test
            columns={[priceColumn, extraColumn(() => 'a')]}
            formulaFunctions={probe.functions}
            initialState={{
              computedColumns: { model: [probed] },
              rowGrouping: { model: ['double'] },
              aggregation: { model: { price: 'sum' } },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        const applications = probe.apply.mock.calls.length;
        const treeRebuilds = vi.fn();
        apiRef.current!.subscribeEvent('activeStrategyProcessorChange', (name) => {
          if (name === 'rowTreeCreation') {
            treeRebuilds();
          }
        });

        setProps({ columns: [priceColumn, extraColumn(() => 'b')] });
        await microtasks();
        expect(probe.apply.mock.calls.length).to.equal(applications);
        expect(treeRebuilds).toHaveBeenCalledTimes(0);
        expect(getColumnValuesOf('double')).to.deep.equal(['', '4', '', '20', '', '8', '']);
      });

      it('should re-evaluate when a referenced column gets a new `valueGetter`', async () => {
        const probe = createProbe();
        const { setProps } = await render(
          <Test
            columns={[priceColumn]}
            formulaFunctions={probe.functions}
            initialState={{ computedColumns: { model: [probed] } }}
          />,
        );
        expect(getColumnValuesOf('double')).to.deep.equal(['4', '20', '8']);
        const applications = probe.apply.mock.calls.length;

        setProps({ columns: [{ ...priceColumn, valueGetter: (value: number) => value * 10 }] });
        await microtasks();
        expect(getColumnValuesOf('double')).to.deep.equal(['40', '200', '80']);
        expect(probe.apply.mock.calls.length).to.be.greaterThan(applications);
      });

      it('should re-evaluate when a referenced column appears', async () => {
        const { setProps } = await render(
          <Test
            computedColumns={[
              { field: 'bonus2', headerName: 'Bonus', formula: '=bonus + 1', type: 'number' },
            ]}
          />,
        );
        expect(getColumnValuesOf('bonus2')).to.deep.equal(['#REF!', '#REF!', '#REF!']);

        setProps({ columns: [...baselineProps.columns, { field: 'bonus', type: 'number' }] });
        await microtasks();
        expect(getColumnValuesOf('bonus2')).to.deep.equal(['1', '1', '1']);
      });
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

    describe('chains with cell formulas', () => {
      const double: GridComputedColumnDefinition = {
        field: 'double',
        headerName: 'Double',
        formula: '=net * 2',
        type: 'number',
      };

      const formulaColumn = (field: string): DataGridPremiumProps['columns'][number] => ({
        field,
        type: 'number',
        allowFormulas: true,
      });

      const getValues = (id: number, fields: string[]) =>
        fields.map((field) => apiRef.current!.getCellValue(id, field));

      [
        ['net', 'out'],
        ['out', 'net'],
      ].forEach((order) => {
        it(`should evaluate a cell formula that reads a computed column after the formula cells the column reads (columns ${order.join(', ')})`, async () => {
          await render(
            <Test
              columns={[{ field: 'price', type: 'number' }, ...order.map(formulaColumn)]}
              rows={[{ id: 0, price: 2, net: '=price + 1', out: '=double + 1' }]}
              computedColumns={[double]}
            />,
          );
          expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([3, 6, 7]);

          act(() => apiRef.current!.updateRows([{ id: 0, price: 4 }]));
          expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([5, 10, 11]);
        });
      });

      [
        ['cell1', 'cell2', 'cell3'],
        ['cell3', 'cell2', 'cell1'],
      ].forEach((order) => {
        it(`should evaluate a chain alternating cell formulas and computed columns (columns ${order.join(', ')})`, async () => {
          const fields = ['cell1', 'computed1', 'cell2', 'computed2', 'cell3'];
          await render(
            <Test
              columns={[{ field: 'price', type: 'number' }, ...order.map(formulaColumn)]}
              rows={[
                {
                  id: 0,
                  price: 2,
                  cell1: '=price + 1',
                  cell2: '=computed1 + 1',
                  cell3: '=computed2 + 1',
                },
              ]}
              computedColumns={[
                { field: 'computed1', headerName: 'C1', formula: '=cell1 * 2', type: 'number' },
                { field: 'computed2', headerName: 'C2', formula: '=cell2 * 2', type: 'number' },
              ]}
            />,
          );
          expect(getValues(0, fields)).to.deep.equal([3, 6, 7, 14, 15]);

          act(() => apiRef.current!.updateRows([{ id: 0, price: 4 }]));
          expect(getValues(0, fields)).to.deep.equal([5, 10, 11, 22, 23]);
        });
      });

      [
        ['total', 'net'],
        ['net', 'total'],
      ].forEach((order) => {
        it(`should evaluate a range over a computed column after the formula cells the column reads (columns ${order.join(', ')})`, async () => {
          await render(
            <Test
              columns={[{ field: 'price', type: 'number' }, ...order.map(formulaColumn)]}
              rows={[
                { id: 0, price: 2, net: '=price + 1', total: '=SUM(COLUMN_VALUES("double"))' },
                { id: 1, price: 4, net: '=price + 1' },
              ]}
              computedColumns={[double]}
            />,
          );
          expect(getColumnValuesOf('double')).to.deep.equal(['6', '10']);
          expect(apiRef.current!.getCellValue(0, 'total')).to.equal(16);

          // Another row: the range dirties the total through the formula cell of that row.
          act(() => apiRef.current!.updateRows([{ id: 1, price: 6 }]));
          expect(getColumnValuesOf('double')).to.deep.equal(['6', '14']);
          expect(apiRef.current!.getCellValue(0, 'total')).to.equal(20);
        });
      });

      it('should show `#CYCLE!` in a cell formula and a computed column that read each other', async () => {
        await render(
          <Test
            columns={[{ field: 'price', type: 'number' }, formulaColumn('net')]}
            rows={[
              { id: 0, price: 2, net: '=double + 1' },
              { id: 1, price: 3, net: 4 },
            ]}
            computedColumns={[double]}
          />,
        );
        // The cycle depends on the data: the row without a formula is not on it.
        expect(getValues(0, ['net', 'double'])).to.deep.equal(['#CYCLE!', '#CYCLE!']);
        expect(getValues(1, ['net', 'double'])).to.deep.equal([4, 8]);

        act(() => apiRef.current!.updateRows([{ id: 0, net: 5 }]));
        expect(getValues(0, ['net', 'double'])).to.deep.equal([5, 10]);
      });

      it('should show `#CYCLE!` through a branch of the computed formula that is not taken', async () => {
        await render(
          <Test
            columns={[
              { field: 'price', type: 'number' },
              formulaColumn('net'),
              formulaColumn('out'),
            ]}
            rows={[{ id: 0, price: 2, net: '=double + 1', out: '=double + 1' }]}
            computedColumns={[{ ...double, formula: '=IF(price > 100, net, 0)' }]}
          />,
        );
        // The dependencies are static, as for the cell formulas: `=IF(FALSE, B1, 0)`
        // in A1 with `=A1` in B1 is a cycle too. `out` is downstream of it.
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([
          '#CYCLE!',
          '#CYCLE!',
          '#CYCLE!',
        ]);
      });

      it('should re-evaluate a cell formula when the computed column it reads changes with a raw input', async () => {
        await render(
          <Test
            columns={[
              { field: 'price', type: 'number' },
              { field: 'bonus', type: 'number' },
              formulaColumn('net'),
              formulaColumn('out'),
            ]}
            rows={[{ id: 0, price: 2, bonus: 0, net: '=price + 1', out: '=double + 1' }]}
            computedColumns={[{ ...double, formula: '=net + bonus' }]}
          />,
        );
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([3, 3, 4]);

        act(() => apiRef.current!.updateRows([{ id: 0, price: 4 }]));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([5, 5, 6]);

        // `double` reads 3 again, the value it had before the previous update: the
        // value the last pass read must have been recorded, not the one of the row scan.
        act(() => apiRef.current!.updateRows([{ id: 0, bonus: -2 }]));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([5, 3, 4]);
      });

      it('should follow the cells a computed column reads when its formula changes', async () => {
        await render(
          <Test
            columns={[
              { field: 'price', type: 'number' },
              formulaColumn('net'),
              formulaColumn('out'),
            ]}
            rows={[{ id: 0, price: 2, net: '=price + 1', out: '=double + 1' }]}
            initialState={{ computedColumns: { model: [double] } }}
          />,
        );
        act(() => apiRef.current!.updateComputedColumn('double', { formula: '=price * 2' }));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([3, 4, 5]);

        act(() => apiRef.current!.updateRows([{ id: 0, net: '=price + 10' }]));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([12, 4, 5]);
        act(() => apiRef.current!.updateRows([{ id: 0, price: 4 }]));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([14, 8, 9]);

        act(() => apiRef.current!.updateComputedColumn('double', { formula: '=net * 2' }));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([14, 28, 29]);
        act(() => apiRef.current!.updateRows([{ id: 0, price: 1 }]));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([11, 22, 23]);
      });

      it('should not keep a computed result read from a formula cell the update rebuilt', async () => {
        await render(
          <Test
            columns={[
              { field: 'price', type: 'number' },
              formulaColumn('net'),
              formulaColumn('out'),
            ]}
            rows={[{ id: 0, price: 2, net: '=price + 1', out: '=double + 1' }]}
            computedColumns={[double]}
          />,
        );
        // A new formula with the same result: `double` is read while `net` is not
        // evaluated yet, to find out whether `out` must be.
        act(() => apiRef.current!.updateRows([{ id: 0, net: '=1 + price' }]));
        expect(getValues(0, ['net', 'double', 'out'])).to.deep.equal([3, 6, 7]);
        expect(getColumnValuesOf('double')).to.deep.equal(['6']);
      });

      it('should not re-evaluate the computed cells when the formula cells they read keep their result', async () => {
        const apply = vi.fn((args: any[]) => args[0]);
        const formulaFunctions = {
          ...GRID_FORMULA_FUNCTIONS,
          PROBE: { name: 'PROBE', minArgs: 1, maxArgs: 1, apply },
        } as any;
        await render(
          <Test
            columns={[{ field: 'price', type: 'number' }, formulaColumn('net')]}
            rows={[
              { id: 0, price: 2, net: '=price + 1' },
              { id: 1, price: 4, net: '=price + 1' },
            ]}
            formulaFunctions={formulaFunctions}
            computedColumns={[{ ...double, formula: '=PROBE(net) * 2' }]}
          />,
        );
        expect(getColumnValuesOf('double')).to.deep.equal(['6', '10']);
        const applications = apply.mock.calls.length;

        // A new column evaluates every cell formula again, with the same results.
        act(() => apiRef.current!.updateColumns([{ field: 'extra' }]));
        expect(getColumnValuesOf('double')).to.deep.equal(['6', '10']);
        expect(apply.mock.calls.length).to.equal(applications);
      });

      describe('cycle locks with the same error', () => {
        // Returns the error of a cycle, so that a cell can leave a cycle with the same result.
        const formulaFunctions = {
          ...GRID_FORMULA_FUNCTIONS,
          CYCLE_ERROR: {
            name: 'CYCLE_ERROR',
            minArgs: 0,
            maxArgs: 0,
            apply: () => ({
              kind: 'error',
              code: '#CYCLE!',
              message: 'The formula is part of a circular reference.',
            }),
          },
        } as any;
        const getColumns = (yAllowsFormulas: boolean): DataGridPremiumProps['columns'] => [
          { field: 'price', type: 'number' },
          formulaColumn('net'),
          { field: 'y', allowFormulas: yAllowsFormulas },
        ];
        const lockedY = '=REF(COLUMN("net"), ROW(0))';
        const rows = [
          { id: 0, price: 1, net: '=CYCLE_ERROR() + REF(COLUMN("y"), ROW(1))' },
          { id: 1, price: 1, y: lockedY },
        ];
        const safe: GridComputedColumnDefinition = {
          field: 'safe',
          headerName: 'Safe',
          formula: '=IFERROR(net, 7)',
          type: 'number',
        };

        it('should render a computed cell again when an update locks or unlocks a formula cell it reads', async () => {
          await render(
            <Test
              columns={getColumns(true)}
              rows={rows}
              formulaFunctions={formulaFunctions}
              computedColumns={[safe]}
            />,
          );
          // `net` and `y` read each other: the computed cell reading `net` is locked with it.
          expect(getValues(0, ['net', 'safe'])).to.deep.equal(['#CYCLE!', '#CYCLE!']);

          // Out of the cycle, `net` keeps the same error, but the computed cell can catch it.
          act(() => apiRef.current!.updateRows([{ id: 1, y: 5 }]));
          expect(getValues(0, ['net', 'safe'])).to.deep.equal(['#CYCLE!', 7]);
          expect(getColumnValuesOf('safe')).to.deep.equal(['7', '']);

          act(() => apiRef.current!.updateRows([{ id: 1, y: lockedY }]));
          expect(getValues(0, ['net', 'safe'])).to.deep.equal(['#CYCLE!', '#CYCLE!']);
          expect(getColumnValuesOf('safe')).to.deep.equal(['#CYCLE!', '']);
        });

        it('should render a computed cell again when a full evaluation unlocks a formula cell it reads', async () => {
          const { setProps } = await render(
            <Test
              columns={getColumns(true)}
              rows={rows}
              formulaFunctions={formulaFunctions}
              computedColumns={[safe]}
            />,
          );
          expect(getValues(0, ['net', 'safe'])).to.deep.equal(['#CYCLE!', '#CYCLE!']);

          // `y` holds a raw value now: a full evaluation, with `net` out of the cycle.
          setProps({ columns: getColumns(false) });
          await microtasks();
          expect(getValues(0, ['net', 'safe'])).to.deep.equal(['#CYCLE!', 7]);
          expect(getColumnValuesOf('safe')).to.deep.equal(['7', '']);
        });
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

    it('should keep the errors last in the `sortComparator` of the column', async () => {
      await render(<Test rows={rowsWithError} computedColumns={[ratio]} />);
      // The grid sorts with `getSortComparator`: this is for the code that reads `sortComparator` directly.
      const sortComparator = getColumn('ratio').sortComparator!;
      const params = {} as GridSortCellParams;
      expect(
        ['#DIV/0!', 2, 1].sort((value1, value2) => sortComparator(value1, value2, params, params)),
      ).to.deep.equal([1, 2, '#DIV/0!']);
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

    it('should count the errors as values for the `isEmpty` and `isNotEmpty` operators', async () => {
      await render(<Test rows={rowsWithError} computedColumns={[ratio]} />);
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'ratio', operator: 'isNotEmpty' }] }),
      );
      expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'ratio', operator: 'isEmpty' }] }),
      );
      expect(getColumnValuesOf('item')).to.deep.equal([]);
      act(() =>
        apiRef.current!.setFilterModel({ items: [{ field: 'ratio', operator: '>', value: '1' }] }),
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

    describe('after a change of the computed values', () => {
      const fruitRows = [
        { id: 0, item: 'Apple', price: 2 },
        { id: 1, item: 'Banana', price: 4 },
        { id: 2, item: 'Cherry', price: 3 },
      ];
      const fruitColumns = [{ field: 'item' }, { field: 'price', type: 'number' as const }];
      const double: GridComputedColumnDefinition = {
        field: 'double',
        headerName: 'Double',
        formula: '=price',
        type: 'number',
      };
      const sortedByDouble = {
        sorting: { sortModel: [{ field: 'double', sort: 'asc' as const }] },
      };
      const filteredByDouble = {
        filter: { filterModel: { items: [{ field: 'double', operator: '>', value: 0 }] } },
      };
      const scaledFunctions = (factor: number) => ({
        ...GRID_FORMULA_FUNCTIONS,
        SCALE: {
          name: 'SCALE',
          minArgs: 1,
          maxArgs: 1,
          apply: (args: unknown[]) => (args[0] as number) * factor,
        },
      });

      const countViewEvents = () => {
        const counts = { sortedRowsSet: 0, filteredRowsSet: 0 };
        apiRef.current!.subscribeEvent('sortedRowsSet', () => {
          counts.sortedRowsSet += 1;
        });
        apiRef.current!.subscribeEvent('filteredRowsSet', () => {
          counts.filteredRowsSet += 1;
        });
        return counts;
      };

      it('should sort again when the formula changes', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{ computedColumns: { model: [double] }, ...sortedByDouble }}
          />,
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Cherry', 'Banana']);
        act(() =>
          apiRef.current!.updateComputedColumn(
            'double',
            { formula: '=-price' },
            { undoable: true },
          ),
        );
        expect(getColumnValuesOf('double')).to.deep.equal(['-4', '-3', '-2']);
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
      });

      it('should filter again when the formula changes', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{ computedColumns: { model: [double] }, ...filteredByDouble }}
          />,
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        act(() =>
          apiRef.current!.updateComputedColumn(
            'double',
            { formula: '=-price' },
            { undoable: true },
          ),
        );
        expect(apiRef.current!.getCellValue(0, 'double')).to.equal(-2);
        expect(getColumnValuesOf('item')).to.deep.equal([]);
      });

      it('should sort again when a function used by the formula changes', async () => {
        const { setProps } = await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            computedColumns={[{ ...double, formula: '=SCALE(price)' }]}
            formulaFunctions={scaledFunctions(1)}
            initialState={sortedByDouble}
          />,
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Cherry', 'Banana']);
        setProps({ formulaFunctions: scaledFunctions(-1) });
        await microtasks();
        expect(getColumnValuesOf('double')).to.deep.equal(['-4', '-3', '-2']);
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
      });

      it('should filter again when a function used by the formula changes', async () => {
        const { setProps } = await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            computedColumns={[{ ...double, formula: '=SCALE(price)' }]}
            formulaFunctions={scaledFunctions(1)}
            initialState={filteredByDouble}
          />,
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        setProps({ formulaFunctions: scaledFunctions(-1) });
        await microtasks();
        expect(apiRef.current!.getCellValue(0, 'double')).to.equal(-2);
        expect(getColumnValuesOf('item')).to.deep.equal([]);
      });

      it('should apply the quick filter again when the formula changes', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{
              computedColumns: {
                model: [
                  { field: 'code', headerName: 'Code', formula: '="x" & price', type: 'string' },
                ],
              },
              filter: { filterModel: { items: [], quickFilterValues: ['x4'] } },
            }}
          />,
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
        act(() => apiRef.current!.updateComputedColumn('code', { formula: '="x" & (price + 1)' }));
        expect(getColumnValuesOf('item')).to.deep.equal(['Cherry']);
      });

      it('should sort again by a cell formula that reads the computed column', async () => {
        await render(
          <Test
            rows={fruitRows.map((row) => ({ ...row, out: '=double + 1' }))}
            columns={[...fruitColumns, { field: 'out', type: 'number', allowFormulas: true }]}
            initialState={{
              computedColumns: { model: [double] },
              sorting: { sortModel: [{ field: 'out', sort: 'asc' }] },
            }}
          />,
        );
        expect(getColumnValuesOf('out')).to.deep.equal(['3', '4', '5']);
        act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' }));
        expect(getColumnValuesOf('out')).to.deep.equal(['-3', '-2', '-1']);
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
      });

      it('should sort again when the formula change is undone and redone', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{ computedColumns: { model: [double] }, ...sortedByDouble }}
          />,
        );
        act(() =>
          apiRef.current!.updateComputedColumn(
            'double',
            { formula: '=-price' },
            { undoable: true },
          ),
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
        await act(async () => {
          await apiRef.current!.history.undo();
        });
        expect(getColumnValuesOf('double')).to.deep.equal(['2', '3', '4']);
        expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Cherry', 'Banana']);
        await act(async () => {
          await apiRef.current!.history.redo();
        });
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
      });

      it('should sort and filter once per change, and only when their model reads a changed value', async () => {
        const unscaled = scaledFunctions(1);
        const doubled = scaledFunctions(2);
        const { setProps } = await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            computedColumns={[{ ...double, formula: '=SCALE(price)' }]}
            formulaFunctions={unscaled}
            initialState={{ ...sortedByDouble, ...filteredByDouble }}
          />,
        );
        let counts = countViewEvents();
        setProps({
          computedColumns: [{ ...double, formula: '=SCALE(price) + 1' }],
          formulaFunctions: unscaled,
        });
        await microtasks();
        expect(counts).to.deep.equal({ sortedRowsSet: 1, filteredRowsSet: 1 });

        counts = countViewEvents();
        setProps({
          computedColumns: [{ ...double, formula: '=SCALE(price) + 1' }],
          formulaFunctions: doubled,
        });
        await microtasks();
        expect(counts).to.deep.equal({ sortedRowsSet: 1, filteredRowsSet: 1 });

        act(() => {
          apiRef.current!.setSortModel([{ field: 'price', sort: 'desc' }]);
          apiRef.current!.setFilterModel({ items: [] });
        });
        counts = countViewEvents();
        setProps({
          computedColumns: [{ ...double, formula: '=-SCALE(price)' }],
          formulaFunctions: doubled,
        });
        await microtasks();
        expect(counts).to.deep.equal({ sortedRowsSet: 0, filteredRowsSet: 0 });
        expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
      });

      it('should not sort again when only the `computedColDef` changes', async () => {
        const { setProps } = await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{ computedColumns: { model: [double] }, ...sortedByDouble }}
          />,
        );
        const counts = countViewEvents();
        setProps({ computedColDef: { headerName: 'Renamed' } });
        await microtasks();
        expect(getColumn('double').headerName).to.equal('Renamed');
        expect(counts).to.deep.equal({ sortedRowsSet: 0, filteredRowsSet: 0 });
      });

      it('should leave the sorting and the filtering to the rebuild of the groups', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{
              computedColumns: {
                model: [
                  {
                    field: 'size',
                    headerName: 'Size',
                    formula: '=IF(price > 2, "big", "small")',
                    type: 'string',
                  },
                ],
              },
              rowGrouping: { model: ['size'] },
              sorting: { sortModel: [{ field: 'size', sort: 'asc' }] },
              filter: {
                filterModel: { items: [{ field: 'size', operator: 'contains', value: 'i' }] },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        const counts = countViewEvents();
        const treeRebuilds = vi.fn();
        apiRef.current!.subscribeEvent('activeStrategyProcessorChange', (name) => {
          if (name === 'rowTreeCreation') {
            treeRebuilds();
          }
        });
        act(() =>
          apiRef.current!.updateComputedColumn('size', {
            formula: '=IF(price > 3, "big", "small")',
          }),
        );
        expect(getColumnValues(0)).to.deep.equal(['big (1)', '']);
        // Each rebuild sorts and filters the new tree: nothing on top of that.
        const rebuilds = treeRebuilds.mock.calls.length;
        expect(rebuilds).to.be.greaterThan(0);
        expect(counts).to.deep.equal({ sortedRowsSet: rebuilds, filteredRowsSet: rebuilds });
      });

      it('should sort again by a grouping column whose leaf field is computed', async () => {
        await render(
          <Test
            rows={fruitRows.map((row) => ({ ...row, category: 'Fruit' }))}
            columns={[...fruitColumns, { field: 'category' }]}
            groupingColDef={{ leafField: 'double' }}
            defaultGroupingExpansionDepth={-1}
            initialState={{
              computedColumns: { model: [double] },
              rowGrouping: { model: ['category'] },
              sorting: {
                sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'asc' }],
              },
            }}
          />,
        );
        expect(getColumnValuesOf('item')).to.deep.equal(['', 'Apple', 'Cherry', 'Banana']);
        act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' }));
        expect(getColumnValuesOf('item')).to.deep.equal(['', 'Banana', 'Cherry', 'Apple']);
      });

      it('should leave the sorting and the filtering to the server', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            sortingMode="server"
            filterMode="server"
            initialState={{
              computedColumns: { model: [double] },
              ...sortedByDouble,
              ...filteredByDouble,
            }}
          />,
        );
        const counts = countViewEvents();
        act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' }));
        expect(apiRef.current!.getCellValue(0, 'double')).to.equal(-2);
        expect(counts).to.deep.equal({ sortedRowsSet: 0, filteredRowsSet: 0 });
      });

      it('should skip the filter and sort items without a field', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{ computedColumns: { model: [double] } }}
          />,
        );
        // Outside of the types, but the core prunes these items only after the columns change.
        act(() => {
          apiRef.current!.setFilterModel({
            items: [{ id: 1, operator: 'contains', value: 'x' } as GridFilterItem],
          });
          apiRef.current!.setSortModel([{ sort: 'asc' } as GridSortModel[number]]);
        });
        expect(() =>
          act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' })),
        ).not.to.throw();
        expect(getColumnValuesOf('double')).to.deep.equal(['-2', '-4', '-3']);
      });

      it('should aggregate the rows filtered with the new values', async () => {
        await render(
          <Test
            rows={fruitRows}
            columns={fruitColumns}
            initialState={{
              computedColumns: { model: [double] },
              filter: { filterModel: { items: [{ field: 'double', operator: '>', value: 2 }] } },
              aggregation: { model: { double: 'sum' } },
            }}
          />,
        );
        expect(getColumnValuesOf('double')).to.deep.equal(['4', '3', '7']);
        // Like after a change of the filter model, the aggregation follows the filtering.
        await act(async () =>
          apiRef.current!.updateComputedColumn('double', { formula: '=price * 2' }),
        );
        expect(getColumnValuesOf('double')).to.deep.equal(['4', '8', '6', '18']);
      });

      describe('when the view does not fit the new type', () => {
        const toText = { type: 'string' as const, formula: '=price & "!"' };
        const half: GridComputedColumnDefinition = {
          field: 'half',
          headerName: 'Half',
          formula: '=price / 2',
          type: 'number',
        };
        // A step that fails warns once, in development.
        const filteringWarning = 'The filtering could not be applied again';
        const sortingWarning = 'The sorting could not be applied again';
        const getFilterItems = () =>
          apiRef.current!.state.filter.filterModel.items.map(({ field, operator, value }) => ({
            field,
            operator,
            value,
          }));
        // The columns keep being hydrated after the type change: the column added next shows up.
        const expectColumnsToBeHydratedAgain = () => {
          act(() => apiRef.current!.setFilterModel({ items: [] }));
          act(() => apiRef.current!.addComputedColumn(half));
          expect(getFields()).to.include('half');
        };

        it('should reset the filter items of the column to an operator of the new type', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{ computedColumns: { model: [double] }, ...filteredByDouble }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText, { undoable: true }));
          }).not.toWarnDev();
          expect(getColumn('double').type).to.equal('string');
          // Like the filter panel when an item moves to a column of another type.
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
          ]);
          expect(getColumnValuesOf('double')).to.deep.equal(['2!', '4!', '3!']);
          expectColumnsToBeHydratedAgain();
        });

        it('should filter with the new type after the reset', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{ computedColumns: { model: [double] }, ...filteredByDouble }}
            />,
          );
          act(() => apiRef.current!.updateComputedColumn('double', toText));
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }]))).not.to.throw();
          expect(getColumnValuesOf('double')).to.deep.equal(['5!', '4!', '3!']);
          act(() =>
            apiRef.current!.setFilterModel({
              items: [{ field: 'double', operator: 'contains', value: '4' }],
            }),
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
        });

        it('should reset the filter items when the type changes through the `computedColumns` prop', async () => {
          const { setProps } = await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              computedColumns={[double]}
              initialState={filteredByDouble}
            />,
          );
          expect(() => setProps({ computedColumns: [{ ...double, ...toText }] })).not.toWarnDev();
          await microtasks();
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
          ]);
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        });

        it('should filter once after the reset of the filter items', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{ computedColumns: { model: [double] }, ...filteredByDouble }}
            />,
          );
          const counts = countViewEvents();
          act(() => apiRef.current!.updateComputedColumn('double', toText));
          expect(counts.filteredRowsSet).to.equal(1);
        });

        it('should keep the filter items of the column when only the formula changes', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{ computedColumns: { model: [double] }, ...filteredByDouble }}
            />,
          );
          act(() => apiRef.current!.updateComputedColumn('double', { formula: '=price - 3' }));
          expect(getFilterItems()).to.deep.equal([{ field: 'double', operator: '>', value: 0 }]);
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
        });

        it('should keep the filter items of the column that the operators of the new type fit', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: { model: [double] },
                filter: { filterModel: { items: [{ field: 'double', operator: 'isNotEmpty' }] } },
              }}
            />,
          );
          const itemsBefore = apiRef.current!.state.filter.filterModel.items;
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(apiRef.current!.state.filter.filterModel.items).to.equal(itemsBefore);
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        });

        it('should not reset the filter items of a regular column a computed field collides with', async () => {
          const collidingPrice: GridComputedColumnDefinition = {
            field: 'price',
            headerName: 'Price',
            formula: '=1',
            type: 'number',
          };
          const collisionWarning = 'uses the field of an existing column';
          let utils: Awaited<ReturnType<typeof render>>;
          await expect(async () => {
            utils = await render(
              <Test
                rows={fruitRows}
                columns={fruitColumns}
                computedColumns={[collidingPrice]}
                initialState={{
                  filter: {
                    filterModel: { items: [{ field: 'price', operator: '>', value: 2 }] },
                  },
                }}
              />,
            );
          }).toWarnDev(collisionWarning);
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          // The record of the computed field changes type, but the column is the regular one.
          utils!.setProps({ computedColumns: [{ ...collidingPrice, ...toText }] });
          await microtasks();
          expect(getFilterItems()).to.deep.equal([{ field: 'price', operator: '>', value: 2 }]);
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
        });

        it('should not reset a filter set after the type change at the next change of the columns', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{ computedColumns: { model: [double] }, ...filteredByDouble }}
            />,
          );
          act(() => apiRef.current!.updateComputedColumn('double', toText));
          act(() =>
            apiRef.current!.setFilterModel({
              items: [{ field: 'double', operator: 'contains', value: '4' }],
            }),
          );
          act(() => apiRef.current!.setColumnIndex('double', 0));
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: '4' },
          ]);
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
        });

        // Excludes `Apple`, so the rows tell whether the view was filtered again.
        const doubleAboveTwo = { id: 1, field: 'double', operator: '>', value: 2 };

        it('should only reset the filter items of the column whose type changed', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: {
                  model: [
                    double,
                    {
                      field: 'triple',
                      headerName: 'Triple',
                      formula: '=price * 3',
                      type: 'number',
                    },
                  ],
                },
                filter: {
                  filterModel: {
                    items: [doubleAboveTwo, { id: 2, field: 'triple', operator: '>', value: 0 }],
                  },
                },
              }}
            />,
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
            { field: 'triple', operator: '>', value: 0 },
          ]);
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          expectColumnsToBeHydratedAgain();
        });

        it('should keep the rows while an item of a regular column can not be applied', async () => {
          const { setProps } = await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: { model: [double] },
                filter: {
                  filterModel: {
                    items: [doubleAboveTwo, { id: 2, field: 'price', operator: '>', value: 0 }],
                  },
                },
              }}
            />,
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          // The core keeps the item of a column whose type changes until the next filtering.
          setProps({ columns: [{ field: 'item' }, { field: 'price', type: 'string' }] });
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' }));
          }).toWarnDev(filteringWarning);
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          expect(getColumnValuesOf('double')).to.deep.equal(['-4', '-3']);
          expectColumnsToBeHydratedAgain();
        });

        it('should keep the rows while the column of an item has no operators', async () => {
          const { setProps } = await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: { model: [double] },
                filter: { filterModel: { items: [doubleAboveTwo] } },
              }}
            />,
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          // The core throws when it filters by a column without operators.
          setProps({ computedColDef: { filterOperators: [] } });
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' }));
          }).toWarnDev(filteringWarning);
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          expectColumnsToBeHydratedAgain();
        });

        it('should keep the quick filter when the filter items are reset', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: { model: [double] },
                filter: { filterModel: { items: [doubleAboveTwo], quickFilterValues: ['a'] } },
              }}
            />,
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(apiRef.current!.state.filter.filterModel.quickFilterValues).to.deep.equal(['a']);
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana']);
          expectColumnsToBeHydratedAgain();
        });

        it('should keep the operator and clear the values that do not fit the new type', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: { model: [double] },
                filter: {
                  // The input of the number operator stores numbers, which the text one trims.
                  filterModel: { items: [{ field: 'double', operator: 'isAnyOf', value: [2, 4] }] },
                },
              }}
            />,
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana']);
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'isAnyOf', value: undefined },
          ]);
          expect(getColumnValuesOf('double')).to.deep.equal(['2!', '4!', '3!']);
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }]))).not.to.throw();
          expectColumnsToBeHydratedAgain();
        });

        it('should keep the order when the comparator does not fit the new type', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              computedColDef={{ sortComparator: (a: string, b: string) => a.localeCompare(b) }}
              initialState={{
                computedColumns: { model: [{ ...double, ...toText }] },
                ...sortedByDouble,
              }}
            />,
          );
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Cherry', 'Banana']);
          expect(() => {
            act(() =>
              apiRef.current!.updateComputedColumn('double', {
                type: 'number',
                formula: '=-price',
              }),
            );
          }).toWarnDev(sortingWarning);
          expect(getColumnValuesOf('double')).to.deep.equal(['-2', '-3', '-4']);
          expectColumnsToBeHydratedAgain();
        });

        it('should warn with the error of a comparator that fails on the new values', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              computedColDef={{
                sortComparator: (a: number, b: number) => {
                  if (a < 0 || b < 0) {
                    throw new Error('comparator bug: negative value');
                  }
                  return a - b;
                },
              }}
              initialState={{ computedColumns: { model: [double] }, ...sortedByDouble }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', { formula: '=-price' }));
          }).toWarnDev(
            [
              'MUI X Data Grid: The sorting could not be applied again after the formula values changed.',
              'The rows keep their previous order, and the next sorting throws the same error until its cause is fixed.',
              'Check the sort model and the comparators of the columns (`computedColDef` for the computed ones) against the new values. Caught error: comparator bug: negative value',
            ].join('\n'),
          );
          // The rows keep their order, and the error comes at the next sorting.
          expect(getColumnValuesOf('double')).to.deep.equal(['-2', '-3', '-4']);
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }]))).to.throw(
            'comparator bug: negative value',
          );
        });

        it('should aggregate the rows filtered after the reset of the filter items', async () => {
          const { setProps } = await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              formulaFunctions={scaledFunctions(1)}
              initialState={{
                computedColumns: {
                  model: [double, { ...half, formula: '=SCALE(price) / 2' }],
                },
                filter: {
                  filterModel: { items: [{ field: 'double', operator: 'isAnyOf', value: [2, 4] }] },
                },
                aggregation: { model: { half: 'sum' } },
              }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          // The footer sums the rows of the reset item, which filters nothing: `Cherry` is back.
          expect(getColumnValuesOf('half')).to.deep.equal(['1', '2', '1.5', '4.5']);
          await act(async () => setProps({ formulaFunctions: scaledFunctions(-1) }));
          expect(getColumnValuesOf('half')).to.deep.equal(['-1', '-2', '-1.5', '-4.5']);
        });

        it('should reset the filter items again at the undo and the redo of a type change', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              initialState={{
                computedColumns: { model: [{ ...double, ...toText }] },
                filter: {
                  filterModel: { items: [{ field: 'double', operator: 'contains', value: '4' }] },
                },
              }}
            />,
          );
          expect(() => {
            act(() =>
              apiRef.current!.updateComputedColumn(
                'double',
                { type: 'number', formula: '=price' },
                { undoable: true },
              ),
            );
          }).not.toWarnDev();
          expect(getColumn('double').type).to.equal('number');
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: '=', value: undefined },
          ]);
          await act(async () => {
            await apiRef.current!.history.undo();
          });
          // The undo brings the type back, not the filter: like the undo of a removed column.
          expect(getColumn('double').type).to.equal('string');
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
          ]);
          expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          await act(async () => {
            await apiRef.current!.history.redo();
          });
          expect(getColumn('double').type).to.equal('number');
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: '=', value: undefined },
          ]);
          expectColumnsToBeHydratedAgain();
        });

        it('should reset the filter items of the grouping column of a computed criterion', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [double] },
                rowGrouping: { model: ['double'] },
                filter: {
                  filterModel: {
                    items: [
                      { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, operator: '>', value: 0 },
                    ],
                  },
                },
              }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          // The grouping column copies the operators of the criterion.
          expect(getFilterItems()).to.deep.equal([
            {
              field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
              operator: 'contains',
              value: undefined,
            },
          ]);
          expect(getColumnValuesOf('item').filter(Boolean)).to.deep.equal([
            'Apple',
            'Banana',
            'Cherry',
          ]);
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }]))).not.to.throw();
          expectColumnsToBeHydratedAgain();
        });

        // The grid regroups after any computed change while a computed column is grouped: the
        // filtering and the sorting of the rebuilt tree run inside the hydration of the columns.
        const label: GridComputedColumnDefinition = {
          field: 'label',
          headerName: 'Label',
          formula: '=item',
          type: 'string',
        };
        const bucket: GridComputedColumnDefinition = {
          field: 'bucket',
          headerName: 'Bucket',
          formula: '=double & ""',
          type: 'string',
        };
        const getGroupingValues = () =>
          getColumnValuesOf(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD).filter(Boolean);
        const getLeafValuesOf = (field: string) => getColumnValuesOf(field).filter(Boolean);

        it('should reset the filter items when the grid is grouped by another computed column', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [label, double] },
                rowGrouping: { model: ['label'] },
                ...filteredByDouble,
              }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(getColumn('double').type).to.equal('string');
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
          ]);
          expect(getLeafValuesOf('double')).to.deep.equal(['2!', '4!', '3!']);
          expectColumnsToBeHydratedAgain();
        });

        it('should not throw when the grid is grouped and filtered by the changed column', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [double] },
                rowGrouping: { model: ['double'] },
                filter: { filterModel: { items: [doubleAboveTwo] } },
              }}
            />,
          );
          expect(getGroupingValues()).to.deep.equal(['4 (1)', '3 (1)']);
          // The regroup runs before the formula feature applies the filtering again: the reset
          // must come first, or the regroup throws out of the hydration.
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
          ]);
          expect(getGroupingValues()).to.deep.equal(['2! (1)', '4! (1)', '3! (1)']);
          expectColumnsToBeHydratedAgain();
        });

        it('should show the new groups when the grouped column reads the changed one', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [double, bucket] },
                rowGrouping: { model: ['bucket'] },
                filter: { filterModel: { items: [doubleAboveTwo] } },
              }}
            />,
          );
          expect(getGroupingValues()).to.deep.equal(['4 (1)', '3 (1)']);
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(getGroupingValues()).to.deep.equal(['2! (1)', '4! (1)', '3! (1)']);
          expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }]))).not.to.throw();
          act(() =>
            apiRef.current!.setFilterModel({
              items: [{ field: 'double', operator: 'contains', value: '4' }],
            }),
          );
          expect(getGroupingValues()).to.deep.equal(['4! (1)']);
          expect(getLeafValuesOf('item')).to.deep.equal(['Banana']);
        });

        it('should not freeze when the comparator does not fit the new type of a grouped column', async () => {
          await render(
            <Test
              // Two leaves in a group: the comparator only compares the leaves of a group.
              rows={[
                { id: 0, item: 'Apple', price: 2 },
                { id: 1, item: 'Apricot', price: 2 },
                { id: 2, item: 'Cherry', price: 3 },
              ]}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              computedColDef={{
                // The group rows pass `null`.
                sortComparator: (a: number | string | null, b: number | string | null) => {
                  if (typeof a === 'string' || typeof b === 'string') {
                    throw new Error('number comparator got text');
                  }
                  return (a ?? 0) - (b ?? 0);
                },
              }}
              initialState={{
                computedColumns: { model: [double, bucket] },
                rowGrouping: { model: ['bucket'] },
                ...sortedByDouble,
              }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).toWarnDev(sortingWarning);
          act(() => apiRef.current!.setSortModel([]));
          expect(getGroupingValues()).to.deep.equal(['2! (2)', '3! (1)']);
          expectColumnsToBeHydratedAgain();
        });

        it('should aggregate the new groups after the reset of the filter items', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [double, bucket] },
                rowGrouping: { model: ['bucket'] },
                aggregation: { model: { price: 'sum' } },
                ...filteredByDouble,
              }}
            />,
          );
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', toText));
          }).not.toWarnDev();
          expect(getGroupingValues()).to.deep.equal(['2! (1)', '4! (1)', '3! (1)']);
          // Each group row shows the sum of its leaf, and the footer the sum of every row.
          expect(getColumnValuesOf('price')).to.deep.equal(['2', '2', '4', '4', '3', '3', '9']);
        });

        it('should reset the filter items at the undo and the redo of a type change while grouped', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [label, { ...double, ...toText }] },
                rowGrouping: { model: ['label'] },
                filter: {
                  filterModel: { items: [{ field: 'double', operator: 'contains', value: '4' }] },
                },
              }}
            />,
          );
          expect(() => {
            act(() =>
              apiRef.current!.updateComputedColumn(
                'double',
                { type: 'number', formula: '=price' },
                { undoable: true },
              ),
            );
          }).not.toWarnDev();
          expect(getColumn('double').type).to.equal('number');
          await act(async () => {
            await apiRef.current!.history.undo();
          });
          expect(getColumn('double').type).to.equal('string');
          expect(getFilterItems()).to.deep.equal([
            { field: 'double', operator: 'contains', value: undefined },
          ]);
          expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          await act(async () => {
            await apiRef.current!.history.redo();
          });
          expect(getColumn('double').type).to.equal('number');
          expectColumnsToBeHydratedAgain();
        });

        it('should warn when the regroup fails in another listener of the rows', async () => {
          await render(
            <Test
              rows={fruitRows}
              columns={fruitColumns}
              defaultGroupingExpansionDepth={-1}
              initialState={{
                computedColumns: { model: [label, double] },
                rowGrouping: { model: ['label'] },
              }}
            />,
          );
          const unsubscribe = apiRef.current!.subscribeEvent('rowsSet', () => {
            throw new Error('listener bug');
          });
          expect(() => {
            act(() => apiRef.current!.updateComputedColumn('double', { formula: '=price * 3' }));
          }).toWarnDev(
            [
              'MUI X Data Grid: The row grouping could not be applied again after the formula values changed.',
              'The rows can stay in their previous groups, and the features that run after the row grouping can be out of date.',
              'Check the `groupingValueGetter` of the grouped columns and the listeners of the `rowsSet` event against the new values. Caught error: listener bug',
            ].join('\n'),
          );
          expect(getLeafValuesOf('double')).to.deep.equal(['6', '12', '9']);
          unsubscribe();
          expectColumnsToBeHydratedAgain();
        });

        it('should leave the error of a rows update to its caller without a warning', async () => {
          await render(
            <Test
              rows={[
                { id: 0, item: 'Apple', base: 2, price: '=base' },
                { id: 1, item: 'Banana', base: 4, price: '=base' },
              ]}
              columns={[
                { field: 'item' },
                { field: 'base', type: 'number' },
                {
                  field: 'price',
                  type: 'number',
                  allowFormulas: true,
                  filterOperators: [
                    {
                      value: 'small',
                      getApplyFilterFn: () => (value: number) => {
                        if (value > 100) {
                          throw new Error('operator bug: too big');
                        }
                        return true;
                      },
                    },
                  ],
                },
              ]}
              initialState={{
                rowGrouping: { model: ['price'] },
                filter: {
                  filterModel: { items: [{ field: 'price', operator: 'small', value: 1 }] },
                },
              }}
            />,
          );
          // The regroup of the formula cells fails first, then the core's own filtering throws.
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, base: 500 }]))).to.throw(
            'operator bug: too big',
          );
        });

        it('should throw the error of the tree creation to the caller of a rows update', async () => {
          await render(
            <Test
              rows={[
                { id: 0, item: 'Apple', base: 2, price: '=base' },
                { id: 1, item: 'Banana', base: 4, price: '=base' },
              ]}
              columns={[
                { field: 'item' },
                { field: 'base', type: 'number' },
                {
                  field: 'price',
                  type: 'number',
                  allowFormulas: true,
                  groupingValueGetter: (value: number) => {
                    if (value > 100) {
                      throw new Error('getter bug: too big');
                    }
                    return value;
                  },
                },
              ]}
              initialState={{ rowGrouping: { model: ['price'] } }}
            />,
          );
          // The core doesn't create the tree again after the regroup of the formula cells.
          expect(() => act(() => apiRef.current!.updateRows([{ id: 0, base: 500 }]))).to.throw(
            'getter bug: too big',
          );
        });

        describe('on the row grouping columns', () => {
          // The text order differs from the number order: "50!" sorts before "6!" and "8!".
          const unevenRows = [
            { id: 0, item: 'Apple', price: 50, category: 'Fruit' },
            { id: 1, item: 'Banana', price: 8, category: 'Fruit' },
            { id: 2, item: 'Cherry', price: 6, category: 'Fruit' },
          ];
          const categoryColumns = [...fruitColumns, { field: 'category' }];
          const categoryGroupingField = '__row_group_by_columns_group_category__';
          const doubleGroupingField = '__row_group_by_columns_group_double__';

          it('should sort again with the comparator of the new type of the leaf field', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  sorting: {
                    sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'desc' }],
                  },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(getLeafValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
          });

          it('should sort again with the comparator of the new type of the leaf field in the `multiple` mode', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                rowGroupingColumnMode="multiple"
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  sorting: { sortModel: [{ field: categoryGroupingField, sort: 'desc' }] },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            act(() => apiRef.current!.updateComputedColumn('double', toText));
            expect(getLeafValuesOf('item')).to.deep.equal(['Banana', 'Cherry', 'Apple']);
          });

          // The regroup sorts the rebuilt tree, and the comparators of a criterion read its
          // column live: it must keep working with the grouping columns synced first.
          it('should sort the groups again with the comparator of the new type of the criterion', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['double'] },
                  sorting: {
                    sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'desc' }],
                  },
                }}
              />,
            );
            expect(getGroupingValues()).to.deep.equal(['50 (1)', '8 (1)', '6 (1)']);
            act(() => apiRef.current!.updateComputedColumn('double', toText));
            expect(getGroupingValues()).to.deep.equal(['8! (1)', '6! (1)', '50! (1)']);
          });

          it('should reset the filter items of the grouping column whose leaf field changed type', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, operator: '>', value: 7 },
                      ],
                    },
                  },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana']);
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(getFilterItems()).to.deep.equal([
              {
                field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                operator: 'contains',
                value: undefined,
              },
            ]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            expect(() =>
              act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }])),
            ).not.to.throw();
            expectColumnsToBeHydratedAgain();
          });

          it('should filter once after the reset of the filter items of a grouping column', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, operator: '>', value: 7 },
                      ],
                    },
                  },
                }}
              />,
            );
            const counts = countViewEvents();
            act(() => apiRef.current!.updateComputedColumn('double', toText));
            expect(counts.filteredRowsSet).to.equal(1);
          });

          it('should only reset the filter items of the grouping column that reads the changed field', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                rowGroupingColumnMode="multiple"
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category', 'double'] },
                  filter: {
                    filterModel: {
                      items: [
                        { id: 0, field: categoryGroupingField, operator: 'contains', value: 'Fr' },
                        { id: 1, field: doubleGroupingField, operator: '>', value: 7 },
                      ],
                    },
                  },
                }}
              />,
            );
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(getFilterItems()).to.deep.equal([
              { field: categoryGroupingField, operator: 'contains', value: 'Fr' },
              { field: doubleGroupingField, operator: 'contains', value: undefined },
            ]);
            expectColumnsToBeHydratedAgain();
          });

          it('should reset the filter items of a grouping column to the operators of its `groupingColDef`', async () => {
            const atLeast: GridFilterOperator = {
              value: 'atLeast',
              getApplyFilterFn: (filterItem) =>
                filterItem.value == null
                  ? null
                  : (value) => Number.parseFloat(String(value)) >= filterItem.value,
            };
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double', filterOperators: [atLeast] }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        {
                          field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                          operator: 'atLeast',
                          value: 7,
                        },
                      ],
                    },
                  },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana']);
            act(() => apiRef.current!.updateComputedColumn('double', toText));
            // The operator of the `groupingColDef` still exists: only the value is cleared.
            expect(getFilterItems()).to.deep.equal([
              {
                field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                operator: 'atLeast',
                value: undefined,
              },
            ]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          });

          it('should keep the filter items of the grouping column when only the formula of the leaf field changes', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, operator: '>', value: 7 },
                      ],
                    },
                  },
                }}
              />,
            );
            act(() => apiRef.current!.updateComputedColumn('double', { formula: '=price / 2' }));
            expect(getFilterItems()).to.deep.equal([
              { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, operator: '>', value: 7 },
            ]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple']);
          });

          it('should not reset a filter of the grouping column set after the type change at the next change of the columns', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, operator: '>', value: 7 },
                      ],
                    },
                  },
                }}
              />,
            );
            act(() => apiRef.current!.updateComputedColumn('double', toText));
            const filtered = {
              field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
              operator: 'contains',
              value: '8',
            };
            act(() => apiRef.current!.setFilterModel({ items: [filtered] }));
            act(() => apiRef.current!.setColumnIndex('double', 0));
            expect(getFilterItems()).to.deep.equal([filtered]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Banana']);
          });

          // The regroup filters the new keys with the grouping column: its item must be fitted
          // to the rebuilt column first. A date operator throws on a string key.
          it('should not throw when the grid is grouped by a computed column whose type changed and its grouping column is filtered', async () => {
            const when: GridComputedColumnDefinition = {
              field: 'when',
              headerName: 'When',
              formula: '=day',
              type: 'dateTime',
            };
            await render(
              <Test
                rows={[
                  { id: 0, item: 'Apple', day: new Date(2024, 0, 1) },
                  { id: 1, item: 'Banana', day: new Date(2024, 5, 1) },
                ]}
                columns={[{ field: 'item' }, { field: 'day', type: 'dateTime' }]}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [when] },
                  rowGrouping: { model: ['when'] },
                  filter: {
                    filterModel: {
                      items: [
                        {
                          field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                          operator: 'after',
                          value: new Date(2024, 2, 1),
                        },
                      ],
                    },
                  },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Banana']);
            expect(() => {
              act(() =>
                apiRef.current!.updateComputedColumn('when', { type: 'string', formula: '=item' }),
              );
            }).not.toWarnDev();
            expect(getFilterItems()).to.deep.equal([
              {
                field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                operator: 'contains',
                value: undefined,
              },
            ]);
            expect(getGroupingValues()).to.deep.equal(['Apple (1)', 'Banana (1)']);
            expectColumnsToBeHydratedAgain();
          });

          // Removing a filtered column makes the core filter again: the item of the grouping
          // column must be fitted to the rebuilt column before.
          it('should not throw when the leaf field changes type and a filtered computed column is removed at once', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double, half] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        {
                          id: 1,
                          field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                          operator: '>',
                          value: 7,
                        },
                        { id: 2, field: 'half', operator: '>', value: 0 },
                      ],
                    },
                  },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana']);
            expect(() => {
              act(() => apiRef.current!.setComputedColumns([{ ...double, ...toText }]));
            }).not.toWarnDev();
            expect(getFields()).not.to.include('half');
            expect(getFilterItems()).to.deep.equal([
              {
                field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                operator: 'contains',
                value: undefined,
              },
            ]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            expectColumnsToBeHydratedAgain();
          });

          // The reset filters once: with the rebuilt grouping column, whose `isEmpty` reads the
          // new text values.
          it('should filter the grouping column with the new type when the reset leaves its item as it is', async () => {
            await render(
              <Test
                rows={unevenRows}
                columns={categoryColumns}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                  filter: {
                    filterModel: {
                      items: [
                        { id: 1, field: 'double', operator: '>', value: 7 },
                        {
                          id: 2,
                          field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                          operator: 'isEmpty',
                        },
                      ],
                    },
                  },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal([]);
            act(() =>
              apiRef.current!.updateComputedColumn('double', {
                type: 'string',
                formula: '=IF(price = 8, "", price & "!")',
              }),
            );
            expect(getFilterItems()).to.deep.equal([
              { field: 'double', operator: 'contains', value: undefined },
              {
                field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                operator: 'isEmpty',
                value: undefined,
              },
            ]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Banana']);
          });
        });

        describe('with a controlled filter model', () => {
          const doubleAboveTwoModel: GridFilterModel = { items: [doubleAboveTwo] };
          const resetItem = { id: 1, field: 'double', operator: 'contains', value: undefined };
          const getItemsOf = (model: GridFilterModel) =>
            model.items.map(({ id, field, operator, value }) => ({ id, field, operator, value }));

          // Passes every model back, after the event that sent it, like `useState` does.
          function ControlledFilterTest({
            filterModel: initialFilterModel,
            onFilterModelChange,
            ...other
          }: Partial<DataGridPremiumProps> & { filterModel: GridFilterModel }) {
            const [filterModel, setFilterModel] = React.useState(initialFilterModel);
            return (
              <Test
                {...other}
                filterModel={filterModel}
                onFilterModelChange={(model, details) => {
                  onFilterModelChange?.(model, details);
                  setFilterModel(model);
                }}
              />
            );
          }

          it('should reset the filter items once the parent passes them back', async () => {
            const onFilterModelChange = vi.fn();
            await render(
              <ControlledFilterTest
                rows={fruitRows}
                columns={fruitColumns}
                filterModel={doubleAboveTwoModel}
                onFilterModelChange={onFilterModelChange}
                initialState={{ computedColumns: { model: [double] } }}
              />,
            );
            expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
            // The state keeps the items that don't fit until the parent passes the reset back:
            // filtering with them would only fail.
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(onFilterModelChange.mock.calls.length).to.equal(1);
            expect(getItemsOf(onFilterModelChange.mock.calls[0][0])).to.deep.equal([resetItem]);
            expect(getFilterItems()).to.deep.equal([
              { field: 'double', operator: 'contains', value: undefined },
            ]);
            expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            expect(() =>
              act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }])),
            ).not.to.throw();
            expectColumnsToBeHydratedAgain();
          });

          it('should keep the rows of the previous filtering while the parent has not passed the reset back', async () => {
            const onFilterModelChange = vi.fn();
            const { setProps } = await render(
              <Test
                rows={fruitRows}
                columns={fruitColumns}
                filterModel={doubleAboveTwoModel}
                onFilterModelChange={onFilterModelChange}
                initialState={{ computedColumns: { model: [double] } }}
              />,
            );
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(getItemsOf(onFilterModelChange.mock.lastCall![0])).to.deep.equal([resetItem]);
            expect(getFilterItems()).to.deep.equal([{ field: 'double', operator: '>', value: 2 }]);
            expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
            expect(() => {
              setProps({ filterModel: onFilterModelChange.mock.lastCall![0] });
            }).not.toWarnDev();
            expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          });

          it('should send the reset of the computed field and of the grouping column in one model', async () => {
            const onFilterModelChange = vi.fn();
            await render(
              <ControlledFilterTest
                rows={fruitRows.map((row) => ({ ...row, category: 'Fruit' }))}
                columns={[...fruitColumns, { field: 'category' }]}
                groupingColDef={{ leafField: 'double' }}
                defaultGroupingExpansionDepth={-1}
                filterModel={{
                  items: [
                    doubleAboveTwo,
                    {
                      id: 2,
                      field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                      operator: '>',
                      value: 3,
                    },
                  ],
                }}
                onFilterModelChange={onFilterModelChange}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['category'] },
                }}
              />,
            );
            expect(getLeafValuesOf('item')).to.deep.equal(['Banana']);
            // The computed field and the grouping column that reads it are reset together: the
            // parent gets one model that holds both resets.
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(onFilterModelChange.mock.calls.length).to.equal(1);
            expect(getItemsOf(onFilterModelChange.mock.lastCall![0])).to.deep.equal([
              resetItem,
              {
                id: 2,
                field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                operator: 'contains',
                value: undefined,
              },
            ]);
            expect(getLeafValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            expect(() =>
              act(() => apiRef.current!.updateRows([{ id: 0, price: 5 }])),
            ).not.to.throw();
          });

          it('should keep every reset in the last model when two types change before the parent passes it back', async () => {
            const onFilterModelChange = vi.fn();
            await render(
              <ControlledFilterTest
                rows={fruitRows}
                columns={fruitColumns}
                filterModel={{
                  items: [doubleAboveTwo, { id: 2, field: 'half', operator: '>', value: 0 }],
                }}
                onFilterModelChange={onFilterModelChange}
                initialState={{ computedColumns: { model: [double, half] } }}
              />,
            );
            // Each change is its own event: the second one runs while the state still holds the
            // items that don't fit, and must start from the model the first one sent.
            expect(() => {
              act(() => {
                apiRef.current!.updateComputedColumn('double', toText);
                apiRef.current!.updateComputedColumn('half', toText);
              });
            }).not.toWarnDev();
            const halfReset = { id: 2, field: 'half', operator: 'contains', value: undefined };
            expect(getItemsOf(onFilterModelChange.mock.lastCall![0])).to.deep.equal([
              resetItem,
              halfReset,
            ]);
            expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
            // Once the parent passed it back, a reset starts from the state again.
            const filtered = { id: 3, field: 'double', operator: 'contains', value: '4' };
            act(() => apiRef.current!.setFilterModel({ items: [filtered] }));
            act(() =>
              apiRef.current!.updateComputedColumn('double', { type: 'number', formula: '=price' }),
            );
            expect(getItemsOf(onFilterModelChange.mock.lastCall![0])).to.deep.equal([
              { ...filtered, operator: '=', value: undefined },
            ]);
            expect(getColumnValuesOf('item')).to.deep.equal(['Apple', 'Banana', 'Cherry']);
          });

          it('should start from the state once the parent passed a model, even an earlier one', async () => {
            const onFilterModelChange = vi.fn();
            const initialModel: GridFilterModel = {
              items: [
                { id: 1, field: 'double', operator: 'isAnyOf', value: ['2!'] },
                { id: 2, field: 'half', operator: '>', value: 0 },
              ],
            };
            const { setProps } = await render(
              <Test
                rows={fruitRows}
                columns={fruitColumns}
                filterModel={initialModel}
                onFilterModelChange={onFilterModelChange}
                initialState={{ computedColumns: { model: [double, half] } }}
              />,
            );
            act(() => apiRef.current!.updateComputedColumn('double', toText));
            setProps({ filterModel: onFilterModelChange.mock.lastCall![0] });
            // The values of the first model fit the new type: the parent can pass it again.
            setProps({ filterModel: initialModel });
            act(() => apiRef.current!.updateComputedColumn('half', toText));
            expect(getItemsOf(onFilterModelChange.mock.lastCall![0])).to.deep.equal([
              { id: 1, field: 'double', operator: 'isAnyOf', value: ['2!'] },
              { id: 2, field: 'half', operator: 'contains', value: undefined },
            ]);
          });

          it('should warn when the filter model is controlled without `onFilterModelChange`', async () => {
            await render(
              <Test
                rows={fruitRows}
                columns={fruitColumns}
                filterModel={doubleAboveTwoModel}
                initialState={{ computedColumns: { model: [double] } }}
              />,
            );
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).toWarnDev(
              'The `filterModel` prop is controlled without `onFilterModelChange`, so the reset items never reach the grid',
            );
            expect(getFilterItems()).to.deep.equal([{ field: 'double', operator: '>', value: 2 }]);
            expect(getColumnValuesOf('item')).to.deep.equal(['Banana', 'Cherry']);
          });

          it('should not warn when the grid is grouped by a column that reads the changed one', async () => {
            await render(
              <ControlledFilterTest
                rows={fruitRows}
                columns={fruitColumns}
                defaultGroupingExpansionDepth={-1}
                filterModel={doubleAboveTwoModel}
                initialState={{
                  computedColumns: { model: [double, bucket] },
                  rowGrouping: { model: ['bucket'] },
                }}
              />,
            );
            expect(getGroupingValues()).to.deep.equal(['4 (1)', '3 (1)']);
            // The regroup filters the rebuilt tree with the items the parent has not passed back.
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).not.toWarnDev();
            expect(getGroupingValues()).to.deep.equal(['2! (1)', '4! (1)', '3! (1)']);
          });

          it('should reset the model the parent passes in the same render as the type change', async () => {
            const onFilterModelChange = vi.fn();
            const { setProps } = await render(
              <Test
                rows={fruitRows}
                columns={fruitColumns}
                computedColumns={[double]}
                filterModel={doubleAboveTwoModel}
                onFilterModelChange={onFilterModelChange}
              />,
            );
            const itemContainsAn = { id: 2, field: 'item', operator: 'contains', value: 'an' };
            // The core sets the filter model in a layout effect, before the computed columns
            // follow their prop: the reset starts from the new model.
            expect(() => {
              setProps({
                computedColumns: [{ ...double, ...toText }],
                filterModel: { items: [{ ...doubleAboveTwo, value: 3 }, itemContainsAn] },
              });
            }).not.toWarnDev();
            await microtasks();
            expect(getItemsOf(onFilterModelChange.mock.lastCall![0])).to.deep.equal([
              resetItem,
              itemContainsAn,
            ]);
            setProps({ filterModel: onFilterModelChange.mock.lastCall![0] });
            expect(getColumnValuesOf('item')).to.deep.equal(['Banana']);
          });

          // Known residual: the regroup of the row grouping, the first listener of the event,
          // filters the rebuilt tree before the parent can pass the reset back, and throws out
          // of the hydration.
          it('should throw when the grid is grouped by the changed column before the parent passes the reset back', async () => {
            await render(
              <ControlledFilterTest
                rows={fruitRows}
                columns={fruitColumns}
                defaultGroupingExpansionDepth={-1}
                filterModel={doubleAboveTwoModel}
                initialState={{
                  computedColumns: { model: [double] },
                  rowGrouping: { model: ['double'] },
                }}
              />,
            );
            expect(() => {
              act(() => apiRef.current!.updateComputedColumn('double', toText));
            }).to.throw('No filter operator ">" found for column "double"');
            await microtasks();
            expect(getFilterItems()).to.deep.equal([
              { field: 'double', operator: 'contains', value: undefined },
            ]);
            // The throw came after the reset took the changed fields: a later change of the
            // columns keeps a filter set since.
            const filtered = { id: 1, field: 'double', operator: 'contains', value: '4' };
            act(() => apiRef.current!.setFilterModel({ items: [filtered] }));
            act(() => apiRef.current!.setColumnIndex('item', 2));
            expect(getFilterItems()).to.deep.equal([
              { field: 'double', operator: 'contains', value: '4' },
            ]);
          });
        });
      });
    });

    describe('grouping column', () => {
      // `avgPrice` divides by zero for Webcam.
      const groupedProps: Partial<DataGridPremiumProps> = {
        rows: [
          { id: 1, product: 'Keyboard', category: 'Input', revenue: 100, units: 10 },
          { id: 2, product: 'Mouse', category: 'Input', revenue: 200, units: 20 },
          { id: 3, product: 'Monitor', category: 'Display', revenue: 90, units: 3 },
          { id: 4, product: 'Dock', category: 'Display', revenue: 60, units: 2 },
          { id: 5, product: 'Webcam', category: 'Input', revenue: 50, units: 0 },
          { id: 6, product: 'Cable', category: 'Display', revenue: 40, units: 8 },
          { id: 7, product: 'Adapter', category: 'Input', revenue: 25, units: 5 },
          { id: 8, product: 'Headset', category: 'Input', revenue: 80, units: 4 },
        ],
        columns: [
          { field: 'product' },
          { field: 'category' },
          { field: 'revenue', type: 'number' },
          { field: 'units', type: 'number' },
        ],
        computedColumns: [
          {
            field: 'avgPrice',
            headerName: 'Avg price',
            formula: '=revenue / units',
            type: 'number',
          },
        ],
      };
      const groupedByAvgPrice: DataGridPremiumProps['initialState'] = {
        rowGrouping: { model: ['avgPrice'] },
      };
      const ascendingGroups = ['5 (2)', '10 (2)', '20 (1)', '30 (2)', '#DIV/0! (1)'];
      const descendingGroups = ['30 (2)', '20 (1)', '10 (2)', '5 (2)', '#DIV/0! (1)'];
      const isErrorCode = (value: unknown) =>
        typeof value === 'string' && value.startsWith('#') && value.endsWith('!');
      const receivedCodes = (spy: { mock: { calls: unknown[][] } }) =>
        spy.mock.calls.some((args) => args.slice(0, 2).some(isErrorCode));

      it('should keep the groups of errors last in both directions', async () => {
        await render(<Test {...groupedProps} initialState={groupedByAvgPrice} />);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
        expect(getColumnValues(0)).to.deep.equal(ascendingGroups);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
        expect(getColumnValues(0)).to.deep.equal(descendingGroups);
      });

      it('should keep the groups of errors last in both directions with a `sortComparator` override', async () => {
        const sortComparator = vi.fn((value1: number, value2: number) => value1 - value2);
        await render(
          <Test
            {...groupedProps}
            initialState={groupedByAvgPrice}
            computedColDef={{ sortComparator }}
          />,
        );
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
        expect(getColumnValues(0)).to.deep.equal(ascendingGroups);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
        expect(getColumnValues(0)).to.deep.equal(descendingGroups);
        expect(sortComparator.mock.calls.length).to.be.greaterThan(0);
        expect(receivedCodes(sortComparator)).to.equal(false);
      });

      it('should keep the groups of errors last in both directions with a `getSortComparator` override', async () => {
        const comparator = vi.fn((value1: number, value2: number) => value1 - value2);
        await render(
          <Test
            {...groupedProps}
            initialState={groupedByAvgPrice}
            computedColDef={{
              getSortComparator: (direction) =>
                direction === 'asc' ? comparator : (value1, value2) => -comparator(value1, value2),
            }}
          />,
        );
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
        expect(getColumnValues(0)).to.deep.equal(ascendingGroups);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
        expect(getColumnValues(0)).to.deep.equal(descendingGroups);
        expect(comparator.mock.calls.length).to.be.greaterThan(0);
        expect(receivedCodes(comparator)).to.equal(false);
      });

      it('should keep the groups of errors last in both directions in the `multiple` grouping column mode', async () => {
        await render(
          <Test
            {...groupedProps}
            initialState={groupedByAvgPrice}
            rowGroupingColumnMode="multiple"
          />,
        );
        act(() => apiRef.current!.sortColumn('__row_group_by_columns_group_avgPrice__', 'asc'));
        expect(getColumnValues(0)).to.deep.equal(ascendingGroups);
        act(() => apiRef.current!.sortColumn('__row_group_by_columns_group_avgPrice__', 'desc'));
        expect(getColumnValues(0)).to.deep.equal(descendingGroups);
      });

      it('should keep the groups of errors last in both directions when the column is not the first grouping criteria', async () => {
        await render(
          <Test
            {...groupedProps}
            initialState={{ rowGrouping: { model: ['category', 'avgPrice'] } }}
            defaultGroupingExpansionDepth={1}
          />,
        );
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
        expect(getColumnValues(0)).to.deep.equal([
          'Display (3)',
          '5 (1)',
          '30 (2)',
          'Input (5)',
          '5 (1)',
          '10 (2)',
          '20 (1)',
          '#DIV/0! (1)',
        ]);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
        expect(getColumnValues(0)).to.deep.equal([
          'Input (5)',
          '20 (1)',
          '10 (2)',
          '5 (1)',
          '#DIV/0! (1)',
          'Display (3)',
          '30 (2)',
          '5 (1)',
        ]);
      });

      it('should keep the errors last in both directions when the column is the `leafField`', async () => {
        await render(
          <Test
            {...groupedProps}
            initialState={{ rowGrouping: { model: ['category'] } }}
            groupingColDef={{ leafField: 'avgPrice' }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
        expect(getColumnValues(0)).to.deep.equal([
          'Input (5)',
          '5',
          '10',
          '10',
          '20',
          '#DIV/0!',
          'Display (3)',
          '5',
          '30',
          '30',
        ]);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
        expect(getColumnValues(0)).to.deep.equal([
          'Input (5)',
          '20',
          '10',
          '10',
          '5',
          '#DIV/0!',
          'Display (3)',
          '30',
          '30',
          '5',
        ]);
      });

      it('should sort with the `sortComparator` of `groupingColDef`', async () => {
        await render(
          <Test
            {...groupedProps}
            initialState={groupedByAvgPrice}
            groupingColDef={{
              sortComparator: (value1, value2) => String(value1).localeCompare(String(value2)),
            }}
          />,
        );
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
        expect(getColumnValues(0)).to.deep.equal([
          '#DIV/0! (1)',
          '10 (2)',
          '20 (1)',
          '30 (2)',
          '5 (2)',
        ]);
        act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
        expect(getColumnValues(0)).to.deep.equal([
          '5 (2)',
          '30 (2)',
          '20 (1)',
          '10 (2)',
          '#DIV/0! (1)',
        ]);
      });

      it('should sort with the `sortComparator` of `groupingColDef` in the `multiple` grouping column mode', async () => {
        await render(
          <Test
            {...groupedProps}
            initialState={groupedByAvgPrice}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              sortComparator: (value1, value2) => String(value1).localeCompare(String(value2)),
            }}
          />,
        );
        act(() => apiRef.current!.sortColumn('__row_group_by_columns_group_avgPrice__', 'asc'));
        expect(getColumnValues(0)).to.deep.equal([
          '#DIV/0! (1)',
          '10 (2)',
          '20 (1)',
          '30 (2)',
          '5 (2)',
        ]);
        act(() => apiRef.current!.sortColumn('__row_group_by_columns_group_avgPrice__', 'desc'));
        expect(getColumnValues(0)).to.deep.equal([
          '5 (2)',
          '30 (2)',
          '20 (1)',
          '10 (2)',
          '#DIV/0! (1)',
        ]);
      });

      it('should not pass the groups of the other grouping criteria to their column in the `multiple` grouping column mode', async () => {
        // Assumes strings: the `avgPrice` grouping column has no value for the groups of `category`
        const sortComparator = vi.fn((value1: string, value2: string) =>
          value1.localeCompare(value2),
        );
        await render(
          <Test
            {...groupedProps}
            columns={groupedProps.columns!.map((column) =>
              column.field === 'category' ? { ...column, sortComparator } : column,
            )}
            initialState={{ rowGrouping: { model: ['avgPrice', 'category'] } }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={-1}
          />,
        );
        act(() => apiRef.current!.sortColumn('__row_group_by_columns_group_avgPrice__', 'desc'));
        expect(getColumnValues(0).filter(Boolean)).to.deep.equal(descendingGroups);
        expect(sortComparator.mock.calls.length).to.equal(0);
      });

      describe('unbalanced rows', () => {
        // Stand and Hub have no category.
        const unbalancedRows = [
          ...groupedProps.rows!,
          { id: 9, product: 'Stand', category: null, revenue: 30, units: 3 },
          { id: 10, product: 'Hub', category: null, revenue: 45, units: 3 },
        ];

        it('should sort the groups by index of the grouping criteria in the model', async () => {
          await render(
            <Test
              {...groupedProps}
              rows={unbalancedRows}
              initialState={{ rowGrouping: { model: ['category', 'avgPrice'] } }}
            />,
          );
          act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
          expect(getColumnValues(0)).to.deep.equal([
            'Display (3)',
            'Input (5)',
            '10 (1)',
            '15 (1)',
          ]);
          act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
          expect(getColumnValues(0)).to.deep.equal([
            '15 (1)',
            '10 (1)',
            'Input (5)',
            'Display (3)',
          ]);
        });

        it('should sort the leaves by index of the grouping criteria in the model when the column is the `leafField`', async () => {
          await render(
            <Test
              {...groupedProps}
              rows={unbalancedRows}
              initialState={{ rowGrouping: { model: ['category'] } }}
              groupingColDef={{ leafField: 'avgPrice' }}
              defaultGroupingExpansionDepth={-1}
            />,
          );
          act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
          expect(getColumnValues(0)).to.deep.equal([
            '10',
            '15',
            'Input (5)',
            '5',
            '10',
            '10',
            '20',
            '#DIV/0!',
            'Display (3)',
            '5',
            '30',
            '30',
          ]);
          act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
          expect(getColumnValues(0)).to.deep.equal([
            'Input (5)',
            '20',
            '10',
            '10',
            '5',
            '#DIV/0!',
            'Display (3)',
            '30',
            '30',
            '5',
            '15',
            '10',
          ]);
        });
      });
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
      await render(<Test computedColumns={[total]} cellSelection disableRowSelectionOnClick />);
      writeText = vi.spyOn(navigator.clipboard, 'writeText');
      const cell = getCell(1, getFields().indexOf('total'));
      await clickCell(cell);
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
      // The footer renders the footer cell, like a column without `renderCell`.
      expect(getCell(3, getFields().indexOf('total')).firstElementChild).to.have.class(
        gridClasses.footerCell,
      );

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

      describe('computed `leafField`', () => {
        const half: GridComputedColumnDefinition = {
          field: 'half',
          headerName: 'Half',
          formula: '=price / 2',
          type: 'number',
        };
        const leafRows = [
          { id: 1, cat: 'Fruit', origin: 'Spain', price: 2 },
          { id: 2, cat: 'Fruit', origin: 'Spain', price: 3 },
        ];
        const leafColumns: DataGridPremiumProps['columns'] = [
          { field: 'cat' },
          { field: 'origin' },
          { field: 'price', type: 'number' },
        ];
        const getGroupingColumn = () => getColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD);

        const renderWithLeaf = (
          probe: ReturnType<typeof createProbe>,
          props: Partial<DataGridPremiumProps> = {},
        ) =>
          renderGrouped(probe, {
            rows: leafRows,
            columns: leafColumns,
            groupingColDef: { leafField: 'double' },
            initialState: {
              computedColumns: { model: [double, half] },
              rowGrouping: { model: ['cat'] },
            },
            ...props,
          });

        it('should rename the grouping column with a name-only edit', async () => {
          const probe = createProbe();
          const { counters } = await renderWithLeaf(probe);
          expect(getGroupingHeader()).to.equal('Double');
          expect(getColumnValues(0)).to.deep.equal(['Fruit (2)', '4', '6']);

          act(() => apiRef.current!.updateComputedColumn('double', { headerName: 'Renamed' }));
          expect(getGroupingHeader()).to.equal('Renamed');
          expect(getColumnValues(0)).to.deep.equal(['Fruit (2)', '4', '6']);
          // Exactly one extra hydration, no re-evaluation.
          expect(counters.columnsChange).to.equal(2);
          expect(counters.formulaEvaluated).to.equal(0);
          expect(probe.apply.mock.calls.length).to.equal(counters.apply);
        });

        it('should filter the leaves with the operators of the new type', async () => {
          const probe = createProbe();
          await renderWithLeaf(probe);
          expect(getGroupingColumn().filterOperators![0].value).to.equal('=');

          act(() =>
            apiRef.current!.updateComputedColumn('double', {
              type: 'string',
              formula: '=price & "!"',
            }),
          );
          expect(getGroupingColumn().filterOperators![0].value).to.equal('contains');
          expect(getColumnValues(0)).to.deep.equal(['Fruit (2)', '2!', '3!']);
        });

        it('should sort the leaves with the comparator of the new type, errors last', async () => {
          const probe = createProbe();
          await renderWithLeaf(probe, {
            rows: [...leafRows, { id: 3, cat: 'Fruit', origin: 'Spain', price: 0 }],
          });
          act(() =>
            apiRef.current!.updateComputedColumn('double', {
              type: 'string',
              formula: '=IF(price = 0, 1 / 0, IF(price = 2, "b", "a"))',
            }),
          );
          act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'asc'));
          expect(getColumnValues(0)).to.deep.equal(['Fruit (3)', 'a', 'b', '#DIV/0!']);
          act(() => apiRef.current!.sortColumn(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'desc'));
          expect(getColumnValues(0)).to.deep.equal(['Fruit (3)', 'b', 'a', '#DIV/0!']);
        });

        it('should stop copying from a removed computed column', async () => {
          const probe = createProbe();
          const { counters } = await renderWithLeaf(probe);

          act(() => apiRef.current!.removeComputedColumn('double'));
          // The grouping column of a `leafField` that does not exist.
          expect(getGroupingHeader()).to.equal('cat');
          expect(getGroupingColumn().filterOperators![0].value).to.equal('contains');
          expect(getColumnValues(0)).to.deep.equal(['Fruit (2)', '', '']);
          expect(counters.columnsChange).to.equal(2);
        });

        it('should follow a change of `computedColDef`', async () => {
          const probe = createProbe();
          const { setProps } = await renderWithLeaf(probe);

          setProps({ computedColDef: { headerName: 'From computedColDef' } });
          await microtasks();
          expect(getGroupingHeader()).to.equal('From computedColDef');
        });

        it('should only rebuild the grouping column whose leaf field changed in the `multiple` grouping column mode', async () => {
          const probe = createProbe();
          const groupingColDef = vi.fn(({ fields }: { fields: string[] }) =>
            fields[0] === 'origin' ? { leafField: 'double' } : undefined,
          );
          const { counters } = await renderWithLeaf(probe, {
            rowGroupingColumnMode: 'multiple',
            groupingColDef,
            initialState: {
              computedColumns: { model: [double, half] },
              rowGrouping: { model: ['cat', 'origin'] },
            },
          });
          expect(getColumnHeadersTextContent().slice(0, 2)).to.deep.equal(['cat', 'Double']);

          act(() => apiRef.current!.updateComputedColumn('double', { headerName: 'Renamed' }));
          expect(getColumnHeadersTextContent().slice(0, 2)).to.deep.equal(['cat', 'Renamed']);
          expect(counters.columnsChange).to.equal(2);

          // Neither a criterion nor a leaf: the hydration of the edit is enough.
          act(() => apiRef.current!.updateComputedColumn('half', { headerName: 'Halved' }));
          expect(getColumnHeadersTextContent().slice(0, 2)).to.deep.equal(['cat', 'Renamed']);
          expect(counters.columnsChange).to.equal(3);
        });

        it('should not hydrate again for a computed column that is neither a criterion nor a leaf', async () => {
          const probe = createProbe();
          const groupingColDef = vi.fn(() => ({ leafField: 'double' }));
          const { counters } = await renderWithLeaf(probe, { groupingColDef });

          act(() => apiRef.current!.updateComputedColumn('half', { headerName: 'Halved' }));
          expect(getGroupingHeader()).to.equal('Double');
          expect(counters.columnsChange).to.equal(1);

          // No computed column was rebuilt: `groupingColDef` is not called.
          const calls = groupingColDef.mock.calls.length;
          act(() => apiRef.current!.setColumnIndex('price', 2));
          expect(counters.columnsChange).to.equal(2);
          expect(groupingColDef.mock.calls.length).to.equal(calls);
        });

        it('should not hydrate again for a leaf field when the row grouping is disabled', async () => {
          const probe = createProbe();
          const groupingColDef = vi.fn(() => ({ leafField: 'double' }));
          const { counters } = await renderWithLeaf(probe, {
            disableRowGrouping: true,
            groupingColDef,
          });
          const calls = groupingColDef.mock.calls.length;

          act(() => apiRef.current!.updateComputedColumn('double', { headerName: 'Renamed' }));
          expect(counters.columnsChange).to.equal(1);
          expect(groupingColDef.mock.calls.length).to.equal(calls);
        });
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

    it('should not let `computedColDef` replace the grouping and row spanning getters', async () => {
      await render(
        <Test
          rowSpanning
          rows={[
            { id: 0, price: 2, quantity: 3 },
            { id: 1, price: 3, quantity: 2 },
            { id: 2, price: 4, quantity: 2 },
          ]}
          computedColumns={[total]}
          computedColDef={{
            // Both receive `row[field]`, which a synthetic column never has.
            // @ts-expect-error `GridComputedColDefOverrides` leaves the getters out: JavaScript only
            groupingValueGetter: () => 'one bucket',
            // @ts-expect-error `GridComputedColDefOverrides` leaves the getters out: JavaScript only
            rowSpanValueGetter: () => 'one span',
          }}
          initialState={{ rowGrouping: { model: ['total'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['6 (2)', '', '', '8 (1)', '']);
      const index = getFields().indexOf('total');
      expect(getCell(1, index).style.height).to.equal('calc(var(--height) * 2)');
      expect(getCell(4, index).style.height).to.equal('');
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

    describe('model changes while pivoting is active', () => {
      const pivotModel = {
        rows: [{ field: 'item' }],
        columns: [],
        values: [{ field: 'price', aggFunc: 'sum' }],
      };
      const getModel = () => gridComputedColumnsSelector(apiRef as RefObject<GridApi>);
      const getModelFields = () => getModel().map((definition) => definition.field);
      // The columns are removed (and the warning printed) when pivoting activates.
      const activatePivot = () => {
        expect(() => {
          act(() => apiRef.current!.setPivotActive(true));
        }).toWarnDev([
          'MUI X Data Grid: Computed columns are not supported while pivoting is active.',
        ]);
        return microtasks();
      };

      it('should keep a definition added or removed while pivoting is active', async () => {
        await render(
          <Test initialState={{ computedColumns: { model: [total] } }} pivotModel={pivotModel} />,
        );
        await activatePivot();
        expect(getFields()).not.to.include('total');

        await act(async () => apiRef.current!.addComputedColumn(ratio));
        await act(async () => apiRef.current!.removeComputedColumn('total'));
        expect(getModelFields()).to.deep.equal(['ratio']);
        // The state exported during pivoting reports the live model.
        expect(apiRef.current!.exportState().computedColumns?.model).to.deep.equal([ratio]);

        await act(async () => apiRef.current!.setPivotActive(false));
        expect(getModelFields()).to.deep.equal(['ratio']);
        expect(getFields()).to.include('ratio');
        expect(getFields()).not.to.include('total');
        expect(getColumnValuesOf('ratio')).to.deep.equal(['0.667', '2', '2']);
      });

      it('should not record a history step when pivoting is deactivated', async () => {
        await render(
          <Test
            initialState={{ computedColumns: { model: [total, ratio] } }}
            pivotModel={pivotModel}
          />,
        );
        // A step made from the column menu before pivoting.
        await act(async () => apiRef.current!.showColumnMenu('ratio'));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Remove computed column' }));
        await microtasks();
        expect(apiRef.current!.state.history.stack).to.have.length(1);

        await activatePivot();
        await act(async () => apiRef.current!.setPivotActive(false));
        expect(apiRef.current!.state.history.stack).to.have.length(1);
        expect(apiRef.current!.history.canUndo()).to.equal(true);

        await act(async () => {
          await apiRef.current!.history.undo();
        });
        expect(getModelFields()).to.deep.equal(['total', 'ratio']);
        expect(apiRef.current!.history.canUndo()).to.equal(false);
      });

      it('should not send the previous model back to a controlled parent', async () => {
        const onComputedColumnsChange = vi.fn();
        function Controlled() {
          const [model, setModel] = React.useState<GridComputedColumnsModel>([total]);
          return (
            <Test
              computedColumns={model}
              onComputedColumnsChange={(nextModel) => {
                onComputedColumnsChange(nextModel);
                setModel(nextModel);
              }}
              pivotModel={pivotModel}
            />
          );
        }
        await render(<Controlled />);
        await activatePivot();
        await act(async () => apiRef.current!.addComputedColumn(ratio));
        await act(async () => apiRef.current!.setPivotActive(false));
        expect(onComputedColumnsChange).toHaveBeenCalledTimes(1);
        expect(getModelFields()).to.deep.equal(['total', 'ratio']);
        expect(getFields()).to.include('ratio');
      });
    });
  });
});
