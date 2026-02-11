import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  type DataGridProProps,
  getDefaultGridFilterModel,
  type GridApi,
  type GridColDef,
  type GridInitialState,
  GridPreferencePanelsValue,
  type GridRowsProp,
  gridColumnFieldsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { createRenderer, screen, act } from '@mui/internal-test-utils';
import {
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getColumnValues,
} from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [
  { id: 0, category: 'Cat A' },
  { id: 1, category: 'Cat A' },
  { id: 2, category: 'Cat A' },
  { id: 3, category: 'Cat B' },
  { id: 4, category: 'Cat B' },
  { id: 5, category: 'Cat B' },
];

const columns: GridColDef[] = [
  {
    field: 'id',
    type: 'number',
  },
  {
    field: 'idBis',
    type: 'number',
    valueGetter: (value, row) => row.id,
  },
  {
    field: 'category',
  },
];

const FULL_INITIAL_STATE: GridInitialState = {
  columns: {
    columnVisibilityModel: { idBis: false },
    orderedFields: ['id', 'category', 'idBis'],
    dimensions: {
      category: {
        width: 75,
        maxWidth: -1,
        minWidth: 50,
        flex: undefined,
      },
    },
  },
  filter: {
    filterModel: {
      items: [{ field: 'id', operator: '>=', value: '0' }],
    },
  },
  pagination: {
    meta: {},
    paginationModel: { page: 1, pageSize: 2 },
    rowCount: 6,
  },
  pinnedColumns: {
    left: ['id'],
  },
  preferencePanel: {
    open: true,
    openedPanelValue: GridPreferencePanelsValue.filters,
    panelId: undefined,
    labelId: undefined,
  },
  sorting: {
    sortModel: [{ field: 'id', sort: 'desc' }],
  },
  density: 'compact',
};

