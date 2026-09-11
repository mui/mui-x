import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
import { getCell, spyApi } from 'test/utils/helperFn';
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

    it('should still scroll the valid axis when the other index is invalid', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 200 }}>
          <DataGrid
            apiRef={apiRef}
            columns={[{ field: 'id' }]}
            rows={Array.from({ length: 50 }, (_, id) => ({ id }))}
            paginationModel={{ page: 0, pageSize: 50 }}
            pageSizeOptions={[50]}
          />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 40, colIndex: 99 });
      }).toWarnDev(
        [
          'MUI X: The `colIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 0 and 0.',
        ].join('\n'),
      );
      expect(result).to.equal(true);
      expect(apiRef.current?.getScrollPosition().top).to.be.greaterThan(0);
    });

    it('should warn about both axes when both indexes are invalid', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid apiRef={apiRef} columns={[{ field: 'id' }]} rows={[{ id: 1 }]} />
        </div>,
      );

      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 5, colIndex: 5 });
      }).toWarnDev([
        [
          'MUI X: The `rowIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 0 and 0 for the current page.',
        ].join('\n'),
        [
          'MUI X: The `colIndex` value passed to `scrollToIndexes` is invalid.',
          'Use an integer between 0 and 0.',
        ].join('\n'),
      ]);
      expect(result).to.equal(false);
    });

    it('should treat a `null` row index as a header scroll', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid apiRef={apiRef} columns={[{ field: 'id' }]} rows={[{ id: 1 }]} />
        </div>,
      );

      expect(() => {
        apiRef.current?.scrollToIndexes({ rowIndex: null as any, colIndex: 0 });
      }).not.toWarnDev();
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

      const getCellColSpanInfo = spyApi(apiRef.current!, 'unstable_getCellColSpanInfo');

      expect(() => {
        apiRef.current?.scrollToIndexes({ rowIndex: 3, colIndex: 0 });
      }).not.toWarnDev();
      expect(getCellColSpanInfo.mock.lastCall?.[0]).to.equal(3);

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

    it('should scroll to the page offset in server mode', () => {
      const apiRef = React.createRef<GridApiCommunity>();

      render(
        <div style={{ width: 300, height: 200 }}>
          <DataGrid
            apiRef={apiRef}
            columns={[{ field: 'id' }]}
            rows={[{ id: 3 }, { id: 4 }, { id: 5 }]}
            rowCount={6}
            paginationMode="server"
            paginationModel={{ page: 1, pageSize: 3 }}
            pageSizeOptions={[3]}
          />
        </div>,
      );

      // `rowIndex` is absolute, so the last loaded row is index 5 and sits at position 2 of
      // the page. Without the offset the lookup would fall off the end of `rowsMeta`.
      let result: boolean | undefined;
      expect(() => {
        result = apiRef.current?.scrollToIndexes({ rowIndex: 5 });
      }).not.toWarnDev();

      expect(result).to.equal(true);
      expect(apiRef.current?.getScrollPosition().top).to.be.greaterThan(0);
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
