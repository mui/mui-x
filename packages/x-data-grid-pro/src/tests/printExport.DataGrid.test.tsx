import type { RefObject } from '@mui/x-internals/types';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import type { GridApi, DataGridProProps } from '@mui/x-data-grid-pro';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { createRenderer, screen, fireEvent, act } from '@mui/internal-test-utils';
import { vi, describe, it, expect, onTestFinished } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Print export', () => {
  const { render } = createRenderer();

  const NB_ROWS = 2;
  const defaultData = getBasicGridData(NB_ROWS, 2);
  let apiRef: RefObject<GridApi | null>;

  const baselineProps = {
    ...defaultData,
    // A hack to remove the warning on print
    pageSizeOptions: [NB_ROWS, 100],
  };

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

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

  describe('Export toolbar', () => {
    it('should display print button by default', () => {
      render(<Test showToolbar />);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Print' })).not.to.equal(null);
    });

    it('should disable print export when passing `printOptions.disableToolbarButton`', () => {
      render(
        <Test
          showToolbar
          slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Print' })).to.equal(null);
    });
  });

  describe('column visibility with initialState', () => {
    allBooleanConfigurations.forEach(({ printVisible, gridVisible }) => {
      it(`should have 'currencyPair' ${printVisible ? "'visible'" : "'hidden'"} in print and ${
        gridVisible ? "'visible'" : "'hidden'"
      } in screen`, async () => {
        const onColumnVisibilityModelChange = vi.fn();

        render(
          <Test
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  currencyPair: gridVisible,
                  id: false,
                },
              },
            }}
          />,
        );

        expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(0);

        await act(() =>
          apiRef.current?.exportDataAsPrint({
            fields: printVisible ? ['currencyPair', 'id'] : ['id'],
          }),
        );

        expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(2);
        // verify column visibility has been set
        expect(onColumnVisibilityModelChange.mock.calls[0][0]).to.deep.equal({
          currencyPair: printVisible,
          id: true,
        });

        // verify column visibility has been restored
        expect(onColumnVisibilityModelChange.mock.calls[1][0]).to.deep.equal({
          currencyPair: gridVisible,
          id: false,
        });
      });
    });
  });

  describe('columns to print', () => {
    it(`should ignore 'allColumns' if 'fields' is provided`, async () => {
      const onColumnVisibilityModelChange = vi.fn();

      render(<Test onColumnVisibilityModelChange={onColumnVisibilityModelChange} />);

      expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(0);

      await act(() => apiRef.current?.exportDataAsPrint({ fields: ['id'], allColumns: true }));

      expect(onColumnVisibilityModelChange.mock.calls[0][0]).to.deep.equal({
        currencyPair: false,
        id: true,
      });
    });

    it(`should ignore 'disableExport' if 'fields' is provided`, async () => {
      const onColumnVisibilityModelChange = vi.fn();

      render(
        <Test
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          columns={[{ field: 'currencyPair' }, { field: 'id', disableExport: true }]}
        />,
      );

      expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(0);

      await act(() => apiRef.current?.exportDataAsPrint({ fields: ['id'], allColumns: true }));

      expect(onColumnVisibilityModelChange.mock.calls[0][0]).to.deep.equal({
        currencyPair: false,
        id: true,
      });
    });

    it(`should apply 'disableExport' even if 'allColumns' is set`, async () => {
      const onColumnVisibilityModelChange = vi.fn();

      render(
        <Test
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          columns={[{ field: 'currencyPair' }, { field: 'id', disableExport: true }]}
        />,
      );

      expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(0);

      await act(() => apiRef.current?.exportDataAsPrint({ allColumns: true }));

      expect(onColumnVisibilityModelChange.mock.calls[0][0]).to.deep.equal({
        currencyPair: true,
        id: false,
      });
    });

    it(`should print hidden columns if 'allColumns' set to true`, async () => {
      const onColumnVisibilityModelChange = vi.fn();

      render(
        <Test
          columnVisibilityModel={{ id: false }}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          columns={[{ field: 'currencyPair' }, { field: 'id' }]}
        />,
      );

      expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(0);

      await act(() => apiRef.current?.exportDataAsPrint({ allColumns: true }));

      expect(onColumnVisibilityModelChange.mock.calls[0][0]).to.deep.equal({
        currencyPair: true,
        id: true,
      });
    });
  });

  describe('stylesheets that fail to load', () => {
    function addMissingStylesheet() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/missing-stylesheet.css';
      document.head.appendChild(link);
      onTestFinished(() => link.remove());
    }

    /* Browsers fire `error` for the missing stylesheet on their own, JSDOM doesn't load resources. */
    async function failStylesheetLoad() {
      if (!isJSDOM) {
        return;
      }

      let link: HTMLLinkElement | null | undefined;
      while (!link) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
        link = document.querySelector('iframe')?.contentDocument?.head.querySelector('link');
      }
      link.dispatchEvent(new Event('error'));
    }

    const initialState = {
      columns: { columnVisibilityModel: { currencyPair: true, id: false } },
    };

    it('rejects, restores the grid, and removes the print window when `onStylesheetError` throws', async () => {
      addMissingStylesheet();
      const onColumnVisibilityModelChange = vi.fn();
      const error = new Error('Stop the print');

      render(
        <Test
          initialState={initialState}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        />,
      );

      await act(async () => {
        const printPromise = apiRef.current!.exportDataAsPrint({
          fields: ['id'],
          onStylesheetError: () => {
            throw error;
          },
        });
        await failStylesheetLoad();
        await expect(printPromise).rejects.toBe(error);
      });

      expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(2);
      expect(onColumnVisibilityModelChange.mock.calls[1][0]).to.deep.equal({
        currencyPair: true,
        id: false,
      });
      expect(document.querySelector('iframe')).to.equal(null);
    });

    it('resolves and restores the grid when `onStylesheetError` returns', async () => {
      addMissingStylesheet();
      const onColumnVisibilityModelChange = vi.fn();
      const onStylesheetError = vi.fn();

      render(
        <Test
          initialState={initialState}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        />,
      );

      await act(async () => {
        const printPromise = apiRef.current!.exportDataAsPrint({
          fields: ['id'],
          onStylesheetError,
        });
        await failStylesheetLoad();
        await printPromise;
      });

      expect(onStylesheetError.mock.calls.length).to.equal(1);
      expect(onStylesheetError.mock.calls[0][0].getAttribute('href')).to.equal(
        '/missing-stylesheet.css',
      );
      expect(onColumnVisibilityModelChange.mock.calls.length).to.equal(2);
      expect(onColumnVisibilityModelChange.mock.calls[1][0]).to.deep.equal({
        currencyPair: true,
        id: false,
      });
      expect(document.querySelector('iframe')).to.equal(null);
    });
  });
});
