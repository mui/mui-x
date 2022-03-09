import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import {
  DataGrid,
  DataGridProps,
  GridFilterItem,
  GridPreferencePanelsValue,
  GridToolbar,
} from '@mui/x-data-grid';
import { getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Filter', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
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
                { id: 0, columnField: 'brand', operatorValue: 'contains' },
                { id: 1, columnField: 'brand', operatorValue: 'contains' },
              ],
            }}
          />,
        );
      }).toErrorDev(
        'MUI: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.',
      );
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
                items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Adidas' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas']);
    });

    it('should use the control state upon the initialize state when both are defined', () => {
      render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Adidas' }],
          }}
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Puma' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas']);
    });

    it('should not update the filters when updating the initial state', () => {
      const { setProps } = render(
        <TestCase
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Adidas' }],
              },
            },
          }}
        />,
      );

      setProps({
        initialState: {
          filter: {
            filterModel: {
              items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Puma' }],
            },
          },
        },
      });

      expect(getColumnValues(0)).to.deep.equal(['Adidas']);
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
                items: [{ columnField: 'brand', operatorValue: 'equals', value: 'Adidas' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas']);
      fireEvent.change(screen.queryByRole('textbox', { name: 'Value' }), {
        target: { value: 'Puma' },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['Puma']);
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
            { id: 3, country: 'France (fr)' },
            { id: 4, country: 'Germany' },
            { id: 5, country: 0 },
            { id: 6, country: 1 },
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

    const ALL_ROWS = ['', '', '', 'France (fr)', 'Germany', '0', '1'];

    it('should filter with operator "contains"', () => {
      expect(getRows({ operatorValue: 'contains', value: 'Fra' })).to.deep.equal(['France (fr)']);

      // Case-insensitive
      expect(getRows({ operatorValue: 'contains', value: 'fra' })).to.deep.equal(['France (fr)']);

      // Number casting
      expect(getRows({ operatorValue: 'contains', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operatorValue: 'contains', value: '1' })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operatorValue: 'contains', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'contains', value: '' })).to.deep.equal(ALL_ROWS);

      // Value with regexp special literal
      expect(getRows({ operatorValue: 'contains', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal(
        [],
      );
      expect(getRows({ operatorValue: 'contains', value: '(fr)' })).to.deep.equal(['France (fr)']);
    });

    it('should filter with operator "equals"', () => {
      expect(getRows({ operatorValue: 'equals', value: 'France (fr)' })).to.deep.equal([
        'France (fr)',
      ]);

      // Case-insensitive
      expect(getRows({ operatorValue: 'equals', value: 'france (fr)' })).to.deep.equal([
        'France (fr)',
      ]);

      // Number casting
      expect(getRows({ operatorValue: 'equals', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operatorValue: 'equals', value: '1' })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operatorValue: 'equals', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'equals', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "startsWith"', () => {
      expect(getRows({ operatorValue: 'startsWith', value: 'Fra' })).to.deep.equal(['France (fr)']);

      // Case-insensitive
      expect(getRows({ operatorValue: 'startsWith', value: 'fra' })).to.deep.equal(['France (fr)']);

      // Empty values
      expect(getRows({ operatorValue: 'startsWith', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'startsWith', value: '' })).to.deep.equal(ALL_ROWS);

      // Number casting
      expect(getRows({ operatorValue: 'startsWith', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operatorValue: 'startsWith', value: '1' })).to.deep.equal(['1']);

      // Value with regexp special literal
      expect(
        getRows({ operatorValue: 'startsWith', value: '[-[]{}()*+?.,\\^$|#s]' }),
      ).to.deep.equal([]);
      expect(getRows({ operatorValue: 'contains', value: 'France (' })).to.deep.equal([
        'France (fr)',
      ]);
    });

    it('should filter with operator "endsWith"', () => {
      expect(getRows({ operatorValue: 'endsWith', value: 'many' })).to.deep.equal(['Germany']);

      // Number casting
      expect(getRows({ operatorValue: 'endsWith', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operatorValue: 'endsWith', value: '1' })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operatorValue: 'endsWith', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'endsWith', value: '' })).to.deep.equal(ALL_ROWS);

      // Value with regexp special literal
      expect(getRows({ operatorValue: 'endsWith', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal(
        [],
      );
      expect(getRows({ operatorValue: 'contains', value: '(fr)' })).to.deep.equal(['France (fr)']);
    });

    it('should filter with operator "isAnyOf"', () => {
      expect(getRows({ operatorValue: 'isAnyOf', value: ['France (fr)'] })).to.deep.equal([
        'France (fr)',
      ]);

      // `isAnyOf` has a `or` behavior
      expect(
        getRows({ operatorValue: 'isAnyOf', value: ['France (fr)', 'Germany'] }),
      ).to.deep.equal(['France (fr)', 'Germany']);

      // Number casting
      expect(getRows({ operatorValue: 'isAnyOf', value: ['0'] })).to.deep.equal(['0']);
      expect(getRows({ operatorValue: 'isAnyOf', value: ['1'] })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operatorValue: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operatorValue: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operatorValue: 'isEmpty' })).to.deep.equal(['', '', '']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operatorValue: 'isNotEmpty' })).to.deep.equal([
        'France (fr)',
        'Germany',
        '0',
        '1',
      ]);
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

    it('should filter with operator "!="', () => {
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
              // The boolean cell does not handle the formatted value, so we override it
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

    it('should support `valueParser`', () => {
      const valueOptions = [
        { value: 'Status 0', label: 'Payment Pending' },
        { value: 'Status 1', label: 'Shipped' },
        { value: 'Status 2', label: 'Delivered' },
      ];

      const { setProps } = render(
        <TestCase
          filterModel={{
            items: [{ columnField: 'status', operatorValue: 'is', value: 0 }],
          }}
          rows={[
            { id: 0, status: 'Status 0' },
            { id: 1, status: 'Status 1' },
            { id: 2, status: 'Status 2' },
          ]}
          columns={[
            { field: 'id' },
            {
              field: 'status',
              type: 'singleSelect',
              valueOptions,
              valueParser: (value) => {
                return `Status ${value}`;
              },
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0']);
      setProps({
        filterModel: {
          items: [{ columnField: 'status', operatorValue: 'not', value: 0 }],
        },
      });
      expect(getColumnValues(0)).to.deep.equal(['1', '2']);
      setProps({
        filterModel: {
          items: [{ columnField: 'status', operatorValue: 'isAnyOf', value: [0, 2] }],
        },
      });
      expect(getColumnValues(0)).to.deep.equal(['0', '2']);
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

  describe('toolbar active filter count', () => {
    it('should not include operators with value when the value is empty', () => {
      const getFilterCount = (item: GridFilterItem) => {
        const { unmount } = render(
          <TestCase
            rows={[]}
            columns={[
              { field: 'brand', type: 'string' },
              { field: 'year', type: 'number' },
              { field: 'status', type: 'singleSelect' },
            ]}
            filterModel={{
              items: [item],
            }}
          />,
        );

        const hasNoActiveFilter = screen.queryByLabelText('0 active filter') == null;
        unmount();

        return hasNoActiveFilter ? 0 : 1;
      };

      expect(
        getFilterCount({ columnField: 'brand', operatorValue: 'contains', value: '' }),
      ).to.equal(0);
      expect(
        getFilterCount({ columnField: 'brand', operatorValue: 'contains', value: undefined }),
      ).to.equal(0);
      expect(
        getFilterCount({ columnField: 'brand', operatorValue: 'isAnyOf', value: [] }),
      ).to.equal(0);
      expect(
        getFilterCount({ columnField: 'year', operatorValue: '=', value: undefined }),
      ).to.equal(0);
      expect(getFilterCount({ columnField: 'year', operatorValue: '=', value: '' })).to.equal(0);
    });

    it('should include value-less operators', () => {
      render(
        <TestCase
          rows={[]}
          columns={[{ field: 'brand', type: 'string' }]}
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
});
