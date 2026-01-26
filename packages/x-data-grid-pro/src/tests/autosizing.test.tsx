import * as React from 'react';
import { createRenderer, act, fireEvent } from '@mui/internal-test-utils';
import { RefObject } from '@mui/x-internals/types';
import {
  DataGridProProps,
  useGridApiRef,
  DataGridPro,
  GridApi,
  gridClasses,
} from '@mui/x-data-grid-pro';
import { getColumnHeaderCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Columns Autosizing Min/Max', () => {
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
  describe.skipIf(isJSDOM)('autosizing min/max', () => {
    it('should respect autoSizingMinSize', async () => {
      const columns = [{ field: 'id', autoSizingMinSize: 200 }, { field: 'brand' }];
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

    it('should ignore minWidth in favor of autoSizingMinSize during autosizing', async () => {
      const columns = [{ field: 'id', minWidth: 250, autoSizingMinSize: 200 }, { field: 'brand' }];
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

    it('should respect minWidth if autoSizingMinSize is not set', async () => {
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

    it('should NOT respect autoSizingMinSize/MaxSize during manual resizing', async () => {
      const columns = [
        { field: 'id', width: 100, autoSizingMinSize: 150, autoSizingMaxSize: 200 },
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

      // Should be 50, ignoring autoSizingMinSize (150)
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '50px' });
    });
  });
});
