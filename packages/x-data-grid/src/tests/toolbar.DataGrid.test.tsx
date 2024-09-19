import * as React from 'react';
import { createRenderer, fireEvent, screen, act } from '@mui/internal-test-utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import { expect } from 'chai';
import { DataGrid, GridToolbar, GridColumnsManagementProps } from '@mui/x-data-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Toolbar', () => {
  const { render } = createRenderer({ clock: 'fake' });

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

  describe('column selector', () => {
    it('should hide "id" column when hiding it from the column selector', () => {
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

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(screen.getByText('Columns'));
      fireEvent.click(screen.getByRole('tooltip').querySelector('[name="id"]')!);

      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should show and hide all columns when clicking "Show/Hide All" checkbox from the column selector', () => {
      const customColumns = [
        {
          field: 'id',
        },
        {
          field: 'brand',
        },
      ];

      render(
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

      fireEvent.click(screen.getByText('Columns'));
      const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
      fireEvent.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal([]);
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

      const columnSearchPredicate: GridColumnsManagementProps['searchPredicate'] = (
        column,
        searchValue,
      ) => {
        return (
          (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1 ||
          (column.description || '').toLowerCase().indexOf(searchValue) > -1
        );
      };

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={customColumns}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              columnsManagement: {
                searchPredicate: columnSearchPredicate,
              },
            }}
          />
        </div>,
      );

      fireEvent.click(screen.getByText('Columns'));

      const searchInput = document.querySelector('input[type="text"]')!;
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(document.querySelector('[role="tooltip"] [name="id"]')).not.to.equal(null);
    });
  });
});
