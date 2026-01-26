import { vi, MockInstance } from 'vitest';
import { DataGrid, DataGridProps, GridToolbarExport } from '@mui/x-data-grid';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { createRenderer, screen, fireEvent } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';

// We need `createObjectURL` to test the downloaded value
describe.skipIf(isJSDOM)('<DataGrid /> - Export', () => {
  const { render } = createRenderer();

  function TestCase(props: Omit<DataGridProps, 'rows' | 'columns'>) {
    const basicData = useBasicDemoData(3, 2);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...basicData} {...props} />
      </div>
    );
  }

  let spyCreateObjectURL: MockInstance;

  beforeEach(() => {
    spyCreateObjectURL = vi.spyOn(globalThis.URL, 'createObjectURL');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('component: GridToolbar', () => {
    it('should export with the default csvOptions', async () => {
      render(<TestCase showToolbar />);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL).toHaveBeenCalledTimes(1);
      const csv = await spyCreateObjectURL.mock.lastCall![0].text();
      expect(csv).to.equal(['id,Currency Pair', '0,USDGBP', '1,USDEUR', '2,GBPEUR'].join('\r\n'));
    });

    it('should apply custom csvOptions', async () => {
      render(<TestCase showToolbar slotProps={{ toolbar: { csvOptions: { delimiter: ';' } } }} />);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL).toHaveBeenCalledTimes(1);
      const csv = await spyCreateObjectURL.mock.lastCall![0].text();
      expect(csv).to.equal(['id;Currency Pair', '0;USDGBP', '1;USDEUR', '2;GBPEUR'].join('\r\n'));
    });

    it('should disable csv export when passing `csvOptions.disableToolbarButton`', () => {
      render(
        <TestCase
          showToolbar
          slotProps={{ toolbar: { csvOptions: { disableToolbarButton: true } } }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));

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
            showToolbar
          />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL).toHaveBeenCalledTimes(1);
      const csv = await spyCreateObjectURL.mock.lastCall![0].text();

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
            showToolbar
          />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL).toHaveBeenCalledTimes(1);
      const csv = await spyCreateObjectURL.mock.lastCall![0].text();

      expect(csv).to.equal(['name', 'Name', '', '', '1234'].join('\r\n'));
    });
  });

  describe('component: GridToolbarExport', () => {
    it('should export with the default csvOptions', async () => {
      render(<TestCase slots={{ toolbar: () => <GridToolbarExport /> }} showToolbar />);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL).toHaveBeenCalledTimes(1);
      const csv = await spyCreateObjectURL.mock.lastCall![0].text();
      expect(csv).to.equal(['id,Currency Pair', '0,USDGBP', '1,USDEUR', '2,GBPEUR'].join('\r\n'));
    });

    it('should apply custom csvOptions', async () => {
      render(
        <TestCase
          slots={{ toolbar: () => <GridToolbarExport csvOptions={{ delimiter: ';' }} /> }}
          showToolbar
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Download as CSV' }));
      expect(spyCreateObjectURL).toHaveBeenCalledTimes(1);
      const csv = await spyCreateObjectURL.mock.lastCall![0].text();
      expect(csv).to.equal(['id;Currency Pair', '0;USDGBP', '1;USDEUR', '2;GBPEUR'].join('\r\n'));
    });

    it('should disable csv export when passing `csvOptions.disableToolbarButton`', async () => {
      render(
        <TestCase
          slots={{
            toolbar: () => <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />,
          }}
          showToolbar
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as CSV' })).to.equal(null);
    });
  });
});
