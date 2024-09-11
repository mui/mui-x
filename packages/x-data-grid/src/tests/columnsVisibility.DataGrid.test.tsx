import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import {
  DataGrid,
  DataGridProps,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1, idBis: 1 }];

const columns: GridColDef[] = [{ field: 'id' }, { field: 'idBis' }];

describe('<DataGridPro /> - Columns visibility', () => {
  const { render } = createRenderer();

  function TestDataGrid(
    props: Omit<DataGridProps, 'columns' | 'rows'> &
      Partial<Pick<DataGridProps, 'rows' | 'columns'>>,
  ) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid columns={columns} rows={rows} {...props} autoHeight={isJSDOM} />
      </div>
    );
  }

  describe('prop: columnVisibilityModel and onColumnVisibilityModelChange', () => {
    it('should allow to set the columnVisibilityModel prop', () => {
      render(<TestDataGrid columnVisibilityModel={{ idBis: false }} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should allow to update the columnVisibilityModel prop from the outside', () => {
      const { setProps } = render(<TestDataGrid columnVisibilityModel={{ idBis: false }} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      setProps({
        columnVisibilityModel: {},
      });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should update the visible columns when props.onColumnVisibilityModelChange and props.columnVisibilityModel are not defined', () => {
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByRole('checkbox', { name: 'id' }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);
    });

    it('should call onColumnVisibilityModelChange and update the visible columns when props.columnVisibilityModel is not defined', () => {
      const onColumnVisibilityModelChange = spy();
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByRole('checkbox', { name: 'id' }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);
      expect(onColumnVisibilityModelChange.callCount).to.equal(1);
      expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
        id: false,
      });
    });

    it('should call onColumnVisibilityModelChange with the new model when columnVisibilityModel is controlled', () => {
      const onColumnVisibilityModelChange = spy();
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          columnVisibilityModel={{ idBis: false }}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByRole('checkbox', { name: 'id' }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      expect(onColumnVisibilityModelChange.callCount).to.equal(1);
      expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
        id: false,
        idBis: false,
      });
    });

    it('should call onColumnVisibilityModelChange with the new model when toggling all columns', () => {
      const onColumnVisibilityModelChange = spy();
      function ControlledTest() {
        const [model, setModel] = React.useState<GridColumnVisibilityModel>({ idBis: false });
        return (
          <TestDataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            columnVisibilityModel={model}
            onColumnVisibilityModelChange={(newModel) => {
              onColumnVisibilityModelChange(newModel);
              setModel(newModel);
            }}
          />
        );
      }
      render(<ControlledTest />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });

      // Hide all
      fireEvent.click(showHideAllCheckbox);
      expect(onColumnVisibilityModelChange.callCount).to.equal(1);
      expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({});

      // Show all
      fireEvent.click(showHideAllCheckbox);
      expect(onColumnVisibilityModelChange.callCount).to.equal(2);
      expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
        id: false,
        idBis: false,
      });
    });

    // Fixes (1) and (2) in https://github.com/mui/mui-x/issues/7393#issuecomment-1372129661
    it('should not show hidden non hideable columns when "Show/Hide All" is clicked', () => {
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          columns={[{ field: 'id' }, { field: 'idBis', hideable: false }]}
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });
      // Hide all
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal([]);
      // Show all
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });
  });

  describe('prop: initialState.columns.columnVisibilityModel', () => {
    it('should allow to initialize the columnVisibilityModel', () => {
      render(
        <TestDataGrid
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should use the control state upon the initialize state when both are defined', () => {
      render(
        <TestDataGrid
          columnVisibilityModel={{}}
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should not update the visible columns when updating the initial state', () => {
      const { setProps } = render(
        <TestDataGrid
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
        />,
      );

      setProps({
        initialState: {
          columns: {
            columnVisibilityModel: {},
          },
        },
      });

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should allow to update the visible columns through the UI when initialized with initialState', () => {
      render(
        <TestDataGrid
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByRole('checkbox', { name: 'id' }));
      expect(getColumnHeadersTextContent()).to.deep.equal([]);
    });
  });

  it('should autofocus the first switch element in columns management when `autoFocusSearchField` disabled', () => {
    render(
      <TestDataGrid
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          columnsManagement: {
            autoFocusSearchField: false,
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));

    expect(screen.getByRole('checkbox', { name: columns[0].field })).toHaveFocus();
  });

  it('should hide `Show/Hide all` in columns management when `disableShowHideToggle` is `true`', () => {
    const { setProps } = render(
      <TestDataGrid
        slots={{
          toolbar: GridToolbar,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
    // check if `Show/Hide all` checkbox is present initially
    expect(screen.getByRole('checkbox', { name: 'Show/Hide All' })).not.to.equal(null);
    setProps({
      slotProps: {
        columnsManagement: {
          disableShowHideToggle: true,
        },
      },
    });

    // check if `Show/Hide All` checkbox is not present  after setting `slotProps`
    expect(screen.queryByRole('checkbox', { name: 'Show/Hide All' })).to.equal(null);
  });

  it('should hide `Reset` in columns panel when `disableResetButton` is `true`', () => {
    const { setProps } = render(
      <TestDataGrid
        slots={{
          toolbar: GridToolbar,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
    // check if Reset button is present initially
    expect(screen.getByRole('button', { name: 'Reset' })).not.to.equal(null);
    setProps({
      slotProps: {
        columnsManagement: {
          disableResetButton: true,
        },
      },
    });
    // check if Reset button is not present after setting slotProps
    expect(screen.queryByRole('button', { name: 'Reset' })).to.equal(null);
  });

  it('should reset the columns to initial columns state when `Reset` button is clicked in columns management panel', () => {
    render(
      <TestDataGrid
        slots={{
          toolbar: GridToolbar,
        }}
      />,
    );

    expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    expect(resetButton).to.have.attribute('disabled');

    // Hide `idBis` column
    fireEvent.click(screen.getByRole('checkbox', { name: 'idBis' }));
    expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    expect(resetButton).not.to.have.attribute('disabled');

    // Reset columns
    fireEvent.click(resetButton);
    expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    expect(resetButton).to.have.attribute('disabled');
  });

  describe('prop: `getTogglableColumns`', () => {
    it('should control columns shown in columns panel using `getTogglableColumns` prop', () => {
      const getTogglableColumns = (cols: GridColDef[]) =>
        cols.filter((column) => column.field !== 'idBis').map((column) => column.field);
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            columnsManagement: {
              getTogglableColumns,
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      expect(screen.queryByRole('checkbox', { name: 'id' })).not.to.equal(null);
      expect(screen.queryByRole('checkbox', { name: 'idBis' })).to.equal(null);
    });

    it('should avoid toggling columns provided by `getTogglableColumns` prop on `Show/Hide All`', () => {
      const getTogglableColumns = (cols: GridColDef[]) =>
        cols.filter((column) => column.field !== 'idBis').map((column) => column.field);
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            columnsManagement: {
              getTogglableColumns,
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);

      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });
  });

  describe('prop: toggleAllMode', () => {
    it('should toggle filtered columns when `toggleAllMode` is `filtered`', () => {
      render(
        <div style={{ width: 400, height: 300 }}>
          <DataGrid
            columns={[
              { field: 'id' },
              { field: 'firstName' },
              { field: 'lastName' },
              { field: 'age' },
            ]}
            rows={[{ id: 1, firstName: 'John', lastName: 'Doe', age: 20 }]}
            slotProps={{
              columnsManagement: {
                toggleAllMode: 'filteredOnly',
              },
            }}
            slots={{ toolbar: GridToolbar }}
            disableVirtualization
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'firstName', 'lastName', 'age']);
      const button = screen.getByRole('button', { name: 'Select columns' });
      act(() => button.focus());
      fireEvent.click(button);

      const input = screen.getByPlaceholderText('Search');
      fireEvent.change(input, { target: { value: 'name' } });
      const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'age']);

      fireEvent.change(input, { target: { value: 'firstName' } });
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'firstName', 'age']);
    });
  });
});
