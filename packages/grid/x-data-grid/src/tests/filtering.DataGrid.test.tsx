import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGrid,
  DataGridProps,
  GridFilterInputValue,
  GridFilterInputValueProps,
  GridFilterItem,
  GridPreferencePanelsValue,
  GridToolbar,
} from '@mui/x-data-grid';
import { getColumnValues } from 'test/utils/helperFn';

function setColumnValue(columnValue: string) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Columns' }), {
    target: { value: columnValue },
  });
}

function setOperatorValue(operatorValue: string) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
    target: { value: operatorValue },
  });
}

function setValue(field: string, value: string) {
  const numberInput = screen.queryByRole('spinbutton', { name: 'Value' });
  if (numberInput) {
    return fireEvent.change(numberInput, { target: { value } });
  }

  const textInput = screen.queryByRole('textbox', { name: 'Value' });
  if (textInput) {
    return fireEvent.change(textInput, { target: { value } });
  }

  const selectInput = screen.queryByRole('combobox', { name: 'Value' });
  if (selectInput) {
    return fireEvent.change(selectInput, {
      target: { value },
    });
  }

  throw new Error("Can't update the UI for this type");
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
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
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

  const TestCase = (props: Partial<DataGridProps>) => {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} {...props} />
      </div>
    );
  };

  describe('props: filterModel', () => {
    it('should throw for more than one filter item', () => {
      expect(() => {
        render(
          <TestCase
            rows={[]}
            columns={[]}
            filterModel={{
              items: [
                { id: 0, columnField: 'id' },
                { id: 1, columnField: 'id' },
              ],
            }}
          />,
        );
      }).toErrorDev('`model.items` has more than 1 item');
    });

    it('should apply the model', () => {
      render(
        <TestCase
          filterModel={{ items: [{ columnField: 'brand', operatorValue: 'contains', value: 'a' }] }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should apply the model when filtering extended columns', () => {
      render(
        <TestCase
          rows={[
            { id: 0, price: 0 },
            { id: 1, price: 1 },
          ]}
          columnTypes={{ price: { extendType: 'number' } }}
          columns={[{ field: 'price', type: 'price' }]}
          filterModel={{
            items: [{ columnField: 'price', operatorValue: '=', value: 1 }],
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should apply the model when row prop changes', () => {
      render(
        <TestCase
          filterModel={{ items: [{ columnField: 'brand', operatorValue: 'contains', value: 'a' }] }}
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
      expect(getColumnValues(0)).to.deep.equal(['Asics']);
    });

    it('should support new dataset', () => {
      const { setProps } = render(
        <TestCase
          filterModel={{ items: [{ columnField: 'brand', operatorValue: 'contains', value: 'a' }] }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
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
        filterModel: { items: [{ columnField: 'country', operatorValue: 'contains', value: 'a' }] },
      });
      expect(getColumnValues(0)).to.deep.equal(['France']);
    });
  });

  describe('props: initialState.filter', () => {
    it('should allow to initialize the filterModel', () => {
      render(
        <TestCase
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
        <TestCase
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
        <TestCase
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
        <TestCase
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
      setValue('isPublished', 'false');
      expect(getColumnValues(0)).to.deep.equal(['Nike']);
    });
  });

  describe('column type: string', () => {
    const getRows = (item: Omit<GridFilterItem, 'columnField'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'country', ...item }],
          }}
          rows={[
            { id: 0, country: undefined },
            { id: 1, country: null },
            { id: 2, country: '' },
            { id: 3, country: 'United States' },
            { id: 4, country: 'Germany' },
          ]}
          columns={[
            {
              field: 'country',
              type: 'string',
            },
          ]}
        />,
      );

      const values = getColumnValues(0);
      unmount();
      return values;
    };

    const ALL_ROWS = ['', '', '', 'United States', 'Germany'];

    it('should filter with operator "contains"', () => {
      expect(getRows({ operatorValue: 'contains', value: 'United' })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'contains', value: 'united' })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'contains', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'contains', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "equals"', () => {
      expect(getRows({ operatorValue: 'equals', value: 'United States' })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'equals', value: 'united states' })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'equals', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'equals', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "startsWith"', () => {
      expect(getRows({ operatorValue: 'startsWith', value: 'unit' })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'startsWith', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'startsWith', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "endWith"', () => {
      expect(getRows({ operatorValue: 'endsWith', value: 'ates' })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'endsWith', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'endsWith', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isAnyOf"', () => {
      expect(getRows({ operatorValue: 'isAnyOf', value: ['United States'] })).to.deep.equal([
        'United States',
      ]);
      expect(getRows({ operatorValue: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operatorValue: 'isEmpty' })).to.deep.equal(['', '', '']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operatorValue: 'isNotEmpty' })).to.deep.equal(['United States', 'Germany']);
    });

    // TODO: Clean
    describe('RegExp', () => {
      ['contains', 'startsWith', 'endsWith'].forEach((operatorValue) => {
        it('should escape RegExp characters if applied as filter values', () => {
          const regExpToEscape = '[-[]{}()*+?.,\\^$|#s]';
          render(
            <TestCase
              filterModel={{
                items: [{ columnField: 'brand', operatorValue, value: regExpToEscape }],
              }}
            />,
          );
          expect(getColumnValues(0)).to.deep.equal([]);
        });
      });

      it('should allow regex special as literals and return rows with the matched input', () => {
        render(
          <TestCase
            filterModel={{
              items: [{ columnField: 'brand', operatorValue: 'contains', value: '.com,' }],
            }}
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
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Amazon.com, Inc.', 'Amazon.com,']);
      });
    });
  });

  describe('column type: number', () => {
    const getRows = (item: Omit<GridFilterItem, 'columnField'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'year', ...item }],
          }}
          rows={[
            { id: 0, year: undefined },
            { id: 1, year: null },
            { id: 2, year: '' },
            { id: 3, year: 0 },
            {
              id: 4,
              year: 1954,
            },
            {
              id: 5,
              year: 1974,
            },
            {
              id: 6,
              year: 1984,
            },
          ]}
          columns={[
            {
              field: 'year',
              type: 'number',
              // Avoid the localization of the number to simplify the checks
              valueFormatter: (params) => params.value,
            },
          ]}
        />,
      );

      const values = getColumnValues(0);
      unmount();
      return values;
    };

    const ALL_ROWS = ['', '', '', '0', '1954', '1974', '1984'];

    it('should filter with operator "="', () => {
      expect(getRows({ operatorValue: '=', value: 1974 })).to.deep.equal(['1974']);
      expect(getRows({ operatorValue: '=', value: 0 })).to.deep.equal(['', '0']);
      expect(getRows({ operatorValue: '=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: '=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "!"', () => {
      expect(getRows({ operatorValue: '!=', value: 1974 })).to.deep.equal([
        '',
        '',
        '',
        '0',
        '1954',
        '1984',
      ]);
      expect(getRows({ operatorValue: '!=', value: 0 })).to.deep.equal([
        '',
        '',
        '1954',
        '1974',
        '1984',
      ]);
      expect(getRows({ operatorValue: '!=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: '!=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator ">"', () => {
      expect(getRows({ operatorValue: '>', value: 1974 })).to.deep.equal(['1984']);
      expect(getRows({ operatorValue: '>', value: 0 })).to.deep.equal(['1954', '1974', '1984']);
      expect(getRows({ operatorValue: '>', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: '>', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator ">=', () => {
      expect(getRows({ operatorValue: '>=', value: 1974 })).to.deep.equal(['1974', '1984']);
      expect(getRows({ operatorValue: '>=', value: 0 })).to.deep.equal([
        '',
        '0',
        '1954',
        '1974',
        '1984',
      ]);
      expect(getRows({ operatorValue: '>=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: '>=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "<"', () => {
      expect(getRows({ operatorValue: '<', value: 1974 })).to.deep.equal(['', '0', '1954']);
      expect(getRows({ operatorValue: '<', value: 0 })).to.deep.equal([]);
      expect(getRows({ operatorValue: '<', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: '<', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "<="', () => {
      expect(getRows({ operatorValue: '<=', value: 1974 })).to.deep.equal([
        '',
        '0',
        '1954',
        '1974',
      ]);
      expect(getRows({ operatorValue: '<=', value: 0 })).to.deep.equal(['', '0']);
      expect(getRows({ operatorValue: '<=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: '<=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isAnyOf"', () => {
      expect(getRows({ operatorValue: 'isAnyOf', value: [1954, 1984] })).to.deep.equal([
        '1954',
        '1984',
      ]);
      expect(getRows({ operatorValue: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operatorValue: 'isEmpty' })).to.deep.equal(['', '']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operatorValue: 'isNotEmpty' })).to.deep.equal([
        '',
        '0',
        '1954',
        '1974',
        '1984',
      ]);
    });
  });

  describe('column type: date', () => {
    const getRows = (item: Omit<GridFilterItem, 'columnField'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'date', ...item }],
          }}
          rows={[
            {
              id: 0,
              date: undefined,
            },
            {
              id: 1,
              date: null,
            },
            {
              id: 2,
              date: '',
            },
            {
              id: 3,
              date: new Date(2000, 0, 1),
            },
            {
              id: 4,
              date: new Date(2001, 0, 1),
            },
            {
              id: 5,
              date: new Date(2001, 0, 1, 8, 30),
            },
            {
              id: 6,
              date: new Date(2002, 0, 1),
            },
          ]}
          columns={[
            {
              field: 'date',
              type: 'date',
              // Avoid the localization of the date to simplify the checks
              valueFormatter: (params) => {
                const value = params.value as Date | null | undefined | string;

                if (value === null) {
                  return 'null';
                }

                if (value === undefined) {
                  return 'undefined';
                }

                if (value === '') {
                  return '';
                }

                return value.toLocaleString('en-US');
              },
            },
          ]}
        />,
      );

      const values = getColumnValues(0);
      unmount();
      return values;
    };

    const ALL_ROWS = [
      'undefined',
      'null',
      '',
      '1/1/2000, 12:00:00 AM',
      '1/1/2001, 12:00:00 AM',
      '1/1/2001, 8:30:00 AM',
      '1/1/2002, 12:00:00 AM',
    ];

    it('should filter with operator "is"', () => {
      expect(getRows({ operatorValue: 'is', value: '2001-01-01' })).to.deep.equal([
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'is', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "not"', () => {
      // TODO: Should this filter return the invalid dates like for the numeric filters ?
      expect(getRows({ operatorValue: 'not', value: '2001-01-01' })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operatorValue: 'not', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'not', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "before"', () => {
      expect(getRows({ operatorValue: 'before', value: '2001-01-01' })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
      ]);
      expect(getRows({ operatorValue: 'before', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'before', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrBefore"', () => {
      expect(getRows({ operatorValue: 'onOrBefore', value: '2001-01-01' })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'onOrBefore', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'onOrBefore', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "after"', () => {
      expect(getRows({ operatorValue: 'after', value: '2001-01-01' })).to.deep.equal([
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operatorValue: 'after', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'after', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrAfter"', () => {
      expect(getRows({ operatorValue: 'onOrAfter', value: '2001-01-01' })).to.deep.equal([
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operatorValue: 'onOrAfter', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'onOrAfter', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operatorValue: 'isEmpty' })).to.deep.equal(['undefined', 'null']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operatorValue: 'isNotEmpty' })).to.deep.equal([
        '',
        '1/1/2000, 12:00:00 AM',
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
    });
  });

  describe('column type: dateTime', () => {
    const getRows = (item: Omit<GridFilterItem, 'columnField'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'date', ...item }],
          }}
          rows={[
            {
              id: 0,
              date: undefined,
            },
            {
              id: 1,
              date: null,
            },
            {
              id: 2,
              date: '',
            },
            {
              id: 3,
              date: new Date(2001, 0, 1, 6, 30),
            },
            {
              id: 4,
              date: new Date(2001, 0, 1, 7, 30),
            },
            {
              id: 5,
              date: new Date(2001, 0, 1, 8, 30),
            },
          ]}
          columns={[
            {
              field: 'date',
              type: 'dateTime',
              // Avoid the localization of the date to simplify the checks
              valueFormatter: (params) => {
                const value = params.value as Date | null | undefined | string;

                if (value === null) {
                  return 'null';
                }

                if (value === undefined) {
                  return 'undefined';
                }

                if (value === '') {
                  return '';
                }

                return value.toLocaleString('en-US');
              },
            },
          ]}
        />,
      );

      const values = getColumnValues(0);
      unmount();
      return values;
    };

    const ALL_ROWS = [
      'undefined',
      'null',
      '',
      '1/1/2001, 6:30:00 AM',
      '1/1/2001, 7:30:00 AM',
      '1/1/2001, 8:30:00 AM',
    ];

    it('should filter with operator "is"', () => {
      expect(getRows({ operatorValue: 'is', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 7:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'is', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "not"', () => {
      // TODO: Should this filter return the invalid dates like for the numeric filters ?
      expect(getRows({ operatorValue: 'not', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'not', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'not', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "before"', () => {
      expect(getRows({ operatorValue: 'before', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'before', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'before', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrBefore"', () => {
      expect(getRows({ operatorValue: 'onOrBefore', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 7:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'onOrBefore', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'onOrBefore', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "after"', () => {
      expect(getRows({ operatorValue: 'after', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'after', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'after', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrAfter"', () => {
      expect(getRows({ operatorValue: 'onOrAfter', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 7:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operatorValue: 'onOrAfter', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'onOrAfter', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operatorValue: 'isEmpty' })).to.deep.equal(['undefined', 'null']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operatorValue: 'isNotEmpty' })).to.deep.equal([
        '',
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 7:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
    });
  });

  describe('column type: boolean', () => {
    const getRows = (item: Omit<GridFilterItem, 'columnField'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'isPublished', ...item }],
          }}
          rows={[
            {
              id: 0,
              isPublished: undefined,
            },
            {
              id: 1,
              isPublished: null,
            },
            {
              id: 2,
              isPublished: true,
            },
            {
              id: 3,
              isPublished: false,
            },
          ]}
          columns={[
            {
              field: 'isPublished',
              type: 'boolean',
              // The boolean cell does not handle the formatted value to we override it
              renderCell: (params) => {
                const value = params.value as boolean | null | undefined;

                if (value === null) {
                  return 'null';
                }

                if (value === undefined) {
                  return 'undefined';
                }

                return value.toString();
              },
            },
          ]}
        />,
      );

      const values = getColumnValues(0);
      unmount();
      return values;
    };

    const ALL_ROWS = ['undefined', 'null', 'true', 'false'];

    it('should filter with operator "is"', () => {
      expect(getRows({ operatorValue: 'is', value: 'true' })).to.deep.equal(['true']);
      expect(getRows({ operatorValue: 'is', value: '' })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
    });
  });

  describe('column type: singleSelect', () => {
    const getRows = (item: GridFilterItem) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [item],
          }}
          rows={[
            {
              id: 0,
              country: undefined,
              year: undefined,
            },
            {
              id: 1,
              country: null,
              year: null,
            },
            {
              id: 2,
              country: 'United States',
              year: 1974,
            },
            {
              id: 3,
              country: 'Germany',
              year: 1984,
            },
          ]}
          columns={[
            {
              field: 'country',
              type: 'singleSelect',
              valueOptions: ['United States', 'Germany', 'France'],
            },
            {
              field: 'year',
              type: 'singleSelect',
              valueOptions: [
                { label: 'Year 1974', value: 1974 },
                { label: 'Year 1984', value: 1984 },
              ],
            },
          ]}
        />,
      );

      const values = {
        country: getColumnValues(0),
        year: getColumnValues(1),
      };
      unmount();
      return values;
    };

    const ALL_ROWS_COUNTRY = ['', '', 'United States', 'Germany'];
    const ALL_ROWS_YEAR = ['', '', '1974', '1984'];

    it('should filter with operator "is"', () => {
      // With simple options
      expect(
        getRows({ columnField: 'country', operatorValue: 'is', value: 'United States' }).country,
      ).to.deep.equal(['United States']);
      expect(
        getRows({ columnField: 'country', operatorValue: 'is', value: undefined }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);
      expect(
        getRows({ columnField: 'country', operatorValue: 'is', value: '' }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);

      // With object options
      expect(getRows({ columnField: 'year', operatorValue: 'is', value: 1974 }).year).to.deep.equal(
        ['1974'],
      );
      expect(
        getRows({ columnField: 'year', operatorValue: 'is', value: undefined }).year,
      ).to.deep.equal(ALL_ROWS_YEAR);
      expect(getRows({ columnField: 'year', operatorValue: 'is', value: '' }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
    });

    it('should filter with operator "not"', () => {
      // With simple options
      expect(
        getRows({ columnField: 'country', operatorValue: 'not', value: 'United States' }).country,
      ).to.deep.equal(['', '', 'Germany']);
      expect(
        getRows({ columnField: 'country', operatorValue: 'not', value: undefined }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);
      expect(
        getRows({ columnField: 'country', operatorValue: 'not', value: '' }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);

      // With object options
      expect(
        getRows({ columnField: 'year', operatorValue: 'not', value: 1974 }).year,
      ).to.deep.equal(['', '', '1984']);
      expect(
        getRows({ columnField: 'year', operatorValue: 'not', value: undefined }).year,
      ).to.deep.equal(ALL_ROWS_YEAR);
      expect(getRows({ columnField: 'year', operatorValue: 'not', value: '' }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
    });

    it('should filter with operator "isAnyOf"', () => {
      // With simple options
      expect(
        getRows({ columnField: 'country', operatorValue: 'isAnyOf', value: ['United States'] })
          .country,
      ).to.deep.equal(['United States']);
      expect(
        getRows({ columnField: 'country', operatorValue: 'isAnyOf', value: [] }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);
      expect(
        getRows({ columnField: 'country', operatorValue: 'isAnyOf', value: undefined }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);

      // With object options
      expect(
        getRows({ columnField: 'year', operatorValue: 'isAnyOf', value: [1974] }).year,
      ).to.deep.equal(['1974']);
      expect(
        getRows({ columnField: 'year', operatorValue: 'isAnyOf', value: [] }).year,
      ).to.deep.equal(ALL_ROWS_YEAR);
      expect(
        getRows({ columnField: 'year', operatorValue: 'isAnyOf', value: undefined }).year,
      ).to.deep.equal(ALL_ROWS_YEAR);
    });

    it('should works with valueParser', () => {
      const valueOptions = [
        { value: 0, label: 'Payment Pending' },
        { value: 1, label: 'Shipped' },
        { value: 2, label: 'Delivered' },
      ];

      const { setProps } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'status', operatorValue: 'is', value: 0 }],
          }}
          columns={[
            { field: 'brand' },
            {
              field: 'status',
              type: 'singleSelect',
              valueOptions,
              valueParser: (value) => {
                if (typeof value === 'number') {
                  return valueOptions.find((option) => option.value === value);
                }
                return value;
              },
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas']);
      setProps({
        filterModel: {
          items: [{ columnField: 'status', operatorValue: 'not', value: 0 }],
        },
      });
      expect(getColumnValues(0)).to.deep.equal(['Puma']);
      setProps({
        filterModel: {
          items: [{ columnField: 'status', operatorValue: 'isAnyOf', value: [0, 2] }],
        },
      });
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });

    it('should support a function for `valueOptions`', () => {
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
          filterModel={{
            items: [{ columnField: 'voltage', operatorValue: 'is' }],
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
      setProps({
        filterModel: { items: [{ columnField: 'voltage', operatorValue: 'is', value: 220 }] },
      });
      expect(getColumnValues(0)).to.deep.equal(['Hair Dryer', 'Microwave']);
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
          filterModel={{ items: [{ columnField: 'voltage', operatorValue: 'is' }] }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
      setProps({
        filterModel: { items: [{ columnField: 'voltage', operatorValue: 'is', value: 220 }] },
      });
      expect(getColumnValues(0)).to.deep.equal(['Hair Dryer', 'Microwave']);
    });
  });

  it('should translate operators dynamically in toolbar without crashing ', () => {
    expect(() => {
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
    }).not.to.throw();
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
        filterModel={{
          items: [
            {
              columnField: 'amount',
              operatorValue: '=',
              value: 50,
            },
          ],
        }}
      />,
    );
    expect(getColumnValues(0)).to.deep.equal(['0.5']);
  });

  it('should include value-less operators when displaying the number of active filters', () => {
    render(
      <TestCase
        filterModel={{
          items: [
            {
              columnField: 'brand',
              operatorValue: 'isNotEmpty',
            },
          ],
        }}
      />,
    );
    expect(screen.queryByLabelText('1 active filter')).not.to.equal(null);
  });

  describe('Filter panel', () => {
    it('should show an empty string as the default filter input value', () => {
      render(
        <TestCase
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
          filterModel={{ items: [{ columnField: 'brand', operatorValue: 'contains' }] }}
        />,
      );
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
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('equals');
      expect(getColumnValues(0)).to.deep.equal(['Puma']);

      setColumnValue('slogan');

      expect(getColumnValues(0)).to.deep.equal([]);
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
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('contains');
      expect(getColumnValues(0)).to.deep.equal(['Puma']);

      setColumnValue('slogan');

      expect(getColumnValues(0)).to.deep.equal([]);
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
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
          onFilterModelChange={onFilterModelChange}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
      expect(screen.getByRole('combobox', { name: 'Operators' }).value).to.equal('contains');
      expect(getColumnValues(0)).to.deep.equal(['Puma']);

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
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['REF_2']);

      setColumnValue('origin');

      expect(getColumnValues(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
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
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['REF_1']);

      setColumnValue('origin');

      expect(getColumnValues(0)).to.deep.equal(['REF_2', 'REF_3']);
    });

    it('should reset filter value if not available in the new valueOptions with isAnyOperator', () => {
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
                items: [{ columnField: 'destination', operatorValue: 'isAnyOf', value: ['UK'] }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['REF_2']);
      setColumnValue('origin');
      expect(getColumnValues(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
    });

    it('should keep the value if available in the new valueOptions with isAnyOperator', () => {
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
                items: [{ columnField: 'destination', operatorValue: 'isAnyOf', value: ['GE'] }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['REF_1']);
      setColumnValue('origin');
      expect(getColumnValues(0)).to.deep.equal(['REF_2', 'REF_3']);
    });

    it('should reset filter value if moving from multiple to single value operator', () => {
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
                items: [{ columnField: 'destination', operatorValue: 'isAnyOf', value: ['UK'] }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['REF_2']);

      setOperatorValue('is');

      expect(getColumnValues(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
    });
  });
});
