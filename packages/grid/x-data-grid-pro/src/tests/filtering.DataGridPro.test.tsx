import {
  getDefaultGridFilterModel,
  GridApi,
  DataGridProProps,
  GridFilterModel,
  GridLogicOperator,
  GridPreferencePanelsValue,
  GridRowModel,
  SUBMIT_FILTER_STROKE_TIME,
  useGridApiRef,
  DataGridPro,
  GetColumnForNewFilterArgs,
  FilterColumnsArgs,
  GridToolbar,
  gridExpandedSortedRowEntriesSelector,
  gridClasses,
} from '@mui/x-data-grid-pro';
import { createRenderer, fireEvent, screen, act, within } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import * as React from 'react';
import { spy } from 'sinon';
import { getColumnHeaderCell, getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Filter', () => {
  const { clock, render } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  function TestCase(props: Partial<DataGridProProps>) {
    const { rows, ...other } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          apiRef={apiRef}
          {...baselineProps}
          rows={rows || baselineProps.rows}
          disableColumnFilter={false}
          {...other}
        />
      </div>
    );
  }

  const filterModel = {
    items: [
      {
        field: 'brand',
        value: 'a',
        operator: 'contains',
      },
    ],
  };

  it('componentsProps `filterColumns` and `getColumnForNewFilter` should allow custom filtering', () => {
    const filterColumns = ({ field, columns, currentFilters }: FilterColumnsArgs) => {
      // remove already filtered fields from list of columns
      const filteredFields = currentFilters?.map((item) => item.field);
      return columns
        .filter(
          (colDef) =>
            colDef.filterable && (colDef.field === field || !filteredFields.includes(colDef.field)),
        )
        .map((column) => column.field);
    };

    const getColumnForNewFilter = ({ currentFilters, columns }: GetColumnForNewFilterArgs) => {
      const filteredFields = currentFilters?.map(({ field }) => field);
      const columnForNewFilter = columns
        .filter((colDef) => colDef.filterable && !filteredFields.includes(colDef.field))
        .find((colDef) => colDef.filterOperators?.length);
      return columnForNewFilter?.field ?? null;
    };

    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          filterPanel: {
            filterFormProps: {
              filterColumns,
            },
            getColumnForNewFilter,
          },
        }}
      />,
    );
    const addButton = screen.getByRole('button', { name: /Add Filter/i });
    fireEvent.click(addButton);
    // Shouldn't allow adding multi-filters for same column
    // Since we have only one column, filter shouldn't be applied onClick
    const filterForms = document.querySelectorAll(`.MuiDataGrid-filterForm`);
    expect(filterForms).to.have.length(1);
  });

  it('should call `getColumnForNewFilter` when filters are added', () => {
    const getColumnForNewFilter = spy();
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          filterPanel: {
            getColumnForNewFilter,
          },
        }}
      />,
    );
    expect(getColumnForNewFilter.callCount).to.equal(2);
    const addButton = screen.getByRole('button', { name: /Add Filter/i });
    fireEvent.click(addButton);
    expect(getColumnForNewFilter.callCount).to.equal(4);
    fireEvent.click(addButton);
    expect(getColumnForNewFilter.callCount).to.equal(6);
  });

  it('should pass columns filtered by `filterColumns` to filters column list', () => {
    const filterColumns = () => ['testField'];
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          filterPanel: {
            filterFormProps: {
              filterColumns,
            },
          },
        }}
        columns={[...baselineProps.columns, { field: 'testField' }]}
      />,
    );

    const selectListOfColumns = document.querySelectorAll<HTMLElement>(
      '.MuiDataGrid-filterFormColumnInput',
    )[0];
    const availableColumns = within(selectListOfColumns).getAllByRole('option');
    expect(availableColumns.length).to.equal(1);
  });

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase filterModel={filterModel} />);

    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should not apply items that are incomplete with AND operator', () => {
    render(
      <TestCase
        filterModel={{
          items: [
            {
              id: 1,
              field: 'brand',
              value: 'a',
              operator: 'contains',
            },
            {
              id: 2,
              field: 'brand',
              operator: 'contains',
            },
          ],
          logicOperator: GridLogicOperator.And,
        }}
      />,
    );
    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should not apply items that are incomplete with OR operator', () => {
    render(
      <TestCase
        filterModel={{
          logicOperator: GridLogicOperator.Or,
          items: [
            {
              id: 1,
              field: 'brand',
              value: 'a',
              operator: 'contains',
            },
            {
              id: 2,
              field: 'brand',
              operator: 'contains',
            },
          ],
        }}
      />,
    );
    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly on GridApiRef setRows', () => {
    render(<TestCase filterModel={filterModel} />);

    const newRows = [
      {
        id: 3,
        brand: 'Asics',
      },
      {
        id: 4,
        brand: 'RedBull',
      },
      {
        id: 5,
        brand: 'Hugo',
      },
    ];
    act(() => apiRef.current.setRows(newRows));
    expect(getColumnValues(0)).to.deep.equal(['Asics']);
  });

  it('should apply the filterModel prop correctly on GridApiRef update row data', () => {
    render(<TestCase filterModel={filterModel} />);
    act(() => apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]));
    act(() => apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]));
    expect(getColumnValues(0)).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
  });

  it('should allow apiRef to setFilterModel', () => {
    render(<TestCase />);
    act(() =>
      apiRef.current.setFilterModel({
        items: [
          {
            field: 'brand',
            value: 'a',
            operator: 'startsWith',
          },
        ],
      }),
    );
    expect(getColumnValues(0)).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and default to AND', () => {
    const newModel = {
      items: [
        {
          id: 1,
          field: 'brand',
          value: 'a',
          operator: 'contains',
        },
        {
          id: 2,
          field: 'brand',
          value: 'm',
          operator: 'contains',
        },
      ],
    };
    render(<TestCase filterModel={newModel} />);
    expect(getColumnValues(0)).to.deep.equal(['Puma']);
  });

  it('should allow multiple filter via apiRef', () => {
    render(<TestCase />);
    const newModel = {
      items: [
        {
          id: 1,
          field: 'brand',
          value: 'a',
          operator: 'startsWith',
        },
        {
          id: 2,
          field: 'brand',
          value: 's',
          operator: 'endsWith',
        },
      ],
    };
    act(() => apiRef.current.setFilterModel(newModel));
    expect(getColumnValues(0)).to.deep.equal(['Adidas']);
  });

  it('should work as expected with "Add filter" and "Remove all" buttons ', () => {
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );
    expect(apiRef.current.state.filter.filterModel.items).to.have.length(0);
    const addButton = screen.getByRole('button', { name: /Add Filter/i });
    const removeButton = screen.getByRole('button', { name: /Remove all/i });
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    expect(apiRef.current.state.filter.filterModel.items).to.have.length(3);
    fireEvent.click(removeButton);
    expect(apiRef.current.state.filter.filterModel.items).to.have.length(0);
    // clicking on `remove all` should close the panel when no filters
    fireEvent.click(removeButton);
    clock.tick(100);
    expect(screen.queryByRole('button', { name: /Remove all/i })).to.equal(null);
  });

  it('should hide `Add filter` in filter panel when `disableAddFilterButton` is `true`', () => {
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        componentsProps={{
          filterPanel: {
            disableAddFilterButton: true,
          },
        }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Add filter' })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Remove all' })).not.to.equal(null);
  });

  it('should hide `Remove all` in filter panel when `disableRemoveAllButton` is `true`', () => {
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        componentsProps={{
          filterPanel: {
            disableRemoveAllButton: true,
          },
        }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Add filter' })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: 'Remove all' })).to.equal(null);
  });

  it('should allow multiple filter and changing the logicOperator', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          id: 1,
          field: 'brand',
          value: 'a',
          operator: 'startsWith',
        },
        {
          id: 2,
          field: 'brand',
          value: 'a',
          operator: 'endsWith',
        },
      ],
      logicOperator: GridLogicOperator.Or,
    };
    render(<TestCase filterModel={newModel} />);
    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
  });

  it("should call onFilterModelChange with reason=changeLogicOperator when the logic operator changes but doesn't change the state", () => {
    const onFilterModelChange = spy();
    const newModel: GridFilterModel = {
      items: [
        {
          id: 1,
          field: 'brand',
          value: 'a',
          operator: 'startsWith',
        },
        {
          id: 2,
          field: 'brand',
          value: 'a',
          operator: 'endsWith',
        },
      ],
    };
    render(
      <TestCase
        filterModel={newModel}
        onFilterModelChange={onFilterModelChange}
        initialState={{
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
        }}
      />,
    );
    expect(onFilterModelChange.callCount).to.equal(0);
    expect(getColumnValues(0)).to.deep.equal([]);

    // The first combo is hidden and we include hidden elements to make the query faster
    // https://github.com/testing-library/dom-testing-library/issues/820#issuecomment-726936225
    const select = screen.queryAllByRole('combobox', { name: 'Logic operator', hidden: true })[
      isJSDOM ? 1 : 0 // https://github.com/testing-library/dom-testing-library/issues/846
    ];
    fireEvent.change(select, { target: { value: 'or' } });
    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.args[1].reason).to.equal('changeLogicOperator');
    expect(getColumnValues(0)).to.deep.equal([]);
  });

  it('should call onFilterModelChange with reason=upsertFilterItem when the value is emptied', () => {
    const onFilterModelChange = spy();
    render(
      <TestCase
        onFilterModelChange={onFilterModelChange}
        filterModel={{
          items: [
            {
              id: 1,
              field: 'brand',
              value: 'a',
              operator: 'contains',
            },
          ],
        }}
        initialState={{
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
        }}
      />,
    );
    expect(onFilterModelChange.callCount).to.equal(0);
    fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), { target: { value: '' } });
    clock.tick(500);
    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.args[1].reason).to.equal('upsertFilterItem');
  });

  it('should call onFilterModelChange with reason=deleteFilterItem when a filter is removed', () => {
    const onFilterModelChange = spy();
    render(
      <TestCase
        onFilterModelChange={onFilterModelChange}
        filterModel={{
          items: [
            {
              id: 1,
              field: 'brand',
              value: 'a',
              operator: 'contains',
            },
            {
              id: 2,
              field: 'brand',
              value: 'a',
              operator: 'endsWith',
            },
          ],
        }}
        initialState={{
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
        }}
      />,
    );
    expect(onFilterModelChange.callCount).to.equal(0);
    fireEvent.click(screen.queryAllByRole('button', { name: 'Delete' })[0]);
    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.args[1].reason).to.equal('deleteFilterItem');
  });

  it('should call onFilterModelChange with reason=upsertFilterItems when a filter is added', () => {
    const onFilterModelChange = spy();
    render(
      <TestCase
        onFilterModelChange={onFilterModelChange}
        filterModel={{
          items: [{ id: 1, field: 'brand', value: 'a', operator: 'contains' }],
        }}
        initialState={{
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
        }}
      />,
    );
    expect(onFilterModelChange.callCount).to.equal(0);
    fireEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.args[1].reason).to.equal('upsertFilterItems');
  });

  it('should publish filterModelChange with the reason whenever the model changes', () => {
    const listener = spy();
    render(
      <TestCase
        initialState={{
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
        }}
      />,
    );
    apiRef.current.subscribeEvent('filterModelChange', listener);
    expect(listener.callCount).to.equal(0);
    fireEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    expect(listener.callCount).to.equal(1);
    expect(listener.lastCall.args[1].reason).to.equal('upsertFilterItems');
  });

  it('should only select visible rows', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          field: 'brand',
          value: 'a',
          operator: 'startsWith',
        },
      ],
      logicOperator: GridLogicOperator.Or,
    };
    render(<TestCase checkboxSelection filterModel={newModel} />);
    const checkAllCell = getColumnHeaderCell(0).querySelector('input')!;
    fireEvent.click(checkAllCell);
    expect(apiRef.current.state.rowSelection).to.deep.equal([1]);
  });

  it('should allow to clear filters by passing an empty filter model', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          field: 'brand',
          value: 'a',
          operator: 'startsWith',
        },
      ],
    };
    const { setProps } = render(<TestCase filterModel={newModel} />);
    expect(getColumnValues(0)).to.deep.equal(['Adidas']);
    setProps({ filterModel: { items: [] } });
    expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });

  it('should show the latest expandedRows', () => {
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    const input = screen.getByPlaceholderText('Filter value');
    fireEvent.change(input, { target: { value: 'ad' } });
    clock.tick(SUBMIT_FILTER_STROKE_TIME);
    expect(getColumnValues(0)).to.deep.equal(['Adidas']);

    expect(gridExpandedSortedRowEntriesSelector(apiRef).length).to.equal(1);
    expect(gridExpandedSortedRowEntriesSelector(apiRef)[0].model).to.deep.equal({
      id: 1,
      brand: 'Adidas',
    });
  });

  it('should not scroll the page when a filter is removed from the panel', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    render(
      <div>
        {/* To simulate a page that needs to be scrolled to reach the grid. */}
        <div style={{ height: '100vh', width: '100vh' }} />
        <TestCase
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              filterModel: {
                logicOperator: GridLogicOperator.Or,
                items: [
                  { id: 1, field: 'brand', value: 'a', operator: 'contains' },
                  { id: 2, field: 'brand', value: 'm', operator: 'contains' },
                ],
              },
            },
          }}
        />
      </div>,
    );
    screen.getByRole('grid').scrollIntoView();
    const initialScrollPosition = window.scrollY;
    expect(initialScrollPosition).not.to.equal(0);
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[1]);
    expect(window.scrollY).to.equal(initialScrollPosition);
  });

  it('should not scroll the page when opening the filter panel and the operator=isAnyOf', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }

    render(
      <div>
        {/* To simulate a page that needs to be scrolled to reach the grid. */}
        <div style={{ height: '100vh', width: '100vh' }} />
        <TestCase
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              filterModel: {
                logicOperator: GridLogicOperator.Or,
                items: [{ id: 1, field: 'brand', operator: 'isAnyOf' }],
              },
            },
          }}
        />
      </div>,
    );

    screen.getByRole('grid').scrollIntoView();
    const initialScrollPosition = window.scrollY;
    expect(initialScrollPosition).not.to.equal(0);
    act(() => apiRef.current.hidePreferences());
    clock.tick(100);
    act(() => apiRef.current.showPreferences(GridPreferencePanelsValue.filters));
    expect(window.scrollY).to.equal(initialScrollPosition);
  });

  describe('Server', () => {
    it('should refresh the filter panel when adding filters', async () => {
      function loadServerRows(commodityFilterValue: string | undefined) {
        const serverRows = [
          { id: '1', commodity: 'rice' },
          { id: '2', commodity: 'soybeans' },
          { id: '3', commodity: 'milk' },
          { id: '4', commodity: 'wheat' },
          { id: '5', commodity: 'oats' },
        ];

        return new Promise<GridRowModel[]>((resolve) => {
          if (!commodityFilterValue) {
            resolve(serverRows);
            return;
          }
          resolve(
            serverRows.filter(
              (row) => row.commodity.toLowerCase().indexOf(commodityFilterValue) > -1,
            ),
          );
        });
      }

      const columns = [{ field: 'commodity', width: 150 }];

      function AddServerFilterGrid() {
        const [rows, setRows] = React.useState<GridRowModel[]>([]);
        const [filterValue, setFilterValue] = React.useState<string>();

        const handleFilterChange = React.useCallback((newFilterModel: GridFilterModel) => {
          setFilterValue(newFilterModel.items[0].value);
        }, []);

        React.useEffect(() => {
          let active = true;

          (async () => {
            const newRows = await loadServerRows(filterValue);

            if (!active) {
              return;
            }

            setRows(newRows);
          })();

          return () => {
            active = false;
          };
        }, [filterValue]);

        return (
          <div style={{ height: 400, width: 400 }}>
            <DataGridPro
              rows={rows}
              columns={columns}
              filterMode="server"
              onFilterModelChange={handleFilterChange}
              initialState={{
                preferencePanel: {
                  open: true,
                  openedPanelValue: GridPreferencePanelsValue.filters,
                },
              }}
            />
          </div>
        );
      }

      render(<AddServerFilterGrid />);
      await act(() => Promise.resolve()); // Wait for the server to send rows

      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiDataGrid-filterForm`);
      expect(filterForms).to.have.length(2);
    });
  });

  it('should display the number of results in the footer', () => {
    const { setProps } = render(<TestCase />);
    expect(screen.getByText('Total Rows: 3')).not.to.equal(null);
    setProps({ filterModel });
    expect(screen.getByText('Total Rows: 2 of 3')).not.to.equal(null);
  });

  describe('control Filter', () => {
    it('should update the filter state when neither the model nor the onChange are set', () => {
      render(
        <TestCase
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiDataGrid-filterForm`);
      expect(filterForms).to.have.length(2);
    });

    it('should not update the filter state when the filterModelProp is set', () => {
      const testFilterModel: GridFilterModel = { items: [], logicOperator: GridLogicOperator.Or };
      render(
        <TestCase
          filterModel={testFilterModel}
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      expect(apiRef.current.state.filter.filterModel.items).to.have.length(0);
    });

    it('should update the filter state when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      render(
        <TestCase
          onFilterModelChange={onModelChange}
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      expect(onModelChange.callCount).to.equal(0);
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiDataGrid-filterForm`);
      expect(filterForms).to.have.length(2);
      expect(onModelChange.callCount).to.equal(1);
      expect(onModelChange.lastCall.firstArg.items.length).to.deep.equal(2);
      expect(onModelChange.lastCall.firstArg.logicOperator).to.deep.equal(GridLogicOperator.And);
    });

    it('should control filter state when the model and the onChange are set', () => {
      function ControlCase(props: Partial<DataGridProProps>) {
        const { rows, columns, ...others } = props;
        const [caseFilterModel, setFilterModel] = React.useState(getDefaultGridFilterModel);
        const handleFilterChange: DataGridProProps['onFilterModelChange'] = (newModel) => {
          setFilterModel(newModel);
        };

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              autoHeight={isJSDOM}
              columns={columns || baselineProps.columns}
              rows={rows || baselineProps.rows}
              filterModel={caseFilterModel}
              onFilterModelChange={handleFilterChange}
              initialState={{
                preferencePanel: {
                  open: true,
                  openedPanelValue: GridPreferencePanelsValue.filters,
                },
              }}
              {...others}
            />
          </div>
        );
      }

      render(<ControlCase />);
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);

      const filterForms = document.querySelectorAll(`.MuiDataGrid-filterForm`);
      expect(filterForms).to.have.length(2);
    });
  });

  it('should give a stable ID to the filter item used as placeholder', function test() {
    if (isJSDOM) {
      this.skip(); // It's not re-rendering the filter panel correctly
    }

    const { rerender } = render(<TestCase slots={{ toolbar: GridToolbar }} />);
    const filtersButton = screen.getByRole('button', { name: /Filters/i });
    fireEvent.click(filtersButton);

    let filterForm = document.querySelector<HTMLElement>(`.${gridClasses.filterForm}`);
    const oldId = filterForm!.dataset.id;

    rerender(<TestCase slots={{ toolbar: GridToolbar }} rows={[{ id: 0, brand: 'ADIDAS' }]} />);
    filterForm = document.querySelector<HTMLElement>(`.${gridClasses.filterForm}`);
    const newId = filterForm!.dataset.id;
    expect(oldId).to.equal(newId);
  });
});
