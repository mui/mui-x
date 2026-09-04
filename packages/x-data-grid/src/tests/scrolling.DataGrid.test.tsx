import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';
import { describe, it, expect } from 'vitest';
import type { GridApiCommunity } from '../models/api/gridApiCommunity';

describe('<DataGrid /> - Scrolling', () => {
  const { render } = createRenderer();

  describe('apiRef: scrollToIndexes', () => {
    it('should accept a row index in the current page', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 200 }}>
          <DataGrid
            apiRef={apiRef}
            columns={[{ field: 'id' }]}
            rows={Array.from({ length: 6 }, (_, id) => ({ id }))}
            paginationModel={{ page: 1, pageSize: 3 }}
            pageSizeOptions={[3]}
          />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 5 });
      }).not.toWarnDev();
      expect(result).to.equal(true);
    });

    it('should warn when the row index is outside the current page', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            apiRef={apiRef}
            columns={[{ field: 'id' }]}
            rows={Array.from({ length: 6 }, (_, id) => ({ id }))}
            paginationModel={{ page: 1, pageSize: 3 }}
            pageSizeOptions={[3]}
          />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 0 });
      }).toWarnDev(
        [
          'MUI X: The `rowIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 3 and 5 for the current page.',
        ].join('\n'),
      );
      expect(result).to.equal(false);
    });

    it('should warn when the column index is out of bounds', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid apiRef={apiRef} columns={[{ field: 'id' }]} rows={[{ id: 1 }]} />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ colIndex: 1 });
      }).toWarnDev(
        [
          'MUI X: The `colIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 0 and 0.',
        ].join('\n'),
      );
      expect(result).to.equal(false);
    });

    it('should warn for a non-integer row index', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid apiRef={apiRef} columns={[{ field: 'id' }]} rows={[{ id: 1 }]} />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 0.5 });
      }).toWarnDev(
        [
          'MUI X: The `rowIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 0 and 0 for the current page.',
        ].join('\n'),
      );
      expect(result).to.equal(false);
    });

    it('should warn for a negative row index', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid apiRef={apiRef} columns={[{ field: 'id' }]} rows={[{ id: 1 }]} />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: -1 });
      }).toWarnDev(
        [
          'MUI X: The `rowIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 0 and 0 for the current page.',
        ].join('\n'),
      );
      expect(result).to.equal(false);
    });

    it('should validate the row index against the current page in server mode', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            apiRef={apiRef}
            columns={[{ field: 'id' }]}
            // Server mode only holds the rows of the current page, indexed from `page * pageSize`.
            rows={[{ id: 3 }, { id: 4 }, { id: 5 }]}
            rowCount={6}
            paginationMode="server"
            paginationModel={{ page: 1, pageSize: 3 }}
            pageSizeOptions={[3]}
          />
        </div>,
      );

      expect(() => {
        apiRef.current?.scrollToIndexes({ rowIndex: 3 });
      }).not.toWarnDev();

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 0 });
      }).toWarnDev(
        [
          'MUI X: The `rowIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 3 and 5 for the current page.',
        ].join('\n'),
      );
      expect(result).to.equal(false);
    });

    it('should not warn when navigating with the keyboard in server mode', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={[{ field: 'id' }]}
            rows={[{ id: 3 }, { id: 4 }, { id: 5 }]}
            rowCount={6}
            paginationMode="server"
            paginationModel={{ page: 1, pageSize: 3 }}
            pageSizeOptions={[3]}
          />
        </div>,
      );

      await user.click(getCell(0, 0));
      await expect(() => user.keyboard('{ArrowDown}')).not.toWarnDev();
    });
  });
});
