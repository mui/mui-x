import * as React from 'react';
import {
    DataGridPro,
    DataGridProProps,
    GridApiRef,
    GridPreferencePanelsValue,
    useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useData } from 'packages/storybook/src/hooks/useData';
import { createRenderer, screen } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getColumnValues} from "../../../../../test/utils/helperFn";

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe.only('<DataGridPro /> - State Persistence', () => {
  const { render } = createRenderer();

  let apiRef: GridApiRef;

  const TestCase = (props: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'>) => {
    const basicData = useData(100, 2);

    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...basicData} pagination autoHeight={isJSDOM} {...props} apiRef={apiRef} rowsPerPageOptions={[100, 5]} />
      </div>
    );
  };

  describe('apiRef: exportState', () => {
      it('should return the whole exportable state', () => {
          render(<TestCase />);
          expect(apiRef.current.exportState()).to.deep.equal({
              filter: {
                  filterModel: {
                      items: [],
                      linkOperator: 'and',
                  },
              },
              pagination: {
                  page: 0,
                  pageSize: 100,
              },
              pinnedColumns: {
                  left: undefined,
                  right: undefined,
              },
              preferencePanel: {
                  open: false,
              },
              sorting: {
                  sortModel: [],
              },
          });
      });

      it('should export the current version of the exportable state', () => {
          render(<TestCase />);
          apiRef.current.setPageSize(5)
          apiRef.current.setPage(1)
          apiRef.current.setPinnedColumns({ left: ['id']})
          apiRef.current.showPreferences(GridPreferencePanelsValue.filters)
          apiRef.current.setSortModel([{ field: 'id', sort: 'desc' }])
          apiRef.current.setFilterModel({ items: [{ columnField: 'id', operatorValue: '<', value: '97' }]})
          expect(apiRef.current.exportState()).to.deep.equal({
              filter: {
                  filterModel: {
                      items: [{ columnField: 'id', operatorValue: '<', value: '97' }],
                  },
              },
              pagination: {
                  page: 1,
                  pageSize: 5,
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
          });
      })
  })

    describe('apiRef: restoreState', () => {
        it.only('should restore the whole exportable state', () => {
            render(<TestCase />);

            console.log('_________________')

            apiRef.current.restoreState({
                filter: {
                    filterModel: {
                        items: [{ columnField: 'id', operatorValue: '<', value: '97' }],
                    },
                },
                pagination: {
                    page: 1,
                    pageSize: 5,
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
            })

            console.log('______')

            // Test sorting + filtering + pagination
            expect(getColumnValues(0)).to.deep.equal(['91', '90', '89', '88', '87'])
            // Preference panel
            expect(screen.getByRole('button', { name: /Add Filter/i })).to.not.equal(null)
            // Pinning
            expect(
                document.querySelector('.MuiDataGrid-pinnedColumnHeaders--left')?.textContent,
            ).to.deep.equal('id');
        })

        it('should restore partial exportable state', () => {
            render(<TestCase />);

            apiRef.current.restoreState({
                pagination: {
                    page: 1,
                    pageSize: 5,
                },
            })

            expect(getColumnValues(0)).to.deep.equal(['5', '6', '7', '8', '9'])
        })
    })
});
