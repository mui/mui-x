import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { expect } from 'chai';
import {
  DataGrid,
  DataGridProps,
  GridToolbarFilterButton,
  GridColDef,
  GridFilterItem,
  GridPreferencePanelsValue,
  GridSlots,
  GridToolbar,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { getColumnValues } from 'test/utils/helperFn';
import { spy } from 'sinon';

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

  let disableEval = false;

  function testEval(fn: Function) {
    disableEval = false;
    fn();
    disableEval = true;
    fn();
    disableEval = false;
  }

  function TestCase(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} {...props} disableEval={disableEval} />
      </div>
    );
  }

  describe('prop: filterModel', () => {
    it('should throw for more than one filter item', () => {
      expect(() => {
        render(
          <TestCase
            rows={[]}
            columns={[]}
            filterModel={{
              items: [
                { id: 0, field: 'brand', operator: 'contains' },
                { id: 1, field: 'brand', operator: 'contains' },
              ],
            }}
          />,
        );
      }).toErrorDev(
        'MUI X: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.',
      );
    });

    it('should apply the model for `filterable: false` columns but the applied filter should be readonly', () => {
      render(
        <TestCase
          columns={[{ field: 'brand', filterable: false }]}
          filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'Adidas' }] }}
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      // filter has been applied
      expect(getColumnValues(0)).to.deep.equal(['Adidas']);

      // field has the applied value and is read-only
      const valueInput = screen.getByRole('textbox', { name: 'Value' });
      expect(valueInput).to.have.value('Adidas');
      expect(valueInput).to.have.property('disabled', true);
    });

    it('should apply the model', () => {
      render(
        <TestCase
          filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'a' }] }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should apply the model when row prop changes', () => {
      render(
        <TestCase
          filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'a' }] }}
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
          filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'a' }] }}
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
        filterModel: { items: [{ field: 'country', operator: 'contains', value: 'a' }] },
      });
      expect(getColumnValues(0)).to.deep.equal(['France']);
    });
  });

  describe('prop: initialState.filter', () => {
    it('should allow to initialize the filterModel', () => {
      render(
        <TestCase
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas']);
    });

    it('should allow to initialize the filterModel for non-filterable columns', () => {
      render(
        <TestCase
          columns={[{ field: 'brand', filterable: false }]}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
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
            items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
          }}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
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
                items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
              },
            },
          }}
        />,
      );

      setProps({
        initialState: {
          filter: {
            filterModel: {
              items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
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
                items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['Adidas']);
      fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), {
        target: { value: 'Puma' },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['Puma']);
    });
  });

  describe('prop: getRowId', () => {
    it('works with filter', () => {
      render(
        <TestCase
          getRowId={(row) => row.brand}
          filterModel={{
            items: [{ id: 0, field: 'brand', operator: 'contains', value: 'Nike' }],
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Nike']);
    });

    it('works with quick filter', () => {
      render(
        <TestCase
          getRowId={(row) => row.brand}
          filterModel={{
            items: [],
            quickFilterValues: ['Nike'],
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Nike']);
    });
  });

  describe('column type: string', () => {
    const getRows = (item: Omit<GridFilterItem, 'field'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ field: 'country', ...item }],
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
      testEval(() => {
        expect(getRows({ operator: 'contains', value: 'Fra' })).to.deep.equal(['France (fr)']);

        // Trim value
        expect(getRows({ operator: 'contains', value: ' Fra ' })).to.deep.equal(['France (fr)']);

        // Case-insensitive
        expect(getRows({ operator: 'contains', value: 'fra' })).to.deep.equal(['France (fr)']);

        // Number casting
        expect(getRows({ operator: 'contains', value: '0' })).to.deep.equal(['0']);
        expect(getRows({ operator: 'contains', value: '1' })).to.deep.equal(['1']);

        // Empty values
        expect(getRows({ operator: 'contains', value: undefined })).to.deep.equal(ALL_ROWS);
        expect(getRows({ operator: 'contains', value: '' })).to.deep.equal(ALL_ROWS);

        // Value with regexp special literal
        expect(getRows({ operator: 'contains', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal([]);
        expect(getRows({ operator: 'contains', value: '(fr)' })).to.deep.equal(['France (fr)']);
      });
    });

    it('should filter with operator "equals"', () => {
      expect(getRows({ operator: 'equals', value: 'France (fr)' })).to.deep.equal(['France (fr)']);

      // Trim value
      expect(getRows({ operator: 'equals', value: ' France (fr) ' })).to.deep.equal([
        'France (fr)',
      ]);

      // Case-insensitive
      expect(getRows({ operator: 'equals', value: 'france (fr)' })).to.deep.equal(['France (fr)']);

      // Number casting
      expect(getRows({ operator: 'equals', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operator: 'equals', value: '1' })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operator: 'equals', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'equals', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "startsWith"', () => {
      expect(getRows({ operator: 'startsWith', value: 'Fra' })).to.deep.equal(['France (fr)']);

      // Trim value
      expect(getRows({ operator: 'startsWith', value: ' Fra ' })).to.deep.equal(['France (fr)']);

      // Case-insensitive
      expect(getRows({ operator: 'startsWith', value: 'fra' })).to.deep.equal(['France (fr)']);

      // Empty values
      expect(getRows({ operator: 'startsWith', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'startsWith', value: '' })).to.deep.equal(ALL_ROWS);

      // Number casting
      expect(getRows({ operator: 'startsWith', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operator: 'startsWith', value: '1' })).to.deep.equal(['1']);

      // Value with regexp special literal
      expect(getRows({ operator: 'startsWith', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal([]);
      expect(getRows({ operator: 'contains', value: 'France (' })).to.deep.equal(['France (fr)']);
    });

    it('should filter with operator "endsWith"', () => {
      expect(getRows({ operator: 'endsWith', value: 'many' })).to.deep.equal(['Germany']);

      // Trim value
      expect(getRows({ operator: 'endsWith', value: ' many ' })).to.deep.equal(['Germany']);

      // Number casting
      expect(getRows({ operator: 'endsWith', value: '0' })).to.deep.equal(['0']);
      expect(getRows({ operator: 'endsWith', value: '1' })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operator: 'endsWith', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'endsWith', value: '' })).to.deep.equal(ALL_ROWS);

      // Value with regexp special literal
      expect(getRows({ operator: 'endsWith', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal([]);
      expect(getRows({ operator: 'contains', value: '(fr)' })).to.deep.equal(['France (fr)']);
    });

    it('should filter with operator "isAnyOf"', () => {
      expect(getRows({ operator: 'isAnyOf', value: ['France (fr)'] })).to.deep.equal([
        'France (fr)',
      ]);

      // `isAnyOf` has a `or` behavior
      expect(getRows({ operator: 'isAnyOf', value: ['France (fr)', 'Germany'] })).to.deep.equal([
        'France (fr)',
        'Germany',
      ]);

      // Number casting
      expect(getRows({ operator: 'isAnyOf', value: ['0'] })).to.deep.equal(['0']);
      expect(getRows({ operator: 'isAnyOf', value: ['1'] })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ operator: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);

      // `isAnyOf` trim values
      expect(getRows({ operator: 'isAnyOf', value: [' France (fr)', 'Germany '] })).to.deep.equal([
        'France (fr)',
        'Germany',
      ]);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['', '', '']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal([
        'France (fr)',
        'Germany',
        '0',
        '1',
      ]);
    });

    describe('ignoreDiacritics', () => {
      function DiacriticsTestCase({
        filterValue,
        ...props
      }: Partial<DataGridProps> & { filterValue: GridFilterItem['value'] }) {
        return (
          <TestCase
            filterModel={{
              items: [{ field: 'label', operator: 'contains', value: filterValue }],
            }}
            {...props}
            rows={[{ id: 0, label: 'Apă' }]}
            columns={[{ field: 'label', type: 'string' }]}
          />
        );
      }

      it('should not ignore diacritics by default', () => {
        testEval(() => {
          const { unmount } = render(<DiacriticsTestCase filterValue="apa" />);
          expect(getColumnValues(0)).to.deep.equal([]);
          unmount();
        });

        testEval(() => {
          const { unmount } = render(<DiacriticsTestCase filterValue="apă" />);
          expect(getColumnValues(0)).to.deep.equal(['Apă']);
          unmount();
        });
      });

      it('should ignore diacritics when `ignoreDiacritics` is enabled', () => {
        testEval(() => {
          const { unmount } = render(<DiacriticsTestCase filterValue="apa" ignoreDiacritics />);
          expect(getColumnValues(0)).to.deep.equal(['Apă']);
          unmount();
        });

        testEval(() => {
          const { unmount } = render(<DiacriticsTestCase filterValue="apă" ignoreDiacritics />);
          expect(getColumnValues(0)).to.deep.equal(['Apă']);
          unmount();
        });
      });
    });
  });

  describe('column type: number', () => {
    const getRows = (item: Omit<GridFilterItem, 'field'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ field: 'year', ...item }],
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
              valueFormatter: (value) => value,
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
      expect(getRows({ operator: '=', value: 1974 })).to.deep.equal(['1974']);
      expect(getRows({ operator: '=', value: 0 })).to.deep.equal(['', '0']);
      expect(getRows({ operator: '=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: '=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "!="', () => {
      expect(getRows({ operator: '!=', value: 1974 })).to.deep.equal([
        '',
        '',
        '',
        '0',
        '1954',
        '1984',
      ]);
      expect(getRows({ operator: '!=', value: 0 })).to.deep.equal(['', '', '1954', '1974', '1984']);
      expect(getRows({ operator: '!=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: '!=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator ">"', () => {
      expect(getRows({ operator: '>', value: 1974 })).to.deep.equal(['1984']);
      expect(getRows({ operator: '>', value: 0 })).to.deep.equal(['1954', '1974', '1984']);
      expect(getRows({ operator: '>', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: '>', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator ">=', () => {
      expect(getRows({ operator: '>=', value: 1974 })).to.deep.equal(['1974', '1984']);
      expect(getRows({ operator: '>=', value: 0 })).to.deep.equal([
        '',
        '0',
        '1954',
        '1974',
        '1984',
      ]);
      expect(getRows({ operator: '>=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: '>=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "<"', () => {
      expect(getRows({ operator: '<', value: 1974 })).to.deep.equal(['', '0', '1954']);
      expect(getRows({ operator: '<', value: 0 })).to.deep.equal([]);
      expect(getRows({ operator: '<', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: '<', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "<="', () => {
      expect(getRows({ operator: '<=', value: 1974 })).to.deep.equal(['', '0', '1954', '1974']);
      expect(getRows({ operator: '<=', value: 0 })).to.deep.equal(['', '0']);
      expect(getRows({ operator: '<=', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: '<=', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isAnyOf"', () => {
      expect(getRows({ operator: 'isAnyOf', value: [1954, 1984] })).to.deep.equal(['1954', '1984']);
      expect(getRows({ operator: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['', '']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal(['', '0', '1954', '1974', '1984']);
    });
  });

  describe('column type: date', () => {
    const getRows = (item: Omit<GridFilterItem, 'field'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ field: 'date', ...item }],
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
              valueFormatter: (value?: Date | string) => {
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
            } as GridColDef<any, Date | null | undefined | string>,
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
      expect(getRows({ operator: 'is', value: '2001-01-01' })).to.deep.equal([
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'is', value: new Date('2001-01-01') })).to.deep.equal([
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "not"', () => {
      // TODO: Should this filter return the invalid dates like for the numeric filters ?
      expect(getRows({ operator: 'not', value: '2001-01-01' })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'not', value: new Date('2001-01-01') })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'not', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'not', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "before"', () => {
      expect(getRows({ operator: 'before', value: '2001-01-01' })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'before', value: new Date('2001-01-01') })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'before', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'before', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrBefore"', () => {
      expect(getRows({ operator: 'onOrBefore', value: '2001-01-01' })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'onOrBefore', value: new Date('2001-01-01') })).to.deep.equal([
        '1/1/2000, 12:00:00 AM',
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'onOrBefore', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'onOrBefore', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "after"', () => {
      expect(getRows({ operator: 'after', value: '2001-01-01' })).to.deep.equal([
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'after', value: new Date('2001-01-01') })).to.deep.equal([
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'after', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'after', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrAfter"', () => {
      expect(getRows({ operator: 'onOrAfter', value: '2001-01-01' })).to.deep.equal([
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'onOrAfter', value: new Date('2001-01-01') })).to.deep.equal([
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
      expect(getRows({ operator: 'onOrAfter', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'onOrAfter', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['undefined', 'null']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal([
        '',
        '1/1/2000, 12:00:00 AM',
        '1/1/2001, 12:00:00 AM',
        '1/1/2001, 8:30:00 AM',
        '1/1/2002, 12:00:00 AM',
      ]);
    });
  });

  describe('column type: dateTime', () => {
    const getRows = (item: Omit<GridFilterItem, 'field'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ field: 'date', ...item }],
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
              valueFormatter: (value?: Date | string) => {
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
            } as GridColDef<any, Date | null | undefined | string>,
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
      expect(getRows({ operator: 'is', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 7:30:00 AM',
      ]);
      expect(getRows({ operator: 'is', value: new Date('2001-01-01T07:30') })).to.deep.equal([
        '1/1/2001, 7:30:00 AM',
      ]);
      expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "not"', () => {
      // TODO: Should this filter return the invalid dates like for the numeric filters ?
      expect(getRows({ operator: 'not', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'not', value: new Date('2001-01-01T07:30') })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'not', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'not', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "before"', () => {
      expect(getRows({ operator: 'before', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
      ]);
      expect(getRows({ operator: 'before', value: new Date('2001-01-01T07:30') })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
      ]);
      expect(getRows({ operator: 'before', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'before', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrBefore"', () => {
      expect(getRows({ operator: 'onOrBefore', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 7:30:00 AM',
      ]);
      expect(
        getRows({ operator: 'onOrBefore', value: new Date('2001-01-01T07:30') }),
      ).to.deep.equal(['1/1/2001, 6:30:00 AM', '1/1/2001, 7:30:00 AM']);
      expect(getRows({ operator: 'onOrBefore', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'onOrBefore', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "after"', () => {
      expect(getRows({ operator: 'after', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'after', value: new Date('2001-01-01T07:30') })).to.deep.equal([
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'after', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'after', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "onOrAfter"', () => {
      expect(getRows({ operator: 'onOrAfter', value: '2001-01-01T07:30' })).to.deep.equal([
        '1/1/2001, 7:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
      expect(getRows({ operator: 'onOrAfter', value: new Date('2001-01-01T07:30') })).to.deep.equal(
        ['1/1/2001, 7:30:00 AM', '1/1/2001, 8:30:00 AM'],
      );
      expect(getRows({ operator: 'onOrAfter', value: undefined })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'onOrAfter', value: '' })).to.deep.equal(ALL_ROWS);
    });

    it('should filter with operator "isEmpty"', () => {
      expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['undefined', 'null']);
    });

    it('should filter with operator "isNotEmpty"', () => {
      expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal([
        '',
        '1/1/2001, 6:30:00 AM',
        '1/1/2001, 7:30:00 AM',
        '1/1/2001, 8:30:00 AM',
      ]);
    });
  });

  describe('column type: boolean', () => {
    const getRows = (item: Omit<GridFilterItem, 'field'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [{ field: 'isPublished', ...item }],
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
      expect(getRows({ operator: 'is', value: 'true' })).to.deep.equal(['true']);
      expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
      expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
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
    const ALL_ROWS_YEAR = ['', '', 'Year 1974', 'Year 1984'];

    it('should filter with operator "is"', () => {
      // With simple options
      expect(
        getRows({ field: 'country', operator: 'is', value: 'United States' }).country,
      ).to.deep.equal(['United States']);
      expect(getRows({ field: 'country', operator: 'is', value: undefined }).country).to.deep.equal(
        ALL_ROWS_COUNTRY,
      );
      expect(getRows({ field: 'country', operator: 'is', value: '' }).country).to.deep.equal(
        ALL_ROWS_COUNTRY,
      );

      // With object options
      expect(getRows({ field: 'year', operator: 'is', value: 1974 }).year).to.deep.equal([
        'Year 1974',
      ]);
      expect(getRows({ field: 'year', operator: 'is', value: undefined }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
      expect(getRows({ field: 'year', operator: 'is', value: '' }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
    });

    it('should filter with operator "not"', () => {
      // With simple options
      expect(
        getRows({ field: 'country', operator: 'not', value: 'United States' }).country,
      ).to.deep.equal(['', '', 'Germany']);
      expect(
        getRows({ field: 'country', operator: 'not', value: undefined }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);
      expect(getRows({ field: 'country', operator: 'not', value: '' }).country).to.deep.equal(
        ALL_ROWS_COUNTRY,
      );

      // With object options
      expect(getRows({ field: 'year', operator: 'not', value: 1974 }).year).to.deep.equal([
        '',
        '',
        'Year 1984',
      ]);
      expect(getRows({ field: 'year', operator: 'not', value: undefined }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
      expect(getRows({ field: 'year', operator: 'not', value: '' }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
    });

    it('should filter with operator "isAnyOf"', () => {
      // With simple options
      expect(
        getRows({ field: 'country', operator: 'isAnyOf', value: ['United States'] }).country,
      ).to.deep.equal(['United States']);
      expect(getRows({ field: 'country', operator: 'isAnyOf', value: [] }).country).to.deep.equal(
        ALL_ROWS_COUNTRY,
      );
      expect(
        getRows({ field: 'country', operator: 'isAnyOf', value: undefined }).country,
      ).to.deep.equal(ALL_ROWS_COUNTRY);

      // With object options
      expect(getRows({ field: 'year', operator: 'isAnyOf', value: [1974] }).year).to.deep.equal([
        'Year 1974',
      ]);
      expect(getRows({ field: 'year', operator: 'isAnyOf', value: [] }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
      expect(getRows({ field: 'year', operator: 'isAnyOf', value: undefined }).year).to.deep.equal(
        ALL_ROWS_YEAR,
      );
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
            items: [{ field: 'status', operator: 'is', value: 0 }],
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
          items: [{ field: 'status', operator: 'not', value: 0 }],
        },
      });
      expect(getColumnValues(0)).to.deep.equal(['1', '2']);
      setProps({
        filterModel: {
          items: [{ field: 'status', operator: 'isAnyOf', value: [0, 2] }],
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
            items: [{ field: 'voltage', operator: 'is' }],
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
      setProps({
        filterModel: { items: [{ field: 'voltage', operator: 'is', value: 220 }] },
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
          filterModel={{ items: [{ field: 'voltage', operator: 'is' }] }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
      setProps({
        filterModel: { items: [{ field: 'voltage', operator: 'is', value: 220 }] },
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

      expect(getFilterCount({ field: 'brand', operator: 'contains', value: '' })).to.equal(0);
      expect(getFilterCount({ field: 'brand', operator: 'contains', value: undefined })).to.equal(
        0,
      );
      expect(getFilterCount({ field: 'brand', operator: 'isAnyOf', value: [] })).to.equal(0);
      expect(getFilterCount({ field: 'year', operator: '=', value: undefined })).to.equal(0);
      expect(getFilterCount({ field: 'year', operator: '=', value: '' })).to.equal(0);
    });

    it('should include value-less operators', () => {
      render(
        <TestCase
          rows={[]}
          columns={[{ field: 'brand', type: 'string' }]}
          filterModel={{
            items: [
              {
                field: 'brand',
                operator: 'isNotEmpty',
              },
            ],
          }}
        />,
      );
      expect(screen.queryByLabelText('1 active filter')).not.to.equal(null);
    });
  });

  describe('filter button tooltip', () => {
    it('should display `falsy` value', () => {
      const { setProps } = render(
        <DataGrid
          filterModel={{
            items: [{ id: 0, field: 'isAdmin', operator: 'is', value: false }],
          }}
          autoHeight
          rows={[
            {
              id: 0,
              isAdmin: false,
              level: 0,
            },
          ]}
          columns={[
            {
              field: 'isAdmin',
              type: 'singleSelect',
              valueOptions: [
                {
                  value: false,
                  label: false,
                },
              ],
            },
            {
              field: 'level',
              type: 'number',
            },
          ]}
          slots={{ toolbar: GridToolbarFilterButton as GridSlots['toolbar'] }}
        />,
      );

      const filterButton = document.querySelector('button[aria-label="Show filters"]')!;
      expect(screen.queryByRole('tooltip')).to.equal(null);

      fireEvent.mouseOver(filterButton);
      clock.tick(1000); // tooltip display delay

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toBeVisible();
      expect(tooltip.textContent).to.contain('false');

      setProps({ filterModel: { items: [{ id: 0, field: 'level', operator: '=', value: 0 }] } });
      expect(tooltip.textContent).to.contain('0');
    });
  });

  describe('custom `filterOperators`', () => {
    it('should allow to customize filter tooltip using `filterOperator.getValueAsString`', () => {
      render(
        <div style={{ width: '100%', height: '400px' }}>
          <DataGrid
            filterModel={{
              items: [{ field: 'name', operator: 'contains', value: 'John' }],
            }}
            rows={[
              {
                id: 0,
                name: 'John Doe',
              },
              {
                id: 1,
                name: 'Mike Smith',
              },
            ]}
            columns={[
              {
                field: 'name',
                type: 'string',
                filterOperators: [
                  {
                    label: 'Contains',
                    value: 'contains',
                    getApplyFilterFn: (filterItem) => {
                      return (value) => {
                        if (
                          !filterItem.field ||
                          !filterItem.value ||
                          !filterItem.operator ||
                          !value
                        ) {
                          return null;
                        }
                        return value.includes(filterItem.value);
                      };
                    },
                    getValueAsString: (value) => `"${value}" text string`,
                  },
                ] as GridFilterOperator<any, string>[],
              },
            ]}
            slots={{ toolbar: GridToolbarFilterButton as GridSlots['toolbar'] }}
          />
        </div>,
      );

      const filterButton = document.querySelector('button[aria-label="Show filters"]')!;
      expect(screen.queryByRole('tooltip')).to.equal(null);

      fireEvent.mouseOver(filterButton);
      clock.tick(1000); // tooltip display delay

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toBeVisible();
      expect(tooltip.textContent).to.contain('"John" text string');
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
                  field: 'quantity',
                  id: 1619547587572,
                  operator: '=',
                  value: '1',
                },
              ],
            }}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      );
    }).not.to.throw();
  });

  it('should update the filter model on columns change', () => {
    const columns = [{ field: 'id' }, { field: 'brand' }];
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const onFilterModelChange = spy();

    function Demo(props: Omit<DataGridProps, 'columns'>) {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            autoHeight={isJSDOM}
            columns={columns}
            filterModel={{
              items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
            }}
            onFilterModelChange={onFilterModelChange}
            {...props}
          />
        </div>
      );
    }
    const { setProps } = render(<Demo rows={rows} />);
    expect(getColumnValues(1)).to.deep.equal(['Puma']);

    setProps({ columns: [{ field: 'id' }] });
    expect(getColumnValues(0)).to.deep.equal(['0', '1', '2']);
    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.firstArg).to.deep.equal({ items: [] });
  });

  // See https://github.com/mui/mui-x/issues/9204
  it('should not clear the filter model when both columns and filterModel change', async () => {
    const columns = [{ field: 'id' }, { field: 'brand' }];
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];

    const onFilterModelChange = spy();

    function Demo(props: Omit<DataGridProps, 'columns'>) {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            autoHeight={isJSDOM}
            columns={columns}
            filterModel={{
              items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
            }}
            onFilterModelChange={onFilterModelChange}
            {...props}
          />
        </div>
      );
    }
    const { setProps } = render(<Demo rows={rows} />);
    expect(getColumnValues(1)).to.deep.equal(['Puma']);

    setProps({
      columns: [{ field: 'id' }],
      filterModel: {
        items: [{ field: 'id', operator: 'equals', value: '1' }],
      },
    });
    expect(getColumnValues(0)).to.deep.equal(['1']);
    expect(onFilterModelChange.callCount).to.equal(0);
  });
});
