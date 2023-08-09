import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer, fireEvent, screen } from '@mui/monorepo/test/utils';
import { DataGrid, DataGridProps, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1, idBis: 1 }];

const columns: GridColDef[] = [{ field: 'id' }, { field: 'idBis' }];

describe('<DataGridPro /> - Columns Visibility', () => {
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
          components={{
            Toolbar: GridToolbar,
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
          components={{
            Toolbar: GridToolbar,
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
          components={{
            Toolbar: GridToolbar,
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
      render(
        <TestDataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          columnVisibilityModel={{ idBis: false }}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByText('Hide all'));
      expect(onColumnVisibilityModelChange.callCount).to.equal(1);
      expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
        idBis: false,
        id: false,
      });

      fireEvent.click(screen.getByText('Show all'));
      expect(onColumnVisibilityModelChange.callCount).to.equal(2);
      expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({});
    });

    it('should not hide non hideable columns when toggling all columns', () => {
      render(
        <TestDataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          columns={[{ field: 'id' }, { field: 'idBis', hideable: false }]}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByText('Hide all'));
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);
    });

    // Fixes (1) in in https://github.com/mui/mui-x/issues/7393#issuecomment-1372129661
    it('should not show hidden non hideable columns when "Show all" is clicked', () => {
      render(
        <TestDataGrid
          components={{ Toolbar: GridToolbar }}
          columns={[{ field: 'id' }, { field: 'idBis', hideable: false }]}
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByText('Show all'));
      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    // Fixes (2) in in https://github.com/mui/mui-x/issues/7393#issuecomment-1372129661
    it('should not show non-hideable columns when "Hide all" is clicked', () => {
      render(
        <TestDataGrid
          components={{ Toolbar: GridToolbar }}
          columns={[{ field: 'id' }, { field: 'idBis', hideable: false }]}
          initialState={{
            columns: {
              columnVisibilityModel: { idBis: false },
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByText('Hide all'));
      expect(getColumnHeadersTextContent()).to.deep.equal([]);
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
          components={{
            Toolbar: GridToolbar,
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByRole('checkbox', { name: 'id' }));
      expect(getColumnHeadersTextContent()).to.deep.equal([]);
    });
  });

  it('should autofocus the first switch element in columns panel when `autoFocusSearchField` disabled', () => {
    render(
      <TestDataGrid
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          columnsPanel: {
            autoFocusSearchField: false,
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));

    expect(screen.getByRole('checkbox', { name: columns[0].field })).toHaveFocus();
  });

  it('should hide `Hide all` in columns panel when `disableHideAllButton` is `true`', () => {
    render(
      <TestDataGrid
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          columnsPanel: {
            disableHideAllButton: true,
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
    expect(screen.queryByRole('button', { name: 'Hide all' })).to.equal(null);
  });

  it('should hide `Show all` in columns panel when `disableShowAllButton` is `true`', () => {
    render(
      <TestDataGrid
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          columnsPanel: {
            disableShowAllButton: true,
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
    expect(screen.queryByRole('button', { name: 'Show all' })).to.equal(null);
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
            columnsPanel: {
              getTogglableColumns,
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      expect(screen.queryByRole('checkbox', { name: 'id' })).not.to.equal(null);
      expect(screen.queryByRole('checkbox', { name: 'idBis' })).to.equal(null);
    });

    it('should avoid toggling columns provided by `getTogglableColumns` prop on `Show all` or `Hide all`', () => {
      const getTogglableColumns = (cols: GridColDef[]) =>
        cols.filter((column) => column.field !== 'idBis').map((column) => column.field);
      render(
        <TestDataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            columnsPanel: {
              getTogglableColumns,
            },
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Select columns' }));
      fireEvent.click(screen.getByRole('button', { name: 'Hide all' }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);

      fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });
  });
});
