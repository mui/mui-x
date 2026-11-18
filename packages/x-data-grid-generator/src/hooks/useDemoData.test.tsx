import { renderHook, waitFor } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useDemoData } from './useDemoData';

// The data cache is shared by all hook instances, so each test uses its own `rowLength`.
describe('useDemoData', () => {
  it('should not reuse the cached data of a demo with other `visibleFields`', async () => {
    const visibleFields = ['commodity'];
    const { result: firstResult } = renderHook(() =>
      useDemoData({ dataSet: 'Commodity', rowLength: 7, visibleFields }),
    );
    await waitFor(() => expect(firstResult.current.loading).to.equal(false));
    expect(
      firstResult.current.data.initialState?.columns?.columnVisibilityModel?.traderName,
    ).to.equal(false);

    const otherVisibleFields = ['traderName'];
    const { result: secondResult } = renderHook(() =>
      useDemoData({ dataSet: 'Commodity', rowLength: 7, visibleFields: otherVisibleFields }),
    );
    await waitFor(() => expect(secondResult.current.loading).to.equal(false));
    expect(
      secondResult.current.data.initialState?.columns?.columnVisibilityModel?.traderName,
    ).to.equal(undefined);
  });

  it('should not reuse the cached data of a demo with another `editable` value', async () => {
    const { result: firstResult } = renderHook(() =>
      useDemoData({ dataSet: 'Commodity', rowLength: 8, editable: true }),
    );
    await waitFor(() => expect(firstResult.current.loading).to.equal(false));
    expect(firstResult.current.data.columns.some((column) => column.editable)).to.equal(true);

    const { result: secondResult } = renderHook(() =>
      useDemoData({ dataSet: 'Commodity', rowLength: 8 }),
    );
    await waitFor(() => expect(secondResult.current.loading).to.equal(false));
    expect(secondResult.current.data.columns.some((column) => column.editable)).to.equal(false);
  });
});
