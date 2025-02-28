import * as React from 'react';
import { config } from 'react-transition-group';
import { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, screen, act, waitFor } from '@mui/internal-test-utils';
import {
  microtasks,
  getColumnHeadersTextContent,
  getColumnValues,
  getCell,
  getSelectByName,
  getRow,
} from 'test/utils/helperFn';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridApi,
  GridPreferencePanelsValue,
  GridRowsProp,
  useGridApiRef,
  GridLogicOperator,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

interface BaselineProps extends DataGridPremiumProps {
  rows: GridRowsProp;
}

const rows: GridRowsProp = [
  { id: 0, category1: 'Cat A', category2: 'Cat 1' },
  { id: 1, category1: 'Cat A', category2: 'Cat 2' },
  { id: 2, category1: 'Cat A', category2: 'Cat 2' },
  { id: 3, category1: 'Cat B', category2: 'Cat 2' },
  { id: 4, category1: 'Cat B', category2: 'Cat 1' },
];

const unbalancedRows: GridRowsProp = [
  { id: 0, category1: 'Cat A' },
  { id: 1, category1: 'Cat A' },
  { id: 2, category1: 'Cat B' },
  { id: 3, category1: 'Cat B' },
  { id: 4, category1: null },
  { id: 5, category1: null },
];

const baselineProps: BaselineProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  rows,
  columns: [
    {
      field: 'id',
      type: 'number',
    },
    {
      field: 'category1',
    },
    {
      field: 'category2',
    },
  ],
};

