import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, screen, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGrid,
  DataGridProps,
  GridFilterModel,
  GridLinkOperator,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Quick Filter', () => {
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
        <DataGrid {...baselineProps} components={{ Toolbar: GridToolbarQuickFilter }} {...props} />
      </div>
    );
  };

  describe('component', () => {
    it('should apply filter', () => {
      render(<TestCase />);

      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'a' },
      });
      clock.runToLast();

      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should allows to customize input splitting', () => {
      const onFilterModelChange = spy();

      render(
        <TestCase
          onFilterModelChange={onFilterModelChange}
          componentsProps={{
            toolbar: {
              quickFilterParser: (searchInput: string) =>
                searchInput.split(',').map((value) => value.trim()),
            },
          }}
        />,
      );

      expect(onFilterModelChange.callCount).to.equal(0);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'adid, nik' },
      });
      clock.runToLast();
      expect(onFilterModelChange.lastCall.firstArg).to.deep.equal({
        items: [],
        linkOperator: 'and',
        quickFilterValues: ['adid', 'nik'],
        quickFilterLogicOperator: 'and',
      });
    });

    it('should no prettify user input', () => {
      render(<TestCase />);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'adidas   nike' },
      });
      clock.runToLast();

      expect(screen.getByRole('searchbox').value).to.equal('adidas   nike');
    });

    it('should update input when the state is modified', () => {
      const { setProps } = render(<TestCase />);

      expect(screen.getByRole('searchbox').value).to.equal('');

      setProps({
        filterModel: {
          items: [],
          quickFilterValues: ['adidas', 'nike'],
        },
      });
      expect(screen.getByRole('searchbox').value).to.equal('adidas nike');

      setProps({
        filterModel: {
          items: [],
          quickFilterValues: [],
        },
      });
      expect(screen.getByRole('searchbox').value).to.equal('');
    });

    it('should allow to customize input formatting', () => {
      const { setProps } = render(
        <TestCase
          componentsProps={{
            toolbar: {
              quickFilterFormatter: (quickFilterValues: string[]) => quickFilterValues.join(', '),
            },
          }}
        />,
      );

      expect(screen.getByRole('searchbox').value).to.equal('');
      setProps({
        filterModel: {
          items: [],
          quickFilterValues: ['adidas', 'nike'],
        },
      });
      expect(screen.getByRole('searchbox').value).to.equal('adidas, nike');
    });
  });

  describe('quick filter logic', () => {
    it('should return rows that match all values by default', () => {
      render(<TestCase />);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'adid' },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['Adidas']);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'adid nik' },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal([]);
    });

    it('should return rows that match some values if quickFilterLogicOperator="or"', () => {
      render(
        <TestCase
          initialState={{
            filter: { filterModel: { items: [], quickFilterLogicOperator: GridLinkOperator.Or } },
          }}
        />,
      );

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'adid' },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['Adidas']);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'adid nik' },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas']);
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

    it('default operator should behave like "contains"', () => {
      expect(getRows({ quickFilterValues: ['Fra'] })).to.deep.equal(['France (fr)']);

      // Case-insensitive
      expect(getRows({ quickFilterValues: ['fra'] })).to.deep.equal(['France (fr)']);

      // Number casting
      expect(getRows({ quickFilterValues: ['0'] })).to.deep.equal(['0']);
      expect(getRows({ quickFilterValues: ['1'] })).to.deep.equal(['1']);

      // Empty values
      expect(getRows({ quickFilterValues: [undefined] })).to.deep.equal(ALL_ROWS);
      expect(getRows({ quickFilterValues: [''] })).to.deep.equal(ALL_ROWS);

      // Value with regexp special literal
      expect(getRows({ quickFilterValues: ['[-[]{}()*+?.,\\^$|#s]'] })).to.deep.equal([]);
      expect(getRows({ quickFilterValues: ['(fr)'] })).to.deep.equal(['France (fr)']);
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
    const ALL_ROWS_YEAR = ['', '', '1974', '1984'];

    it('should filter with operator "start with"', () => {
      // With simple options
      expect(getRows({ quickFilterValues: ['germa'] }).country).to.deep.equal(['Germany']);
      expect(getRows({ quickFilterValues: [''] }).country).to.deep.equal(ALL_ROWS_COUNTRY);
      expect(getRows({ quickFilterValues: ['erman'] }).country).to.deep.equal([]);

      // With object options
      expect(getRows({ quickFilterValues: ['1974'] }).year).to.deep.equal(['1974']);
      expect(getRows({ quickFilterValues: ['year'] }).year).to.deep.equal(['1974', '1984']);
      expect(getRows({ quickFilterValues: ['97'] }).year).to.deep.equal([]);
      expect(getRows({ quickFilterValues: [undefined] }).year).to.deep.equal(ALL_ROWS_YEAR);
      expect(getRows({ quickFilterValues: [''] }).year).to.deep.equal(ALL_ROWS_YEAR);
    });
  });
});
