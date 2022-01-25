import * as React from 'react';
import { DataGrid, DataGridProps, GridToolbar, GridToolbarExport } from '@mui/x-data-grid';
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
  });
});
