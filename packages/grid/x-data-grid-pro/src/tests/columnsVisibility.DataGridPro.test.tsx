import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { createRenderer } from '@material-ui/monorepo/test/utils';
import {
  DataGridPro,
  GridApiRef,
  useGridApiRef,
  DataGridProProps,
  GridRowsProp,
  GridColumns,
} from '@mui/x-data-grid-pro';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1 }];

const columns: GridColumns = [{ field: 'id' }];

/**
 * TODO: Remove deprecated tests on v6
 */
describe('<DataGridPro /> - Columns Visibility', () => {
  const { render } = createRenderer();

  let apiRef: GridApiRef;

  const TestDataGridPro = (
    props: Omit<DataGridProProps, 'columns' | 'rows' | 'apiRef'> &
      Partial<Pick<DataGridProProps, 'rows' | 'columns'>>,
  ) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          columns={columns}
          rows={rows}
          {...props}
          apiRef={apiRef}
          autoHeight={isJSDOM}
        />
      </div>
    );
  };

  describe('apiRef: setColumnVisibility', () => {
    describe('Model on 1st render: use not use `GridColDef.hide`', () => {
      it('should update `visibleColumnsModel` but not `GridColDef.hide` in state', () => {
        render(<TestDataGridPro initialState={{ columns: { visibleColumnsModel: ['id'] } }} />);
        apiRef.current.setColumnVisibility('id', false);
        expect(apiRef.current.state.columns.lookup.id.hide).to.equal(false);
        expect(apiRef.current.state.columns.visibleColumnsModel).to.deep.equal([]);

        apiRef.current.setColumnVisibility('id', true);
        expect(apiRef.current.state.columns.lookup.id.hide).to.equal(false);
        expect(apiRef.current.state.columns.visibleColumnsModel).to.deep.equal(['id']);
      });

      it('should call `onVisibleColumnsModelChange` with the new model', () => {
        const onVisibleColumnsModelChange = spy();

        render(
          <TestDataGridPro
            initialState={{ columns: { visibleColumnsModel: ['id'] } }}
            onVisibleColumnsModelChange={onVisibleColumnsModelChange}
          />,
        );

        apiRef.current.setColumnVisibility('id', false);
        expect(onVisibleColumnsModelChange.callCount).to.equal(1);
        expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal([]);

        apiRef.current.setColumnVisibility('id', true);
        expect(onVisibleColumnsModelChange.callCount).to.equal(2);
        expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal(['id']);
      });

      it('should not call `onColumnVisibilityChange`', () => {
        const onColumnVisibilityChange = spy();

        render(
          <TestDataGridPro
            initialState={{ columns: { visibleColumnsModel: ['id'] } }}
            onColumnVisibilityChange={onColumnVisibilityChange}
          />,
        );

        apiRef.current.setColumnVisibility('id', false);
        expect(onColumnVisibilityChange.callCount).to.equal(0);

        apiRef.current.setColumnVisibility('id', true);
        expect(onColumnVisibilityChange.callCount).to.equal(0);
      });
    });

    describe('No model on 1st render: use `GridColDef.hide` (deprecated)', () => {
      it('should update `visibleColumnsModel` and `GridColDef.hide` in state', () => {
        render(<TestDataGridPro />);

        apiRef.current.setColumnVisibility('id', false);
        expect(apiRef.current.state.columns.lookup.id.hide).to.equal(true);
        expect(apiRef.current.state.columns.visibleColumnsModel).to.deep.equal([]);

        apiRef.current.setColumnVisibility('id', true);
        expect(apiRef.current.state.columns.lookup.id.hide).to.equal(false);
        expect(apiRef.current.state.columns.visibleColumnsModel).to.deep.equal(['id']);
      });

      it('should call `onVisibleColumnsModelChange` with the new model', () => {
        const onVisibleColumnsModelChange = spy();

        render(<TestDataGridPro onVisibleColumnsModelChange={onVisibleColumnsModelChange} />);

        apiRef.current.setColumnVisibility('id', false);
        expect(onVisibleColumnsModelChange.callCount).to.equal(1);
        expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal([]);

        apiRef.current.setColumnVisibility('id', true);
        expect(onVisibleColumnsModelChange.callCount).to.equal(2);
        expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal(['id']);
      });

      it('should call `onColumnVisibilityChange` with the new visibility status', () => {
        const onColumnVisibilityChange = spy();

        render(<TestDataGridPro onColumnVisibilityChange={onColumnVisibilityChange} />);

        apiRef.current.setColumnVisibility('id', false);
        expect(onColumnVisibilityChange.callCount).to.equal(1);
        expect(onColumnVisibilityChange.lastCall.firstArg).to.have.property('isVisible', false);
        expect(onColumnVisibilityChange.lastCall.firstArg).to.have.property('field', 'id');

        apiRef.current.setColumnVisibility('id', true);
        expect(onColumnVisibilityChange.callCount).to.equal(2);
        expect(onColumnVisibilityChange.lastCall.firstArg).to.have.property('isVisible', true);
        expect(onColumnVisibilityChange.lastCall.firstArg).to.have.property('field', 'id');
      });
    });
  });

  describe('apiRef: setVisibleColumnsModel', () => {
    it('should update `visibleColumnsModel` in state and call `onVisibleColumnsModelChange`', () => {
      const onVisibleColumnsModelChange = spy();

      render(
        <TestDataGridPro
          initialState={{ columns: { visibleColumnsModel: ['id'] } }}
          onVisibleColumnsModelChange={onVisibleColumnsModelChange}
        />,
      );
      apiRef.current.setVisibleColumnsModel([]);
      expect(onVisibleColumnsModelChange.callCount).to.equal(1);
      expect(onVisibleColumnsModelChange.lastCall.firstArg).to.deep.equal([]);
    });
  });
});
