import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGrid /> - Virtualization RTL', () => {
  const { render } = createRenderer();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 120 },
  ];

  const rows = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    name: `Name ${index}`,
  }));

  // Total column width: 780px

  describe.skipIf(isJSDOM)('RTL scroll clamping', () => {
    // This test verifies the fix for issue https://github.com/mui/mui-x/issues/18274
    it('should not skip columns in RTL when columns fit in viewport', async () => {
      const rtlTheme = createTheme({ direction: 'rtl' });

      render(
        <ThemeProvider theme={rtlTheme}>
          {/* The width must be larger than the total column width */}
          <div style={{ width: 1000, height: 600 }} dir="rtl">
            <DataGrid rows={rows} columns={columns} />
          </div>
        </ThemeProvider>,
      );

      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
      expect(virtualScroller).not.to.equal(null);

      await act(() => {
        // Trigger scroll event to update render context
        virtualScroller!.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        // All 7 column headers should be visible since viewport is wider than columns
        expect(screen.queryByText('ID')).not.to.equal(null);
        expect(screen.queryByText('Name')).not.to.equal(null);
      });

      // All cells in first row should be rendered (no columns skipped)
      await waitFor(() => {
        expect(getCell(0, 0).textContent).to.equal('0');
        expect(getCell(0, 1).textContent).to.equal('Name 0');
      });
    });
  });
});
