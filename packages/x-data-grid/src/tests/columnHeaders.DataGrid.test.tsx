import { createRenderer, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
import { getColumnHeaderCell, getColumnHeadersTextContent } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Column headers', () => {
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
  };

  describe('headerClassName', () => {
    it('should append the CSS class defined in headerClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} columns={[{ field: 'brand', headerClassName: 'foobar' }]} />
        </div>,
      );
      expect(getColumnHeaderCell(0)).to.have.class('foobar');
    });

    it('should append the CSS class returned by headerClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'brand', headerClassName: () => 'foobar' }]}
          />
        </div>,
      );
      expect(getColumnHeaderCell(0)).to.have.class('foobar');
    });
  });

  describe('Column menu', () => {
    it('should allow to hide column', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar' }]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
      await user.click(screen.getByRole('menuitem', { name: 'Hide column' }));

      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should not render the column menu icon when the column menu has no items', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            disableColumnSelector
            columns={[
              { field: 'id', filterable: false, sortable: false, hideable: false },
              { field: 'brand' },
            ]}
          />
        </div>,
      );

      expect(within(getColumnHeaderCell(0)).queryByLabelText('id column menu')).to.equal(null);
      expect(within(getColumnHeaderCell(1)).queryByLabelText('brand column menu')).not.to.equal(
        null,
      );
    });

    it('should render the column menu icon when there is a custom menu item', async () => {
      function CustomMenuItem() {
        return <li>Custom Item</li>;
      }

      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            disableColumnSelector
            columns={[
              { field: 'id', filterable: false, sortable: false, hideable: false },
              { field: 'brand' },
            ]}
            slotProps={{
              columnMenu: {
                slots: {
                  columnMenuCustomItem: CustomMenuItem,
                },
              },
            }}
          />
        </div>,
      );

      // The 'id' column now has a custom menu item, so the icon should be rendered
      expect(within(getColumnHeaderCell(0)).queryByLabelText('id column menu')).not.to.equal(null);
      expect(within(getColumnHeaderCell(1)).queryByLabelText('brand column menu')).not.to.equal(
        null,
      );

      // Open the column menu and verify the custom item is shown
      await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
      expect(screen.getByText('Custom Item')).not.to.equal(null);
    });

    it('should not allow to hide the only visible column', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar' }]}
            initialState={{
              columns: {
                columnVisibilityModel: { brand: false },
              },
            }}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
      await user
        .setup({ pointerEventsCheck: 0 })
        .click(screen.getByRole('menuitem', { name: 'Hide column' }));

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should not allow to hide the only visible column that has menu', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[
              { field: 'id', disableColumnMenu: true },
              { field: 'brand', headerClassName: 'foobar' },
            ]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      await user.click(within(getColumnHeaderCell(1)).getByLabelText('brand column menu'));
      await user
        .setup({ pointerEventsCheck: 0 })
        .click(screen.getByRole('menuitem', { name: 'Hide column' }));

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
    });

    it('menu icon button should close column menu when already open', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );

      await user.click(within(getColumnHeaderCell(0)).getByLabelText('brand column menu'));
      expect(screen.queryByRole('menu')).not.to.equal(null);

      await user.click(within(getColumnHeaderCell(0)).getByLabelText('brand column menu'));
      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
    });

    it('should prevent wheel scroll event from closing the menu when scrolling within the menu', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );

      await user.click(within(getColumnHeaderCell(0)).getByLabelText('brand column menu'));
      const menu = screen.getByRole('menu');

      fireEvent.wheel(menu);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.to.equal(null);
      });
    });

    it('should close the column menu when the grid is scrolled', async () => {
      const { user } = render(
        <div style={{ height: 300, width: 300 }}>
          <DataGrid
            rows={Array.from({ length: 50 }, (_, id) => ({ id, name: id }))}
            columns={[{ field: 'brand' }]}
          />
        </div>,
      );

      await user.click(within(getColumnHeaderCell(0)).getByLabelText('brand column menu'));

      const scroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      fireEvent.wheel(scroller, { deltaY: 120 });

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
    });

    it('column menu should open in response to the Ctrl+Enter hotkey', async () => {
      const { user } = render(
        <div style={{ height: 300, width: 300 }}>
          <DataGrid
            rows={Array.from({ length: 50 }, (_, id) => ({ id, name: id }))}
            columns={[{ field: 'brand' }]}
          />
        </div>,
      );

      expect(screen.queryByRole('tooltip')).to.equal(null);

      await user.keyboard('{Tab}');
      expect(screen.getAllByRole('columnheader')[0]).toHaveFocus();

      await user.keyboard('{Control>}{Enter}');
      expect(screen.queryByRole('tooltip')).to.not.equal(null);
    });
  });

  it("should use 'headerName' as the aria-label for the menu icon button", async () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          disableColumnSorting
          columns={[{ headerName: 'brand header name', field: 'brand' }]}
        />
      </div>,
    );
    expect(await screen.findByLabelText('brand header name column menu')).not.to.equal(null);
  });

  it('should display sort column menu items as per sortingOrder prop', async () => {
    const { user } = render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          sortingOrder={['desc', 'asc']}
          columns={[{ field: 'brand', headerClassName: 'foobar' }]}
        />
      </div>,
    );
    const columnCell = getColumnHeaderCell(0);
    const menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]')!;
    await user.click(menuIconButton);

    expect(screen.queryByRole('menuitem', { name: /asc/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: /desc/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: /unsort/i })).to.equal(null);
  });

  it('should use baseTooltip slot for sort icon', () => {
    function CustomTooltip({ title, children, enterDelay, ...other }: any) {
      return (
        <div data-testid="custom-tooltip" data-title={title} {...other}>
          {children}
        </div>
      );
    }

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          columns={[{ field: 'id', sortable: true }]}
          rows={[{ id: 1 }]}
          initialState={{
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }],
            },
          }}
          slots={{
            baseTooltip: CustomTooltip,
          }}
        />
      </div>,
    );

    const sortButton = screen.getByRole('grid').querySelector('.MuiDataGrid-sortButton')!;
    const tooltip = sortButton.closest('[data-testid="custom-tooltip"]');

    expect(tooltip).not.to.equal(null);
    expect(tooltip!.getAttribute('data-title')).to.equal('Sort');
    expect(sortButton.getAttribute('title')).to.equal(null);
  });
});