describe('<DataGridPremium /> - Row grouping', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('Setting grouping criteria', () => {
    describe('initialState: rowGrouping.model', () => {
      it('should allow to initialize the row grouping', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
      });

      it('should not react to initial state updates', () => {
        const { setProps } = render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);

        setProps({ initialState: { rowGrouping: { model: ['category2'] } } });
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
      });
    });

    describe('prop: rowGroupingModel', () => {
      it('should not call onRowGroupingModelChange on initialisation or on rowGroupingModel prop change', () => {
        const onRowGroupingModelChange = spy();

        const { setProps } = render(
          <Test
            rowGroupingModel={['category1']}
            onRowGroupingModelChange={onRowGroupingModelChange}
          />,
        );

        expect(onRowGroupingModelChange.callCount).to.equal(0);
        setProps({ rowGroupingModel: ['category2'] });

        expect(onRowGroupingModelChange.callCount).to.equal(0);
      });

      it('should allow to update the row grouping model from the outside', () => {
        const { setProps } = render(
          <Test rowGroupingModel={['category1']} defaultGroupingExpansionDepth={-1} />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
        setProps({ rowGroupingModel: ['category2'] });
        expect(getColumnValues(0)).to.deep.equal(['Cat 1 (2)', '', '', 'Cat 2 (3)', '', '', '']);
        setProps({ rowGroupingModel: ['category1', 'category2'] });
        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          'Cat 1 (1)',
          '',
          'Cat 2 (2)',
          '',
          '',
          'Cat B (2)',
          'Cat 2 (1)',
          '',
          'Cat 1 (1)',
          '',
        ]);
      });
    });

    it('should ignore grouping criteria that do not match any column', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category3'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
    });

    it('should display the value from the `valueOptions` for `singleSelect` column type', () => {
      render(
        <Test
          columns={[
            {
              field: 'category',
              type: 'singleSelect',
              valueOptions: [
                { value: 'category1', label: 'categoryLabel1' },
                { value: 'category2', label: 'categoryLabel2' },
              ],
            },
          ]}
          rows={[
            { id: 1, category: 'category1' },
            { id: 2, category: 'category1' },
            { id: 3, category: 'category1' },
            { id: 4, category: 'category2' },
            { id: 5, category: 'category2' },
          ]}
          initialState={{ rowGrouping: { model: ['category'] } }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['categoryLabel1 (3)', 'categoryLabel2 (2)']);
    });

    it('should display icon on auto-generated row', () => {
      render(
        <Test
          initialState={{
            rowGrouping: {
              model: ['isFilled'],
            },
          }}
          columns={[...baselineProps.columns, { field: 'isFilled', type: 'boolean' }]}
          rows={baselineProps.rows?.map((row) => ({ ...row, isFilled: false }))}
        />,
      );

      expect(screen.getByTestId('CloseIcon')).toBeVisible();
    });

    it('should respect the grouping criteria with colDef.groupable = false', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
              type: 'number',
            },
            {
              field: 'category1',
            },
            {
              field: 'category2',
              groupable: false,
            },
          ]}
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat 1 (1)',
        '',
        'Cat 2 (2)',
        '',
        '',
        'Cat B (2)',
        'Cat 2 (1)',
        '',
        'Cat 1 (1)',
        '',
      ]);
    });

    it('should allow to use several time the same grouping criteria', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category1'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat A (3)',
        '',
        '',
        '',
        'Cat B (2)',
        'Cat B (2)',
        '',
        '',
      ]);
    });
  });

  describe('colDef: groupingValueGetter & valueGetter', () => {
    it('should use groupingValueGetter to group rows when defined', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              groupingValueGetter: (value) => `groupingValue ${value}`,
            },
          ]}
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'groupingValue Cat A (3)',
        '',
        '',
        '',
        'groupingValue Cat B (2)',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
    });

    it('should react to groupingValueGetter update', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'modulo',
              groupingValueGetter: (value, row) => row.id % 2,
            },
          ]}
          initialState={{ rowGrouping: { model: ['modulo'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0 (3)', '', '', '', '1 (2)', '', '']);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '2', '4', '', '1', '3']);

      act(() =>
        apiRef.current?.updateColumns([
          {
            field: 'modulo',
            groupingValueGetter: (value, row) => row.id % 3,
          },
        ]),
      );

      expect(getColumnValues(0)).to.deep.equal(['0 (2)', '', '', '1 (2)', '', '', '2 (1)', '']);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '3', '', '1', '4', '', '2']);
    });

    it('should use valueGetter to group the rows when defined', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              valueGetter: (value, row) => `value ${row.category1}`,
            },
          ]}
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'value Cat A (3)',
        '',
        '',
        '',
        'value Cat B (2)',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
    });

    it('should still pass the raw row value to the groupingValueGetter callback when valueGetter defined', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
          }}
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              valueGetter: (value, row) => `value ${row.category1}`,
              groupingValueGetter: (value, row: { category1: string }) =>
                `groupingValue ${row.category1}`,
            },
          ]}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'groupingValue Cat A (3)',
        '',
        '',
        '',
        'groupingValue Cat B (2)',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
    });
  });

  describe('column menu', () => {
    it('should add a "Group by {field}" menu item on ungrouped columns when coLDef.groupable is not defined', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
            },
          ]}
        />,
      );
      act(() => apiRef.current?.showColumnMenu('category1'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItem = screen.getByRole('menuitem', { name: 'Group by category1' });
      fireEvent.click(menuItem);
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal(['category1']);
    });

    it('should not add a "Group by {field}" menu item on ungrouped columns when coLDef.groupable = false', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              groupable: false,
            },
          ]}
        />,
      );
      act(() => apiRef.current?.showColumnMenu('category1'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Group by category1' })).to.equal(null);
    });

    it('should add a "Stop grouping by {field}" menu item on grouped column', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
            },
          ]}
          initialState={{
            rowGrouping: {
              model: ['category1'],
            },
          }}
        />,
      );
      act(() => apiRef.current?.showColumnMenu('category1'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItem = screen.getByRole('menuitem', { name: 'Stop grouping by category1' });
      fireEvent.click(menuItem);
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal([]);
    });

    it('should add a "Stop grouping by {field} menu item on each grouping column when prop.rowGroupingColumnMode = "multiple"', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
            },
            {
              field: 'category2',
            },
          ]}
          initialState={{
            rowGrouping: {
              model: ['category1', 'category2'],
            },
          }}
          rowGroupingColumnMode="multiple"
        />,
      );

      act(() => apiRef.current?.showColumnMenu('__row_group_by_columns_group_category1__'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal(['category2']);

      act(() => apiRef.current?.hideColumnMenu());

      expect(screen.queryByRole('menu')).to.equal(null);

      act(() => apiRef.current?.showColumnMenu('__row_group_by_columns_group_category2__'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory2 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal([]);
    });

    it('should add a "Stop grouping {field}" menu item for each grouping criteria on the grouping column when prop.rowGroupingColumnMode = "single"', () => {
      const restoreDisabledConfig = config.disabled;
      // enable `react-transition-group` transitions for this test
      config.disabled = false;

      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
            },
            {
              field: 'category2',
            },
          ]}
          initialState={{
            rowGrouping: {
              model: ['category1', 'category2'],
            },
          }}
        />,
      );

      act(() => apiRef.current?.showColumnMenu('__row_group_by_columns_group__'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal(['category2']);
      const menuItemCategory2 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal([]);

      // restore previous config
      config.disabled = restoreDisabledConfig;
    });

    it('should add a "Stop grouping {field}" menu item for each grouping criteria with colDef.groupable = false but it should be disabled', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              groupable: false,
            },
            {
              field: 'category2',
              groupable: false,
            },
          ]}
          initialState={{
            rowGrouping: {
              model: ['category1', 'category2'],
            },
          }}
        />,
      );

      act(() => apiRef.current?.showColumnMenu('__row_group_by_columns_group__'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      expect(menuItemCategory1).to.have.class('Mui-disabled');
      const menuItemCategory2 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      expect(menuItemCategory2).to.have.class('Mui-disabled');
    });

    it('should use the colDef.headerName property for grouping menu item label', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              headerName: 'Category 1',
            },
          ]}
        />,
      );
      act(() => apiRef.current?.showColumnMenu('category1'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Group by Category 1' })).not.to.equal(null);
    });

    it('should use the colDef.headerName property for ungrouping menu item label', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              headerName: 'Category 1',
            },
          ]}
          initialState={{
            rowGrouping: {
              model: ['category1'],
            },
          }}
        />,
      );
      act(() => apiRef.current?.showColumnMenu('category1'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Stop grouping by Category 1' })).not.to.equal(
        null,
      );
    });
  });

  describe('sorting', () => {
    describe('prop: rowGroupingColumnMode = "single"', () => {
      it('should use each grouping criteria for sorting if leafField are not defined', async () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        await microtasks();

        expect(getColumnValues(0)).to.deep.equal([
          'Cat B (2)',
          'Cat 2 (1)',
          '',
          'Cat 1 (1)',
          '',
          'Cat A (3)',
          'Cat 2 (2)',
          '',
          '',
          'Cat 1 (1)',
          '',
        ]);
      });

      it('should sort leaves if leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category2',
            }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal([
          'Cat B (2)',
          'Cat 2 (1)',
          '3',
          'Cat 1 (1)',
          '4',
          'Cat A (3)',
          'Cat 2 (2)',
          '1',
          '2',
          'Cat 1 (1)',
          '0',
        ]);
      });

      it('should use the leaf field for sorting if mainGroupingCriteria is not defined and leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            groupingColDef={{
              leafField: 'id',
            }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          'Cat 1 (1)',
          '0',
          'Cat 2 (2)',
          '2',
          '1',
          'Cat B (2)',
          'Cat 2 (1)',
          '3',
          'Cat 1 (1)',
          '4',
        ]);
      });

      it('should use the leaf field for sorting if mainGroupingCriteria is not one of the grouping criteria and leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category3',
            }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          'Cat 1 (1)',
          '0',
          'Cat 2 (2)',
          '2',
          '1',
          'Cat B (2)',
          'Cat 2 (1)',
          '3',
          'Cat 1 (1)',
          '4',
        ]);
      });

      it('should sort unbalanced grouped by index of the grouping criteria in the model when sorting by a grouping criteria', () => {
        render(
          <Test
            rows={unbalancedRows}
            initialState={{ rowGrouping: { model: ['category1'] } }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
            groupingColDef={{ mainGroupingCriteria: 'category1', leafField: 'id' }}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat B (2)',
          '2',
          '3',
          'Cat A (2)',
          '0',
          '1',
          '4',
          '5',
        ]);
      });

      it('should sort unbalanced grouped by index of the grouping criteria in the model when sorting by leaves', () => {
        render(
          <Test
            rows={unbalancedRows}
            initialState={{ rowGrouping: { model: ['category1'] } }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
            groupingColDef={{ leafField: 'id' }}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (2)',
          '1',
          '0',
          'Cat B (2)',
          '3',
          '2',
          '5',
          '4',
        ]);
      });
    });

    describe('prop: rowGroupingColumnMode = "multiple"', () => {
      it('should use the column grouping criteria for sorting if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="multiple"
            sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', '', '', 'Cat A (3)', '', '', '']);
      });

      it('should use the column grouping criteria for sorting if mainGroupingCriteria matches the column grouping criteria and leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category1',
            }}
            sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat B (2)',
          '3',
          '4',
          'Cat A (3)',
          '0',
          '1',
          '2',
        ]);
      });

      it('should use the leaf field for sorting if mainGroupingCriteria is not defined and leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              leafField: 'id',
            }}
            sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '2',
          '1',
          '0',
          'Cat B (2)',
          '4',
          '3',
        ]);
      });

      it("should use the leaf field for sorting if mainGroupingCriteria doesn't match the column grouping criteria and leaf field is defined", () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category2',
            }}
            sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '2',
          '1',
          '0',
          'Cat B (2)',
          '4',
          '3',
        ]);
      });
    });
  });

  describe('filtering', () => {
    describe('prop: rowGroupingColumnMode = "single"', () => {
      it('should use the top level grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        await user.type(screen.getByRole('textbox', { name: 'Value' }), 'Cat A');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal([
            'Cat A (3)',
            'Cat 1 (1)',
            '',
            'Cat 2 (2)',
            '',
            '',
          ]);
        });
      });

      it('should use the column grouping criteria for filtering if mainGroupingCriteria is one of the grouping criteria and leaf field is defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category2',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        await user.type(screen.getByRole('textbox', { name: 'Value' }), 'Cat 1');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal([
            'Cat A (1)',
            'Cat 1 (1)',
            '0',
            'Cat B (1)',
            'Cat 1 (1)',
            '4',
          ]);
        });
      });

      it('should use the leaf field for filtering if mainGroupingCriteria is not defined and leaf field is defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColDef={{
              leafField: 'id',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(getSelectByName('Operator'), {
          target: { value: '>' },
        });
        await user.type(screen.getByRole('spinbutton', { name: 'Value' }), '2');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal([
            'Cat B (2)',
            'Cat 2 (1)',
            '3',
            'Cat 1 (1)',
            '4',
          ]);
        });
      });

      it('should use the leaf field for filtering if mainGroupingCriteria is not one of the grouping criteria and leaf field is defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category3',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(getSelectByName('Operator'), {
          target: { value: '>' },
        });

        await user.type(screen.getByRole('spinbutton', { name: 'Value' }), '2');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal([
            'Cat B (2)',
            'Cat 2 (1)',
            '3',
            'Cat 1 (1)',
            '4',
          ]);
        });
      });

      it('should not filter the groups when filtering with an item that is not on the grouping column', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [{ field: 'id', operator: '=', value: 2 }],
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // "Cat A" & "Cat 2" groups are not tested against the "id" filter item
        expect(getColumnValues(0)).to.deep.equal(['Cat A (1)', 'Cat 2 (1)', '']);
      });

      it('should apply quick filter without throwing error', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: ['B'],
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(1)).to.deep.equal(['', '3', '4']);
      });

      it('should let group appears when a leaf rows pass quick filter', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: ['Cat 1'],
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // Corresponds to rows id 0 an 4 (respectively "cat A cat 1" and "cat B cat 1")
        expect(getColumnValues(1)).to.deep.equal(['', '0', '', '4']);
      });

      it('should let group appears when a rows pass quick filter based on both grouping and leaf values', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: ['Cat A', 'Cat 2'],
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // Corresponds to rows A.1 and B.1
        expect(getColumnValues(1)).to.deep.equal(['', '1', '2']);
      });

      it('should show all children when a group pass quick filter', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: ['Cat A'],
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2']);
      });

      it('should let group appears when a leaf rows pass filterModel', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              filter: {
                filterModel: {
                  items: [
                    {
                      field: 'category2',
                      operator: 'equals',
                      value: 'Cat 1',
                    },
                  ],
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // Corresponds to rows id 0 an 4 (respectively "cat A cat 1" and "cat B cat 1")
        expect(getColumnValues(1)).to.deep.equal(['', '0', '', '4']);
      });

      it('should manage link operator OR across group and leaf columns', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              filter: {
                filterModel: {
                  items: [
                    {
                      id: 2,
                      field: 'category2',
                      operator: 'equals',
                      value: 'Cat 1',
                    },
                    {
                      id: 1,
                      field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                      operator: 'equals',
                      value: 'Cat A',
                    },
                  ],
                  logicOperator: GridLogicOperator.Or,
                },
              },
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // Corresponds to rows id 0, 1, 2 because of Cat A, ann id 4 because of Cat 1
        expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '', '4']);
      });

      it('should keep the correct count of the children and descendants in the filter state', () => {
        const extendedColumns = [
          ...baselineProps.columns,
          {
            field: 'value1',
          },
        ];

        const extendedRows = rows.map((row, index) => ({ ...row, value1: `Value${index}` }));
        const additionalRows = [
          { id: 5, category1: 'Cat A', category2: 'Cat 2', value1: 'Value5' },
          { id: 6, category1: 'Cat A', category2: 'Cat 2', value1: 'Value6' },
          { id: 7, category1: 'Cat B', category2: 'Cat 1', value1: 'Value7' },
        ];

        render(
          <Test
            columns={extendedColumns}
            rows={[...extendedRows, ...additionalRows]}
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            defaultGroupingExpansionDepth={3}
            rowGroupingColumnMode="multiple"
          />,
        );

        const { filteredChildrenCountLookup, filteredDescendantCountLookup } =
          apiRef.current!.state.filter;

        expect(filteredChildrenCountLookup['auto-generated-row-category1/Cat A']).to.equal(2);
        expect(filteredDescendantCountLookup['auto-generated-row-category1/Cat A']).to.equal(5);

        expect(
          filteredChildrenCountLookup['auto-generated-row-category1/Cat A-category2/Cat 2'],
        ).to.equal(4);
        expect(
          filteredDescendantCountLookup['auto-generated-row-category1/Cat A-category2/Cat 2'],
        ).to.equal(4);
      });
    });

    describe('prop: rowGroupingColumnMode = "multiple"', () => {
      it('should use the column grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        await user.type(screen.getByRole('textbox', { name: 'Value' }), 'Cat A');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '']);
        });

        expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2']);
      });

      it('should use the column grouping criteria for filtering if mainGroupingCriteria matches the column grouping criteria and leaf field is defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category1',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        await user.type(screen.getByRole('textbox', { name: 'Value' }), 'Cat A');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '0', '1', '2']);
        });
      });

      it('should use the leaf field for filtering if mainGroupingCriteria is not defined and leaf field is defined', async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              leafField: 'id',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(getSelectByName('Operator'), {
          target: { value: '>' },
        });
        await user.clear(screen.getByRole('spinbutton', { name: 'Value' }));
        await user.type(screen.getByRole('spinbutton', { name: 'Value' }), '2');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', '3', '4']);
        });
      });

      it("should use the leaf field for filtering if mainGroupingCriteria doesn't match the column grouping criteria and leaf field is defined", async () => {
        const { user } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category2',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(getSelectByName('Operator'), {
          target: { value: '>' },
        });
        await user.clear(screen.getByRole('spinbutton', { name: 'Value' }));
        await user.type(screen.getByRole('spinbutton', { name: 'Value' }), '2');

        await waitFor(() => {
          expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', '3', '4']);
        });
      });

      it('should not filter the groups when filtering with an item that is not on the grouping column', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [{ field: 'id', operator: '=', value: 2 }],
                },
              },
            }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // "Cat A" & "Cat 2" groups are not tested against the "id" filter item
        expect(getColumnValues(0)).to.deep.equal(['Cat A (1)', '', '']);
        expect(getColumnValues(1)).to.deep.equal(['', 'Cat 2 (1)', '']);
      });

      it('should not filter the groups when filtering with an item that is from another grouping column', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [
                    {
                      field: '__row_group_by_columns_group_category1__',
                      operator: 'equals',
                      value: 'Cat A',
                    },
                  ],
                },
              },
            }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // "Cat A" is testing against the "__row_group_by_columns_group_category1__" filter item, but "Cat 1" and "Cat 2" are not
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', '', '']);
        expect(getColumnValues(1)).to.deep.equal(['', 'Cat 1 (1)', '', 'Cat 2 (2)', '', '']);
      });
    });

    it('should not apply filters when the row is expanded', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
          }}
        />,
      );

      const onFilteredRowsSet = spy();
      apiRef.current?.subscribeEvent('filteredRowsSet', onFilteredRowsSet);

      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(onFilteredRowsSet.callCount).to.equal(0);
    });

    it('should not apply filters when the row is collapsed', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
          }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      const onFilteredRowsSet = spy();
      apiRef.current?.subscribeEvent('filteredRowsSet', onFilteredRowsSet);

      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(onFilteredRowsSet.callCount).to.equal(0);
    });
  });

  describe('column pinning', () => {
    it('should keep the checkbox selection column position after column is unpinned when groupingColumnMode = "single"', () => {
      const { setProps } = render(
        <Test
          checkboxSelection
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      const initialColumnOrder = ['', 'category1', 'id', 'category1', 'category2'];
      expect(getColumnHeadersTextContent()).to.deep.equal(initialColumnOrder);
      setProps({ pinnedColumns: { left: ['id'] } });
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'id',
        '',
        'category1',
        'category1',
        'category2',
      ]);
      setProps({ pinnedColumns: { left: [] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(initialColumnOrder);
    });

    it('should keep the checkbox selection column position after column is unpinned when groupingColumnMode = "multiple"', () => {
      const { setProps } = render(
        <Test
          checkboxSelection
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          rowGroupingColumnMode="multiple"
          defaultGroupingExpansionDepth={-1}
        />,
      );
      const initialColumnOrder = ['', 'category1', 'category2', 'id', 'category1', 'category2'];
      expect(getColumnHeadersTextContent()).to.deep.equal(initialColumnOrder);
      setProps({
        pinnedColumns: {
          left: ['__row_group_by_columns_group_category2__', 'id'],
        },
      });
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category2',
        'id',
        '',
        'category1',
        'category1',
        'category2',
      ]);
      setProps({ pinnedColumns: { left: [] } });
      expect(getColumnHeadersTextContent()).to.deep.equal(initialColumnOrder);
    });
  });

  describe('accessibility', () => {
    it('should add necessary treegrid aria attributes to the rows', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          rowGroupingColumnMode="multiple"
        />,
      );

      expect(getRow(0).getAttribute('aria-level')).to.equal('1'); // Cat A
      expect(getRow(1).getAttribute('aria-level')).to.equal('2'); // Cat 1
      expect(getRow(1).getAttribute('aria-posinset')).to.equal('1');
      expect(getRow(1).getAttribute('aria-setsize')).to.equal('2'); // Cat A has Cat 1 & Cat 2
      expect(getRow(2).getAttribute('aria-level')).to.equal('3'); // Cat 1 row
      expect(getRow(3).getAttribute('aria-posinset')).to.equal('2'); // Cat 2
      expect(getRow(4).getAttribute('aria-posinset')).to.equal('1'); // Cat 2 row
      expect(getRow(4).getAttribute('aria-setsize')).to.equal('2'); // Cat 2 has 2 rows
    });
  });

  // See https://github.com/mui/mui-x/issues/8626
  it('should properly update the rows when they change', async () => {
    render(
      <Test
        columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]}
        rows={[{ id: 1, group: 'A', username: 'username' }]}
        rowGroupingModel={['group']}
        defaultGroupingExpansionDepth={-1}
      />,
    );

    await act(async () => {
      apiRef.current?.updateRows([{ id: 1, group: 'A', username: 'username 2' }]);
    });

    expect(getCell(1, 3).textContent).to.equal('username 2');
  });

  // See https://github.com/mui/mui-x/issues/8580
  it('should not collapse expanded groups after `updateRows`', async () => {
    const { user } = render(
      <Test
        columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]}
        rows={[{ id: 1, group: 'A', username: 'username' }]}
        rowGroupingModel={['group']}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'see children' }));

    await act(async () => {
      apiRef.current?.updateRows([{ id: 1, group: 'A', username: 'username 2' }]);
    });

    expect(screen.getByRole('button', { name: 'hide children' })).toBeVisible();
    expect(getCell(1, 3).textContent).to.equal('username 2');
  });

  // See https://github.com/mui/mui-x/issues/8853
  it('should not reorder rows after calling `updateRows`', async () => {
    render(
      <Test
        columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]}
        rows={[
          { id: 1, group: 'A', username: 'username1' },
          { id: 2, group: 'A', username: 'username2' },
        ]}
        rowGroupingModel={['group']}
        defaultGroupingExpansionDepth={-1}
      />,
    );

    expect(getColumnValues(3)).to.deep.equal(['', 'username1', 'username2']);

    // trigger row update without any changes in row data
    await act(async () => {
      apiRef.current?.updateRows([{ id: 1 }]);
    });

    expect(getColumnValues(3)).to.deep.equal(['', 'username1', 'username2']);
  });
});
