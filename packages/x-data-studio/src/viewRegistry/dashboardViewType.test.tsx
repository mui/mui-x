import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { dashboardViewType } from './dashboardViewType';
import type { DataStudioDataSource } from '../DataStudio/DataStudio.types';

const { render } = createRenderer();

const Dashboard = dashboardViewType.Component;

const salesSource: DataStudioDataSource = {
  id: 'sales',
  label: 'Sales',
  columns: [
    { field: 'region' },
    { field: 'units', type: 'number' },
    { field: 'revenue', type: 'number' },
  ],
  rows: [
    { id: 1, region: 'North', units: 10, revenue: 100 },
    { id: 2, region: 'South', units: 20, revenue: 200 },
    { id: 3, region: 'North', units: 5, revenue: 50 },
  ],
};

function renderDashboard(
  dataSource: DataStudioDataSource | null,
  options: { params?: { tiles?: any[] }; setParams?: (next: any) => void } = {},
) {
  return render(
    <Dashboard
      sheet={{ id: 's', label: 'Dashboard', dataSourceId: 'sales', type: 'dashboard' }}
      dataSource={dataSource}
      dataSources={dataSource ? [dataSource] : []}
      params={options.params ?? {}}
      setParams={options.setParams ?? vi.fn()}
      plan="premium"
      apiRef={{ current: null }}
    />,
  );
}

describe('dashboardViewType', () => {
  it('seeds default tiles (metrics + breakdown) and a record count', () => {
    renderDashboard(salesSource);

    // Builder toolbar.
    expect(screen.getByRole('button', { name: 'Metric' })).not.toBe(null);
    expect(screen.getByRole('button', { name: 'Breakdown' })).not.toBe(null);
    // Record count.
    expect(screen.getByText(/3\s+records/i)).not.toBe(null);
    // A breakdown tile of the measure by the categorical dimension.
    expect(screen.getByText(/by region/i)).not.toBe(null);
    expect(screen.getByText('North')).not.toBe(null);
    expect(screen.getByText('South')).not.toBe(null);
  });

  it('adds a metric tile via the toolbar (persists to params)', () => {
    const setParams = vi.fn();
    renderDashboard(salesSource, { setParams });

    fireEvent.click(screen.getByRole('button', { name: 'Metric' }));

    expect(setParams).toHaveBeenCalledTimes(1);
    const tiles = setParams.mock.calls[0][0].tiles as Array<{ kind: string }>;
    // Seeded (units, revenue metrics + 1 breakdown = 3) + 1 new metric = 4.
    expect(tiles).toHaveLength(4);
    expect(tiles.filter((t) => t.kind === 'metric')).toHaveLength(3);
  });

  it('removes a tile via params', () => {
    const setParams = vi.fn();
    renderDashboard(salesSource, {
      params: { tiles: [{ id: 't1', kind: 'metric', field: 'units', agg: 'sum' }] },
      setParams,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove tile' }));
    expect(setParams).toHaveBeenCalledWith({ tiles: [] });
  });

  it('samples rows from a server connector and computes insights', async () => {
    const getRows = vi.fn(async () => ({ rows: [...salesSource.rows!], rowCount: 3 }));
    renderDashboard({ ...salesSource, rows: undefined, connector: { getRows } });

    await waitFor(() => {
      expect(screen.getByText(/Based on a sample/i)).not.toBe(null);
    });
    expect(getRows).toHaveBeenCalled();
    expect(screen.getByText(/by region/i)).not.toBe(null);
  });

  it('shows a graceful message for a source with no rows and no connector', () => {
    renderDashboard({ ...salesSource, rows: undefined });
    expect(screen.getByText(/No data to summarize/i)).not.toBe(null);
  });

  it('shows the unbound empty state when no Data Source is connected', () => {
    renderDashboard(null);
    expect(screen.getByText(/No Data Source connected/i)).not.toBe(null);
  });
});
