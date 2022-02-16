import * as React from 'react';
import {
  DataGrid,
  DataGridProps,
  GridToolbar,
  GridToolbarExport,
  GridRowsProp,
  GridColumns,
} from '@mui/x-data-grid';
import { createRenderer, screen, fireEvent } from '@mui/monorepo/test/utils';
import { useData } from 'storybook/src/hooks/useData';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

describe('<DataGridPro /> - Export', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const TestCase = (props: Omit<DataGridProps, 'rows' | 'columns'>) => {
    const basicData = useData(3, 2);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...basicData} {...props} />
      </div>
    );
  };

  // We need `createObjectURL` to test the downloaded value
  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let spyCreateObjectURL: SinonSpy;
  beforeEach(() => {
    spyCreateObjectURL = spy(global.URL, 'createObjectURL');
  });

  afterEach(() => {
    spyCreateObjectURL.restore();
  });

  describe('component: GridToolbar', () => {
    it('should export with the default csvOptions', async function test() {
      // Safari 13 doesn't have Blob.text().
      if (/safari/i.test(window.navigator.userAgent)) {
        this.skip();
      }
      render(<TestCase components={{ Toolbar: GridToolbar }} />);
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id,Currency Pair', '0,USDGBP', '1,USDEUR', '2,GBPEUR'].join('\r\n'));
    });

    it('should apply custom csvOptions', async function test() {
      // Safari 13 doesn't have Blob.text().
      if (/safari/i.test(window.navigator.userAgent)) {
        this.skip();
      }
      render(
        <TestCase
          components={{ Toolbar: GridToolbar }}
          componentsProps={{ toolbar: { csvOptions: { delimiter: ';' } } }}
        />,
      );
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id;Currency Pair', '0;USDGBP', '1;USDEUR', '2;GBPEUR'].join('\r\n'));
    });

    it('should disable csv export when passing `csvOptions.disableToolbarButton`', () => {
      render(
        <TestCase
          components={{ Toolbar: GridToolbar }}
          componentsProps={{ toolbar: { csvOptions: { disableToolbarButton: true } } }}
        />,
      );
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as CSV' })).to.equal(null);
    });
  });

  describe('component: GridToolbarExport', () => {
    it('should export with the default csvOptions', async function test() {
      // Safari 13 doesn't have Blob.text().
      if (/safari/i.test(window.navigator.userAgent)) {
        this.skip();
      }
      render(<TestCase components={{ Toolbar: () => <GridToolbarExport /> }} />);
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id,Currency Pair', '0,USDGBP', '1,USDEUR', '2,GBPEUR'].join('\r\n'));
    });

    it('should apply custom csvOptions', async function test() {
      // Safari 13 doesn't have Blob.text().
      if (/safari/i.test(window.navigator.userAgent)) {
        this.skip();
      }
      render(
        <TestCase
          components={{ Toolbar: () => <GridToolbarExport csvOptions={{ delimiter: ';' }} /> }}
        />,
      );
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.queryByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id;Currency Pair', '0;USDGBP', '1;USDEUR', '2;GBPEUR'].join('\r\n'));
    });

    it('should disable csv export when passing `csvOptions.disableToolbarButton`', async () => {
      render(
        <TestCase
          components={{
            Toolbar: () => <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />,
          }}
        />,
      );
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as CSV' })).to.equal(null);
    });

    it('should restore columns after print', async function test() {
      const onColumnVisibilityModelChange = spy();

      const rows: GridRowsProp = [{ id: 1, value: 3, currency: 'USD' }];

      const columns: GridColumns = [{ field: 'id' }, { field: 'value' }, { field: 'currency' }];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={columns}
            rows={rows}
            // A hack to remove the warning
            rowsPerPageOptions={[1, 100]}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            components={{
              Toolbar: () => <GridToolbarExport printOptions={{ fields: ['id'] }} />,
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

      // verify hidden columns corresponds to the printOptions
      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        id: true,
        value: false,
        currency: false,
      });

      // verify column visibility has been restored
      expect(onColumnVisibilityModelChange.secondCall.firstArg).to.deep.equal({
        id: true,
        value: true,
        currency: true,
      });
    });
  });
});
