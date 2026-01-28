import * as React from 'react';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { RefObject } from '@mui/x-internals/types';
import {
  DataGridProProps,
  useGridApiRef,
  DataGridPro,
  gridClasses,
  GridApi,
  GridAutosizeOptions,
} from '@mui/x-data-grid-pro';
import { getColumnHeaderCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Autosizing', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Lululemon Athletica' },
    ],
  };

  function Test(props: DataGridProProps & { width?: number; height?: number }) {
    apiRef = useGridApiRef();
    const { width = 300, height = 500, ...otherProps } = props;
    return (
      <div style={{ width, height }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...otherProps} />
      </div>
    );
  }

  const getWidths = (columns: any[]) => {
    return columns.map((_, i) => parseInt(getColumnHeaderCell(i).style.width, 10));
  };

  // Need layouting
  describe.skipIf(isJSDOM)('autosizing', () => {
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Lululemon Athletica' },
    ];
    const columns = [
      { field: 'id', headerName: 'This is the ID column' },
      { field: 'brand', headerName: 'This is the brand column' },
    ];

    const getWidthsLocal = () => {
      return columns.map((_, i) => parseInt(getColumnHeaderCell(i).style.width, 10));
    };

    it('should work through the API', async () => {
      render(<Test rows={rows} columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      expect(getWidthsLocal()).to.deep.equal([152, 174]);
    });

    it('should work through double-clicking the separator', async () => {
      const { user } = render(<Test rows={rows} columns={columns} />);
      const separator = document.querySelectorAll(
        `.${gridClasses['columnSeparator--resizable']}`,
      )[1];
      await user.dblClick(separator);
      await waitFor(() => {
        expect(getWidthsLocal()).to.deep.equal([100, 174]);
      });
    });

    it('should work on mount', async () => {
      render(<Test rows={rows} columns={columns} autosizeOnMount />);
      await waitFor(() => {
        expect(getWidthsLocal()).to.deep.equal([152, 174]);
      });
    });

    it('should work with flex columns', async () => {
      const { user } = render(
        <Test
          rows={rows}
          columns={[
            { field: 'id', flex: 1 },
            { field: 'brand', flex: 2 },
          ]}
        />,
      );
      const separators = document.querySelectorAll(`.${gridClasses['columnSeparator--resizable']}`);
      await user.dblClick(separators[0]);

      await waitFor(() => {
        expect(columns.map((_, i) => getColumnHeaderCell(i).offsetWidth)).to.deep.equal([50, 248]);
      });

      await user.dblClick(separators[1]);
      await waitFor(() => {
        expect(columns.map((_, i) => getColumnHeaderCell(i).offsetWidth)).to.deep.equal([50, 63]);
      });
    });

    it('should work with custom column header sort icon', async () => {
      const iconSize = 24;
      const gap = 2;
      const paddingX = 20;
      function CustomSortIcon() {
        return <span style={{ width: iconSize, flex: 'none' }}>⇅</span>;
      }
      render(
        <Test
          rows={rows}
          columns={columns}
          slots={{
            columnHeaderSortIcon: CustomSortIcon,
          }}
        />,
      );
      await act(async () => apiRef.current?.autosizeColumns());

      // Cell structure: |← padding →|← text →|← gap →|← icon →|← padding →|
      expect(getWidthsLocal()).to.deep.equal([
        paddingX + 132 + gap + iconSize, // `132` is the width of the text "This is the ID column"
        paddingX + 154 + gap + iconSize, // `154` is the width of the text "This is the brand column"
      ]);
    });

    describe('options', () => {
      const autosize = async (options: GridAutosizeOptions | undefined, widths: number[]) => {
        render(<Test rows={rows} columns={columns} />);
        await act(async () =>
          apiRef.current?.autosizeColumns({ includeHeaders: false, ...options }),
        );
        await waitFor(() => {
          expect(getWidthsLocal()).to.deep.equal(widths);
        });
      };

      it('.columns works', async () => {
        await autosize({ columns: [columns[0].field] }, [50, 100]);
      });

      it('.includeHeaders works', async () => {
        await autosize({ includeHeaders: true }, [152, 174]);
      });

      it('.includeOutliers works', async () => {
        await autosize({ includeOutliers: true }, [50, 141]);
      });

      it('.outliersFactor works', async () => {
        await autosize({ outliersFactor: 40 }, [50, 141]);
      });

      it('.expand works', async () => {
        // These values are tuned to Ubuntu/Chromium and might be flaky in other environments
        await autosize({ expand: true }, [142, 155]);
      });

      it('.includeHeaderFilters works', async () => {
        render(
          <Test
            rows={rows}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                maxWidth: 200, // the `maxWidth` is to prevent flaky test due to different input widths between local and CI.
              },
            ]}
            headerFilters
          />,
        );
        await act(async () => apiRef.current?.autosizeColumns({ includeHeaderFilters: true }));
        await waitFor(() => {
          expect(parseInt(getColumnHeaderCell(0).style.width, 10)).to.deep.equal(200);
        });
      });
    });
  });

  // Need layouting
  describe.skipIf(isJSDOM)('autosizing min/max', () => {
    it('should respect autoSizingMinWidth', async () => {
      const columns = [{ field: 'id', autoSizingMinWidth: 200 }, { field: 'brand' }];
      render(<Test columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      // 'id' column would normally be smaller, but should be at least 200
      expect(getWidths(columns)[0]).to.equal(200);
    });

    it('should respect autoSizingMaxSize', async () => {
      const columns = [{ field: 'id' }, { field: 'brand', autoSizingMaxSize: 100 }];
      render(<Test columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      // 'brand' column "Lululemon Athletica" would normally be > 100, but should be capped at 100
      expect(getWidths(columns)[1]).to.equal(100);
    });

    it('should ignore minWidth in favor of autoSizingMinWidth during autosizing', async () => {
      const columns = [{ field: 'id', minWidth: 250, autoSizingMinWidth: 200 }, { field: 'brand' }];
      render(<Test columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      // should be 200, not 250
      expect(getWidths(columns)[0]).to.equal(200);
    });

    it('should ignore maxWidth in favor of autoSizingMaxSize during autosizing', async () => {
      const columns = [{ field: 'id' }, { field: 'brand', maxWidth: 50, autoSizingMaxSize: 100 }];
      render(<Test columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      // should be 100, not 50
      expect(getWidths(columns)[1]).to.equal(100);
    });

    it('should respect minWidth if autoSizingMinWidth is not set', async () => {
      const columns = [{ field: 'id', minWidth: 200 }, { field: 'brand' }];
      render(<Test columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      expect(getWidths(columns)[0]).to.equal(200);
    });

    it('should respect maxWidth if autoSizingMaxSize is not set', async () => {
      const columns = [{ field: 'id' }, { field: 'brand', maxWidth: 100 }];
      render(<Test columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      expect(getWidths(columns)[1]).to.equal(100);
    });

    it('should NOT respect autoSizingMinWidth/MaxSize during manual resizing', async () => {
      const columns = [
        { field: 'id', width: 100, autoSizingMinWidth: 150, autoSizingMaxSize: 200 },
        { field: 'brand' },
      ];
      render(<Test columns={columns} />);
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;

      // Manual resize to 250px
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 250, buttons: 1 });
      fireEvent.mouseUp(separator);

      // Should be 250, ignoring autoSizingMaxSize (200)
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '250px' });

      // Manual resize to 50px
      fireEvent.mouseDown(separator, { clientX: 250 });
      fireEvent.mouseMove(separator, { clientX: 50, buttons: 1 });
      fireEvent.mouseUp(separator);

      // Should be 50, ignoring autoSizingMinWidth (150)
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '50px' });
    });
  });
});
