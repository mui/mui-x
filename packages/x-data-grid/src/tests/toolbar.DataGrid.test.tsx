import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import { expect } from 'chai';
import { DataGrid, GridColumnsManagementProps, Toolbar, ToolbarButton } from '@mui/x-data-grid';
import { isJSDOM } from 'test/utils/skipIf';

declare module '@mui/x-data-grid' {
  interface GridToolbarProps {
    items: string[];
  }
}

function CustomToolbar({ items = ['Item 1', 'Item 2', 'Item 3'] }: { items: string[] }) {
  return (
    <Toolbar>
      {items.map((item) => (
        <ToolbarButton key={item}>{item}</ToolbarButton>
      ))}
    </Toolbar>
  );
}

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

  describe('component', () => {
    it('should move focus to the next item when pressing ArrowRight', async () => {
      const { user } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 1' }).focus();
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should move focus to the previous item when pressing ArrowLeft', async () => {
      const { user } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 3' }).focus();
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });

    it('should focus on the first item when pressing Home key', async () => {
      const { user } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 1' }).focus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });

    it('should focus on the last item when pressing End key', async () => {
      const { user } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 3' }).focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should wrap to first item when pressing ArrowRight on last item', async () => {
      const { user } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 3' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });

    it('should wrap to last item when pressing ArrowLeft on first item', async () => {
      const { user } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 1' }).focus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should maintain focus position when an item is removed', async () => {
      const { setProps } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 2' }).focus();
      setProps({
        slotProps: {
          toolbar: { items: ['Item 1', 'Item 3'] },
        },
      });
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should maintain focus on the last item when the last item is removed', async () => {
      const { setProps } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 3' }).focus();
      setProps({
        slotProps: {
          toolbar: { items: ['Item 1', 'Item 2'] },
        },
      });
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
    });

    it('should preserve arrow key navigation after item removal', async () => {
      const { user, setProps } = render(
        <DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      screen.getByRole('button', { name: 'Item 1' }).focus();
      setProps({
        slotProps: {
          toolbar: { items: ['Item 1', 'Item 3'] },
        },
      });
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });
  });

  describe('column selector', () => {
    it('should hide "id" column when hiding it from the column selector', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} showToolbar />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      await user.click(screen.getByLabelText('Columns'));
      await user.click(document.querySelector('[role="tooltip"] [name="id"]')!);

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

      const column: HTMLElement = document.querySelector('[role="tooltip"] [name="id"]')!;
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
