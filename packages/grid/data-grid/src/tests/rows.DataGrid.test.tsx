import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import Portal from '@mui/material/Portal';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { getColumnValues, getRow } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Rows', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        clientId: 'c1',
        first: 'Mike',
        age: 11,
      },
      {
        clientId: 'c2',
        first: 'Jack',
        age: 11,
      },
      {
        clientId: 'c3',
        first: 'Mike',
        age: 20,
      },
    ],
    columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
  };

  describe('getRowId', () => {
    it('should allow to select a field as id', () => {
      const getRowId = (row) => `${row.clientId}`;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} getRowId={getRowId} />
        </div>,
      );
      expect(getColumnValues()).to.deep.equal(['c1', 'c2', 'c3']);
    });
  });

  it('should ignore events coming from a portal in the cell', () => {
    const handleRowClick = spy();
    const InputCell = () => <input type="text" name="input" />;
    const PortalCell = () => (
      <Portal>
        <input type="text" name="portal-input" />
      </Portal>
    );

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={[{ id: '1' }]}
          onRowClick={handleRowClick}
          columns={[
            {
              field: 'id',
              renderCell: () => <PortalCell />,
            },
            {
              field: 'input',
              renderCell: () => <InputCell />,
            },
          ]}
        />
      </div>,
    );
    fireEvent.click(document.querySelector('input[name="portal-input"]'));
    expect(handleRowClick.callCount).to.equal(0);
    fireEvent.click(document.querySelector('input[name="input"]'));
    expect(handleRowClick.callCount).to.equal(1);
  });

  it('should apply the CSS class returned by getRowClassName', () => {
    const getRowId = (row) => `${row.clientId}`;
    const handleRowClassName = (params) =>
      params.getValue(params.id, 'age') < 20 ? 'under-age' : '';
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid getRowClassName={handleRowClassName} getRowId={getRowId} {...baselineProps} />
      </div>,
    );
    expect(getRow(0)).to.have.class('under-age');
    expect(getRow(1)).to.have.class('under-age');
    expect(getRow(2)).not.to.have.class('under-age');
  });

  describe('columnType: actions', () => {
    it('should throw an error if getActions is missing', function test() {
      if (!isJSDOM) {
        this.skip();
      }
      expect(() => {
        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              {...baselineProps}
              rows={[{ id: 1 }]}
              columns={[{ field: 'actions', type: 'actions' }]}
            />
          </div>,
        );
      }) // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev([
          'MUI: Missing the `getActions` property in the `GridColDef`.',
          'The above error occurred in the <GridActionsCell> component',
          'MUI: GridErrorHandler - An unexpected error occurred.',
        ]);
    });

    it('should call getActions with the row params', () => {
      const getActions = stub().returns([]);
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            rows={[{ id: 1 }]}
            columns={[{ field: 'actions', type: 'actions', getActions }]}
          />
        </div>,
      );
      expect(getActions.args[0][0].id).to.equal(1);
      expect(getActions.args[0][0].row).to.deep.equal({ id: 1 });
    });

    it('should always show the actions not marked as showInMenu', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            rows={[{ id: 1 }]}
            columns={[
              {
                field: 'actions',
                type: 'actions',
                getActions: () => [
                  <GridActionsCellItem icon={<span />} label="delete" />,
                  <GridActionsCellItem label="print" showInMenu />,
                ],
              },
            ]}
          />
        </div>,
      );
      expect(screen.queryByRole('button', { name: 'delete' })).not.to.equal(null);
      expect(screen.queryByText('print')).to.equal(null);
    });

    it('should show in a menu the actions marked as showInMenu', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            rows={[{ id: 1 }]}
            columns={[
              {
                field: 'actions',
                type: 'actions',
                getActions: () => [<GridActionsCellItem label="print" showInMenu />],
              },
            ]}
          />
        </div>,
      );
      expect(screen.queryByText('print')).to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: 'more' }));
      await waitFor(() => expect(screen.queryByText('print')).not.to.equal(null));
    });
  });
});
