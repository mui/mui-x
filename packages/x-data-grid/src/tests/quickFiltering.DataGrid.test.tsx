import * as React from 'react';
import { createRenderer, screen, reactMajor, waitFor, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGrid,
  DataGridProps,
  GetApplyQuickFilterFn,
  GridFilterModel,
  GridLogicOperator,
  getGridStringQuickFilterFn,
} from '@mui/x-data-grid';
import { getColumnValues, sleep } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGrid /> - Quick filter', () => {
  const { render } = createRenderer();

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

  function TestCase(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          {...baselineProps}
          showToolbar
          disableColumnSelector
          disableDensitySelector
          disableColumnFilter
          {...props}
          slotProps={{
            ...props?.slotProps,
            toolbar: {
              showQuickFilter: true,
              ...props?.slotProps?.toolbar,
            },
          }}
        />
      </div>
    );
  }

  describe('component', () => {
    it('should apply filter', async () => {
      const { user } = render(<TestCase />);

      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      await user.type(screen.getByRole('searchbox'), 'a');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
      });
    });

    it('should allow to customize input splitting', async () => {
      const onFilterModelChange = spy();

      const { user } = render(
        <TestCase
          onFilterModelChange={onFilterModelChange}
          slotProps={{
            toolbar: {
              quickFilterProps: {
                quickFilterParser: (searchInput: string) =>
                  searchInput.split(',').map((value) => value.trim()),
              },
            },
          }}
        />,
      );

      expect(onFilterModelChange.callCount).to.equal(0);

      await user.type(screen.getByRole('searchbox'), 'adid, nik');

      await waitFor(() => {
        expect(onFilterModelChange.lastCall.firstArg).to.deep.equal({
          items: [],
          logicOperator: 'and',
          quickFilterValues: ['adid', 'nik'],
          quickFilterLogicOperator: 'and',
        });
      });
    });

    it('should no prettify user input', async () => {
      const { user } = render(<TestCase />);

      await user.type(screen.getByRole('searchbox'), 'adidas   nike');

      expect(screen.getByRole<HTMLInputElement>('searchbox').value).to.equal('adidas   nike');
    });

    it('should update input when the state is modified', () => {
      const { setProps } = render(<TestCase />);

      expect(screen.getByRole<HTMLInputElement>('searchbox').value).to.equal('');

      setProps({
        filterModel: {
          items: [],
          quickFilterValues: ['adidas', 'nike'],
        },
      });
      expect(screen.getByRole<HTMLInputElement>('searchbox').value).to.equal('adidas nike');

      setProps({
        filterModel: {
          items: [],
          quickFilterValues: [],
        },
      });
      expect(screen.getByRole<HTMLInputElement>('searchbox').value).to.equal('');
    });

    it('should allow to customize input formatting', () => {
      const { setProps } = render(
        <TestCase
          slotProps={{
            toolbar: {
              quickFilterProps: {
                quickFilterFormatter: (quickFilterValues: string[]) => quickFilterValues.join(', '),
              },
            },
          }}
        />,
      );

      expect(screen.getByRole<HTMLInputElement>('searchbox').value).to.equal('');
      setProps({
        filterModel: {
          items: [],
          quickFilterValues: ['adidas', 'nike'],
        },
      });
      expect(screen.getByRole<HTMLInputElement>('searchbox').value).to.equal('adidas, nike');
    });
  });

  describe('quick filter logic', () => {
    it('should return rows that match all values by default', async () => {
      const { user } = render(<TestCase />);

      await user.type(screen.getByRole('searchbox'), 'adid');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Adidas']);
      });
      await user.type(screen.getByRole('searchbox'), ' nik');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal([]);
      });
    });

    it('should return rows that match some values if quickFilterLogicOperator="or"', async () => {
      const { user } = render(
        <TestCase
          initialState={{
            filter: { filterModel: { items: [], quickFilterLogicOperator: GridLogicOperator.Or } },
          }}
        />,
      );

      await user.type(screen.getByRole('searchbox'), 'adid');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Adidas']);
      });

      await user.type(screen.getByRole('searchbox'), ' nik');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas']);
      });
    });

    it('should ignore hidden columns by default', async () => {
      const { user } = render(
        <TestCase
          columns={[{ field: 'id' }, { field: 'brand' }]}
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
            filter: { filterModel: { items: [] } },
          }}
        />,
      );

      await user.type(screen.getByRole('searchbox'), '1');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal([]);
      });

      await user.type(screen.getByRole('searchbox'), '[Backspace]2');

      expect(getColumnValues(0)).to.deep.equal([]);
    });

    it('should search hidden columns when quickFilterExcludeHiddenColumns=false', async () => {
      const { user } = render(
        <TestCase
          columns={[{ field: 'id' }, { field: 'brand' }]}
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
            filter: { filterModel: { items: [], quickFilterExcludeHiddenColumns: false } },
          }}
        />,
      );

      await user.type(screen.getByRole('searchbox'), '1');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Adidas']);
      });

      await user.type(screen.getByRole('searchbox'), '[Backspace]2');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Puma']);
      });
    });

    it('should ignore hidden columns when quickFilterExcludeHiddenColumns=true', async () => {
      const { user } = render(
        <TestCase
          columns={[{ field: 'id' }, { field: 'brand' }]}
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
            filter: { filterModel: { items: [], quickFilterExcludeHiddenColumns: true } },
          }}
        />,
      );

      await user.type(screen.getByRole('searchbox'), '1');
      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal([]);
      });

      await user.type(screen.getByRole('searchbox'), '[Backspace]2');
      expect(getColumnValues(0)).to.deep.equal([]);
    });

    it('should apply filters on quickFilterExcludeHiddenColumns value change', () => {
      const { setProps } = render(
        <TestCase
          columns={[{ field: 'id' }, { field: 'brand' }]}
          columnVisibilityModel={{ brand: false }}
          filterModel={{
            items: [],
            quickFilterValues: ['adid'],
            quickFilterExcludeHiddenColumns: false,
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['1']);

      setProps({
        filterModel: {
          items: [],
          quickFilterValues: ['adid'],
          quickFilterExcludeHiddenColumns: true,
        },
      });
      expect(getColumnValues(0)).to.deep.equal([]);
    });

    it('should apply filters on column visibility change when quickFilterExcludeHiddenColumns=true', () => {
      const getApplyQuickFilterFnSpy = spy(getGridStringQuickFilterFn);
      const { setProps } = render(
        <TestCase
          columns={[
            {
              field: 'id',
              getApplyQuickFilterFn: getApplyQuickFilterFnSpy,
            },
            { field: 'brand' },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: ['adid'],
                quickFilterExcludeHiddenColumns: true,
              },
            },
          }}
        />,
      );

      // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
      const initialCallCount = reactMajor >= 19 ? 1 : 2;

      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);

      setProps({ columnVisibilityModel: { brand: false } });
      expect(getColumnValues(0)).to.deep.equal([]);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount + 1);

      setProps({ columnVisibilityModel: { brand: true } });
      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount + 2);
    });

    it('should not apply filters on column visibility change when quickFilterExcludeHiddenColumns=true but no quick filter values', () => {
      const getApplyQuickFilterFnSpy = spy(getGridStringQuickFilterFn);
      const { setProps } = render(
        <TestCase
          columns={[
            { field: 'id', getApplyQuickFilterFn: getApplyQuickFilterFnSpy },
            { field: 'brand' },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: true,
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(0);

      setProps({ columnVisibilityModel: { brand: false } });
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(0);

      setProps({ columnVisibilityModel: { brand: true } });
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(0);
    });

    it('should not apply filters on column visibility change when quickFilterExcludeHiddenColumns=false', () => {
      const getApplyQuickFilterFnSpy = spy(getGridStringQuickFilterFn);
      const { setProps } = render(
        <TestCase
          columns={[
            { field: 'id', getApplyQuickFilterFn: getApplyQuickFilterFnSpy },
            { field: 'brand' },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: ['adid'],
                quickFilterExcludeHiddenColumns: false,
              },
            },
          }}
        />,
      );

      // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
      const initialCallCount = reactMajor >= 19 ? 1 : 2;

      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);

      setProps({ columnVisibilityModel: { brand: false } });
      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);

      setProps({ columnVisibilityModel: { brand: true } });
      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);
    });
  });

  describe('column type: string', () => {
    const getRows = ({ quickFilterValues }: Pick<GridFilterModel, 'quickFilterValues'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [],
            quickFilterValues,
          }}
          rows={[
            { id: 0, country: undefined, phone: '5511111111' },
            { id: 1, country: null, phone: '5522222222' },
            { id: 2, country: '', phone: '5533333333' },
            { id: 3, country: 'France (fr)', phone: '5544444444' },
            { id: 4, country: 'Germany', phone: '5555555555' },
            { id: 5, country: 8, phone: '5566666666' },
            { id: 6, country: 9, phone: '5577777777' },
          ]}
          columns={[
            {
              field: 'country',
              type: 'string',
            },
            {
              field: 'phone',
              type: 'string',
              valueFormatter: (value: string) => `+${value.slice(0, 2)} ${value.slice(2)}`,
            },
          ]}
        />,
      );

      const values = getColumnValues(0);
      unmount();
      return values;
    };

    const ALL_ROWS = ['', '', '', 'France (fr)', 'Germany', '8', '9'];

    it('default operator should behave like "contains"', () => {
      expect(getRows({ quickFilterValues: ['Fra'] })).to.deep.equal(['France (fr)']);

      // Case-insensitive
      expect(getRows({ quickFilterValues: ['fra'] })).to.deep.equal(['France (fr)']);

      // Number casting
      expect(getRows({ quickFilterValues: ['8'] })).to.deep.equal(['8']);
      expect(getRows({ quickFilterValues: ['9'] })).to.deep.equal(['9']);

      // Empty values
      expect(getRows({ quickFilterValues: [undefined] })).to.deep.equal(ALL_ROWS);
      expect(getRows({ quickFilterValues: [''] })).to.deep.equal(ALL_ROWS);

      // Value with regexp special literal
      expect(getRows({ quickFilterValues: ['[-[]{}()*+?.,\\^$|#s]'] })).to.deep.equal([]);
      expect(getRows({ quickFilterValues: ['(fr)'] })).to.deep.equal(['France (fr)']);
    });

    it('should filter considering the formatted value when a valueFormatter is used', () => {
      expect(getRows({ quickFilterValues: ['+55 44444444'] })).to.deep.equal(['France (fr)']);
      expect(getRows({ quickFilterValues: ['5544444444'] })).to.deep.equal([]);
    });

    describe('ignoreDiacritics', () => {
      function DiacriticsTestCase({
        quickFilterValues,
        ...props
      }: Partial<DataGridProps> & {
        quickFilterValues: GridFilterModel['quickFilterValues'];
      }) {
        return (
          <TestCase
            {...props}
            filterModel={{
              items: [],
              quickFilterValues,
            }}
            rows={[{ id: 0, label: 'Apă' }]}
            columns={[{ field: 'label', type: 'string' }]}
          />
        );
      }

      it('should not ignore diacritics by default', () => {
        const { unmount } = render(<DiacriticsTestCase quickFilterValues={['apa']} />);
        expect(getColumnValues(0)).to.deep.equal([]);
        unmount();

        const { unmount: unmount2 } = render(<DiacriticsTestCase quickFilterValues={['apă']} />);
        expect(getColumnValues(0)).to.deep.equal(['Apă']);
        unmount2();
      });

      it('should ignore diacritics when `ignoreDiacritics` is enabled', () => {
        const { unmount } = render(
          <DiacriticsTestCase quickFilterValues={['apa']} ignoreDiacritics />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Apă']);
        unmount();

        const { unmount: unmount2 } = render(
          <DiacriticsTestCase quickFilterValues={['apă']} ignoreDiacritics />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Apă']);
        unmount2();
      });
    });
  });

  describe('column type: number', () => {
    const getRows = ({ quickFilterValues }: Pick<GridFilterModel, 'quickFilterValues'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [],
            quickFilterValues,
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

    it('default operator should behave like "="', () => {
      expect(getRows({ quickFilterValues: ['1974'] })).to.deep.equal(['1974']);
      expect(getRows({ quickFilterValues: ['0'] })).to.deep.equal(['', '0']);
      expect(getRows({ quickFilterValues: [undefined] })).to.deep.equal(ALL_ROWS);
      expect(getRows({ quickFilterValues: [''] })).to.deep.equal(ALL_ROWS);
    });
  });

  describe('column type: singleSelect', () => {
    const getRows = ({ quickFilterValues }: Pick<GridFilterModel, 'quickFilterValues'>) => {
      const { unmount } = render(
        <TestCase
          filterModel={{
            items: [],
            quickFilterValues,
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

    it('should filter with operator "contains"', () => {
      // With simple options
      expect(getRows({ quickFilterValues: ['germa'] }).country).to.deep.equal(['Germany']);
      expect(getRows({ quickFilterValues: [''] }).country).to.deep.equal(ALL_ROWS_COUNTRY);
      expect(getRows({ quickFilterValues: ['erman'] }).country).to.deep.equal(['Germany']);

      // With object options
      expect(getRows({ quickFilterValues: ['1974'] }).year).to.deep.equal(['Year 1974']);
      expect(getRows({ quickFilterValues: ['year'] }).year).to.deep.equal([
        'Year 1974',
        'Year 1984',
      ]);
      expect(getRows({ quickFilterValues: ['97'] }).year).to.deep.equal(['Year 1974']);
      expect(getRows({ quickFilterValues: [undefined] }).year).to.deep.equal(ALL_ROWS_YEAR);
      expect(getRows({ quickFilterValues: [''] }).year).to.deep.equal(ALL_ROWS_YEAR);
    });
  });

  // https://github.com/mui/mui-x/issues/6783
  it('should not override user input when typing', async () => {
    // Warning: this test doesn't fail consistently as it is timing-sensitive.
    const debounceMs = 50;

    const { user } = render(
      <TestCase
        slotProps={{
          toolbar: {
            quickFilterProps: { debounceMs },
          },
        }}
      />,
    );

    const searchBox = screen.getByRole<HTMLInputElement>('searchbox');

    expect(searchBox.value).to.equal('');

    await user.type(screen.getByRole('searchbox'), `a`);

    await act(() => sleep(debounceMs - 2));
    await user.type(screen.getByRole('searchbox'), `b`);

    await act(() => sleep(10));
    await user.type(screen.getByRole('searchbox'), `c`);

    await act(() => sleep(debounceMs * 2));
    expect(searchBox.value).to.equal('abc');
  });

  // https://github.com/mui/mui-x/issues/9666
  it('should not fail when the data changes', () => {
    const getApplyQuickFilterFn: GetApplyQuickFilterFn<any, string> = (value) => {
      if (!value) {
        return null;
      }
      return (cellValue) => {
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      };
    };

    const { setProps } = render(
      <TestCase
        columns={[
          {
            field: 'brand',
            getApplyQuickFilterFn,
          },
        ]}
        filterModel={{
          items: [],
          quickFilterValues: ['adid'],
        }}
      />,
    );

    setProps({
      rows: [],
    });
  });
});
