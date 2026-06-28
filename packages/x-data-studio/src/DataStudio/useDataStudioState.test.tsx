import { act, renderHook } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { GridInitialState } from '@mui/x-data-grid';
import { useDataStudioState } from './useDataStudioState';
import type { DataStudioDataSource, DataStudioSheet } from './DataStudio.types';

const dataSources: DataStudioDataSource[] = [
  { id: 'customer', label: 'Customer', columns: [{ field: 'country' }] },
  { id: 'joint-orders', label: 'Orders (joined)', columns: [{ field: 'orders_Country' }] },
];

const PIVOT_PARAMS = { pivotModel: { rows: [{ field: 'orders_Country' }] } };
const PIVOT_INITIAL_STATE: GridInitialState = { pivoting: { enabled: true } } as GridInitialState;

function renderState(sheet: DataStudioSheet) {
  return renderHook(() =>
    useDataStudioState({
      dataSources,
      defaultSheets: [sheet],
      initialActiveSheetId: sheet.id,
    }),
  );
}

describe('useDataStudioState - updateSheet view-state reset on rebind', () => {
  it('clears params and initialState when the sheet rebinds to another data source', () => {
    const { result } = renderState({
      id: 'sheet-1',
      label: 'Sheet 1',
      dataSourceId: 'joint-orders',
      type: 'pivot',
      params: PIVOT_PARAMS,
      initialState: PIVOT_INITIAL_STATE,
    });

    act(() => {
      result.current.updateSheet('sheet-1', { dataSourceId: 'customer' });
    });

    expect(result.current.activeSheet?.dataSourceId).toBe('customer');
    expect(result.current.activeSheet?.params).toEqual({});
    expect(result.current.activeSheet?.initialState).toBeUndefined();
  });

  it('honors explicit params/initialState passed alongside a data source change', () => {
    const { result } = renderState({
      id: 'sheet-1',
      label: 'Sheet 1',
      dataSourceId: 'joint-orders',
      type: 'pivot',
      params: PIVOT_PARAMS,
    });

    const nextParams = { pivotModel: { rows: [{ field: 'country' }] } };
    act(() => {
      result.current.updateSheet('sheet-1', { dataSourceId: 'customer', params: nextParams });
    });

    expect(result.current.activeSheet?.params).toEqual(nextParams);
  });

  it('preserves params when updating without a data source change', () => {
    const { result } = renderState({
      id: 'sheet-1',
      label: 'Sheet 1',
      dataSourceId: 'joint-orders',
      type: 'pivot',
      params: PIVOT_PARAMS,
    });

    act(() => {
      result.current.updateSheet('sheet-1', { type: 'chart' });
    });

    expect(result.current.activeSheet?.dataSourceId).toBe('joint-orders');
    expect(result.current.activeSheet?.params).toEqual(PIVOT_PARAMS);
  });
});
