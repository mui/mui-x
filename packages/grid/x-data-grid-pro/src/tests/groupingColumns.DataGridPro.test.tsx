import { createRenderer, fireEvent, screen, act } from '@material-ui/monorepo/test/utils';
import { getColumnHeadersTextContent, getColumnValues } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import {
  DataGridPro,
  DataGridProProps,
  GridApiRef,
  GridKeyGetterParams,
  GridPreferencePanelsValue,
  GridRowsProp,
  useGridApiRef,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';

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
    groupingColumns: true,
  },
};

describe('<DataGridPro /> - Group Rows By Column', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: GridApiRef;

  const Test = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  describe('Setting grouping criteria', () => {
    describe('initialState: groupingColumns.model', () => {
      it('should allow to initialize the grouping columns', () => {
        render(
          <Test
            initialState={{ groupingColumns: { model: ['category1'] } }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
      });

      it('should not react to initial state updates', () => {
        const { setProps } = render(
          <Test
            initialState={{ groupingColumns: { model: ['category1'] } }}
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);

        setProps({ initialState: { groupingColumns: { model: ['category2'] } } });
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
      });
    });

    describe('prop: groupingColumnsModel', () => {
      it('should not call onGroupingColumnsModelChange on initialisation or on groupingColumnsModel prop change', () => {
        const onGroupingColumnsModelChange = spy();

        const { setProps } = render(
          <Test
            groupingColumnsModel={['category1']}
            onGroupingColumnsModelChange={onGroupingColumnsModelChange}
          />,
        );

        expect(onGroupingColumnsModelChange.callCount).to.equal(0);
        setProps({ groupingColumnsModel: ['category2'] });

        expect(onGroupingColumnsModelChange.callCount).to.equal(0);
      });

      it('should allow to update the grouping columns model from the outside', () => {
        const { setProps } = render(
          <Test groupingColumnsModel={['category1']} defaultGroupingExpansionDepth={-1} />,
        );
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
        setProps({ groupingColumnsModel: ['category2'] });
        expect(getColumnValues()).to.deep.equal(['Cat 1 (2)', '', '', 'Cat 2 (3)', '', '', '']);
        setProps({ groupingColumnsModel: ['category1', 'category2'] });
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
          initialState={{ groupingColumns: { model: ['category1', 'category3'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
    });

    it('should ignore grouping criteria with colDef.canBeGrouped = false', () => {
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
              canBeGrouped: false,
            },
          ]}
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
    });

    it('should allow to use several time the same grouping criteria', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category1', 'category1'] } }}
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

  describe('props: groupingColumnMode', () => {
    it('should gather all the grouping criteria into a single column when groupingColumnMode is not defined', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
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

    it('should gather all the grouping criteria into a single column when groupingColumnMode = "single"', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          groupingColumnMode="single"
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

    it('should create one grouping column per grouping criteria when groupingColumnMode = "multiple"', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          groupingColumnMode="multiple"
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

    it('should support groupingColumnMode switch', () => {
      const { setProps } = render(
        <Test
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
          defaultGroupingExpansionDepth={-1}
          groupingColumnMode="multiple"
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

      setProps({ groupingColumnMode: 'single' });
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

      setProps({ groupingColumnMode: 'multiple' });
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

    it('should respect the model grouping order when groupingColumnMode = "single"', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category2', 'category1'] } }}
          defaultGroupingExpansionDepth={-1}
          groupingColumnMode="single"
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

    it('should respect the model grouping order when groupingColumnMode = "multiple"', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category2', 'category1'] } }}
          defaultGroupingExpansionDepth={-1}
          groupingColumnMode="multiple"
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

  describe('props: disableGroupingColumns', () => {
    // TODO: Remove once the feature is stable
    it('should set `disableGroupingColumns` to `true` if `experimentalFeatures.groupingColumns = false', () => {
      const disableGroupingColumnsSpy = spy();

      const CustomToolbar = () => {
        const rootProps = useGridRootProps();
        disableGroupingColumnsSpy(rootProps.disableGroupingColumns);
        return null;
      };

      render(
        <Test
          initialState={{ groupingColumns: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
          experimentalFeatures={{
            groupingColumns: false,
          }}
          components={{ Toolbar: CustomToolbar }}
        />,
      );

      expect(disableGroupingColumnsSpy.lastCall.firstArg).to.equal(true);
    });

    it('should disable grouping columns when `prop.disableGroupingColumns = true`', () => {
      render(
        <Test
          initialState={{ groupingColumns: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
          disableGroupingColumns
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
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', 'Cat B (2)']);
    });

    it('should expand all top level rows if defaultGroupingExpansionDepth = 1', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={1}
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
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
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
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
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
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

    it('should react to defaultGroupingExpansionDepth updates', () => {
      const { setProps } = render(
        <Test
          defaultGroupingExpansionDepth={0}
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', 'Cat B (2)']);
      setProps({ defaultGroupingExpansionDepth: 1 });
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        'Cat 1 (1)',
        'Cat 2 (2)',
        'Cat B (2)',
        'Cat 2 (1)',
        'Cat 1 (1)',
      ]);
    });

    it('should not re-apply default expansion on rerender after expansion manually toggled', () => {
      const { setProps } = render(
        <Test initialState={{ groupingColumns: { model: ['category1', 'category2'] } }} />,
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

  describe('props: groupingColDef when groupingColumMode = "single"', () => {
    it('should not allow to override the field', () => {
      const { setProps } = render(
        <Test
          initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
          groupingColumnMode="multiple"
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

    it('should react to groupingColDef update', () => {});

    describe('prop: groupColDef.leafField', () => {
      it('should render the leafField `value` on leaves', () => {
        render(
          <Test
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
          initialState={{ groupingColumns: { model: ['category1'] } }}
          groupingColumnMode="single"
          groupingColDef={{
            // @ts-expect-error
            field: 'custom-field',
          }}
        />,
      );

      expect(apiRef.current.getAllColumns()[0].field).to.equal('__row_group_by_columns_group__');
    });

    describe('prop: groupColDef.leafField', () => {
      it('should render the leafField `value` on leaves', () => {
        render(
          <Test
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="multiple"
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

  describe('colDef: keyGetter & valueGetter', () => {
    it('should use keyGetter to group rows when defined', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              keyGetter: (params: GridKeyGetterParams<string>) => `key ${params.value}`,
            },
          ]}
          initialState={{ groupingColumns: { model: ['category1'] } }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'key Cat A (3)',
        '',
        '',
        '',
        'key Cat B (2)',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
    });

    it('should use valueGetter to group the rows when defined', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'complexCategory1',
              valueGetter: (params) => `value ${params.row.category1}`,
            },
          ]}
          initialState={{ groupingColumns: { model: ['complexCategory1'] } }}
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

    it('should pass the return value of valueGetter to the keyGetter callback when both defined', () => {
      render(
        <Test
          initialState={{
            groupingColumns: { model: ['complexCategory1'] },
          }}
          columns={[
            {
              field: 'id',
            },
            {
              field: 'complexCategory1',
              hide: true,
              valueGetter: (params) => `value ${params.row.category1}`,
              keyGetter: (params: GridKeyGetterParams<string>) => `key ${params.value}`,
            },
          ]}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'key value Cat A (3)',
        '',
        '',
        '',
        'key value Cat B (2)',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
    });
  });

  describe('column menu', () => {
    it('should add a "Group by {field}" menu item on ungrouped columns when coLDef.canBeGrouped is not defined', () => {
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
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal(['category1']);
    });

    it('should not add a "Group by {field}" menu item on ungrouped columns when coLDef.canBeGrouped = false', () => {
      render(
        <Test
          columns={[
            {
              field: 'id',
            },
            {
              field: 'category1',
              canBeGrouped: false,
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
            groupingColumns: {
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
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal([]);
    });

    it('should add a "Stop grouping by {field} menu item on each grouping column when prop.groupingColumnMode = "multiple"', () => {
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
            groupingColumns: {
              model: ['category1', 'category2'],
            },
          }}
          groupingColumnMode="multiple"
        />,
      );

      apiRef.current.showColumnMenu('__row_group_by_columns_group_category1__');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal(['category2']);

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
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal([]);
    });

    it('should add a "Stop grouping {field} menu item for each grouping criteria on the grouping column when prop.groupingColumnMode = "single"', () => {
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
            groupingColumns: {
              model: ['category1', 'category2'],
            },
          }}
          groupingColumnMode="single"
        />,
      );

      apiRef.current.showColumnMenu('__row_group_by_columns_group__');
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const menuItemCategory1 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category1',
      });
      fireEvent.click(menuItemCategory1);
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal(['category2']);
      const menuItemCategory2 = screen.queryByRole('menuitem', {
        name: 'Stop grouping by category2',
      });
      fireEvent.click(menuItemCategory2);
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal([]);
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
            groupingColumns: {
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
    describe('props: groupingColumnMode = "single"', () => {
      it('should use the top level grouping criteria for sorting if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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
            initialState={{ groupingColumns: { model: ['category1', 'category2'] } }}
            groupingColumnMode="single"
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

      it('should sort unbalanced grouped by index of the groupingField in the model when sorting by a grouping criteria', () => {
        render(
          <Test
            rows={unbalancedRows}
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="single"
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

      it('should sort unbalanced grouped by index of the groupingField in the model when sorting by leaves', () => {
        render(
          <Test
            rows={unbalancedRows}
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="single"
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

    describe('props: groupingColumnMode = "multiple"', () => {
      it('should use the column grouping criteria for sorting if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="multiple"
            sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]}
            defaultGroupingExpansionDepth={-1}
          />,
        );

        expect(getColumnValues(0)).to.deep.equal(['Cat B (2)', '', '', 'Cat A (3)', '', '', '']);
      });

      it('should use the column grouping criteria for sorting if mainGroupingCriteria matches the column grouping criteria and leaf field is defined', () => {
        render(
          <Test
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="multiple"
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
            initialState={{ groupingColumns: { model: ['category1'] } }}
            groupingColumnMode="multiple"
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

    describe('props: groupingColumnMode = "single"', () => {
      it('should use the top level grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{
              groupingColumns: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="single"
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
              groupingColumns: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="single"
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
              groupingColumns: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="single"
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
              groupingColumns: { model: ['category1', 'category2'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="single"
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
              groupingColumns: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [{ columnField: 'id', operatorValue: '=', value: 2 }],
                },
              },
            }}
            groupingColumnMode="single"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // "Cat A" & "Cat 2" groups are not tested against the "id" filter item
        expect(getColumnValues(0)).to.deep.equal(['Cat A (1)', 'Cat 2 (1)', '']);
      });
    });

    describe('props: groupingColumnMode = "multiple"', () => {
      it('should use the column grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', () => {
        render(
          <Test
            initialState={{
              groupingColumns: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="multiple"
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
              groupingColumns: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="multiple"
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
              groupingColumns: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="multiple"
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
              groupingColumns: { model: ['category1'] },
              preferencePanel: { open: true, openedPanelValue: GridPreferencePanelsValue.filters },
            }}
            groupingColumnMode="multiple"
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
              groupingColumns: { model: ['category1', 'category2'] },
              filter: {
                filterModel: {
                  items: [{ columnField: 'id', operatorValue: '=', value: 2 }],
                },
              },
            }}
            groupingColumnMode="multiple"
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
              groupingColumns: { model: ['category1', 'category2'] },
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
            groupingColumnMode="multiple"
            defaultGroupingExpansionDepth={-1}
          />,
        );

        // "Cat A" is testing against the "__row_group_by_columns_group_category1__" filter item, but "Cat 1" and "Cat 2" are not
        expect(getColumnValues(0)).to.deep.equal(['Cat A (3)', '', '', '', '', '']);
        expect(getColumnValues(1)).to.deep.equal(['', 'Cat 1 (1)', '', 'Cat 2 (2)', '', '']);
      });
    });
  });

  describe('apiRef: addGroupingCriteria', () => {
    it('should add grouping criteria to model', () => {
      render(<Test initialState={{ groupingColumns: { model: ['category1'] } }} />);
      apiRef.current.addGroupingCriteria('category2');
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal(['category1', 'category2']);
    });

    it('should add grouping criteria to model at the right position', () => {
      render(<Test initialState={{ groupingColumns: { model: ['category1'] } }} />);
      apiRef.current.addGroupingCriteria('category2', 0);
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal(['category2', 'category1']);
    });
  });

  describe('apiRef: removeGroupingCriteria', () => {
    it('should remove field from model', () => {
      render(<Test initialState={{ groupingColumns: { model: ['category1'] } }} />);
      apiRef.current.removeGroupingCriteria('category1');
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal([]);
    });
  });

  describe('apiRef: setGroupingCriteriaIndex', () => {
    it('should change the grouping criteria order', () => {
      render(<Test initialState={{ groupingColumns: { model: ['category1', 'category2'] } }} />);
      apiRef.current.setGroupingCriteriaIndex('category1', 1);
      expect(apiRef.current.state.groupingColumns.model).to.deep.equal(['category2', 'category1']);
    });
  });
});
