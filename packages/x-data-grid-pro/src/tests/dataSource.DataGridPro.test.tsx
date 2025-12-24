import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPro,
  DataGridProProps,
  GridApi,
  GridDataSource,
  GridGetRowsResponse,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { vi } from 'vitest';
import { getRow } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { TestCache } from '@mui/x-data-grid/internals';

describe.skipIf(isJSDOM)('<DataGridPro /> - Data source', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const fetchRowsSpy = vi.fn();

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.resetHistory();
    }, []);
    return null;
  }

  function TestDataSource(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    const { fetchRows, columns, isReady } = useMockServer<GridGetRowsResponse>(
      { rowLength: 200, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
          });

          fetchRowsSpy(params);

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
      };
    }, [fetchRows]);

    if (!isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <DataGridPro
          apiRef={apiRef}
          dataSource={dataSource}
          columns={columns}
          disableVirtualization
          {...props}
        />
      </div>
    );
  }

  describe('Cache', () => {
    it('should cache the data in one chunk when pagination is disabled', async () => {
      const testCache = new TestCache();
      render(<TestDataSource dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(199)).not.to.be.undefined);
      expect(testCache.size()).to.equal(1); // 1 chunk of 200 rows
    });
  });
});
