import * as React from 'react';
import { createRenderer, fireEvent, screen, act } from '@mui-internal/test-utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import { expect } from 'chai';
import {
  DataGrid,
  DataGridProps,
  GridToolbar,
  gridClasses,
  GridColumnsPanelProps,
} from '@mui/x-data-grid';
import {
  COMFORTABLE_DENSITY_FACTOR,
  COMPACT_DENSITY_FACTOR,
} from '../hooks/features/density/useGridDensity';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Toolbar', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
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

  describe('density selector', () => {
    it('should increase grid density when selecting compact density', () => {
      const rowHeight = 30;
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireEvent.click(getByText('Density'));
      clock.tick(100);
      fireEvent.click(getByText('Compact'));

      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMPACT_DENSITY_FACTOR)}px`,
      });

      expect(screen.getAllByRole('cell')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMPACT_DENSITY_FACTOR)}px`,
      });
    });

    it('should decrease grid density when selecting comfortable density', () => {
      const rowHeight = 30;
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireEvent.click(getByText('Density'));
      fireEvent.click(getByText('Comfortable'));

      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMFORTABLE_DENSITY_FACTOR)}px`,
      });

      expect(screen.getAllByRole('cell')[1]).toHaveInlineStyle({
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

      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMPACT_DENSITY_FACTOR)}px`,
      });

      expect(screen.getAllByRole('cell')[1]).toHaveInlineStyle({
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

      expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMFORTABLE_DENSITY_FACTOR)}px`,
      });

      expect(screen.getAllByRole('cell')[1]).toHaveInlineStyle({
        maxHeight: `${Math.floor(rowHeight * COMFORTABLE_DENSITY_FACTOR)}px`,
      });
    });

    it('should apply to the root element a class corresponding to the current density', () => {
      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }
      const { setProps } = render(<Test />);
      expect(screen.getByRole('grid')).to.have.class(gridClasses['root--densityStandard']);
      setProps({ density: 'compact' });
      expect(screen.getByRole('grid')).to.have.class(gridClasses['root--densityCompact']);
      setProps({ density: 'comfortable' });
      expect(screen.getByRole('grid')).to.have.class(gridClasses['root--densityComfortable']);
    });
  });

  describe('column selector', () => {
    it('should hide "id" column when hiding it from the column selector', () => {
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(getByText('Columns'));
      fireEvent.click(screen.getByRole('tooltip').querySelector('[name="id"]')!);

      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should hide all columns when clicking "HIDE ALL" from the column selector', () => {
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(getByText('Columns'));
      fireEvent.click(getByText('Hide all'));

      expect(getColumnHeadersTextContent()).to.deep.equal([]);
    });

    it('should show all columns when clicking "SHOW ALL" from the column selector', () => {
      const customColumns = [
        {
          field: 'id',
        },
        {
          field: 'brand',
        },
      ];

      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={customColumns}
            slots={{
              toolbar: GridToolbar,
            }}
            initialState={{
              columns: {
                columnVisibilityModel: { id: false, brand: false },
              },
            }}
          />
        </div>,
      );

      fireEvent.click(getByText('Columns'));
      fireEvent.click(getByText('Show all'));

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
    });

    it('should keep the focus on the switch after toggling a column', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>,
      );

      const button = screen.getByRole('button', { name: 'Select columns' });
      act(() => button.focus());
      fireEvent.click(button);

      const column: HTMLElement = screen.getByRole('tooltip').querySelector('[name="id"]')!;
      act(() => column.focus());
      fireEvent.click(column);

      expect(column).toHaveFocus();
    });

    it('should allow to override search predicate function', () => {
      const customColumns = [
        {
          field: 'id',
          description: 'test',
        },
        {
          field: 'brand',
        },
      ];

      const columnSearchPredicate: GridColumnsPanelProps['searchPredicate'] = (
        column,
        searchValue,
      ) => {
        return (
          (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1 ||
          (column.description || '').toLowerCase().indexOf(searchValue) > -1
        );
      };

      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={customColumns}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              columnsPanel: {
                searchPredicate: columnSearchPredicate,
              },
            }}
          />
        </div>,
      );

      fireEvent.click(getByText('Columns'));

      const searchInput = document.querySelector('input[type="text"]')!;
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(document.querySelector('[role="tooltip"] [name="id"]')).not.to.equal(null);
    });
  });
});