describe('<DataGridPro /> - State persistence', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function TestCase(props: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          pagination
          autoHeight={isJSDOM}
          apiRef={apiRef}
          disableVirtualization
          pageSizeOptions={[100, 2]}
          {...props}
          initialState={{
            ...props.initialState,
            columns: {
              ...props.initialState?.columns,
              columnVisibilityModel: {
                ...props.initialState?.columns?.columnVisibilityModel,
              }, // To enable the `columnVisibilityModel` in export / restore
            },
          }}
        />
      </div>
    );
  }

  describe('apiRef: exportState', () => {
    it('should export the default values of the models', () => {
      render(<TestCase />);
      expect(apiRef.current?.exportState()).to.deep.equal({
        columns: {
          columnVisibilityModel: {},
          orderedFields: ['id', 'idBis', 'category'],
        },
        filter: {
          filterModel: getDefaultGridFilterModel(),
        },
        pagination: {
          meta: {},
          paginationModel: { page: 0, pageSize: 100 },
          rowCount: 6,
        },
        pinnedColumns: {},
        preferencePanel: {
          open: false,
        },
        sorting: {
          sortModel: [],
        },
        density: 'standard',
      });
    });

    it('should not export the default values of the models when using exportOnlyDirtyModels', () => {
      render(<TestCase />);
      expect(apiRef.current?.exportState({ exportOnlyDirtyModels: true })).to.deep.equal({
        columns: {
          orderedFields: ['id', 'idBis', 'category'],
        },
      });
    });

    it('should export the initial values of the models', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current?.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });

    it('should export the controlled values of the models', () => {
      render(
        <TestCase
          filterModel={FULL_INITIAL_STATE.filter?.filterModel}
          sortModel={FULL_INITIAL_STATE.sorting?.sortModel}
          columnVisibilityModel={FULL_INITIAL_STATE.columns?.columnVisibilityModel}
          paginationModel={{
            page: FULL_INITIAL_STATE.pagination?.paginationModel?.page!,
            pageSize: FULL_INITIAL_STATE.pagination?.paginationModel?.pageSize!,
          }}
          paginationMode="server"
          rowCount={FULL_INITIAL_STATE.pagination?.rowCount}
          pinnedColumns={FULL_INITIAL_STATE.pinnedColumns}
          density={FULL_INITIAL_STATE.density}
          // Some portable states don't have a controllable model
          initialState={{
            columns: {
              orderedFields: FULL_INITIAL_STATE.columns?.orderedFields,
              dimensions: FULL_INITIAL_STATE.columns?.dimensions,
            },
            preferencePanel: FULL_INITIAL_STATE.preferencePanel,
          }}
        />,
      );
      expect(apiRef.current?.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });

    it('should export the controlled values of the models when using exportOnlyDirtyModels', () => {
      render(
        <TestCase
          filterModel={FULL_INITIAL_STATE.filter?.filterModel}
          sortModel={FULL_INITIAL_STATE.sorting?.sortModel}
          columnVisibilityModel={FULL_INITIAL_STATE.columns?.columnVisibilityModel}
          paginationModel={{
            page: FULL_INITIAL_STATE.pagination?.paginationModel?.page!,
            pageSize: FULL_INITIAL_STATE.pagination?.paginationModel?.pageSize!,
          }}
          paginationMode="server"
          rowCount={FULL_INITIAL_STATE.pagination?.rowCount}
          paginationMeta={FULL_INITIAL_STATE.pagination?.meta}
          pinnedColumns={FULL_INITIAL_STATE.pinnedColumns}
          density={FULL_INITIAL_STATE.density}
          // Some portable states don't have a controllable model
          initialState={{
            columns: {
              orderedFields: FULL_INITIAL_STATE.columns?.orderedFields,
              dimensions: FULL_INITIAL_STATE.columns?.dimensions,
            },
            preferencePanel: FULL_INITIAL_STATE.preferencePanel,
          }}
        />,
      );
      expect(apiRef.current?.exportState({ exportOnlyDirtyModels: true })).to.deep.equal(
        FULL_INITIAL_STATE,
      );
    });

    it('should export the initial values of the models when using exportOnlyUserModels', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current?.exportState({ exportOnlyDirtyModels: true })).to.deep.equal(
        FULL_INITIAL_STATE,
      );
    });

    it('should export the current version of the exportable state', () => {
      render(<TestCase />);
      act(() => {
        apiRef.current?.setPinnedColumns({ left: ['id'] });
        apiRef.current?.showPreferences(GridPreferencePanelsValue.filters);
        apiRef.current?.setSortModel([{ field: 'id', sort: 'desc' }]);
        apiRef.current?.setFilterModel({
          items: [{ field: 'id', operator: '>=', value: '0' }],
        });
        apiRef.current?.setPaginationModel({ page: 1, pageSize: 2 });
        apiRef.current?.setColumnIndex('category', 1);
        apiRef.current?.setColumnWidth('category', 75);
        apiRef.current?.setColumnVisibilityModel({ idBis: false });
        apiRef.current?.setDensity('compact');
      });
      expect(apiRef.current?.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });
  });

  describe('apiRef: restoreState', () => {
    it('should restore the whole exportable state', () => {
      render(<TestCase />);

      act(() => apiRef.current?.restoreState(FULL_INITIAL_STATE));

      // Pinning, pagination, sorting and filtering
      expect(getColumnValues(0)).to.deep.equal(['3', '2']);

      // Preference panel
      expect(screen.getByRole('button', { name: /Add Filter/i })).not.to.equal(null);

      // Columns visibility
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'category']);

      // Columns dimensions
      expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '75px' });
    });

    it('should restore partial exportable state', () => {
      render(<TestCase />);

      act(() =>
        apiRef.current?.restoreState({
          pagination: {
            paginationModel: { page: 1, pageSize: 2 },
          },
        }),
      );

      expect(getColumnValues(0)).to.deep.equal(['2', '3']);
    });

    it('should restore controlled sub-state', () => {
      function ControlledTest() {
        const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 5 });

        return (
          <TestCase
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[2, 5]}
          />
        );
      }

      render(<ControlledTest />);
      act(() =>
        apiRef.current?.restoreState({
          pagination: {
            paginationModel: { page: 1, pageSize: 2 },
          },
        }),
      );

      expect(getColumnValues(0)).to.deep.equal(['2', '3']);
    });

    it('should correctly reorder columns for pinning when restoring state with different columns', () => {
      const columns1: GridColDef[] = [{ field: 'id' }, { field: 'a' }, { field: '1' }];
      const columns2: GridColDef[] = [{ field: 'id' }, { field: 'a' }, { field: '2' }];

      function Grid1() {
        const ref = useGridApiRef();
        apiRef = ref;
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              rows={[{ id: 0, a: 'a0', 1: '10' }]}
              columns={columns1}
              apiRef={ref}
              initialState={{ pinnedColumns: { right: ['a'] } }}
            />
          </div>
        );
      }

      function Grid2({ savedState }: { savedState: GridInitialState }) {
        const ref = useGridApiRef();
        apiRef = ref;
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={[{ id: 0, a: 'a0', 2: '20' }]} columns={columns2} apiRef={ref} />
          </div>
        );
      }

      // Render Grid1 and export its state
      const { unmount } = render(<Grid1 />);
      const exportedState = apiRef.current!.exportState();
      unmount();

      // Render Grid2 and restore Grid1's state
      render(<Grid2 savedState={exportedState} />);
      act(() => apiRef.current!.restoreState(exportedState));

      // Column 'a' should be pinned to the right, meaning it should be last in orderedFields
      const orderedFields = gridColumnFieldsSelector(apiRef);
      expect(orderedFields[orderedFields.length - 1]).to.equal('a');
    });
  });
});
