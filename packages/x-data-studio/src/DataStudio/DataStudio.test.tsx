import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { DataGridProps, GridDataSource } from '@mui/x-data-grid';
import { DataStudio } from './DataStudio';
import type {
  DataStudioDataGridProps,
  DataStudioDataset,
  DataStudioToolbarComponent,
  DataStudioView,
} from './DataStudio.types';

const { render } = createRenderer();

const customerDataset: DataStudioDataset = {
  id: 'customers',
  label: 'Customers',
  columns: [{ field: 'name', headerName: 'Name', width: 120 }],
  rows: [{ id: 1, name: 'Alice' }],
};

const productDataset: DataStudioDataset = {
  id: 'products',
  label: 'Products',
  columns: [{ field: 'product', headerName: 'Product', width: 120 }],
  rows: [{ id: 1, product: 'Arabica' }],
};

function renderDataStudio(props: Partial<React.ComponentProps<typeof DataStudio>> = {}) {
  return render(
    <div style={{ width: 500, height: 300 }}>
      <DataStudio
        datasets={[customerDataset, productDataset]}
        slotProps={{ dataGrid: { disableVirtualization: true } }}
        // Disable the default localStorage persistence in tests so view
        // mutations in one test don't bleed into the next (vitest runs with
        // `isolate: false` and shares the jsdom window between tests).
        viewsPersistence={null}
        {...props}
      />
    </div>,
  );
}

