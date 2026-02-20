import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPro,
  type DataGridProProps,
  type GridApi,
  type GridDataSource,
  type GridGetRowsResponse,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { getRow } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { TestCache } from '@mui/x-data-grid/internals';

describe.skipIf(isJSDOM)('<DataGridPro /> - Data source', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const fetchRowsSpy = spy();

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset({ resetSpy }: { resetSpy: typeof fetchRowsSpy }) {
    React.useLayoutEffect(() => {
      resetSpy.resetHistory();
    }, [resetSpy]);
    return null;
  }

  function TestDataSource(
    props: Partial<DataGridProProps> & { onFetchRows?: typeof fetchRowsSpy },
  ) {
    apiRef = useGridApiRef();
    const { onFetchRows, ...other } = props;
    const effectiveFetchRowsSpy = onFetchRows ?? fetchRowsSpy;
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

          effectiveFetchRowsSpy(params);

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
      };
    }, [fetchRows, effectiveFetchRowsSpy]);

    if (!isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset resetSpy={effectiveFetchRowsSpy} />
        <DataGridPro
          apiRef={apiRef}
          dataSource={dataSource}
          columns={columns}
          disableVirtualization
          {...other}
        />
      </div>
    );
  }

  describe('Cache', () => {
    it('should cache the data in one chunk when pagination is disabled', async () => {
      const testCache = new TestCache();
      render(<TestDataSource dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(199)).not.to.be.undefined);
      expect(testCache.size()).to.equal(1); // 1 chunk of 200 rows
    });
  });

  describe('Revalidation', () => {
    it('should periodically revalidate the current query when dataSourceRevalidateMs is set', async () => {
      const localFetchRowsSpy = spy();
      render(
        <TestDataSource
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );
      await waitFor(() => {
        expect(localFetchRowsSpy.callCount).to.be.greaterThan(0);
      });

      localFetchRowsSpy.resetHistory();

      await waitFor(() => {
        expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);
      });
    });
  });
});
