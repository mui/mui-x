import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { DataGrid, DataGridProps, GridRowsProp, GridColumns, GridToolbar } from '@mui/x-data-grid';
import { getColumnHeadersTextContent } from '../../../../../test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1, idBis: 1 }];

const columns: GridColumns = [{ field: 'id' }, { field: 'idBis' }];

/**
 * TODO: Remove deprecated tests on v6
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

  describe('prop: visibleColumnsModel and onVisibleColumnsModelChange', () => {
    it('should allow to set the visibleColumnsModel prop', () => {
      render(<TestDataGrid visibleColumnsModel={['id']} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should allow to update the visibleColumnsModel prop from the outside', () => {
      const { setProps } = render(<TestDataGrid visibleColumnsModel={['id']} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      setProps({ visibleColumnsModel: ['id', 'idBis'] });
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should respect the order of the columns not the order of the model', () => {
      render(<TestDataGrid visibleColumnsModel={['idBis', 'id']} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should update the visible columns when props.onVisibleColumnsModelChange and props.visibleColumnsModel are not defined', () => {
      const { getByText } = render(
        <TestDataGrid
          components={{
            Toolbar: GridToolbar,
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
      fireEvent.click(getByText('Columns'));
      fireEvent.click(document.querySelector('[role="tooltip"] [name="id"]'));
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);
    });

    it('should call onVisibleColumnsModelChange and update the visible columns when props.visibleColumnsModel is not defined', () => {
      const onVisibleColumnsModelChange = spy();
      const { getByText } = render(
        <TestDataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          onVisibleColumnsModelChange={onVisibleColumnsModelChange}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
      fireEvent.click(getByText('Columns'));
      fireEvent.click(document.querySelector('[role="tooltip"] [name="id"]'));
      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis']);
      expect(onVisibleColumnsModelChange.callCount).to.equal(1);
      expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal(['idBis']);
    });

    it('should call onVisibleColumnsModelChange with the new model when visibleColumnsModel is controlled', () => {
      const onVisibleColumnsModelChange = spy();
      const { getByText } = render(
        <TestDataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          visibleColumnsModel={['id']}
          onVisibleColumnsModelChange={onVisibleColumnsModelChange}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      fireEvent.click(getByText('Columns'));
      fireEvent.click(document.querySelector('[role="tooltip"] [name="id"]'));
      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      expect(onVisibleColumnsModelChange.callCount).to.equal(1);
      expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal([]);
    });

    it('should call onVisibleColumnsModelChange with the new model when toggling all rows', () => {
      const onVisibleColumnsModelChange = spy();
      const { getByText } = render(
        <TestDataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          visibleColumnsModel={['id']}
          onVisibleColumnsModelChange={onVisibleColumnsModelChange}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      fireEvent.click(getByText('Columns'));
      fireEvent.click(getByText('Hide all'));
      expect(onVisibleColumnsModelChange.callCount).to.equal(1);
      expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal([]);

      fireEvent.click(getByText('Show all'));
      expect(onVisibleColumnsModelChange.callCount).to.equal(2);
      expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal(['id', 'idBis']);
    });
  });

  describe('prop: initialState.columns.visibleColumnsModel', () => {
    it('should allow to initialize the visibleColumnsModel', () => {
      render(
        <TestDataGrid
          initialState={{
            columns: {
              visibleColumnsModel: ['id'],
            },
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should use the control state upon the initialize state when both are defined', () => {
      render(
        <TestDataGrid
          visibleColumnsModel={[]}
          initialState={{
            columns: {
              visibleColumnsModel: ['id'],
            },
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal([]);
    });

    it('should not update the visible columns when updating the initial state', () => {
      const { setProps } = render(
        <TestDataGrid
          initialState={{
            columns: {
              visibleColumnsModel: ['id'],
            },
          }}
        />,
      );

      setProps({
        initialState: {
          columns: {
            visibleColumnsModel: [],
          },
        },
      });

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should allow to update the visible columns through the UI when initialized with initialState', () => {
      const { getByText } = render(
        <TestDataGrid
          initialState={{
            columns: {
              visibleColumnsModel: ['id'],
            },
          }}
          components={{
            Toolbar: GridToolbar,
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
      fireEvent.click(getByText('Columns'));
      fireEvent.click(document.querySelector('[role="tooltip"] [name="id"]'));
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
              visibleColumnsModel: ['id', 'idBis'],
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
          visibleColumnsModel={['id', 'idBis']}
          columns={[{ field: 'id' }, { field: 'idBis', hide: true }]}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });
  });
});