describe('<DataStudio />', () => {
  it('renders the first dataset by default', () => {
    renderDataStudio();

    expect(screen.getByText('Alice')).not.toBe(null);
    expect(screen.getByText('Data Sources')).not.toBe(null);
    expect(screen.getByRole('treeitem', { name: 'Customers' })).not.toBe(null);
  });

  it('switches datasets using the sidebar tree', () => {
    renderDataStudio();

    fireEvent.click(screen.getByText('Products'));

    expect(screen.getByText('Arabica')).not.toBe(null);
    expect(screen.getByRole('treeitem', { name: 'Products' })).not.toBe(null);
  });

  it('calls onActiveDatasetChange in controlled mode', () => {
    const handleActiveDatasetChange = vi.fn();

    renderDataStudio({
      activeDatasetId: 'customers',
      onActiveDatasetChange: handleActiveDatasetChange,
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
          datasets={[
            {
              id: 'remote',
              label: 'Remote',
              columns: [{ field: 'name', headerName: 'Name', width: 120 }],
              dataSource: { getRows },
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

  it('renders empty data sources and views states when no datasets are provided', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio datasets={[]} />
      </div>,
    );

    expect(screen.getByText('Data Sources')).not.toBe(null);
    expect(screen.getByText('No data sources')).not.toBe(null);
    expect(screen.getByText('No data source selected')).not.toBe(null);
    expect(screen.getByText('Views')).not.toBe(null);
    expect(screen.getByText('No views yet')).not.toBe(null);
    expect(screen.getByRole('button', { name: 'Add new view' })).toHaveProperty('disabled', true);
  });

  it('renders data source shimmer while loading datasets', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio datasets={[]} loading />
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
        <DataStudio datasets={[customerDataset]} slots={{ dataGrid: CustomDataGrid }} />
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

  it('renders the chart view layout instead of the grid when the active view kind is "chart"', () => {
    renderDataStudio({
      defaultViews: [{ id: 'c1', label: 'Chart 1', datasetId: 'customers', kind: 'chart' }],
      initialActiveViewId: 'c1',
    });

    // Default plan is 'community': chart workspace falls back to the upgrade
    // prompt rather than rendering the grid.
    expect(screen.getByText('Charts require the Premium plan')).not.toBe(null);
    expect(screen.getByRole('button', { name: 'Upgrade to Premium' })).not.toBe(null);
    // The active dataset's data is not rendered as grid rows.
    expect(screen.queryByText('Alice')).toBe(null);
  });

  describe('layout="tabs"', () => {
    function getTab(name: string) {
      return screen
        .queryAllByRole('button', { name })
        .find((node) => node.tagName === 'BUTTON' && node.getAttribute('type') === 'button');
    }

    it('renders dataset tabs and the +/menu actions', () => {
      renderDataStudio({ layout: 'tabs' });

      expect(getTab('Customers')).not.toBeUndefined();
      expect(getTab('Products')).not.toBeUndefined();
      expect(screen.getByRole('button', { name: 'Add view' })).not.toBe(null);
      expect(screen.getByRole('button', { name: 'All tabs' })).not.toBe(null);
      // No views yet.
      expect(screen.queryByText('View 1')).toBe(null);
    });

    it('switches dataset by clicking a dataset tab and fires onActiveDatasetChange', () => {
      const handleActiveDatasetChange = vi.fn();
      renderDataStudio({ layout: 'tabs', onActiveDatasetChange: handleActiveDatasetChange });

      const productsTab = getTab('Products')!;
      fireEvent.click(productsTab);

      expect(handleActiveDatasetChange).toHaveBeenCalledWith('products', productDataset);
      expect(screen.getByText('Arabica')).not.toBe(null);
    });

    it('adds a "Sheet N" view targeting the active dataset without entering rename mode', () => {
      const handleViewsChange = vi.fn();
      const handleActiveViewChange = vi.fn();

      renderDataStudio({
        layout: 'tabs',
        onViewsChange: handleViewsChange,
        onActiveViewChange: handleActiveViewChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Add view' }));

      expect(handleViewsChange).toHaveBeenCalledTimes(1);
      const nextViews = handleViewsChange.mock.calls[0][0] as DataStudioView[];
      expect(nextViews).toHaveLength(1);
      expect(nextViews[0]).toMatchObject({ datasetId: 'customers', label: 'Sheet 1' });

      expect(handleActiveViewChange).toHaveBeenCalledWith(nextViews[0].id, nextViews[0]);
      expect(screen.queryByRole('textbox', { name: 'Rename view' })).toBe(null);
      expect(getTab('Sheet 1')).not.toBeUndefined();
    });

    it('renames a view via double-click + Enter', () => {
      renderDataStudio({
        layout: 'tabs',
        defaultViews: [{ id: 'v1', label: 'Sheet 1', datasetId: 'customers' }],
        initialActiveViewId: 'v1',
      });

      const tab = getTab('Sheet 1')!;
      fireEvent.doubleClick(tab);

      const input = screen.getByRole('textbox', { name: 'Rename view' }) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Sales' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.queryByRole('textbox', { name: 'Rename view' })).toBe(null);
      expect(getTab('Sales')).not.toBeUndefined();
    });

    it('duplicates a view via the per-tab dropdown menu', () => {
      const handleViewsChange = vi.fn();
      const views: DataStudioView[] = [{ id: 'v1', label: 'Sales', datasetId: 'customers' }];

      renderDataStudio({
        layout: 'tabs',
        views,
        activeViewId: 'v1',
        onViewsChange: handleViewsChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'View options for Sales' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));

      expect(handleViewsChange).toHaveBeenCalledTimes(1);
      const next = handleViewsChange.mock.calls[0][0] as DataStudioView[];
      expect(next).toHaveLength(2);
      expect(next[0].id).toBe('v1');
      expect(next[1]).toMatchObject({ datasetId: 'customers', label: 'Sales (copy)' });
      expect(next[1].id).not.toBe('v1');
    });

    it('deletes a view via the per-tab dropdown menu', () => {
      const handleViewsChange = vi.fn();
      const handleActiveViewChange = vi.fn();
      const views: DataStudioView[] = [
        { id: 'v1', label: 'Sales', datasetId: 'customers' },
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
      ];

      renderDataStudio({
        layout: 'tabs',
        views,
        activeViewId: 'v1',
        onViewsChange: handleViewsChange,
        onActiveViewChange: handleActiveViewChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'View options for Sales' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

      expect(handleViewsChange).toHaveBeenCalledWith([
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
      ]);
      expect(handleActiveViewChange).toHaveBeenCalledWith(null, null);
    });

    it('reorders a view via Move left', () => {
      const handleViewsChange = vi.fn();
      const views: DataStudioView[] = [
        { id: 'v1', label: 'Sales', datasetId: 'customers' },
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
        { id: 'v3', label: 'Orders', datasetId: 'customers' },
      ];

      renderDataStudio({
        layout: 'tabs',
        views,
        activeViewId: 'v2',
        onViewsChange: handleViewsChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'View options for Inventory' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Move left' }));

      expect(handleViewsChange).toHaveBeenLastCalledWith([
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
        { id: 'v1', label: 'Sales', datasetId: 'customers' },
        { id: 'v3', label: 'Orders', datasetId: 'customers' },
      ]);
    });

    it('reorders a view via Move right', () => {
      const handleViewsChange = vi.fn();
      const views: DataStudioView[] = [
        { id: 'v1', label: 'Sales', datasetId: 'customers' },
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
        { id: 'v3', label: 'Orders', datasetId: 'customers' },
      ];

      renderDataStudio({
        layout: 'tabs',
        views,
        activeViewId: 'v2',
        onViewsChange: handleViewsChange,
      });

      fireEvent.click(screen.getByRole('button', { name: 'View options for Inventory' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Move right' }));

      expect(handleViewsChange).toHaveBeenLastCalledWith([
        { id: 'v1', label: 'Sales', datasetId: 'customers' },
        { id: 'v3', label: 'Orders', datasetId: 'customers' },
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
      ]);
    });

    it('disables Move left on the first view', () => {
      const views: DataStudioView[] = [
        { id: 'v1', label: 'Sales', datasetId: 'customers' },
        { id: 'v2', label: 'Inventory', datasetId: 'products' },
      ];

      renderDataStudio({ layout: 'tabs', views, activeViewId: 'v1' });

      fireEvent.click(screen.getByRole('button', { name: 'View options for Sales' }));
      // MUI MenuItem with `disabled` reflects aria-disabled in the DOM.
      expect(
        screen.getByRole('menuitem', { name: 'Move left' }).getAttribute('aria-disabled'),
      ).toBe('true');
    });

    it('lists all datasets and views in the hamburger menu and marks the active one', () => {
      const views: DataStudioView[] = [{ id: 'v1', label: 'Sales', datasetId: 'customers' }];

      renderDataStudio({ layout: 'tabs', views, activeViewId: 'v1' });

      fireEvent.click(screen.getByRole('button', { name: 'All tabs' }));

      const menu = screen.getByRole('menu');
      const items = within(menu).getAllByRole('menuitem');
      const labels = items.map((item) => item.textContent);
      expect(labels).toEqual(['Customers', 'Products', 'Sales']);

      const activeItem = items.find((item) => item.textContent === 'Sales');
      // The check mark is the only icon rendered in the active list-item icon slot.
      expect(activeItem!.querySelector('svg[data-testid="CheckIcon"]')).not.toBe(null);
    });

    it('toggles dataset visibility via the collapse button', () => {
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

    it('selecting a view tab activates the view and its underlying dataset', () => {
      const handleActiveDatasetChange = vi.fn();
      const handleActiveViewChange = vi.fn();
      const views: DataStudioView[] = [{ id: 'v1', label: 'Sales', datasetId: 'products' }];

      renderDataStudio({
        layout: 'tabs',
        views,
        defaultViews: views, // ensure uncontrolled path works the same
        onActiveDatasetChange: handleActiveDatasetChange,
        onActiveViewChange: handleActiveViewChange,
      });

      const viewTab = getTab('Sales')!;
      fireEvent.click(viewTab);

      expect(handleActiveViewChange).toHaveBeenCalledWith('v1', views[0]);
      expect(handleActiveDatasetChange).toHaveBeenCalledWith('products', productDataset);
      expect(screen.getByText('Arabica')).not.toBe(null);
    });
  });
});
