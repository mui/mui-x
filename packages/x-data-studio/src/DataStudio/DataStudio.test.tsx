import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import type { DataGridProps, GridDataSource } from '@mui/x-data-grid';
import { DataStudio } from './DataStudio';
import type {
  DataStudioDataGridProps,
  DataStudioDataSource,
  DataStudioToolbarComponent,
  DataStudioSheet,
  DataStudioJointSourceConfig,
} from './DataStudio.types';
import type { DataStudioJointSourcesPersistenceAdapter } from './jointSourcesPersistence';

const { render } = createRenderer();

const customerDataset: DataStudioDataSource = {
  id: 'customers',
  label: 'Customers',
  columns: [{ field: 'name', headerName: 'Name', width: 120 }],
  rows: [{ id: 1, name: 'Alice' }],
};

const productDataset: DataStudioDataSource = {
  id: 'products',
  label: 'Products',
  columns: [{ field: 'product', headerName: 'Product', width: 120 }],
  rows: [{ id: 1, product: 'Arabica' }],
};

function renderDataStudio(props: Partial<React.ComponentProps<typeof DataStudio>> = {}) {
  return render(
    <div style={{ width: 500, height: 300 }}>
      <DataStudio
        dataSources={[customerDataset, productDataset]}
        slotProps={{ dataGrid: { disableVirtualization: true } }}
        // Disable the default localStorage persistence in tests so view
        // mutations in one test don't bleed into the next (vitest runs with
        // `isolate: false` and shares the jsdom window between tests).
        sheetsPersistence={null}
        {...props}
      />
    </div>,
  );
}

