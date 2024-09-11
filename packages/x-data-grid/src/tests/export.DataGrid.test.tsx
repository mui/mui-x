import * as React from 'react';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { DataGrid, DataGridProps, GridToolbar, GridToolbarExport } from '@mui/x-data-grid';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { createRenderer, screen, fireEvent } from '@mui/internal-test-utils';

describe('<DataGrid /> - Export', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  function TestCase(props: Omit<DataGridProps, 'rows' | 'columns'>) {
    const basicData = useBasicDemoData(3, 2);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...basicData} {...props} />
      </div>
    );
  }

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
    it('should export with the default csvOptions', async () => {
      render(<TestCase slots={{ toolbar: GridToolbar }} />);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id,Currency Pair', '0,USDGBP', '1,USDEUR', '2,GBPEUR'].join('\r\n'));
    });

    it('should apply custom csvOptions', async () => {
      render(
        <TestCase
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { csvOptions: { delimiter: ';' } } }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id;Currency Pair', '0;USDGBP', '1;USDEUR', '2;GBPEUR'].join('\r\n'));
    });

    it('should disable csv export when passing `csvOptions.disableToolbarButton`', () => {
      render(
        <TestCase
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { csvOptions: { disableToolbarButton: true } } }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as CSV' })).to.equal(null);
    });

    it('should escape formulas in the cells', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={[{ field: 'name' }]}
            rows={[
              { id: 0, name: '=1+1' },
              { id: 1, name: '+1+1' },
              { id: 2, name: '-1+1' },
              { id: 3, name: '@1+1' },
              { id: 4, name: '\t1+1' },
              { id: 5, name: '\r1+1' },
              { id: 6, name: ',=1+1' },
              { id: 7, name: 'value,=1+1' },
            ]}
            slots={{ toolbar: GridToolbar }}
          />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();

      expect(csv).to.equal(
        [
          'name',
          '"\'=1+1"',
          '"\'+1+1"',
          '"\'-1+1"',
          '"\'@1+1"',
          '"\'\t1+1"',
          '"\'\r1+1"',
          '",=1+1"',
          '"value,=1+1"',
        ].join('\r\n'),
      );
    });

    it('should export `undefined` and `null` values as blank', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={[{ field: 'name' }]}
            rows={[
              { id: 0, name: 'Name' },
              { id: 1, name: undefined },
              { id: 2, name: null },
              { id: 3, name: 1234 },
            ]}
            slots={{ toolbar: GridToolbar }}
          />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();

      expect(csv).to.equal(['name', 'Name', '', '', '1234'].join('\r\n'));
    });
  });

  describe('component: GridToolbarExport', () => {
    it('should export with the default csvOptions', async () => {
      render(<TestCase slots={{ toolbar: () => <GridToolbarExport /> }} />);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id,Currency Pair', '0,USDGBP', '1,USDEUR', '2,GBPEUR'].join('\r\n'));
    });

    it('should apply custom csvOptions', async () => {
      render(
        <TestCase
          slots={{ toolbar: () => <GridToolbarExport csvOptions={{ delimiter: ';' }} /> }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL.callCount).to.equal(1);
      const csv = await spyCreateObjectURL.lastCall.firstArg.text();
      expect(csv).to.equal(['id;Currency Pair', '0;USDGBP', '1;USDEUR', '2;GBPEUR'].join('\r\n'));
    });

    it('should disable csv export when passing `csvOptions.disableToolbarButton`', async () => {
      render(
        <TestCase
          slots={{
            toolbar: () => <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />,
          }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      clock.runToLast();
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as CSV' })).to.equal(null);
    });
  });
});
