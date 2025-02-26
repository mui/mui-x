import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { createRenderer, screen, act, reactMajor, waitFor } from '@mui/internal-test-utils';
import {
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getColumnValues,
  getCell,
} from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  getRowGroupingFieldFromGroupingCriteria,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridApi,
  GridRowsProp,
  useGridApiRef,
  GridGroupingColDefOverrideParams,
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

  describe('prop: rowGroupingColumnMode', () => {
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
    it('should disable the row grouping when `prop.disableRowGrouping = true`', async () => {
      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
          disableRowGrouping
        />,
      );

      // No grouping applied on rows
      expect(apiRef.current?.state.rows.groupingName).to.equal('none');
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);

      // No grouping column rendered
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'category1', 'category2']);

      // No menu item on column menu to add / remove grouping criteria
      act(() => apiRef.current?.showColumnMenu('category1'));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      const category1Menuitem = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      expect(category1Menuitem).to.equal(null);

      act(() => apiRef.current?.hideColumnMenu());

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });

      act(() => apiRef.current?.showColumnMenu('category2'));

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
        apiRef.current?.setRowChildrenExpansion('auto-generated-row-category1/Cat B', true);
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
        (node: GridGroupNode) => node.groupingKey === 'Cat A' && node.groupingField === 'category1',
      );

      render(
        <Test
          initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}
          isGroupExpandedByDefault={isGroupExpandedByDefault}
        />,
      );
      expect(isGroupExpandedByDefault.callCount).to.equal(reactMajor >= 19 ? 6 : 12); // Should not be called on leaves
      const { childrenExpanded, ...node } = apiRef.current?.state.rows.tree[
        'auto-generated-row-category1/Cat A'
      ] as GridGroupNode;
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

      expect(apiRef.current?.getAllColumns()[0].field).to.equal('__row_group_by_columns_group__');
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
        apiRef.current?.updateColumns([
          { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, width: 100 },
        ]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      act(() =>
        apiRef.current?.updateColumns([
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
                const rowId = apiRef.current?.getRowId(row);
                if (!rowId) {
                  return '';
                }

                const node = apiRef.current?.getRowNode(rowId)!;
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
                const rowId = apiRef.current?.getRowId(row);
                if (!rowId) {
                  return '';
                }

                const node = apiRef.current?.getRowNode(rowId)!;
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

      expect(apiRef.current?.getAllColumns()[0].field).to.equal(
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
        apiRef.current?.updateColumns([
          { field: getRowGroupingFieldFromGroupingCriteria('category1'), width: 100 },
        ]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '300px' });
      act(() =>
        apiRef.current?.updateColumns([
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
                const rowId = apiRef.current?.getRowId(row);
                if (!rowId) {
                  return '';
                }

                const node = apiRef.current?.getRowNode(rowId)!;
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
                  const rowId = apiRef.current?.getRowId(row);
                  if (!rowId) {
                    return '';
                  }

                  const node = apiRef.current?.getRowNode(rowId)!;
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
});
