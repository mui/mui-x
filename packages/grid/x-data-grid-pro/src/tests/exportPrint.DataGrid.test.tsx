import * as React from 'react';
import { DataGrid, GridToolbarExport, GridRowsProp, GridColumns } from '@mui/x-data-grid';
import { createRenderer, screen, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';

describe('<DataGridPro /> - Export - Print', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const rows: GridRowsProp = [
    { id: 1, col1: '1-1', col2: '1-2' },
    { id: 2, col1: '2-1', col2: '2-2' },
  ];
  const columns: GridColumns = [{ field: 'col1' }, { field: 'col2' }];
  const baselineProps = {
    columns,
    rows,
    // A hack to remove the warning on print
    rowsPerPageOptions: [2, 100],
  };

  const allBooleanConfigurations = [
    {
      printVisible: true,
      gridVisible: true,
    },
    {
      printVisible: false,
      gridVisible: true,
    },
    {
      printVisible: true,
      gridVisible: false,
    },
    {
      printVisible: false,
      gridVisible: false,
    },
  ];
  // We need `createObjectURL` to test the downloaded value
  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  describe('restore visibility', () => {
    allBooleanConfigurations.forEach(({ printVisible, gridVisible }) => {
      it(`should set and restore 'col1' from ${printVisible ? "'visible'" : "'hidden'"} to ${
        gridVisible ? "'visible'" : "'hidden'"
      } (visibilityModel)`, async function test() {
        const onColumnVisibilityModelChange = spy();

        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              {...baselineProps}
              onColumnVisibilityModelChange={onColumnVisibilityModelChange}
              components={{
                Toolbar: () => (
                  <GridToolbarExport
                    printOptions={{ fields: printVisible ? ['col1', 'col2'] : ['col2'] }}
                  />
                ),
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns status and traderName, the other columns will remain visible
                    col1: gridVisible,
                    col2: false,
                  },
                },
              }}
            />
          </div>,
        );
        expect(onColumnVisibilityModelChange.callCount).to.equal(0);

        // Trigger print
        fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
        fireEvent.click(screen.queryByRole('menuitem', { name: 'Print' }));
        await clock.runToLast();
        expect(onColumnVisibilityModelChange.callCount).to.equal(2);
        // verify column visibility has been set
        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
          col1: printVisible,
          col2: true,
        });

        // verify column visibility has been restored
        expect(onColumnVisibilityModelChange.secondCall.firstArg).to.deep.equal({
          col1: gridVisible,
          col2: false,
        });
      });

      it(`should set and restore 'col1' from ${printVisible ? "'visible'" : "'hidden'"} to ${
        gridVisible ? "'visible'" : "'hidden'"
      } (hidden)`, async function test() {
        const onColumnVisibilityModelChange = spy();

        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              {...baselineProps}
              onColumnVisibilityModelChange={onColumnVisibilityModelChange}
              components={{
                Toolbar: () => (
                  <GridToolbarExport
                    printOptions={{ fields: printVisible ? ['col1', 'col2'] : ['col2'] }}
                  />
                ),
              }}
              columns={[
                { field: 'col1', hide: !gridVisible },
                { field: 'col2', hide: true },
              ]}
            />
          </div>,
        );
        expect(onColumnVisibilityModelChange.callCount).to.equal(0);

        // Trigger print
        fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
        fireEvent.click(screen.queryByRole('menuitem', { name: 'Print' }));
        await clock.runToLast();

        expect(onColumnVisibilityModelChange.callCount).to.equal(2);

        // verify column visibility has been set
        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
          col1: printVisible,
          col2: true,
        });

        // verify column visibility has been restored
        expect(onColumnVisibilityModelChange.secondCall.firstArg).to.deep.equal({
          col1: gridVisible,
          col2: false,
        });
      });
    });
  });
  describe('column selection', () => {
    it(`should ignore 'allColumns' if 'fields' is provided`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            components={{
              Toolbar: () => (
                <GridToolbarExport printOptions={{ fields: ['col2'], allColumns: true }} />
              ),
            }}
          />
        </div>,
      );
      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      // Trigger print
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Print' }));
      await clock.runToLast();

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        col1: false,
        col2: true,
      });
    });

    it(`should ignore 'disableExport' if 'fields' is provided`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            components={{
              Toolbar: () => (
                <GridToolbarExport printOptions={{ fields: ['col2'], allColumns: true }} />
              ),
            }}
            columns={[{ field: 'col1' }, { field: 'col2', disableExport: true }]}
          />
        </div>,
      );
      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      // Trigger print
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Print' }));
      await clock.runToLast();

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        col1: false,
        col2: true,
      });
    });

    it(`should apply 'disableExport' even if 'allColumns' is set`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            components={{
              Toolbar: () => <GridToolbarExport printOptions={{ allColumns: true }} />,
            }}
            columns={[{ field: 'col1' }, { field: 'col2', disableExport: true }]}
          />
        </div>,
      );
      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      // Trigger print
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Print' }));
      await clock.runToLast();

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        col1: true,
        col2: false,
      });
    });

    it(`should print hidden columns if 'allColumns' set to true`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            components={{
              Toolbar: () => <GridToolbarExport printOptions={{ allColumns: true }} />,
            }}
            columns={[{ field: 'col1' }, { field: 'col2', hide: true }]}
          />
        </div>,
      );
      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      // Trigger print
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Print' }));
      await clock.runToLast();

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        col1: true,
        col2: true,
      });
    });
  });
});