describe('<DataStudio />', () => {
  it('renders the first dataSource by default', () => {
    renderDataStudio();

    expect(screen.getByText('Alice')).not.toBe(null);
    expect(screen.getByText('Data Sources')).not.toBe(null);
    expect(screen.getByRole('treeitem', { name: 'Customers' })).not.toBe(null);
  });

  it('switches dataSources using the sidebar tree', () => {
    renderDataStudio();

    fireEvent.click(screen.getByText('Products'));

    expect(screen.getByText('Arabica')).not.toBe(null);
    expect(screen.getByRole('treeitem', { name: 'Products' })).not.toBe(null);
  });

  it('calls onActiveDataSourceChange in controlled mode', () => {
    const handleActiveDatasetChange = vi.fn();

    renderDataStudio({
      activeDataSourceId: 'customers',
      onActiveDataSourceChange: handleActiveDatasetChange,
    });

    fireEvent.click(screen.getByText('Products'));

    expect(handleActiveDatasetChange).toHaveBeenCalledWith('products', productDataset);
  });

  it('passes Data Source props to the active Data Grid', async () => {
    const getRows = vi.fn<GridDataSource['getRows']>(async () => ({
      rows: [{ id: 1, name: 'Server row' }],
      rowCount: 1,
    }));

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          dataSources={[
            {
              id: 'remote',
              label: 'Remote',
              columns: [{ field: 'name', headerName: 'Name', width: 120 }],
              connector: { getRows },
              slotProps: {
                dataGrid: {
                  disableVirtualization: true,
                  initialState: {
                    pagination: { paginationModel: { page: 0, pageSize: 5 }, rowCount: 0 },
                  },
                  pageSizeOptions: [5],
                  pagination: true,
                },
              },
            },
          ]}
        />
      </div>,
    );

    await waitFor(() => {
      expect(getRows).toHaveBeenCalledTimes(1);
    });
  });

  it('renders the Composer (front door) when no dataSources are provided', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} />
      </div>,
    );

    expect(screen.getByText('Data Sources')).not.toBe(null);
    expect(screen.getByText('No data sources')).not.toBe(null);
    expect(screen.getByText('Sheets')).not.toBe(null);
    expect(screen.getByText('No sheets yet')).not.toBe(null);
    expect(screen.getByRole('button', { name: 'Add new sheet' })).toHaveProperty('disabled', true);
    // Composer renders in the main pane in place of the bare "No data source
    // selected" empty state.
    expect(screen.getByText('What would you like to build?')).not.toBe(null);
    expect(screen.getByRole('button', { name: 'Send prompt' })).toHaveProperty('disabled', true);
  });

  it('surfaces the built-in Spreadsheet template in the Composer with no props', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} />
      </div>,
    );

    // Default-on: the spreadsheet template card appears without passing
    // `sheetTemplates`. The card is a `<button>` with an explicit
    // `role="listitem"`, so it surfaces as a listitem, not a button.
    expect(
      screen.getByRole('listitem', { name: 'Create from Spreadsheet template' }),
    ).not.toBe(null);
  });

  it('creates a working Spreadsheet sheet from the built-in template (no viewTypes prop)', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} />
      </div>,
    );

    fireEvent.click(screen.getByRole('listitem', { name: 'Create from Spreadsheet template' }));

    // The new free-form sheet is added to the sidebar...
    expect(screen.getAllByRole('treeitem', { name: /Spreadsheet/ }).length).toBeGreaterThan(0);
    // ...and its built-in spreadsheet view type renders (the A column header
    // proves the spreadsheetViewType resolved without a `viewTypes` prop).
    expect(screen.getByRole('columnheader', { name: 'A' })).not.toBe(null);
    // Default A–H columns; no I yet.
    expect(screen.queryByRole('columnheader', { name: 'I' })).toBe(null);
  });

  it('adds a column and a row to a Spreadsheet via the in-view toolbar', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} />
      </div>,
    );

    fireEvent.click(screen.getByRole('listitem', { name: 'Create from Spreadsheet template' }));

    const rowCountBefore = screen.getAllByRole('row').length;

    fireEvent.click(screen.getByRole('button', { name: 'Add column' }));
    // The next lettered column (I) appears after A–H.
    expect(screen.getByRole('columnheader', { name: 'I' })).not.toBe(null);

    fireEvent.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getAllByRole('row').length).toBe(rowCountBefore + 1);
  });

  it('deletes the clicked cell column and row from a Spreadsheet', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} />
      </div>,
    );

    fireEvent.click(screen.getByRole('listitem', { name: 'Create from Spreadsheet template' }));

    const cellInColumn = (field: string) =>
      screen.getAllByRole('gridcell').find((cell) => cell.getAttribute('data-field') === field);

    // Delete is disabled until a cell is clicked.
    expect(screen.getByRole('button', { name: 'Delete column' })).toHaveProperty('disabled', true);

    // Click a B-column cell → Delete column removes B.
    fireEvent.click(cellInColumn('B')!);
    expect(screen.getByRole('button', { name: 'Delete column' })).toHaveProperty('disabled', false);
    fireEvent.click(screen.getByRole('button', { name: 'Delete column' }));
    expect(screen.queryByRole('columnheader', { name: 'B' })).toBe(null);
    expect(screen.getByRole('columnheader', { name: 'A' })).not.toBe(null);

    // Click a cell, then Delete row removes a row.
    const rowsBefore = screen.getAllByRole('row').length;
    fireEvent.click(cellInColumn('A')!);
    fireEvent.click(screen.getByRole('button', { name: 'Delete row' }));
    expect(screen.getAllByRole('row').length).toBe(rowsBefore - 1);
  });

  it('lets a function override remove a built-in template', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          dataSources={[]}
          sheetsPersistence={null}
          sheetTemplates={(defaults) => defaults.filter((template) => template.id !== 'spreadsheet')}
        />
      </div>,
    );

    expect(screen.queryByRole('listitem', { name: 'Create from Spreadsheet template' })).toBe(null);
    // With every template trimmed, the Composer shows its empty-state message.
    expect(screen.getByText(/No templates registered yet/)).not.toBe(null);
  });

  it('surfaces the built-in Pivot template only on the premium plan', () => {
    const { unmount } = render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} plan="premium" />
      </div>,
    );
    expect(screen.getByRole('listitem', { name: 'Create from Pivot table template' })).not.toBe(
      null,
    );
    unmount();

    // Community (default) plan: the pivot card is gated out.
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} />
      </div>,
    );
    expect(screen.queryByRole('listitem', { name: 'Create from Pivot table template' })).toBe(null);
  });

  it('creates a Pivot sheet bound to the Data Source from the preview action', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          dataSources={[customerDataset]}
          sheetsPersistence={null}
          plan="premium"
          slotProps={{ dataGrid: { disableVirtualization: true } }}
        />
      </div>,
    );

    // Previewing the Data Source shows the action bar; create the pivot.
    fireEvent.click(
      screen.getByRole('button', { name: 'Create a pivot table from this data source' }),
    );

    // A bound Pivot sheet is added and activated; the built-in pivotViewType
    // resolves (with no `viewTypes` prop) and renders a grid — not the
    // "No Data Source connected" empty state and not the unknown-type fallback.
    expect(screen.getAllByRole('treeitem', { name: /Pivot table/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole('grid')).not.toBe(null);
    expect(screen.queryByText('No Data Source connected')).toBe(null);
  });

  it('surfaces the built-in Chart template only on the premium plan', () => {
    const { unmount } = render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} plan="premium" />
      </div>,
    );
    expect(screen.getByRole('listitem', { name: 'Create from Chart template' })).not.toBe(null);
    unmount();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} sheetsPersistence={null} />
      </div>,
    );
    expect(screen.queryByRole('listitem', { name: 'Create from Chart template' })).toBe(null);
  });

  // The chart workspace mounts `ChartsRenderer`, which needs real layout / SVG
  // measurement and can't render under jsdom — exercise it in browser mode.
  it.skipIf(isJSDOM)(
    'creates a Chart sheet bound to the Data Source from the preview action',
    () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataStudio
            dataSources={[customerDataset]}
            sheetsPersistence={null}
            plan="premium"
            slotProps={{ dataGrid: { disableVirtualization: true } }}
          />
        </div>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Create a chart from this data source' }));

      // A bound Chart sheet is added and activated; the built-in chartViewType
      // resolves (no `viewTypes` prop) and mounts its workspace — not the
      // "No Data Source connected" empty state.
      expect(screen.getAllByRole('treeitem', { name: /Chart/ }).length).toBeGreaterThan(0);
      expect(screen.getByRole('grid')).not.toBe(null);
      expect(screen.queryByText('No Data Source connected')).toBe(null);
    },
  );

  it('renders data source shimmer while loading dataSources', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[]} loading />
      </div>,
    );

    expect(screen.getByText('Data Sources')).not.toBe(null);
    expect(screen.queryByText('No data sources')).toBe(null);
    expect(screen.getAllByTestId('data-source-skeleton')).toHaveLength(3);
  });

  it('uses the dataGrid slot and applies Data Studio grid defaults', () => {
    const CustomDataGrid = vi.fn(
      (props: DataStudioDataGridProps & { rows?: DataGridProps['rows'] }) => (
        <div data-testid="custom-grid">
          {props.showToolbar ? 'toolbar' : 'no toolbar'}{' '}
          {props.disableVirtualization === false ? 'virtualized' : 'not virtualized'}{' '}
          {props.rows?.[0].name}
        </div>
      ),
    );

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio dataSources={[customerDataset]} slots={{ dataGrid: CustomDataGrid }} />
      </div>,
    );

    expect(screen.getByTestId('custom-grid').textContent).toBe('no toolbar virtualized Alice');
    expect(CustomDataGrid).toHaveBeenCalled();
    expect(CustomDataGrid.mock.calls.at(-1)?.[0]).toMatchObject({
      // Data Studio owns the toolbar; the inner DataGrid's native toolbar is
      // disabled so the two don't render side-by-side.
      showToolbar: false,
      disableVirtualization: false,
      disableColumnFilter: false,
      disableColumnMenu: false,
      disableColumnSelector: false,
      disableDensitySelector: false,
      disableColumnSorting: false,
      lazyLoading: false,
      pagination: false,
      aggregationFunctions: expect.objectContaining({
        sum: {},
        avg: {},
        size: {},
      }),
      pivotingColDef: expect.any(Function),
    });
    expect(CustomDataGrid.mock.calls.at(-1)?.[0].pivotingColDef?.('amount', ['2026'])).toEqual({
      field: '2026>->amount',
      minWidth: 100,
      headerAlign: 'left',
      headerClassName: 'DataStudioPivotMeasureHeader',
      cellClassName: 'DataStudioPivotMeasureCell',
    });
  });

  it('renders the default Data Studio toolbar above the grid', () => {
    renderDataStudio();

    expect(screen.getByRole('toolbar', { name: 'Data Studio toolbar' })).not.toBe(null);
    // The toolbar may render two `placeholder="Search"` inputs: the visible
    // search field plus an off-screen ghost copy used for overflow
    // measurement. We only care that at least one renders.
    expect(screen.getAllByPlaceholderText('Search').length).toBeGreaterThan(0);
  });

  it('replaces the toolbar via slots.toolbar', () => {
    const CustomToolbar: DataStudioToolbarComponent = vi.fn(() => (
      <div data-testid="custom-toolbar">custom</div>
    ));

    renderDataStudio({ slots: { toolbar: CustomToolbar } });

    expect(screen.getByTestId('custom-toolbar')).not.toBe(null);
    expect(screen.queryByRole('toolbar', { name: 'Data Studio toolbar' })).toBe(null);
    expect(CustomToolbar).toHaveBeenCalled();
    expect((CustomToolbar as ReturnType<typeof vi.fn>).mock.calls.at(-1)?.[0]).toMatchObject({
      apiRef: expect.objectContaining({ current: expect.anything() }),
    });
  });

  it('forwards slotProps.toolbar to a custom toolbar', () => {
    const CustomToolbar = vi.fn((props: { label?: string }) => (
      <div data-testid="custom-toolbar">{props.label}</div>
    )) as unknown as DataStudioToolbarComponent;

    renderDataStudio({
      slots: { toolbar: CustomToolbar },
      slotProps: { toolbar: { className: 'studio-bar' } as any },
    });

    const node = screen.getByTestId('custom-toolbar');
    expect(node).not.toBe(null);
  });

  it('hides the toolbar when slots.toolbar is null', () => {
    renderDataStudio({ slots: { toolbar: null } });

    expect(screen.queryByRole('toolbar', { name: 'Data Studio toolbar' })).toBe(null);
    expect(screen.queryByPlaceholderText('Search')).toBe(null);
  });

  describe('layout="tabs"', () => {
    function getTab(name: string) {
      return screen
        .queryAllByRole('button', { name })
        .find((node) => node.tagName === 'BUTTON' && node.getAttribute('type') === 'button');
    }

    it('renders dataSource tabs and the +/menu actions', () => {
      renderDataStudio({ layout: 'tabs' });

      expect(getTab('Customers')).not.toBeUndefined();
      expect(getTab('Products')).not.toBeUndefined();
      expect(screen.getByRole('button', { name: 'Add sheet' })).not.toBe(null);
      expect(screen.getByRole('button', { name: 'All tabs' })).not.toBe(null);
      // No sheets yet.
      expect(screen.queryByText('View 1')).toBe(null);
    });

    it('switches dataSource by clicking a dataSource tab and fires onActiveDataSourceChange', () => {
      const handleActiveDatasetChange = vi.fn();
      renderDataStudio({ layout: 'tabs', onActiveDataSourceChange: handleActiveDatasetChange });

      const productsTab = getTab('Products')!;
      fireEvent.click(productsTab);

      expect(handleActiveDatasetChange).toHaveBeenCalledWith('products', productDataset);
      expect(screen.getByText('Arabica')).not.toBe(null);
    });

    it('adds a "Sheet N" view targeting the active dataSource without entering rename mode', () => {
      const handleViewsChange = vi.fn();
      const handleActiveViewChange = vi.fn();

      renderDataStudio({
        layout: 'tabs',
        onSheetsChange: handleViewsChange,
        onActiveSheetChange: handleActiveViewChange,
      });

      // "Add sheet" opens the Composer (template picker) rather than appending a
      // default grid Sheet directly.
      fireEvent.click(screen.getByRole('button', { name: 'Add sheet' }));
      expect(screen.getByText('What would you like to build?')).not.toBe(null);
      expect(handleViewsChange).not.toHaveBeenCalled();

      // Picking a template creates the Sheet (community plan → Spreadsheet).
      fireEvent.click(screen.getByRole('listitem', { name: 'Create from Spreadsheet template' }));

      expect(handleViewsChange).toHaveBeenCalledTimes(1);
      const nextViews = handleViewsChange.mock.calls[0][0] as DataStudioSheet[];
      expect(nextViews).toHaveLength(1);
      expect(nextViews[0]).toMatchObject({ type: 'spreadsheet', dataSourceId: null });

      expect(handleActiveViewChange).toHaveBeenCalledWith(nextViews[0].id, nextViews[0]);
      expect(screen.queryByRole('textbox', { name: 'Rename sheet' })).toBe(null);
    });

    it('renames a view via double-click + Enter', () => {
      renderDataStudio({
        layout: 'tabs',
        defaultSheets: [{ id: 'v1', label: 'Sheet 1', dataSourceId: 'customers' }],
        initialActiveSheetId: 'v1',
      });

      const tab = getTab('Sheet 1')!;
      fireEvent.doubleClick(tab);

      const input = screen.getByRole('textbox', { name: 'Rename sheet' }) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Sales' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.queryByRole('textbox', { name: 'Rename sheet' })).toBe(null);
      expect(getTab('Sales')).not.toBeUndefined();
    });

    it('duplicates a view via the per-tab dropdown menu', () => {
      const handleViewsChange = vi.fn();
      const views: DataStudioSheet[] = [{ id: 'v1', label: 'Sales', dataSourceId: 'customers' }];

      renderDataStudio({
        layout: 'tabs',
        sheets: views,
        activeSheetId: 'v1',
        onSheetsChange: handleViewsChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Sheet options for Sales' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));

      expect(handleViewsChange).toHaveBeenCalledTimes(1);
      const next = handleViewsChange.mock.calls[0][0] as DataStudioSheet[];
      expect(next).toHaveLength(2);
      expect(next[0].id).toBe('v1');
      expect(next[1]).toMatchObject({ dataSourceId: 'customers', label: 'Sales (copy)' });
      expect(next[1].id).not.toBe('v1');
    });

    it('deletes a view via the per-tab dropdown menu', () => {
      const handleViewsChange = vi.fn();
      const handleActiveViewChange = vi.fn();
      const views: DataStudioSheet[] = [
        { id: 'v1', label: 'Sales', dataSourceId: 'customers' },
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
      ];

      renderDataStudio({
        layout: 'tabs',
        sheets: views,
        activeSheetId: 'v1',
        onSheetsChange: handleViewsChange,
        onActiveSheetChange: handleActiveViewChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Sheet options for Sales' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

      expect(handleViewsChange).toHaveBeenCalledWith([
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
      ]);
      expect(handleActiveViewChange).toHaveBeenCalledWith(null, null);
    });

    it('reorders a view via Move left', () => {
      const handleViewsChange = vi.fn();
      const views: DataStudioSheet[] = [
        { id: 'v1', label: 'Sales', dataSourceId: 'customers' },
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
        { id: 'v3', label: 'Orders', dataSourceId: 'customers' },
      ];

      renderDataStudio({
        layout: 'tabs',
        sheets: views,
        activeSheetId: 'v2',
        onSheetsChange: handleViewsChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Sheet options for Inventory' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Move left' }));

      expect(handleViewsChange).toHaveBeenLastCalledWith([
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
        { id: 'v1', label: 'Sales', dataSourceId: 'customers' },
        { id: 'v3', label: 'Orders', dataSourceId: 'customers' },
      ]);
    });

    it('reorders a view via Move right', () => {
      const handleViewsChange = vi.fn();
      const views: DataStudioSheet[] = [
        { id: 'v1', label: 'Sales', dataSourceId: 'customers' },
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
        { id: 'v3', label: 'Orders', dataSourceId: 'customers' },
      ];

      renderDataStudio({
        layout: 'tabs',
        sheets: views,
        activeSheetId: 'v2',
        onSheetsChange: handleViewsChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Sheet options for Inventory' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Move right' }));

      expect(handleViewsChange).toHaveBeenLastCalledWith([
        { id: 'v1', label: 'Sales', dataSourceId: 'customers' },
        { id: 'v3', label: 'Orders', dataSourceId: 'customers' },
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
      ]);
    });

    it('disables Move left on the first view', () => {
      const views: DataStudioSheet[] = [
        { id: 'v1', label: 'Sales', dataSourceId: 'customers' },
        { id: 'v2', label: 'Inventory', dataSourceId: 'products' },
      ];

      renderDataStudio({ layout: 'tabs', sheets: views, activeSheetId: 'v1' });

      fireEvent.click(screen.getByRole('button', { name: 'Sheet options for Sales' }));
      // MUI MenuItem with `disabled` reflects aria-disabled in the DOM.
      expect(
        screen.getByRole('menuitem', { name: 'Move left' }).getAttribute('aria-disabled'),
      ).toBe('true');
    });

    it('lists all dataSources and views in the hamburger menu and marks the active one', () => {
      const views: DataStudioSheet[] = [{ id: 'v1', label: 'Sales', dataSourceId: 'customers' }];

      renderDataStudio({ layout: 'tabs', sheets: views, activeSheetId: 'v1' });

      fireEvent.click(screen.getByRole('button', { name: 'All tabs' }));

      const menu = screen.getByRole('menu');
      const items = within(menu).getAllByRole('menuitem');
      const labels = items.map((item) => item.textContent);
      expect(labels).toEqual(['Customers', 'Products', 'Sales']);

      const activeItem = items.find((item) => item.textContent === 'Sales');
      // The check mark is the only icon rendered in the active list-item icon slot.
      expect(activeItem!.querySelector('svg[data-testid="CheckIcon"]')).not.toBe(null);
    });

    it('toggles dataSource visibility via the collapse button', () => {
      renderDataStudio({ layout: 'tabs' });

      expect(getTab('Customers')).not.toBeUndefined();
      expect(getTab('Products')).not.toBeUndefined();

      fireEvent.click(screen.getByRole('button', { name: 'Hide data sources' }));

      expect(getTab('Customers')).toBeUndefined();
      expect(getTab('Products')).toBeUndefined();

      fireEvent.click(screen.getByRole('button', { name: 'Show data sources' }));

      expect(getTab('Customers')).not.toBeUndefined();
      expect(getTab('Products')).not.toBeUndefined();
    });

    it('selecting a view tab activates the view and its underlying dataSource', () => {
      const handleActiveDatasetChange = vi.fn();
      const handleActiveViewChange = vi.fn();
      const views: DataStudioSheet[] = [{ id: 'v1', label: 'Sales', dataSourceId: 'products' }];

      renderDataStudio({
        layout: 'tabs',
        sheets: views,
        defaultSheets: views, // ensure uncontrolled path works the same
        onActiveDataSourceChange: handleActiveDatasetChange,
        onActiveSheetChange: handleActiveViewChange,
      });

      const viewTab = getTab('Sales')!;
      fireEvent.click(viewTab);

      expect(handleActiveViewChange).toHaveBeenCalledWith('v1', views[0]);
      expect(handleActiveDatasetChange).toHaveBeenCalledWith('products', productDataset);
      expect(screen.getByText('Arabica')).not.toBe(null);
    });
  });

  describe('joint sources', () => {
    const connector = { getRows: vi.fn(async () => ({ rows: [], rowCount: 0 })) };
    const ordersBase: DataStudioDataSource = {
      id: 'orders',
      label: 'Orders',
      columns: [{ field: 'id' }, { field: 'product_id' }, { field: 'amount' }],
      connector,
      supportsServerGrouping: true,
      joinGroup: 'shop',
    };
    const productsBase: DataStudioDataSource = {
      id: 'products',
      label: 'Products',
      columns: [{ field: 'id' }, { field: 'name' }],
      connector,
      supportsServerGrouping: true,
      joinGroup: 'shop',
    };
    const jointConfig: DataStudioJointSourceConfig = {
      id: 'joint-1',
      label: 'Orders + Products',
      definition: {
        base: 'orders',
        joins: [
          {
            sourceId: 'products',
            type: 'inner',
            on: [{ leftField: 'product_id', rightField: 'id' }],
          },
        ],
        columns: [
          { sourceId: 'orders', field: 'amount', as: 'amount' },
          { sourceId: 'products', field: 'name', as: 'name' },
        ],
      },
    };

    function renderWithJointSource() {
      let stored: DataStudioJointSourceConfig[] = [jointConfig];
      const persistence: DataStudioJointSourcesPersistenceAdapter = {
        read: () => stored,
        write: (next) => {
          stored = next;
        },
      };
      const view = render(
        <div style={{ width: 500, height: 300 }}>
          <DataStudio
            dataSources={[ordersBase, productsBase]}
            sheetsPersistence={null}
            jointSourcesPersistence={persistence}
            slotProps={{ dataGrid: { disableVirtualization: true } }}
          />
        </div>,
      );
      return { ...view, getStored: () => stored };
    }

    it('hydrates a persisted joint source into the sidebar', async () => {
      renderWithJointSource();
      expect(await screen.findByText('Orders + Products')).not.toBe(null);
    });

    it('edits a joint source (the builder opens pre-filled)', async () => {
      renderWithJointSource();
      fireEvent.click(await screen.findByLabelText('Joint source options for Orders + Products'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

      // Dialog opens in edit mode with the name pre-filled.
      expect(screen.getByRole('dialog')).not.toBe(null);
      expect((screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement).value).toBe(
        'Orders + Products',
      );
      expect(screen.getByRole('button', { name: 'Save' })).not.toBe(null);
    });

    it('deletes a joint source and persists the removal', async () => {
      const { getStored } = renderWithJointSource();
      fireEvent.click(await screen.findByLabelText('Joint source options for Orders + Products'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

      await waitFor(() => {
        expect(screen.queryByText('Orders + Products')).toBe(null);
      });
      expect(getStored()).toEqual([]);
    });
  });
});
