import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import { expect } from 'chai';
import { DataGrid, GridColumnsManagementProps } from '@mui/x-data-grid';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGrid /> - Toolbar', () => {
  const { render } = createRenderer();

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
    it('should hide "id" column when hiding it from the column selector', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} showToolbar />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      await user.click(screen.getByLabelText('Columns'));
      await user.click(screen.getByRole('tooltip').querySelector('[name="id"]')!);

      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should show and hide all columns when clicking "Show/Hide All" checkbox from the column selector', async () => {
      const customColumns = [
        {
          field: 'id',
        },
        {
          field: 'brand',
        },
      ];

      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={customColumns}
            showToolbar
            initialState={{
              columns: {
                columnVisibilityModel: { id: false, brand: false },
              },
            }}
          />
        </div>,
      );

      await user.click(screen.getByLabelText('Columns'));
      const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });
      await user.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
      await user.click(showHideAllCheckbox);
      expect(getColumnHeadersTextContent()).to.deep.equal([]);
    });

    it('should keep the focus on the switch after toggling a column', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} showToolbar />
        </div>,
      );

      const button = screen.getByRole('button', { name: 'Columns' });
      await user.click(button);

      const column: HTMLElement = screen.getByRole('tooltip').querySelector('[name="id"]')!;
      await user.click(column);

      expect(column).toHaveFocus();
    });

    it('should allow to override search predicate function', async () => {
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

      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={customColumns}
            showToolbar
            slotProps={{
              columnsManagement: {
                searchPredicate: columnSearchPredicate,
              },
            }}
          />
        </div>,
      );

      await user.click(screen.getByLabelText('Columns'));

      const searchInput = document.querySelector('input[type="search"]')!;
      await user.type(searchInput, 'test');

      expect(document.querySelector('[role="tooltip"] [name="id"]')).not.to.equal(null);
    });
  });
});
