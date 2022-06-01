import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen } from '@mui/monorepo/test/utils';
import { DataGrid, DataGridProps, GridRowsProp, GridColumns, GridToolbar } from '@mui/x-data-grid';
import { getColumnHeadersTextContent } from '../../../../../test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1, idBis: 1 }];

const columns: GridColumns = [{ field: 'id' }, { field: 'idBis' }];

/**
 * TODO v6: Remove deprecated tests
 */
describe('<DataGridPro /> - Columns Visibility', () => {
  const { render } = createRenderer();

  const TestDataGrid = (
    props: Omit<DataGridProps, 'columns' | 'rows'> &
      Partial<Pick<DataGridProps, 'rows' | 'columns'>>,
  ) => (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid columns={columns} rows={rows} {...props} autoHeight={isJSDOM} />
    </div>
  );

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
        idBis: true,
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

    it('should call onColumnVisibilityModelChange with the new model when toggling all rows', () => {
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

  describe('GridColDef: hide (deprecated)', () => {
    it('should hide columns with `hide: true`', () => {
      render(<TestDataGrid columns={[{ field: 'id' }, { field: 'idBis', hide: true }]} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should not hide columns with `hide: true` if the model is initialized', () => {
      render(
        <TestDataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {},
            },
          }}
          columns={[{ field: 'id' }, { field: 'idBis', hide: true }]}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should not hide columns with `hide: true` if the model is controlled', () => {
      render(
        <TestDataGrid
          columnVisibilityModel={{}}
          columns={[{ field: 'id' }, { field: 'idBis', hide: true }]}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });
  });
});
