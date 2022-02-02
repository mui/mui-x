import { createRenderer, fireEvent, screen, act } from '@mui/monorepo/test/utils';
import {
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getColumnValues,
} from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import {
  DataGridPro,
  DataGridProProps,
  getRowGroupingFieldFromGroupingCriteria,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridApi,
  GridGroupingValueGetterParams,
  GridPreferencePanelsValue,
  GridRowsProp,
  GridRowTreeNodeConfig,
  useGridApiRef,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { DataGridProProcessedProps } from '../../../_modules_/grid/models/props/DataGridProProps';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

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

const baselineProps: DataGridProProps = {
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
  experimentalFeatures: {
    rowGrouping: true,
  },
};

describe('<DataGridPro /> - Group Rows By Column', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const Test = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

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
        expect(getColumnValues()).to.deep.equal([
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

    it('should ignore grouping criteria with colDef.groupable = false', () => {
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
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
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

  describe('props: rowGroupingColumnMode', () => {
    it('should gather all the grouping criteria into a single column when rowGroupingColumnMode is not defined', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'Group',
        'id',
        'category1',
        'category2',
      ]);
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

    it('should gather all the grouping criteria into a single column when rowGroupingColumnMode = "single"', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          rowGroupingColumnMode="single"
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'Group',
        'id',
        'category1',
        'category2',
      ]);
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

    it('should create one grouping column per grouping criteria when rowGroupingColumnMode = "multiple"', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          rowGroupingColumnMode="multiple"
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category1',
        'category2',
        'id',
        'category1',
        'category2',
      ]);
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        '',
        '',
        '',
        '',
        '',
        'Cat B (2)',
        '',
        '',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal([
        '',
        'Cat 1 (1)',
        '',
        'Cat 2 (2)',
        '',
        '',
        '',
        'Cat 2 (1)',
        '',
        'Cat 1 (1)',
        '',
      ]);
    });

    it('should support rowGroupingColumnMode switch', () => {
      const { setProps } = render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          rowGroupingColumnMode="multiple"
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category1',
        'category2',
        'id',
        'category1',
        'category2',
      ]);
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        '',
        '',
        '',
        '',
        '',
        'Cat B (2)',
        '',
        '',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal([
        '',
        'Cat 1 (1)',
        '',
        'Cat 2 (2)',
        '',
        '',
        '',
        'Cat 2 (1)',
        '',
        'Cat 1 (1)',
        '',
      ]);

      setProps({ rowGroupingColumnMode: 'single' });
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'Group',
        'id',
        'category1',
        'category2',
      ]);
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

      setProps({ rowGroupingColumnMode: 'multiple' });
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category1',
        'category2',
        'id',
        'category1',
        'category2',
      ]);
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        '',
        '',
        '',
        '',
        '',
        'Cat B (2)',
        '',
        '',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal([
        '',
        'Cat 1 (1)',
        '',
        'Cat 2 (2)',
        '',
        '',
        '',
        'Cat 2 (1)',
        '',
        'Cat 1 (1)',
        '',
      ]);
    });

    it('should respect the model grouping order when rowGroupingColumnMode = "single"', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category2', 'category1'] } }}
          defaultGroupingExpansionDepth={-1}
          rowGroupingColumnMode="single"
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'Group',
        'id',
        'category1',
        'category2',
      ]);
      expect(getColumnValues(0)).to.deep.equal([
        'Cat 1 (2)',
        'Cat A (1)',
        '',
        'Cat B (1)',
        '',
        'Cat 2 (3)',
        'Cat A (2)',
        '',
        '',
        'Cat B (1)',
        '',
      ]);
    });

    it('should respect the model grouping order when rowGroupingColumnMode = "multiple"', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category2', 'category1'] } }}
          defaultGroupingExpansionDepth={-1}
          rowGroupingColumnMode="multiple"
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category2',
        'category1',
        'id',
        'category1',
        'category2',
      ]);
      expect(getColumnValues(0)).to.deep.equal([
        'Cat 1 (2)',
        '',
        '',
        '',
        '',
        'Cat 2 (3)',
        '',
        '',
        '',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal([
        '',
        'Cat A (1)',
        '',
        'Cat B (1)',
        '',
        '',
        'Cat A (2)',
        '',
        '',
        'Cat B (1)',
        '',
      ]);
    });
  });

  describe('props: disableRowGrouping', () => {
    // TODO: Remove once the feature is stable
    it('should set `disableRowGrouping` to `true` if `experimentalFeatures.rowGrouping = false', () => {
      const disableRowGroupingSpy = spy();

      const CustomToolbar = () => {
        const rootProps = useGridRootProps<DataGridProProcessedProps>();
        disableRowGroupingSpy(rootProps.disableRowGrouping);
        return null;
      };

      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
          experimentalFeatures={{
            rowGrouping: false,
          }}
          components={{ Toolbar: CustomToolbar }}
        />,
      );

      expect(disableRowGroupingSpy.lastCall.firstArg).to.equal(true);
    });

    it('should disable the row grouping when `prop.disableRowGrouping = true`', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
          disableRowGrouping
        />,
      );

      // No grouping applied on rows
      expect(apiRef.current.state.rows.groupingName).to.equal('none');
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);

      // No grouping column rendered
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'category1', 'category2']);

      // No menu item on column menu to add / remove grouping criteria
      apiRef.current.showColumnMenu('category1');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const category1Menuitem = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      expect(category1Menuitem).to.equal(null);

      apiRef.current.hideColumnMenu();
      clock.runToLast();
      expect(screen.queryByRole('menu')).to.equal(null);

      apiRef.current.showColumnMenu('category2');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const category2Menuitem = screen.queryByRole('menuitem', { name: 'Group by category2' });
      expect(category2Menuitem).to.equal(null);
    });
  });

  describe('prop: defaultGroupingExpansionDepth', () => {
    it('should not expand any row if defaultGroupingExpansionDepth = 0', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={0}
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', 'Cat B (2)']);
    });

    it('should expand all top level rows if defaultGroupingExpansionDepth = 1', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={1}
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat 1 (1)',
        'Cat 2 (2)',
        'Cat B (2)',
        'Cat 2 (1)',
        'Cat 1 (1)',
      ]);
    });

    it('should expand all rows up to depth of 2 if defaultGroupingExpansionDepth = 2', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={2}
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
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

    it('should expand all rows if defaultGroupingExpansionDepth = -1', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={-1}
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
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

    it('should not re-apply default expansion on rerender after expansion manually toggled', () => {
      const { setProps } = render(
        <Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', 'Cat B (2)']);
      act(() => {
        apiRef.current.setRowChildrenExpansion('auto-generated-row-category1/Cat B', true);
      });
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat B (2)',
        'Cat 2 (1)',
        'Cat 1 (1)',
      ]);
      setProps({ sortModel: [{ field: '__row_group_by_columns_group__', sort: 'desc' }] });
      expect(getColumnValues(0)).to.deep.equal([
        'Cat B (2)',
        'Cat 2 (1)',
        'Cat 1 (1)',
        'Cat A (3)',
      ]);
    });
  });

  describe('prop: isGroupExpandedByDefault', () => {
    it('should expand groups according to isGroupExpandedByDefault when defined', () => {
      const isGroupExpandedByDefault = spy(
        (node: GridRowTreeNodeConfig) =>
          node.groupingKey === 'Cat A' && node.groupingField === 'category1',
      );

      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          isGroupExpandedByDefault={isGroupExpandedByDefault}
        />,
      );
      expect(isGroupExpandedByDefault.callCount).to.equal(12); // Should not be called on leaves
      const { childrenExpanded, ...node } = apiRef.current.state.rows.tree.A;
      const callForNodeA = isGroupExpandedByDefault
        .getCalls()
        .find(
          (call) =>
            call.firstArg.groupingKey === 'Cat A' && call.firstArg.groupingField === 'category1',
        )!;
      expect(callForNodeA.firstArg).to.deep.includes(node);
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat 1 (1)',
        'Cat 2 (2)',
        'Cat B (2)',
      ]);
    });

    it('should have priority over defaultGroupingExpansionDepth when both defined', () => {
      const isGroupExpandedByDefault = (node: GridRowTreeNodeConfig) =>
        node.groupingKey === 'Cat A' && node.groupingField === 'category1';

      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          isGroupExpandedByDefault={isGroupExpandedByDefault}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat 1 (1)',
        'Cat 2 (2)',
        'Cat B (2)',
      ]);
    });
  });

  describe('props: groupingColDef when groupingColumMode = "single"', () => {
    it('should not allow to override the field', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          rowGroupingColumnMode="single"
          groupingColDef={{
            // @ts-expect-error
            field: 'custom-field',
          }}
        />,
      );

      expect(apiRef.current.getAllColumns()[0].field).to.equal('__row_group_by_columns_group__');
    });

    it('should react to groupingColDef update', () => {
      const { setProps } = render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          rowGroupingColumnMode="single"
          groupingColDef={{}}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category1',
        'id',
        'category1',
        'category2',
      ]);

      setProps({
        groupingColDef: {
          headerName: 'Custom group',
        },
      });
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'Custom group',
        'id',
        'category1',
        'category2',
      ]);
    });

    it('should keep the grouping column width between generations', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          rowGroupingColumnMode="single"
          groupingColDef={{ width: 200 }}
        />,
      );

      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '200px' });
      apiRef.current.updateColumns([
        { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, width: 100 },
      ]);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      apiRef.current.updateColumns([
        {
          field: 'id',
          headerName: 'New id',
        },
      ]);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
    });

    describe('prop: groupColDef.leafField', () => {
      it('should render the leafField `value` on leaves', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{ leafField: 'id' }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '0',
          '1',
          '2',
          'Cat B (2)',
          '3',
          '4',
        ]);
      });

      it('should render the leafField `formattedValue` on leaves if `valueFormatter` is defined on the leafColDef', () => {
        render(
          <Test
            columns={[
              {
                field: 'id',
                type: 'number',
                valueFormatter: (params) => {
                  if (params.value == null) {
                    return null;
                  }

                  return `#${params.value}`;
                },
              },
              {
                field: 'category1',
              },
            ]}
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{ leafField: 'id' }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '#0',
          '#1',
          '#2',
          'Cat B (2)',
          '#3',
          '#4',
        ]);
      });

      it('should render the leafField `renderCell` on leaves  if `renderCell` is defined on the leafColDef', () => {
        const renderIdCell = spy(() => 'Custom leaf');

        render(
          <Test
            columns={[
              {
                field: 'id',
                type: 'number',
                renderCell: renderIdCell,
              },
              {
                field: 'category1',
              },
            ]}
            initialState={{ rowGrouping: { model: ['category1'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{ leafField: 'id' }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(renderIdCell.lastCall.firstArg.id).to.equal(4);
        expect(renderIdCell.lastCall.firstArg.field).to.equal('id');
        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          'Custom leaf',
          'Custom leaf',
          'Custom leaf',
          'Cat B (2)',
          'Custom leaf',
          'Custom leaf',
        ]);
      });
    });

    describe('prop: groupColDef.headerName', () => {
      it('should allow to override the headerName in object mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{
              headerName: 'Main category',
            }}
          />,
        );

        expect(getColumnHeadersTextContent()).to.deep.equal([
          'Main category',
          'id',
          'category1',
          'category2',
        ]);
      });

      it('should allow to override the headerName in callback mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={(params) =>
              params.fields.includes('category1')
                ? {
                    headerName: 'Main category',
                  }
                : {}
            }
          />,
        );

        expect(getColumnHeadersTextContent()).to.deep.equal([
          'Main category',
          'id',
          'category1',
          'category2',
        ]);
      });
    });

    describe('prop: groupingColDef.hideDescendantCount', () => {
      it('should render descendant count when hideDescendantCount = false', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{ hideDescendantCount: false }}
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

      it('should not render descendant count when hideDescendantCount = true', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{ hideDescendantCount: true }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A',
          'Cat 1',
          '',
          'Cat 2',
          '',
          '',
          'Cat B',
          'Cat 2',
          '',
          'Cat 1',
          '',
        ]);
      });
    });
  });

  describe('props: groupingColDef when groupingColumMode = "multiple"', () => {
    it('should not allow to override the field', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          rowGroupingColumnMode="multiple"
          groupingColDef={{
            // @ts-expect-error
            field: 'custom-field',
          }}
        />,
      );

      expect(apiRef.current.getAllColumns()[0].field).to.equal(
        '__row_group_by_columns_group_category1__',
      );
    });

    it('should react to groupingColDef update', () => {
      const { setProps } = render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          rowGroupingColumnMode="multiple"
          groupingColDef={(params) =>
            params.fields.includes('category1')
              ? {
                  headerName: 'Custom group',
                }
              : {}
          }
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([
        'Custom group',
        'category2',
        'id',
        'category1',
        'category2',
      ]);

      setProps({
        groupingColDef: (params) =>
          params.fields.includes('category2')
            ? {
                headerName: 'Custom group',
              }
            : {},
      });
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'category1',
        'Custom group',
        'id',
        'category1',
        'category2',
      ]);
    });

    it('should keep the grouping column width between generations', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          rowGroupingColumnMode="multiple"
          groupingColDef={(params) =>
            params.fields.includes('category1') ? { width: 200 } : { width: 300 }
          }
        />,
      );

      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '200px' });
      expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '300px' });
      apiRef.current.updateColumns([
        { field: getRowGroupingFieldFromGroupingCriteria('category1'), width: 100 },
      ]);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '300px' });
      apiRef.current.updateColumns([
        {
          field: 'id',
          headerName: 'New id',
        },
      ]);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '300px' });
    });

    describe('prop: groupColDef.leafField', () => {
      it('should render the leafField `value` on leaves', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={(params) =>
              params.fields.includes('category2')
                ? {
                    leafField: 'id',
                  }
                : {}
            }
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '',
          '',
          '',
          '',
          '',
          'Cat B (2)',
          '',
          '',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'Cat 1 (1)',
          '0',
          'Cat 2 (2)',
          '1',
          '2',
          '',
          'Cat 2 (1)',
          '3',
          'Cat 1 (1)',
          '4',
        ]);
      });

      it('should render the leafField `formattedValue` on leaves if `valueFormatter` is defined on the leafColDef', () => {
        render(
          <Test
            columns={[
              {
                field: 'id',
                type: 'number',
                valueFormatter: (params) => {
                  if (params.value == null) {
                    return null;
                  }

                  return `#${params.value}`;
                },
              },
              {
                field: 'category1',
              },
              {
                field: 'category2',
              },
            ]}
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={(params) =>
              params.fields.includes('category2')
                ? {
                    leafField: 'id',
                  }
                : {}
            }
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '',
          '',
          '',
          '',
          '',
          'Cat B (2)',
          '',
          '',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'Cat 1 (1)',
          '#0',
          'Cat 2 (2)',
          '#1',
          '#2',
          '',
          'Cat 2 (1)',
          '#3',
          'Cat 1 (1)',
          '#4',
        ]);
      });

      it('should render the leafField `renderCell` on leaves  if `renderCell` is defined on the leafColDef', () => {
        const renderIdCell = spy(() => 'Custom leaf');

        render(
          <Test
            columns={[
              {
                field: 'id',
                type: 'number',
                renderCell: renderIdCell,
              },
              {
                field: 'category1',
              },
              {
                field: 'category2',
              },
            ]}
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={(params) =>
              params.fields.includes('category2')
                ? {
                    leafField: 'id',
                  }
                : {}
            }
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(renderIdCell.lastCall.firstArg.id).to.equal(4);
        expect(renderIdCell.lastCall.firstArg.field).to.equal('id');
        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '',
          '',
          '',
          '',
          '',
          'Cat B (2)',
          '',
          '',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'Cat 1 (1)',
          'Custom leaf',
          'Cat 2 (2)',
          'Custom leaf',
          'Custom leaf',
          '',
          'Cat 2 (1)',
          'Custom leaf',
          'Cat 1 (1)',
          'Custom leaf',
        ]);
      });
    });

    describe('prop: groupColDef.headerName', () => {
      it('should allow to override the headerName in object mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{
              headerName: 'Main category',
            }}
          />,
        );

        expect(getColumnHeadersTextContent()).to.deep.equal([
          'Main category',
          'Main category',
          'id',
          'category1',
          'category2',
        ]);
      });

      it('should allow to override the headerName in callback mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={(params) =>
              params.fields.includes('category1')
                ? {
                    headerName: 'Main category',
                  }
                : {}
            }
          />,
        );

        expect(getColumnHeadersTextContent()).to.deep.equal([
          'Main category',
          'category2',
          'id',
          'category1',
          'category2',
        ]);
      });
    });

    describe('prop: groupingColDef.hideDescendantCount', () => {
      it('should render descendant count when hideDescendantCount = false', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{ hideDescendantCount: false }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          '',
          '',
          '',
          '',
          '',
          'Cat B (2)',
          '',
          '',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'Cat 1 (1)',
          '',
          'Cat 2 (2)',
          '',
          '',
          '',
          'Cat 2 (1)',
          '',
          'Cat 1 (1)',
          '',
        ]);
      });

      it('should not render descendant count when hideDescendantCount = true', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            groupingColDef={{ hideDescendantCount: true }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A',
          '',
          '',
          '',
          '',
          '',
          'Cat B',
          '',
          '',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'Cat 1',
          '',
          'Cat 2',
          '',
          '',
          '',
          'Cat 2',
          '',
          'Cat 1',
          '',
        ]);
      });
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
              groupingValueGetter: (params: GridGroupingValueGetterParams<string>) =>
                `groupingValue ${params.value}`,
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

    it('should not use valueGetter to group the rows when defined', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              valueGetter: (params) => `value ${params.row.category1}`,
            },
          ]}
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
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
              hide: true,
              valueGetter: (params) => `value ${params.row.category1}`,
              groupingValueGetter: (params: GridGroupingValueGetterParams<string>) =>
                `groupingValue ${params.row.category1}`,
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
      apiRef.current.showColumnMenu('category1');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItem = screen.queryByRole('menuitem', { name: 'Group by category1' });
      fireEvent.click(menuItem);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category1']);
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
      apiRef.current.showColumnMenu('category1');
      clock.runToLast();
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
      apiRef.current.showColumnMenu('category1');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItem = screen.queryByRole('menuitem', { name: 'Stop grouping by category1' });
      fireEvent.click(menuItem);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
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

      apiRef.current.showColumnMenu('__row_group_by_columns_group_category1__');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2']);

      apiRef.current.hideColumnMenu();
      clock.runToLast();
      expect(screen.queryByRole('menu')).to.equal(null);

      apiRef.current.showColumnMenu('__row_group_by_columns_group_category2__');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory2 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
    });

    it('should add a "Stop grouping {field} menu item for each grouping criteria on the grouping column when prop.rowGroupingColumnMode = "single"', () => {
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
          rowGroupingColumnMode="single"
        />,
      );

      apiRef.current.showColumnMenu('__row_group_by_columns_group__');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2']);
      const menuItemCategory2 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
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
      apiRef.current.showColumnMenu('category1');
      clock.runToLast();
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
      apiRef.current.showColumnMenu('category1');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Stop grouping by Category 1' })).not.to.equal(
        null,
      );
    });
  });

  describe('sorting', () => {
    describe('props: rowGroupingColumnMode = "single"', () => {
      it('should use the top level grouping criteria for sorting if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'Cat B (2)',
          'Cat 2 (1)',
          '',
          'Cat 1 (1)',
          '',
          'Cat A (3)',
          'Cat 1 (1)',
          '',
          'Cat 2 (2)',
          '',
          '',
        ]);
      });

      it('should use the column grouping criteria for sorting if mainGroupingCriteria is one of the grouping criteria and leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category2',
            }}
            sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          'Cat 2 (2)',
          '1',
          '2',
          'Cat 1 (1)',
          '0',
          'Cat B (2)',
          'Cat 2 (1)',
          '3',
          'Cat 1 (1)',
          '4',
        ]);
      });

      it('should use the leaf field for sorting if mainGroupingCriteria is not defined and leaf field is defined', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="single"
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
            rowGroupingColumnMode="single"
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
            rowGroupingColumnMode="single"
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
            rowGroupingColumnMode="single"
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

    describe('props: rowGroupingColumnMode = "multiple"', () => {
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
    clock.withFakeTimers();

    describe('props: rowGroupingColumnMode = "single"', () => {
      it('should use the top level grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="single"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), {
          target: { value: 'Cat A' },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (3)',
          'Cat 1 (1)',
          '',
          'Cat 2 (2)',
          '',
          '',
        ]);
      });

      it('should use the column grouping criteria for filtering if mainGroupingCriteria is one of the grouping criteria and leaf field is defined', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="single"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category2',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), {
          target: { value: 'Cat 1' },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal([
          'Cat A (1)',
          'Cat 1 (1)',
          '0',
          'Cat B (1)',
          'Cat 1 (1)',
          '4',
        ]);
      });

      it('should use the leaf field for filtering if mainGroupingCriteria is not defined and leaf field is defined', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="single"
            groupingColDef={{
              leafField: 'id',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
          target: { value: '>' },
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: 'Value' }), {
          target: { value: 2 },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', 'Cat 2 (1)', '3', 'Cat 1 (1)', '4']);
      });

      it('should use the leaf field for filtering if mainGroupingCriteria is not one of the grouping criteria and leaf field is defined', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="single"
            groupingColDef={{
              leafField: 'id',
              mainGroupingCriteria: 'category3',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
          target: { value: '>' },
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: 'Value' }), {
          target: { value: 2 },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', 'Cat 2 (1)', '3', 'Cat 1 (1)', '4']);
      });

      it('should not filter the groups when filtering with an item that is not on the grouping column', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [{ columnField: 'id', operatorValue: '=', value: 2 }],
                },
              },
            }}
            rowGroupingColumnMode="single"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // "Cat A" & "Cat 2" groups are not tested against the "id" filter item
        expect(getColumnValues(0)).to.deep.equal(['Cat A (1)', 'Cat 2 (1)', '']);
      });
    });

    describe('props: rowGroupingColumnMode = "multiple"', () => {
      it('should use the column grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), {
          target: { value: 'Cat A' },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '']);
        expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2']);
      });

      it('should use the column grouping criteria for filtering if mainGroupingCriteria matches the column grouping criteria and leaf field is defined', () => {
        render(
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

        fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), {
          target: { value: 'Cat A' },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '0', '1', '2']);
      });

      it('should use the leaf field for filtering if mainGroupingCriteria is not defined and leaf field is defined', () => {
        render(
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

        fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
          target: { value: '>' },
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: 'Value' }), {
          target: { value: 2 },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', '3', '4']);
      });

      it("should use the leaf field for filtering if mainGroupingCriteria doesn't match the column grouping criteria and leaf field is defined", () => {
        render(
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

        fireEvent.change(screen.getByRole('combobox', { name: 'Operators' }), {
          target: { value: '>' },
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: 'Value' }), {
          target: { value: 2 },
        });
        clock.tick(500);

        expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', '3', '4']);
      });

      it('should not filter the groups when filtering with an item that is not on the grouping column', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [{ columnField: 'id', operatorValue: '=', value: 2 }],
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
                      columnField: '__row_group_by_columns_group_category1__',
                      operatorValue: 'equals',
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
  });

  describe('apiRef: addRowGroupingCriteria', () => {
    it('should add grouping criteria to model', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      apiRef.current.addRowGroupingCriteria('category2');
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category1', 'category2']);
    });

    it('should add grouping criteria to model at the right position', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      apiRef.current.addRowGroupingCriteria('category2', 0);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
    });
  });

  describe('apiRef: removeRowGroupingCriteria', () => {
    it('should remove field from model', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      apiRef.current.removeRowGroupingCriteria('category1');
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
    });
  });

  describe('apiRef: setRowGroupingCriteriaIndex', () => {
    it('should change the grouping criteria order', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} />);
      apiRef.current.setRowGroupingCriteriaIndex('category1', 1);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
    });
  });
});
