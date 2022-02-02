import * as React from 'react';
import {
  DataGridPro,
  DataGridProProps,
  GridApi,
  GridInitialState,
  GridPreferencePanelsValue,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { createRenderer, screen } from '@mui/monorepo/test/utils';
import { useMovieData } from '@mui/x-data-grid-generator';
import { expect } from 'chai';
import { getColumnHeadersTextContent, getColumnValues } from '../../../../../test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - State Persistence', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const TestCase = (props: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'>) => {
    const data = useMovieData();

    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          {...data}
          pagination
          autoHeight={isJSDOM}
          {...props}
          apiRef={apiRef}
          disableVirtualization
          rowsPerPageOptions={[100, 2]}
          experimentalFeatures={{ rowGrouping: true }} // To enable the `rowGroupingModel in export / restore
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
        />
      </div>
    );
  };

  describe('apiRef: exportState', () => {
    const FULL_INITIAL_STATE: GridInitialState = {
      columns: {
        columnVisibilityModel: { year: false },
      },
      filter: {
        filterModel: {
          items: [{ columnField: 'gross', operatorValue: '>', value: '1500000000' }],
        },
      },
      pagination: {
        page: 1,
        pageSize: 2,
      },
      pinnedColumns: {
        left: ['company'],
      },
      preferencePanel: {
        open: true,
        openedPanelValue: GridPreferencePanelsValue.filters,
      },
      sorting: {
        sortModel: [{ field: 'director', sort: 'asc' }],
      },
      rowGrouping: {
        model: ['director'],
      },
    };

    it('should not return the default values of the models', () => {
      render(<TestCase />);
      expect(apiRef.current.exportState()).to.deep.equal({});
    });

    it('should export the initial values of the models', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });

    it('should export the current version of the exportable state', () => {
      render(<TestCase />);
      apiRef.current.setPageSize(2);
      apiRef.current.setPage(1);
      apiRef.current.setPinnedColumns({ left: ['company'] });
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
      apiRef.current.setSortModel([{ field: 'director', sort: 'asc' }]);
      apiRef.current.setFilterModel({
        items: [{ columnField: 'gross', operatorValue: '>', value: '1500000000' }],
      });
      apiRef.current.setRowGroupingModel(['director']);
      apiRef.current.setColumnVisibilityModel({ year: false });

      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });
  });

  describe('apiRef: restoreState', () => {
    it('should restore the whole exportable state', () => {
      render(<TestCase />);

      apiRef.current.restoreState({
        columns: {
          columnVisibilityModel: { year: false },
        },
        filter: {
          filterModel: {
            items: [{ columnField: 'gross', operatorValue: '>', value: '1500000000' }],
          },
        },
        pagination: {
          page: 1,
          pageSize: 2,
        },
        pinnedColumns: {
          left: ['company'],
        },
        preferencePanel: {
          open: true,
          openedPanelValue: GridPreferencePanelsValue.filters,
        },
        sorting: {
          sortModel: [{ field: 'director', sort: 'asc' }],
        },
        rowGrouping: {
          model: ['director'],
        },
      });

      // Pagination
      expect(getColumnValues(0)).to.deep.equal(['', 'Disney Studios', '', 'Universal Pictures']);

      // Sorting and row grouping
      expect(getColumnValues(1)).to.deep.equal(['J. J. Abrams (1)', '', 'Colin Trevorrow (1)', '']);

      // Filtering
      expect(getColumnValues(3)).to.deep.equal(['', '2,068,223,624$', '', '1,671,713,208$']);

      // Preference panel
      expect(screen.getByRole('button', { name: /Add Filter/i })).to.not.equal(null);

      // Columns visibility
      expect(getColumnHeadersTextContent()).to.not.include('Year');

      // Pinning
      expect(
        document.querySelector('.MuiDataGrid-pinnedColumnHeaders--left')?.textContent,
      ).to.deep.equal('Company');
    });

    it('should restore partial exportable state', () => {
      render(<TestCase />);

      apiRef.current.restoreState({
        pagination: {
          page: 1,
          pageSize: 2,
        },
      });

      expect(getColumnValues(0)).to.deep.equal(['Titanic', 'Star Wars: The Force Awakens']);
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
          pageSize: 2,
        },
      });
      clock.runToLast();
      expect(getColumnValues(0)).to.deep.equal(['Titanic', 'Star Wars: The Force Awakens']);
    });
  });
});
