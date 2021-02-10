import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import { expect } from 'chai';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import {
  COMFORTABLE_DENSITY_FACTOR,
  COMPACT_DENSITY_FACTOR,
} from 'packages/grid/_modules_/grid/hooks/features/density/useDensity';

describe('<DataGrid /> - Toolbar', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [
      {
        field: 'id',
      },
      {
        field: 'brand',
      },
    ],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  describe('Density selector', () => {
    it('should increase grid density when selecting compact density', () => {
      const rowHeight = 30;
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            showToolbar
            components={{
              Toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireEvent.click(getByText('Density'));
      fireEvent.click(getByText('Compact'));

      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMPACT_DENSITY_FACTOR)}px`,
      });
    });

    it('should decrease grid density when selecting comfortable density', () => {
      const rowHeight = 30;
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            showToolbar
            components={{
              Toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireEvent.click(getByText('Density'));
      fireEvent.click(getByText('Comfortable'));

      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMFORTABLE_DENSITY_FACTOR)}px`,
      });
    });

    it('should increase grid density even if toolbar is not enabled', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} rowHeight={rowHeight} density="compact" />
        </div>,
      );

      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMPACT_DENSITY_FACTOR)}px`,
      });
    });

    it('should decrease grid density even if toolbar is not enabled', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} rowHeight={rowHeight} density="comfortable" />
        </div>,
      );

      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMFORTABLE_DENSITY_FACTOR)}px`,
      });
    });
  });

  describe('Column selector', () => {
    it('should hide "id" column when hiding it from the column selector', () => {
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            components={{
              Toolbar: GridToolbar,
            }}
            showToolbar
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(getByText('Columns'));
      fireEvent.click(document.querySelector('[role="tooltip"] [name="id"]'));

      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should hide all columns when clicking "HIDE ALL" from the column selector', () => {
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            components={{
              Toolbar: GridToolbar,
            }}
            showToolbar
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(getByText('Columns'));
      fireEvent.click(getByText('Hide All'));

      expect(getColumnHeadersTextContent()).to.deep.equal([]);
    });

    it('should show all columns when clicking "SHOW ALL" from the column selector', () => {
      const customColumns = [
        {
          field: 'id',
          hide: true,
        },
        {
          field: 'brand',
          hide: true,
        },
      ];

      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={customColumns}
            components={{
              Toolbar: GridToolbar,
            }}
            showToolbar
          />
        </div>,
      );

      fireEvent.click(getByText('Columns'));
      fireEvent.click(getByText('Show All'));

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
    });
  });
});
