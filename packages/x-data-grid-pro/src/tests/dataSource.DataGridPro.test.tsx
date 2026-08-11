import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import type {
  DataGridProProps,
  GridApi,
  GridDataSource,
  GridGetRowsResponse,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { getRow } from 'test/utils/helperFn';
import { TestCache } from '@mui/x-data-grid/internals';

describe('<DataGridPro /> - Data source', () => {
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

  describe('Editing', () => {
    class CommodityRow {
      id: number;

      commodity: string;

      #revision: number;

      constructor(id: number, commodity: string, revision = 0) {
        this.id = id;
        this.commodity = commodity;
        this.#revision = revision;
      }

      withCommodity(commodity: string) {
        return new CommodityRow(this.id, commodity, this.#revision + 1);
      }

      get revision() {
        return this.#revision;
      }
    }

    function ReplaceTestCase({ dataSource }: { dataSource: GridDataSource }) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            columns={[{ field: 'commodity', editable: true }]}
            dataSource={dataSource}
            disableVirtualization
          />
        </div>
      );
    }

    it('should store the row verbatim when `updateRow()` returns a replace update', async () => {
      const initialRows = [new CommodityRow(0, 'Nickel'), new CommodityRow(1, 'Cobalt')];
      let replacement: CommodityRow | undefined;
      const dataSource: GridDataSource = {
        getRows: async () => ({ rows: initialRows, rowCount: initialRows.length }),
        updateRow: async (params) => {
          replacement = (params.previousRow as CommodityRow).withCommodity(
            params.updatedRow.commodity,
          );
          return { _action: 'replace', row: replacement };
        },
      };

      render(<ReplaceTestCase dataSource={dataSource} />);

      await waitFor(() => {
        // The rows returned by `getRows()` are stored verbatim.
        expect(apiRef.current?.getRow(1)).to.equal(initialRows[1]);
      });

      await act(async () => apiRef.current?.startCellEditMode({ id: 1, field: 'commodity' }));
      await act(async () =>
        apiRef.current?.setEditCellValue({ id: 1, field: 'commodity', value: 'Silver' }),
      );
      await act(async () => apiRef.current?.stopCellEditMode({ id: 1, field: 'commodity' }));

      await waitFor(() => {
        // The instance returned in the envelope is stored verbatim.
        expect(apiRef.current?.getRow(1)).to.equal(replacement);
      });
      const updatedRow = apiRef.current?.getRow(1) as CommodityRow;
      expect(updatedRow.commodity).to.equal('Silver');
      // #private state survives the edit because the stored row is the instance itself.
      expect(updatedRow.revision).to.equal(1);
    });

    it('should store the row verbatim when `updateRows()` is called with a replace update', async () => {
      const initialRows = [new CommodityRow(0, 'Nickel'), new CommodityRow(1, 'Cobalt')];
      const dataSource: GridDataSource = {
        getRows: async () => ({ rows: initialRows, rowCount: initialRows.length }),
      };

      render(<ReplaceTestCase dataSource={dataSource} />);

      await waitFor(() => {
        expect(apiRef.current?.getRow(0)).to.equal(initialRows[0]);
      });

      const replacement = initialRows[0].withCommodity('Silver');
      await act(async () => apiRef.current?.updateRows([{ _action: 'replace', row: replacement }]));

      // The instance provided in the envelope is stored verbatim.
      expect(apiRef.current?.getRow(0)).to.equal(replacement);
      expect((apiRef.current?.getRow(0) as CommodityRow).revision).to.equal(1);
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
