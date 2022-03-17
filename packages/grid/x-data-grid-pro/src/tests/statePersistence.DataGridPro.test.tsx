import * as React from 'react';
import {
  DataGridPro,
  DataGridProProps,
  GridApi,
  GridColDef,
  GridInitialState,
  GridPreferencePanelsValue,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, screen } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import {
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getColumnValues,
} from '../../../../../test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [
  { id: 0, category1: 'Cat A' },
  { id: 1, category1: 'Cat A' },
  { id: 2, category1: 'Cat A' },
  { id: 3, category1: 'Cat B' },
  { id: 4, category1: 'Cat B' },
  { id: 5, category1: 'Cat B' },
];

const columns: GridColDef[] = [
  {
    field: 'id',
    type: 'number',
  },
  {
    field: 'category1',
  },
  {
    field: 'idBis',
    type: 'number',
    valueGetter: (params) => params.row.id,
  },
];

const FULL_INITIAL_STATE: GridInitialState = {
  columns: {
    columnVisibilityModel: { category1: false },
    orderedFields: ['id', '__row_group_by_columns_group__', 'idBis', 'category1'],
    dimensions: {
      idBis: {
        width: 75,
        maxWidth: Infinity,
        minWidth: 50,
        flex: undefined,
      },
    },
  },
  filter: {
    filterModel: {
      items: [{ columnField: 'id', operatorValue: '<', value: '5' }],
    },
  },
  pagination: {
    page: 1,
    pageSize: 1,
  },
  pinnedColumns: {
    left: ['id'],
  },
  preferencePanel: {
    open: true,
    openedPanelValue: GridPreferencePanelsValue.filters,
  },
  sorting: {
    sortModel: [{ field: 'id', sort: 'desc' }],
  },
  rowGrouping: {
    model: ['category1'],
  },
};

describe('<DataGridPro /> - State Persistence', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const TestCase = (props: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'>) => {
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
          rowsPerPageOptions={[100, 1]}
          experimentalFeatures={{ rowGrouping: true }} // To enable the `rowGroupingModel in export / restore
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
          defaultGroupingExpansionDepth={-1}
          groupingColDef={{ headerName: 'Group' }}
        />
      </div>
    );
  };

  describe('apiRef: exportState', () => {
    // We always export the `orderedFields`,
    // If it's something problematic we could introduce an `hasBeenReordered` property and only export if at least one column has been reordered.
    it('should not return the default values of the models', () => {
      render(<TestCase />);
      expect(apiRef.current.exportState()).to.deep.equal({
        columns: {
          orderedFields: ['id', 'category1', 'idBis'],
        },
      });
    });

    it('should export the initial values of the models', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });

    it('should export the current version of the exportable state', () => {
      render(<TestCase />);
      apiRef.current.setPageSize(1);
      apiRef.current.setPage(1);
      apiRef.current.setPinnedColumns({ left: ['id'] });
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
      apiRef.current.setSortModel([{ field: 'id', sort: 'desc' }]);
      apiRef.current.setFilterModel({
        items: [{ columnField: 'id', operatorValue: '<', value: '5' }],
      });
      apiRef.current.setRowGroupingModel(['category1']);
      apiRef.current.setColumnIndex('idBis', 2);
      apiRef.current.setColumnWidth('idBis', 75);
      apiRef.current.setColumnVisibilityModel({ category1: false });

      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });
  });

  describe('apiRef: restoreState', () => {
    it('should restore the whole exportable state', () => {
      render(<TestCase />);

      apiRef.current.restoreState(FULL_INITIAL_STATE);

      // Pinning sorting and filtering
      expect(getColumnValues(0)).to.deep.equal(['', '4', '3']);

      // Pagination and row grouping
      expect(getColumnValues(1)).to.deep.equal(['Cat B (2)', '', '']);

      // Preference panel
      expect(screen.getByRole('button', { name: /Add Filter/i })).to.not.equal(null);

      // Columns visibility
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Group', 'idBis']);

      // Columns dimensions
      expect(getColumnHeaderCell(2)).toHaveInlineStyle({ width: '75px' });
    });

    it('should restore partial exportable state', () => {
      render(<TestCase />);

      apiRef.current.restoreState({
        pagination: {
          page: 1,
          pageSize: 1,
        },
      });

      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should restore controlled sub-state', () => {
      const ControlledTest = () => {
        const [page, setPage] = React.useState(0);

        return (
          <TestCase
            page={page}
            onPageChange={(newPage) => {
              setPage(newPage);
            }}
          />
        );
      };

      render(<ControlledTest />);
      apiRef.current.restoreState({
        pagination: {
          page: 1,
          pageSize: 1,
        },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should not restore the column visibility model when using the legacy column visibility', () => {
      const TestCaseLegacyColumnVisibility = () => {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              rows={rows}
              columns={[
                {
                  field: 'id',
                  hide: true,
                },
                {
                  field: 'category1',
                },
              ]}
              autoHeight={isJSDOM}
              apiRef={apiRef}
              disableVirtualization
            />
          </div>
        );
      };

      render(<TestCaseLegacyColumnVisibility />);

      apiRef.current.restoreState({
        columns: {
          columnVisibilityModel: {
            category1: false,
          },
        },
      });

      expect(getColumnHeadersTextContent()).to.deep.equal(['category1']);
    });
  });
});
