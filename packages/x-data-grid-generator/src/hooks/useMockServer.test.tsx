import { renderHook, waitFor } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { BASE_URL, useMockServer } from './useMockServer';

const serverOptions = { minDelay: 0, maxDelay: 0, verbose: false };

// The data cache is shared by all hook instances, so each test uses its own `rowLength`.
describe('useMockServer', () => {
  it('should not reuse the cached data of a demo with another `derivedColumns` value', async () => {
    const { result: firstResult } = renderHook(() =>
      useMockServer({ dataSet: 'Commodity', rowLength: 5, maxColumns: 20 }, serverOptions),
    );
    await waitFor(() => expect(firstResult.current.isReady).to.equal(true));

    const { result: secondResult } = renderHook(() =>
      useMockServer(
        { dataSet: 'Commodity', rowLength: 5, maxColumns: 20, derivedColumns: true },
        serverOptions,
      ),
    );
    await waitFor(() => expect(secondResult.current.isReady).to.equal(true));
    const { rows } = await secondResult.current.fetchRows(BASE_URL);
    expect(rows[0]).to.have.property('maturityDate-year');
  });

  it.each([false, true])(
    'should not reuse cached data with multiSelect=%s for the opposite value',
    async (multiSelect) => {
      const rowLength = multiSelect ? 7 : 8;
      const { result: firstResult } = renderHook(() =>
        useMockServer(
          { dataSet: 'Commodity', rowLength, maxColumns: 6, multiSelect },
          serverOptions,
        ),
      );
      await waitFor(() => expect(firstResult.current.isReady).to.equal(true));

      const { result: secondResult } = renderHook(() =>
        useMockServer(
          { dataSet: 'Commodity', rowLength, maxColumns: 6, multiSelect: !multiSelect },
          serverOptions,
        ),
      );
      await waitFor(() => expect(secondResult.current.isReady).to.equal(true));
      const { rows } = await secondResult.current.fetchRows(BASE_URL);
      expect(rows[0]).to.have.property(multiSelect ? 'quantity' : 'tags');
      expect(rows[0]).not.to.have.property(multiSelect ? 'tags' : 'quantity');
    },
  );

  it('should keep the edited row after a remount', async () => {
    const { result, unmount } = renderHook(() =>
      useMockServer({ dataSet: 'Commodity', rowLength: 6 }, serverOptions),
    );
    await waitFor(() => expect(result.current.isReady).to.equal(true));
    const { rows } = await result.current.fetchRows(BASE_URL);
    await result.current.editRow(rows[0].id, { ...rows[0], commodity: 'Edited' });
    unmount();

    const { result: remountResult } = renderHook(() =>
      useMockServer({ dataSet: 'Commodity', rowLength: 6 }, serverOptions),
    );
    await waitFor(() => expect(remountResult.current.isReady).to.equal(true));
    const { rows: remountRows } = await remountResult.current.fetchRows(BASE_URL);
    expect(remountRows[0].commodity).to.equal('Edited');
  });
});
