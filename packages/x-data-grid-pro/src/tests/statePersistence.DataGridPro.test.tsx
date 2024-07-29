import * as React from 'react';
import {
  DataGridPro,
  DataGridProProps,
  getDefaultGridFilterModel,
  GridApi,
  GridColDef,
  GridInitialState,
  GridPreferencePanelsValue,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { createRenderer, screen, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
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
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

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
      expect(apiRef.current.exportState()).to.deep.equal({
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
      expect(apiRef.current.exportState({ exportOnlyDirtyModels: true })).to.deep.equal({
        columns: {
          orderedFields: ['id', 'idBis', 'category'],
        },
      });
    });

    it('should export the initial values of the models', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
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
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
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
      expect(apiRef.current.exportState({ exportOnlyDirtyModels: true })).to.deep.equal(
        FULL_INITIAL_STATE,
      );
    });

    it('should export the initial values of the models when using exportOnlyUserModels', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current.exportState({ exportOnlyDirtyModels: true })).to.deep.equal(
        FULL_INITIAL_STATE,
      );
    });

    it('should export the current version of the exportable state', () => {
      render(<TestCase />);
      act(() => {
        apiRef.current.setPaginationModel({ page: 1, pageSize: 2 });
        apiRef.current.setPinnedColumns({ left: ['id'] });
        apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
        apiRef.current.setSortModel([{ field: 'id', sort: 'desc' }]);
        apiRef.current.setFilterModel({
          items: [{ field: 'id', operator: '>=', value: '0' }],
        });
        apiRef.current.setColumnIndex('category', 1);
        apiRef.current.setColumnWidth('category', 75);
        apiRef.current.setColumnVisibilityModel({ idBis: false });
        apiRef.current.setDensity('compact');
      });
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });
  });

  describe('apiRef: restoreState', () => {
    it('should restore the whole exportable state', () => {
      render(<TestCase />);

      act(() => apiRef.current.restoreState(FULL_INITIAL_STATE));

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
        apiRef.current.restoreState({
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
        apiRef.current.restoreState({
          pagination: {
            paginationModel: { page: 1, pageSize: 2 },
          },
        }),
      );
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['2', '3']);
    });
  });
});
