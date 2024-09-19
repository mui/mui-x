import * as React from 'react';
import { createRenderer, fireEvent, screen, act, waitFor } from '@mui/internal-test-utils';
import {
  microtasks,
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getColumnValues,
  getCell,
  getSelectByName,
  getRow,
} from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  getRowGroupingFieldFromGroupingCriteria,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridApi,
  GridPreferencePanelsValue,
  GridRowsProp,
  useGridApiRef,
  GridGroupingColDefOverrideParams,
  getGroupRowIdFromPath,
  GridLogicOperator,
  GridGroupNode,
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
  const { render, clock } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('Setting grouping criteria', () => {
    clock.withFakeTimers();

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

  describe('prop: rowGroupingColumnMode', () => {
    clock.withFakeTimers();

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

  describe('prop: disableRowGrouping', () => {
    clock.withFakeTimers();

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
      act(() => apiRef.current.showColumnMenu('category1'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const category1Menuitem = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      expect(category1Menuitem).to.equal(null);

      act(() => apiRef.current.hideColumnMenu());
      clock.runToLast();
      expect(screen.queryByRole('menu')).to.equal(null);

      act(() => apiRef.current.showColumnMenu('category2'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const category2Menuitem = screen.queryByRole('menuitem', { name: 'Group by category2' });
      expect(category2Menuitem).to.equal(null);
    });
  });

  describe('prop: defaultGroupingExpansionDepth', () => {
    clock.withFakeTimers();

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
    clock.withFakeTimers();

    it('should expand groups according to isGroupExpandedByDefault when defined', () => {
      const isGroupExpandedByDefault = spy(
        (node: GridGroupNode) => node.groupingKey === 'Cat A' && node.groupingField === 'category1',
      );

      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          isGroupExpandedByDefault={isGroupExpandedByDefault}
        />,
      );
      expect(isGroupExpandedByDefault.callCount).to.equal(12); // Should not be called on leaves
      const { childrenExpanded, ...node } = apiRef.current.state.rows.tree.A as GridGroupNode;
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
      const isGroupExpandedByDefault = (node: GridGroupNode) =>
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

  describe('prop: groupingColDef when groupingColumnMode = "single"', () => {
    clock.withFakeTimers();

    it('should not allow to override the field', () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
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
        <Test initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{}} />,
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
          groupingColDef={{ width: 200 }}
        />,
      );

      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '200px' });
      act(() =>
        apiRef.current.updateColumns([
          { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, width: 100 },
        ]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      act(() =>
        apiRef.current.updateColumns([
          {
            field: 'id',
            headerName: 'New id',
          },
        ]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
    });

    describe('prop: groupColDef.leafField', () => {
      it('should render the leafField `value` on leaves', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1'] } }}
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
                valueFormatter: (value) => {
                  if (value == null) {
                    return null;
                  }

                  return `#${value}`;
                },
              },
              {
                field: 'category1',
              },
            ]}
            initialState={{ rowGrouping: { model: ['category1'] } }}
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
            groupingColDef={{ leafField: 'id' }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

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

      // See https://github.com/mui/mui-x/issues/7949
      it('should correctly pass `hasFocus` to `renderCell` defined on the leafColDef', () => {
        const renderIdCell = spy((params) => `Focused: ${params.hasFocus}`);

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
            groupingColDef={{ leafField: 'id' }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireUserEvent.mousePress(getCell(1, 0));
        expect(renderIdCell.lastCall.firstArg.field).to.equal('id');
        expect(getCell(1, 0)).to.have.text('Focused: true');
      });
    });

    describe('prop: groupColDef.headerName', () => {
      it('should allow to override the headerName in object mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
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

    describe('prop: groupColDef.valueFormatter', () => {
      it('should allow to format the value in object mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            defaultGroupingExpansionDepth={1}
            groupingColDef={{
              valueFormatter: (value, row) => {
                const rowId = apiRef.current.getRowId(row);
                const node = apiRef.current.getRowNode(rowId)!;
                if (node.type !== 'group') {
                  return '';
                }

                return `${node.groupingField} / ${node.groupingKey}`;
              },
            }}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'category1 / Cat A (3)',
          'category2 / Cat 1 (1)',
          'category2 / Cat 2 (2)',
          'category1 / Cat B (2)',
          'category2 / Cat 2 (1)',
          'category2 / Cat 1 (1)',
        ]);
      });

      it('should allow to format the value in callback mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            defaultGroupingExpansionDepth={1}
            groupingColDef={() => ({
              valueFormatter: (value, row) => {
                const rowId = apiRef.current.getRowId(row);
                const node = apiRef.current.getRowNode(rowId)!;
                if (node.type !== 'group') {
                  return '';
                }

                return `${node.groupingField} / ${node.groupingKey}`;
              },
            })}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'category1 / Cat A (3)',
          'category2 / Cat 1 (1)',
          'category2 / Cat 2 (2)',
          'category1 / Cat B (2)',
          'category2 / Cat 2 (1)',
          'category2 / Cat 1 (1)',
        ]);
      });
    });

    describe('prop: groupingColDef.hideDescendantCount', () => {
      it('should render descendant count when hideDescendantCount = false', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
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

  describe('prop: groupingColDef when groupingColumnMode = "multiple"', () => {
    clock.withFakeTimers();

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
        groupingColDef: (params: GridGroupingColDefOverrideParams) =>
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
      act(() =>
        apiRef.current.updateColumns([
          { field: getRowGroupingFieldFromGroupingCriteria('category1'), width: 100 },
        ]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '300px' });
      act(() =>
        apiRef.current.updateColumns([
          {
            field: 'id',
            headerName: 'New id',
          },
        ]),
      );
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
                valueFormatter: (value) => {
                  if (value == null) {
                    return null;
                  }

                  return `#${value}`;
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

    describe('prop: groupColDef.valueFormatter', () => {
      it('should allow to format the value in object mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={1}
            groupingColDef={{
              valueFormatter: (value, row) => {
                const rowId = apiRef.current.getRowId(row);
                const node = apiRef.current.getRowNode(rowId)!;
                if (node.type !== 'group') {
                  return '';
                }

                return `${node.groupingField} / ${node.groupingKey}`;
              },
            }}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'category1 / Cat A (3)',
          '',
          '',
          'category1 / Cat B (2)',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'category2 / Cat 1 (1)',
          'category2 / Cat 2 (2)',
          '',
          'category2 / Cat 2 (1)',
          'category2 / Cat 1 (1)',
        ]);
      });

      it('should allow to format the value in callback mode', () => {
        render(
          <Test
            initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
            rowGroupingColumnMode="multiple"
            defaultGroupingExpansionDepth={1}
            groupingColDef={({ fields }) => {
              if (!fields.includes('category1')) {
                return {};
              }

              return {
                valueFormatter: (value, row) => {
                  const rowId = apiRef.current.getRowId(row);
                  const node = apiRef.current.getRowNode(rowId)!;
                  if (node.type !== 'group') {
                    return '';
                  }

                  return `${node.groupingField} / ${node.groupingKey}`;
                },
              };
            }}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal([
          'category1 / Cat A (3)',
          '',
          '',
          'category1 / Cat B (2)',
          '',
          '',
        ]);
        expect(getColumnValues(1)).to.deep.equal([
          '',
          'Cat 1 (1)',
          'Cat 2 (2)',
          '',
          'Cat 2 (1)',
          'Cat 1 (1)',
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
    clock.withFakeTimers();

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
        apiRef.current.updateColumns([
          {
            field: 'modulo',
            groupingValueGetter: (value, row) => row.id % 3,
          },
        ]),
      );

      expect(getColumnValues(0)).to.deep.equal(['0 (2)', '', '', '1 (2)', '', '', '2 (1)', '']);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '3', '', '1', '4', '', '2']);
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
              valueGetter: (value, row) => `value ${row.category1}`,
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
    clock.withFakeTimers();

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
      act(() => apiRef.current.showColumnMenu('category1'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItem = screen.getByRole('menuitem', { name: 'Group by category1' });
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
      act(() => apiRef.current.showColumnMenu('category1'));
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
      act(() => apiRef.current.showColumnMenu('category1'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItem = screen.getByRole('menuitem', { name: 'Stop grouping by category1' });
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

      act(() => apiRef.current.showColumnMenu('__row_group_by_columns_group_category1__'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2']);

      act(() => apiRef.current.hideColumnMenu());
      clock.runToLast();
      expect(screen.queryByRole('menu')).to.equal(null);

      act(() => apiRef.current.showColumnMenu('__row_group_by_columns_group_category2__'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory2 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
    });

    it('should add a "Stop grouping {field}" menu item for each grouping criteria on the grouping column when prop.rowGroupingColumnMode = "single"', () => {
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

      act(() => apiRef.current.showColumnMenu('__row_group_by_columns_group__'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2']);
      const menuItemCategory2 = screen.getByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
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

      act(() => apiRef.current.showColumnMenu('__row_group_by_columns_group__'));
      clock.runToLast();
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
      act(() => apiRef.current.showColumnMenu('category1'));
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
      act(() => apiRef.current.showColumnMenu('category1'));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Stop grouping by Category 1' })).not.to.equal(
        null,
      );
    });
  });

  describe('sorting', () => {
    clock.withFakeTimers();

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
    clock.withFakeTimers();

    describe('prop: rowGroupingColumnMode = "single"', () => {
      it('should use the top level grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
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
            groupingColDef={{
              leafField: 'id',
            }}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        fireEvent.change(getSelectByName('Operator'), {
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
          apiRef.current.state.filter;

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

        fireEvent.change(getSelectByName('Operator'), {
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

        fireEvent.change(getSelectByName('Operator'), {
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
      apiRef.current.subscribeEvent('filteredRowsSet', onFilteredRowsSet);

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
      apiRef.current.subscribeEvent('filteredRowsSet', onFilteredRowsSet);

      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(onFilteredRowsSet.callCount).to.equal(0);
    });
  });

  describe('apiRef: addRowGroupingCriteria', () => {
    clock.withFakeTimers();

    it('should add grouping criteria to model', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      act(() => apiRef.current.addRowGroupingCriteria('category2'));
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category1', 'category2']);
    });

    it('should add grouping criteria to model at the right position', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      act(() => apiRef.current.addRowGroupingCriteria('category2', 0));
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
    });
  });

  describe('apiRef: removeRowGroupingCriteria', () => {
    clock.withFakeTimers();

    it('should remove field from model', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      act(() => apiRef.current.removeRowGroupingCriteria('category1'));
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal([]);
    });
  });

  describe('apiRef: setRowGroupingCriteriaIndex', () => {
    clock.withFakeTimers();

    it('should change the grouping criteria order', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} />);
      act(() => apiRef.current.setRowGroupingCriteriaIndex('category1', 1));
      expect(apiRef.current.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
    });
  });

  describe('apiRef: getRowGroupChildren', () => {
    clock.withFakeTimers();

    it('should return the rows in group of depth 0 of length 1 from tree of depth 1', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            filter: {
              filterModel: {
                items: [{ field: 'id', operator: '>=', value: '1' }],
              },
            },
          }}
        />,
      );

      const groupId = getGroupRowIdFromPath([{ field: 'category1', key: 'Cat A' }]);
      expect(apiRef.current.getRowGroupChildren({ groupId })).to.deep.equal([0, 1, 2]);
      expect(apiRef.current.getRowGroupChildren({ groupId, applySorting: true })).to.deep.equal([
        2, 1, 0,
      ]);
      expect(apiRef.current.getRowGroupChildren({ groupId, applyFiltering: true })).to.deep.equal([
        1, 2,
      ]);
      expect(
        apiRef.current.getRowGroupChildren({
          groupId,
          applySorting: true,
          applyFiltering: true,
        }),
      ).to.deep.equal([2, 1]);
    });

    it('should return the rows in group of depth 0 from tree of depth 2', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1', 'category2'] },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            filter: {
              filterModel: {
                items: [{ field: 'id', operator: '>=', value: '1' }],
              },
            },
          }}
        />,
      );

      const groupId = getGroupRowIdFromPath([{ field: 'category1', key: 'Cat A' }]);
      expect(apiRef.current.getRowGroupChildren({ groupId })).to.deep.equal([0, 1, 2]);
      expect(apiRef.current.getRowGroupChildren({ groupId, applySorting: true })).to.deep.equal([
        0, 2, 1,
      ]);
      expect(apiRef.current.getRowGroupChildren({ groupId, applyFiltering: true })).to.deep.equal([
        1, 2,
      ]);
      expect(
        apiRef.current.getRowGroupChildren({
          groupId,
          applySorting: true,
          applyFiltering: true,
        }),
      ).to.deep.equal([2, 1]);
      expect(
        apiRef.current.getRowGroupChildren({
          groupId,
          skipAutoGeneratedRows: false,
        }),
      ).to.deep.equal([
        'auto-generated-row-category1/Cat A-category2/Cat 1',
        0,
        'auto-generated-row-category1/Cat A-category2/Cat 2',
        1,
        2,
      ]);
      expect(
        apiRef.current.getRowGroupChildren({
          groupId,
          skipAutoGeneratedRows: false,
          applySorting: true,
          applyFiltering: true,
        }),
      ).to.deep.equal(['auto-generated-row-category1/Cat A-category2/Cat 2', 2, 1]);
    });

    it('should return the rows in group of depth 1 from tree of depth 2', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1', 'category2'] },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            filter: {
              filterModel: {
                items: [{ field: 'id', operator: '>=', value: '2' }],
              },
            },
          }}
        />,
      );

      const groupId = getGroupRowIdFromPath([
        { field: 'category1', key: 'Cat A' },
        { field: 'category2', key: 'Cat 2' },
      ]);
      expect(apiRef.current.getRowGroupChildren({ groupId })).to.deep.equal([1, 2]);
      expect(apiRef.current.getRowGroupChildren({ groupId, applySorting: true })).to.deep.equal([
        2, 1,
      ]);
      expect(apiRef.current.getRowGroupChildren({ groupId, applyFiltering: true })).to.deep.equal([
        2,
      ]);
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

    act(() => apiRef.current.updateRows([{ id: 1, group: 'A', username: 'username 2' }]));

    await waitFor(() => expect(getCell(1, 3).textContent).to.equal('username 2'));
  });

  // See https://github.com/mui/mui-x/issues/8580
  it('should not collapse expanded groups after `updateRows`', async () => {
    render(
      <Test
        columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]}
        rows={[{ id: 1, group: 'A', username: 'username' }]}
        rowGroupingModel={['group']}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'see children' }));

    act(() => apiRef.current.updateRows([{ id: 1, group: 'A', username: 'username 2' }]));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'hide children' })).toBeVisible();
    });
    await waitFor(() => expect(getCell(1, 3).textContent).to.equal('username 2'));
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
    act(() => apiRef.current.updateRows([{ id: 1 }]));

    await waitFor(() => {
      expect(getColumnValues(3)).to.deep.equal(['', 'username1', 'username2']);
    });
  });
});
