import * as React from 'react';
import { createRenderer, fireEvent, screen, getByText } from '@material-ui/monorepo/test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGrid,
  GridToolbar,
  GridPreferencePanelsValue,
  DataGridProps,
  GridFilterInputValueProps,
  GridFilterInputValue,
} from '@mui/x-data-grid';
import { getColumnValues } from 'test/utils/helperFn';

function setColumnValue(columnValue) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Columns' }), {
    target: { value: columnValue },
  });
}

function setOperatorValue(operatorValue) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
    target: { value: operatorValue },
  });
}

function CustomInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue } = props;

  const handleFilterChange = (event) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <input
      name="custom-filter-operator"
      placeholder="Filter value"
      value={item.value}
      onChange={handleFilterChange}
      data-testid="customInput"
    />
  );
}

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Filter', () => {
  const { clock, render } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        slogan: 'just do it',
        isPublished: false,
        country: 'United States',
        status: 0,
      },
      {
        id: 1,
        brand: 'Adidas',
        slogan: 'is all in',
        isPublished: true,
        country: 'Germany',
        status: 0,
      },
      {
        id: 2,
        brand: 'Puma',
        slogan: 'Forever Faster',
        isPublished: true,
        country: 'Germany',
        status: 2,
      },
    ],
    columns: [
      { field: 'brand' },
      {
        field: 'slogan',
        filterOperators: [
          {
            label: 'From',
            value: 'from',
            getApplyFilterFn: () => {
              return () => false;
            },
            InputComponent: CustomInputValue,
          },
          {
            value: 'equals',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.value) {
                return null;
              }
              const collator = new Intl.Collator(undefined, {
                sensitivity: 'base',
                usage: 'search',
              });
              return ({ value }): boolean => {
                return collator.compare(filterItem.value, (value && value.toString()) || '') === 0;
              };
            },
            InputComponent: GridFilterInputValue,
          },
        ],
      },
      { field: 'isPublished', type: 'boolean' },
      {
        field: 'country',
        type: 'singleSelect',
        valueOptions: ['United States', 'Germany', 'France'],
      },
      {
        field: 'status',
        type: 'singleSelect',
        valueOptions: [
          { value: 0, label: 'Payment Pending' },
          { value: 1, label: 'Shipped' },
          { value: 2, label: 'Delivered' },
        ],
      },
    ],
  };

  const TestCase = (
    props: {
      columns?: any[];
      operatorValue?: string;
      value?: any;
      field?: string;
    } & Partial<Omit<DataGridProps, 'columns'>>,
  ) => {
    const { operatorValue, value, rows, columns, field = 'brand', initialState, ...other } = props;
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          autoHeight={isJSDOM}
          columns={columns || baselineProps.columns}
          rows={rows || baselineProps.rows}
          filterModel={
            initialState
              ? undefined
              : {
                  items: [
                    {
                      columnField: field,
                      value,
                      operatorValue,
                    },
                  ],
                }
          }
          disableColumnFilter={false}
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            ...initialState,
          }}
          {...other}
        />
      </div>
    );
  };

  it('should throw for more than one filter item', () => {
    expect(() => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={[]}
            columns={[]}
            filterModel={{
              items: [
                { id: 0, columnField: 'id' },
                { id: 1, columnField: 'id' },
              ],
            }}
          />
        </div>,
      );
    })
      // @ts-expect-error need to migrate helpers to TypeScript
      .toErrorDev('`model.items` has more than 1 item');
  });

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase value="a" operatorValue="contains" />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly when filtering extended columns', () => {
    render(
      <TestCase
        rows={[
          { id: 0, price: 0 },
          { id: 1, price: 1 },
        ]}
        columnTypes={{ price: { extendType: 'number' } }}
        columns={[{ field: 'price', type: 'price' }]}
        field="price"
        value={1}
        operatorValue="="
      />,
    );
    expect(getColumnValues()).to.deep.equal(['1']);
  });

  it('should apply the filterModel prop correctly when row prop changes', () => {
    render(
      <TestCase
        value="a"
        operatorValue="contains"
        rows={[
          {
            id: 3,
            brand: 'Asics',
          },
          {
            id: 4,
            brand: 'RedBull',
          },
          {
            id: 5,
            brand: 'Hugo',
          },
        ]}
      />,
    );
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  [
    { operatorValue: '', value: '2000-12-01' },
    { operatorValue: '', value: '' },
  ].forEach(({ operatorValue, value }) => {
    it(`should not filter when operatorValue='${operatorValue}' and value='${value}'`, () => {
      render(
        <TestCase
          value={value}
          operatorValue={operatorValue}
          rows={[
            {
              id: 3,
              brand: { date: new Date(2000, 11, 1) },
            },
            {
              id: 4,
              brand: { date: new Date(2001, 0, 1) },
            },
            {
              id: 5,
              brand: { date: new Date(2002, 0, 1) },
            },
          ]}
          columns={[
            {
              field: 'brand',
              type: 'date',
              valueGetter: (params) => params.value.date,
              valueFormatter: (params) => params.value.toLocaleDateString('en-US'),
            },
          ]}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['12/1/2000', '1/1/2001', '1/1/2002']);
    });
  });

  describe('string operators', () => {
    it('should allow operator startsWith', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        operatorValue: 'startsWith',
      });
      expect(getColumnValues()).to.deep.equal(['Adidas']);
    });

    it('should allow operator endsWith', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        operatorValue: 'endsWith',
      });
      expect(getColumnValues()).to.deep.equal(['Puma']);
    });

    it('should allow operator equal', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        operatorValue: 'equals',
        value: 'nike',
      });
      expect(getColumnValues()).to.deep.equal(['Nike']);
    });

    it('should allow operator isEmpty', () => {
      const rows = [
        {
          id: 0,
          brand: 'Nike',
          country: 'United States',
        },
        {
          id: 1,
          brand: 'Adidas',
          country: null,
        },
        {
          id: 2,
          brand: 'Puma',
          country: '',
        },
      ];
      render(
        <TestCase
          operatorValue="isEmpty"
          field="country"
          columns={[{ field: 'brand' }, { field: 'country' }]}
          rows={rows}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should allow operator isNotEmpty', () => {
      const rows = [
        {
          id: 0,
          brand: 'Nike',
          country: 'United States',
        },
        {
          id: 1,
          brand: 'Adidas',
          country: null,
        },
        {
          id: 2,
          brand: 'Puma',
          country: '',
        },
      ];
      render(
        <TestCase
          operatorValue="isNotEmpty"
          field="country"
          columns={[{ field: 'brand' }, { field: 'country' }]}
          rows={rows}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['Nike']);
    });

    [
      { operatorValue: 'contains', value: 'a', expected: ['Asics'] },
      { operatorValue: 'startsWith', value: 'r', expected: ['RedBull'] },
      { operatorValue: 'equals', value: 'hugo', expected: ['Hugo'] },
      { operatorValue: 'endsWith', value: 'ics', expected: ['Asics'] },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should allow object as value and work with valueGetter, operatorValue: ${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { name: 'Asics' },
              },
              {
                id: 4,
                brand: { name: 'RedBull' },
              },
              {
                id: 5,
                brand: { name: 'Hugo' },
              },
            ]}
            columns={[{ field: 'brand', valueGetter: (params) => params.value.name }]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });

    ['contains', 'startsWith', 'equals', 'endsWith'].forEach((operatorValue) => {
      it(`should show all rows when the value is '' and operator='${operatorValue}'`, () => {
        render(
          <TestCase
            filterModel={undefined}
            columns={[{ field: 'brand' }]}
            rows={[
              {
                id: 3,
                brand: 'Asics',
              },
              {
                id: 4,
                brand: 'RedBull',
              },
              {
                id: 5,
                brand: 'Hugo',
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Asics', 'RedBull', 'Hugo']);
        fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
          target: { value: operatorValue },
        });
        const input = screen.getByRole('textbox', { name: 'Value' });
        fireEvent.change(input, { target: { value: 'abc' } });
        clock.tick(500);
        expect(getColumnValues()).to.deep.equal([]);
        fireEvent.change(input, { target: { value: '' } });
        clock.tick(500);
        expect(getColumnValues()).to.deep.equal(['Asics', 'RedBull', 'Hugo']);
      });
    });

    describe('RegExp', () => {
      ['contains', 'startsWith', 'endsWith'].forEach((operatorValue) => {
        it('should escape RegExp characters if applied as filter values', () => {
          const regExpToEscape = '[-[]{}()*+?.,\\^$|#s]';
          render(<TestCase value={regExpToEscape} operatorValue={operatorValue} />);
          expect(getColumnValues()).to.deep.equal([]);
        });
      });

      it('should allow regex special as literals and return rows with the matched input', () => {
        render(
          <TestCase
            rows={[
              {
                id: 0,
                brand: 'Amazon',
              },
              {
                id: 1,
                brand: 'Amazon.com, Inc.',
              },
              {
                id: 2,
                brand: 'Amazon.com,',
              },
            ]}
            value=".com,"
            operatorValue="contains"
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Amazon.com, Inc.', 'Amazon.com,']);
      });
    });
  });

  describe('numeric operators', () => {
    [
      { operatorValue: '=', value: 1984, expected: [1984] },
      { operatorValue: '!=', value: 1984, expected: ['', '', 0, 1954, 1974] },
      { operatorValue: '>', value: 1974, expected: [1984] },
      { operatorValue: '>=', value: 1974, expected: [1984, 1974] },
      { operatorValue: '<', value: 1974, expected: [0, 1954] },
      { operatorValue: '<=', value: 1974, expected: [0, 1954, 1974] },
      { operatorValue: '=', value: 0, expected: [0] },
      { operatorValue: '!=', value: 0, expected: ['', '', 1984, 1954, 1974] },
      { operatorValue: '>', value: 0, expected: [1984, 1954, 1974] },
      { operatorValue: '>=', value: 0, expected: [0, 1984, 1954, 1974] },
      { operatorValue: '<', value: 0, expected: [] },
      { operatorValue: '<=', value: 0, expected: [0] },
      { operatorValue: '=', value: undefined, expected: ['', '', 0, 1984, 1954, 1974] },
      { operatorValue: '!=', value: undefined, expected: ['', '', 0, 1984, 1954, 1974] },
      { operatorValue: '>', value: undefined, expected: ['', '', 0, 1984, 1954, 1974] },
      { operatorValue: '>=', value: undefined, expected: ['', '', 0, 1984, 1954, 1974] },
      { operatorValue: '<', value: undefined, expected: ['', '', 0, 1984, 1954, 1974] },
      { operatorValue: '<=', value: undefined, expected: ['', '', 0, 1984, 1954, 1974] },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should allow object as value and work with valueGetter, operatorValue: ${operatorValue}, value: '${value}'`, () => {
        render(
          <TestCase
            value={value?.toString()}
            operatorValue={operatorValue}
            rows={[
              { id: 0, brand: { year: undefined } },
              { id: 1, brand: { year: null } },
              { id: 2, brand: { year: 0 } },
              {
                id: 3,
                brand: { year: 1984 },
              },
              {
                id: 4,
                brand: { year: 1954 },
              },
              {
                id: 5,
                brand: { year: 1974 },
              },
            ]}
            columns={[
              { field: 'brand', valueGetter: (params) => params.value.year, type: 'number' },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected.map((res) => res.toLocaleString()));
      });
    });

    it('should allow operator isEmpty', () => {
      const rows = [
        {
          id: 0,
          quantity: 0,
        },
        {
          id: 1,
          quantity: null,
        },
        {
          id: 2,
          quantity: 100,
        },
      ];
      render(
        <TestCase
          operatorValue="isEmpty"
          field="quantity"
          columns={[{ field: 'id' }, { field: 'quantity', type: 'number' }]}
          rows={rows}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should allow operator isNotEmpty', () => {
      const rows = [
        {
          id: 0,
          quantity: 0,
        },
        {
          id: 1,
          quantity: null,
        },
        {
          id: 2,
          quantity: 100,
        },
      ];
      render(
        <TestCase
          operatorValue="isNotEmpty"
          field="quantity"
          columns={[{ field: 'id' }, { field: 'quantity', type: 'number' }]}
          rows={rows}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '2']);
    });

    it('should show all rows when the value is empty', () => {
      render(
        <TestCase
          filterModel={undefined}
          columns={[
            { field: 'brand', type: 'number', valueFormatter: ({ value }) => String(value) },
          ]}
          rows={[
            { id: 2, brand: 0 },
            { id: 3, brand: 1984 },
            { id: 4, brand: 1954 },
            { id: 5, brand: 1974 },
          ]}
        />,
        { strict: false, strictEffects: false },
      );
      expect(getColumnValues()).to.deep.equal(['0', '1984', '1954', '1974']);
      const input = screen.getByRole('spinbutton', { name: 'Value' });
      fireEvent.change(input, { target: { value: 999999 } });
      clock.tick(500);
      expect(getColumnValues()).to.deep.equal([]);
      fireEvent.change(input, { target: { value: '' } });
      clock.tick(500);
      expect(getColumnValues()).to.deep.equal(['0', '1984', '1954', '1974']);
    });
  });

  describe('date operators', () => {
    [
      { operatorValue: 'is', value: '' },
      { operatorValue: 'is', value: undefined },
    ].forEach(({ operatorValue, value }) => {
      it(`should not filter when operatorValue='${operatorValue}' and value='${value}'`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { date: new Date(2000, 11, 1) },
              },
              {
                id: 4,
                brand: { date: new Date(2001, 0, 1) },
              },
              {
                id: 5,
                brand: { date: new Date(2002, 0, 1) },
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'date',
                valueGetter: (params) => params.value.date,
                valueFormatter: (params) => params.value.toLocaleDateString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(['12/1/2000', '1/1/2001', '1/1/2002']);
      });

      it('should allow operator isEmpty', () => {
        const rows = [
          {
            id: 0,
            date: new Date(1984, 1, 1),
          },
          {
            id: 1,
            date: null,
          },
          {
            id: 2,
            date: new Date(1992, 1, 1),
          },
        ];
        render(
          <TestCase
            operatorValue="isEmpty"
            field="date"
            columns={[{ field: 'id' }, { field: 'date', type: 'date' }]}
            rows={rows}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['1']);
      });

      it('should allow operator isNotEmpty', () => {
        const rows = [
          {
            id: 0,
            date: new Date(1984, 1, 1),
          },
          {
            id: 1,
            date: null,
          },
          {
            id: 2,
            date: new Date(1992, 1, 1),
          },
        ];
        render(
          <TestCase
            operatorValue="isNotEmpty"
            field="date"
            columns={[{ field: 'id' }, { field: 'date', type: 'date' }]}
            rows={rows}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['0', '2']);
      });
    });

    it('should filter out rows with invalid values', () => {
      render(
        <TestCase
          value="2001-01-01"
          operatorValue="before"
          rows={[
            {
              id: 3,
              brand: { date: new Date(2000, 11, 1) },
            },
            {
              id: 4,
              brand: { date: '' },
            },
            {
              id: 5,
              brand: { date: null },
            },
          ]}
          columns={[
            {
              field: 'brand',
              type: 'date',
              valueGetter: (params) => params.value.date,
              valueFormatter: (params) =>
                params.value instanceof Date
                  ? params.value.toLocaleDateString('en-US')
                  : params.value,
            },
          ]}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['12/1/2000']);
    });

    [
      { operatorValue: 'is', value: '2000-12-01', expected: ['12/1/2000'] },
      { operatorValue: 'not', value: '2000-12-01', expected: ['1/1/2001', '1/1/2002'] },
      { operatorValue: 'after', value: '2001-01-01', expected: ['1/1/2002'] },
      { operatorValue: 'onOrAfter', value: '2001-01-01', expected: ['1/1/2001', '1/1/2002'] },
      { operatorValue: 'before', value: '2001-01-01', expected: ['12/1/2000'] },
      { operatorValue: 'onOrBefore', value: '2001-01-01', expected: ['12/1/2000', '1/1/2001'] },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should allow object as value and work with valueGetter, operatorValue: ${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { date: new Date(2000, 11, 1) },
              },
              {
                id: 4,
                brand: { date: new Date(2001, 0, 1) },
              },
              {
                id: 5,
                brand: { date: new Date(2002, 0, 1) },
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'date',
                valueGetter: (params) => params.value.date,
                valueFormatter: (params) => params.value.toLocaleDateString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });

    [
      {
        operatorValue: 'is',
        value: '2000-12-01',
        expected: ['12/1/2000, 12:00:00 AM', '12/1/2000, 8:30:00 AM'],
      },
      {
        operatorValue: 'not',
        value: '2000-12-01',
        expected: [
          '1/1/2001, 12:00:00 AM',
          '1/1/2001, 8:30:00 AM',
          '1/1/2002, 12:00:00 AM',
          '1/1/2002, 8:30:00 AM',
        ],
      },
      {
        operatorValue: 'after',
        value: '2001-01-01',
        expected: ['1/1/2002, 12:00:00 AM', '1/1/2002, 8:30:00 AM'],
      },
      {
        operatorValue: 'onOrAfter',
        value: '2001-01-01',
        expected: [
          '1/1/2001, 12:00:00 AM',
          '1/1/2001, 8:30:00 AM',
          '1/1/2002, 12:00:00 AM',
          '1/1/2002, 8:30:00 AM',
        ],
      },
      {
        operatorValue: 'before',
        value: '2001-01-01',
        expected: ['12/1/2000, 12:00:00 AM', '12/1/2000, 8:30:00 AM'],
      },
      {
        operatorValue: 'onOrBefore',
        value: '2001-01-01',
        expected: [
          '12/1/2000, 12:00:00 AM',
          '12/1/2000, 8:30:00 AM',
          '1/1/2001, 12:00:00 AM',
          '1/1/2001, 8:30:00 AM',
        ],
      },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should work with dates at different hours, operator ${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: new Date(2000, 11, 1), // 12/1/2000, 12:00:00 AM
              },
              {
                id: 4,
                brand: new Date(2000, 11, 1, 8, 30), // 12/1/2000, 8:30:00 AM
              },
              {
                id: 5,
                brand: new Date(2001, 0, 1), // 1/1/2001, 12:00:00 AM
              },
              {
                id: 6,
                brand: new Date(2001, 0, 1, 8, 30), // 1/1/2001, 08:30:00 AM
              },
              {
                id: 7,
                brand: new Date(2002, 0, 1), // 1/1/2002, 12:00:00 AM
              },
              {
                id: 8,
                brand: new Date(2002, 0, 1, 8, 30), // 1/1/2002, 08:30:00 AM
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'date',
                valueFormatter: (params) => params.value.toLocaleString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });
  });

  describe('dateTime operators', () => {
    [
      {
        operatorValue: 'is',
        value: '2000-12-01T08:30',
        expected: ['12/1/2000, 8:30:15 AM'],
      },
      {
        operatorValue: 'not',
        value: '2000-12-01T08:30',
        expected: ['1/1/2001, 8:30:15 AM', '1/1/2002, 8:30:15 AM'],
      },
      {
        operatorValue: 'after',
        value: '2001-01-01T08:30',
        expected: ['1/1/2002, 8:30:15 AM'],
      },
      {
        operatorValue: 'onOrAfter',
        value: '2001-01-01T08:30',
        expected: ['1/1/2001, 8:30:15 AM', '1/1/2002, 8:30:15 AM'],
      },
      {
        operatorValue: 'before',
        value: '2001-01-01T08:30',
        expected: ['12/1/2000, 8:30:15 AM'],
      },
      {
        operatorValue: 'onOrBefore',
        value: '2001-01-01T08:30',
        expected: ['12/1/2000, 8:30:15 AM', '1/1/2001, 8:30:15 AM'],
      },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should work correctly with operatorValue=${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: new Date(2000, 11, 1, 8, 30, 15, 20), // 12/1/2000, 8:30:15 AM
              },
              {
                id: 4,
                brand: new Date(2001, 0, 1, 8, 30, 15, 20), // 1/1/2001, 08:30:15 AM
              },
              {
                id: 5,
                brand: new Date(2002, 0, 1, 8, 30, 15, 20), // 1/1/2002, 08:30:15 AM
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'dateTime',
                valueFormatter: (params) => params.value.toLocaleString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });
  });

  describe('boolean operators', () => {
    it('should allow operator is', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        field: 'isPublished',
        operatorValue: 'is',
        value: 'false',
      });
      expect(getColumnValues()).to.deep.equal(['Nike']);
      setProps({
        field: 'isPublished',
        operatorValue: 'is',
        value: 'true',
      });
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
      setProps({
        field: 'isPublished',
        operatorValue: 'is',
        value: '',
      });
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
  });

  describe('singleSelect operators', () => {
    describe('simple options', () => {
      it('should allow operator is', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'country',
          operatorValue: 'is',
          value: 'United States',
        });
        expect(getColumnValues()).to.deep.equal(['Nike']);
        setProps({
          field: 'country',
          operatorValue: 'is',
          value: 'Germany',
        });
        expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
        setProps({
          field: 'country',
          operatorValue: 'is',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should allow operator not', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'country',
          operatorValue: 'not',
          value: 'United States',
        });
        expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
        setProps({
          field: 'country',
          operatorValue: 'not',
          value: 'Germany',
        });
        expect(getColumnValues()).to.deep.equal(['Nike']);
        setProps({
          field: 'country',
          operatorValue: 'not',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should work with numeric values', () => {
        const { setProps } = render(
          <TestCase
            rows={[
              { id: 1, name: 'Hair Dryer', voltage: 220 },
              { id: 2, name: 'Dishwasher', voltage: 110 },
              { id: 3, name: 'Microwave', voltage: 220 },
            ]}
            columns={[
              { field: 'name' },
              { field: 'voltage', type: 'singleSelect', valueOptions: [220, 110] },
            ]}
            field="voltage"
            operatorValue="is"
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
        setProps({ value: 220 });
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Microwave']);
      });

      it('should work with function', () => {
        const { setProps } = render(
          <TestCase
            rows={[
              { id: 1, name: 'Hair Dryer', voltage: 220 },
              { id: 2, name: 'Dishwasher', voltage: 110 },
              { id: 3, name: 'Microwave', voltage: 220 },
            ]}
            columns={[
              { field: 'name' },
              {
                field: 'voltage',
                type: 'singleSelect',
                valueOptions: ({ row }) => (row && row.name === 'Dishwasher' ? [110] : [220, 110]),
              },
            ]}
            field="voltage"
            operatorValue="is"
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
        setProps({ value: 220 });
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Microwave']);
      });

      it('should work if valueOptions is not provided', () => {
        const { setProps } = render(
          <TestCase
            rows={[
              { id: 1, name: 'Hair Dryer', voltage: 220 },
              { id: 2, name: 'Dishwasher', voltage: 110 },
              { id: 3, name: 'Microwave', voltage: 220 },
            ]}
            columns={[{ field: 'name' }, { field: 'voltage', type: 'singleSelect' }]}
            field="voltage"
            operatorValue="is"
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
        setProps({ value: 220 });
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Microwave']);
      });
    });

    describe('complex options', () => {
      it('should allow operator is', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'status',
          operatorValue: 'is',
          value: 0,
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas']);
        setProps({
          field: 'status',
          operatorValue: 'is',
          value: 2,
        });
        expect(getColumnValues()).to.deep.equal(['Puma']);
        setProps({
          field: 'status',
          operatorValue: 'is',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should allow operator not', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'status',
          operatorValue: 'not',
          value: 0,
        });
        expect(getColumnValues()).to.deep.equal(['Puma']);
        setProps({
          field: 'status',
          operatorValue: 'not',
          value: 2,
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas']);
        setProps({
          field: 'status',
          operatorValue: 'not',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should work with numeric values', () => {
        const { setProps } = render(<TestCase field="status" operatorValue="is" />);
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        setProps({ value: 2 });
        expect(getColumnValues()).to.deep.equal(['Puma']);
      });
    });
  });

  it('should support new dataset', () => {
    const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    setProps({
      rows: [
        {
          id: 0,
          country: 'France',
        },
        {
          id: 1,
          country: 'UK',
        },
        {
          id: 12,
          country: 'US',
        },
      ],
      columns: [{ field: 'country' }],
      field: 'country',
    });
    expect(getColumnValues()).to.deep.equal(['France']);
  });

  it('should translate operators dynamically in toolbar without crashing ', () => {
    const Test = () => {
      return (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={[
              {
                id: 1,
                quantity: 1,
              },
            ]}
            columns={[{ field: 'quantity', type: 'number', width: 150 }]}
            filterModel={{
              items: [
                {
                  columnField: 'quantity',
                  id: 1619547587572,
                  operatorValue: '=',
                  value: '1',
                },
              ],
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      );
    };
    render(<Test />);
  });

  it('should apply the valueParser onto the filter value', () => {
    render(
      <TestCase
        rows={[
          {
            id: 1,
            amount: 0.5,
          },
          {
            id: 2,
            amount: 1,
          },
        ]}
        columns={[
          {
            field: 'amount',
            type: 'number',
            valueParser: (value) => (value as number) / 100,
          },
        ]}
        operatorValue="="
        value={50}
        field="amount"
      />,
    );
    expect(getColumnValues()).to.deep.equal(['0.5']);
  });

  it('should include value-less operators when displaying the number of active filters', () => {
    const rows = [
      {
        id: 0,
        brand: 'Nike',
        country: 'United States',
      },
      {
        id: 1,
        brand: 'Adidas',
        country: null,
      },
      {
        id: 2,
        brand: 'Puma',
        country: '',
      },
    ];
    render(
      <TestCase
        operatorValue="isNotEmpty"
        field="country"
        columns={[{ field: 'brand' }, { field: 'country' }]}
        rows={rows}
      />,
    );
    expect(screen.queryByLabelText('1 active filter')).not.to.equal(null);
  });

  describe('Filter preference panel', () => {
    it('should show an empty string as the default filter input value', () => {
      render(<TestCase field="brand" operatorValue="contains" />);
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('');
    });

    it('should keep filter operator and value if available', () => {
      render(
        <TestCase
          initialState={{
            filter: {
              filterModel: {
                items: [
                  {
                    columnField: 'brand',
                    value: 'Puma',
                    operatorValue: 'equals',
                  },
                ],
              },
            },
          }}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('equals');
      expect(getColumnValues()).to.deep.equal(['Puma']);

      setColumnValue('slogan');

      expect(getColumnValues()).to.deep.equal([]);
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('equals');
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
    });

    it('should reset value if operator is not available for the new column', () => {
      render(
        <TestCase
          initialState={{
            filter: {
              filterModel: {
                items: [
                  {
                    columnField: 'brand',
                    operatorValue: 'contains',
                    value: 'Pu',
                  },
                ],
              },
            },
          }}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('contains');
      expect(getColumnValues()).to.deep.equal(['Puma']);

      setColumnValue('slogan');

      expect(getColumnValues()).to.deep.equal([]);
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('from');
      expect(screen.getByTestId('customInput').value).to.equal('');
    });

    it('should reset value if the new operator has no input component', () => {
      const onFilterModelChange = spy();

      render(
        <TestCase
          initialState={{
            filter: {
              filterModel: {
                items: [
                  {
                    columnField: 'brand',
                    operatorValue: 'contains',
                    value: 'Pu',
                  },
                ],
              },
            },
          }}
          onFilterModelChange={onFilterModelChange}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('contains');
      expect(getColumnValues()).to.deep.equal(['Puma']);

      expect(onFilterModelChange.callCount).to.equal(0);

      setOperatorValue('isEmpty');

      expect(onFilterModelChange.callCount).to.equal(1);
      expect(onFilterModelChange.lastCall.args[0].items[0].value).to.equal(undefined);

      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('isEmpty');
    });

    it('should reset filter value if not available in the new valueOptions', () => {
      render(
        <TestCase
          rows={[
            { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
            { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
            { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
          ]}
          columns={[
            { field: 'reference' },
            { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
            {
              field: 'destination',
              type: 'singleSelect',
              valueOptions: ['Italy', 'Germany', 'UK'],
            },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'destination', operatorValue: 'is', value: 'UK' }],
              },
            },
          }}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['REF_2']);

      setColumnValue('origin');

      expect(getColumnValues()).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
    });

    it('should keep the value if available in the new valueOptions', () => {
      const IT = { value: 'IT', label: 'Italy' };
      const GE = { value: 'GE', label: 'Germany' };

      render(
        <TestCase
          rows={[
            { id: 1, reference: 'REF_1', origin: 'IT', destination: 'GE' },
            { id: 2, reference: 'REF_2', origin: 'GE', destination: 'UK' },
            { id: 3, reference: 'REF_3', origin: 'GE', destination: 'IT' },
          ]}
          columns={[
            { field: 'reference' },
            { field: 'origin', type: 'singleSelect', valueOptions: [IT, GE] },
            { field: 'destination', type: 'singleSelect', valueOptions: ['IT', 'GE', 'UK'] },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'destination', operatorValue: 'is', value: 'GE' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues()).to.deep.equal(['REF_1']);

      setColumnValue('origin');

      expect(getColumnValues()).to.deep.equal(['REF_2', 'REF_3']);
    });
  });

  describe('prop: initialState.filter', () => {
    const Test = (props: Omit<DataGridProps, 'rows' | 'columns'>) => (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} {...props} />
      </div>
    );

    it('should allow to initialize the filterModel', () => {
      render(
        <Test
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'isPublished', operatorValue: 'is', value: 'true' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should use the control state upon the initialize state when both are defined', () => {
      render(
        <Test
          filterModel={{
            items: [{ columnField: 'isPublished', operatorValue: 'is', value: 'false' }],
          }}
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'isPublished', operatorValue: 'is', value: 'true' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Nike']);
    });

    it('should not update the filters when updating the initial state', () => {
      const { setProps } = render(
        <Test
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'isPublished', operatorValue: 'is', value: 'true' }],
              },
            },
          }}
        />,
      );

      setProps({
        initialState: {
          filter: {
            filterModel: {
              items: [{ columnField: 'isPublished', operatorValue: 'is', value: 'false' }],
            },
          },
        },
      });

      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should allow to update the filters when initialized with initialState', () => {
      render(
        <Test
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              filterModel: {
                items: [{ columnField: 'isPublished', operatorValue: 'is', value: 'true' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);

      fireEvent.change(getByText(screen.getByRole('tooltip'), 'true').parentNode, {
        target: { value: 'false' },
      });
      expect(getColumnValues(0)).to.deep.equal(['Nike']);
    });
  });
});
