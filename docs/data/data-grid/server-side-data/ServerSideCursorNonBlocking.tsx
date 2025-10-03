import * as React from 'react';
import {
  DataGrid,
  GridDataSource,
  GridGetRowsParams,
  GridGetRowsResponse,
} from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

function getKeyDefault(params: GridGetRowsParams) {
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.start,
    params.end,
  ]);
}

class Cache {
  private cache: Record<string, { value: GridGetRowsResponse }>;

  private cacheKeys: Set<string>;

  private getKey: (params: GridGetRowsParams) => string;

  constructor() {
    this.cache = {};
    this.cacheKeys = new Set();
    this.getKey = getKeyDefault;
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    const keyString = this.getKey(key);
    this.cache[keyString] = { value };
  }

  get(key: GridGetRowsParams): GridGetRowsResponse | undefined {
    const keyString = this.getKey(key);
    const entry = this.cache[keyString];
    if (!entry) {
      return undefined;
    }

    return entry.value;
  }

  pushKey(key: GridGetRowsParams) {
    const keyString = this.getKey(key);
    this.cacheKeys.add(keyString);
  }

  async getLast(key: GridGetRowsParams): Promise<GridGetRowsResponse | undefined> {
    const cacheKeys = Array.from(this.cacheKeys);
    const prevKey = cacheKeys[cacheKeys.indexOf(this.getKey(key)) - 1];
    if (!prevKey) {
      return undefined;
    }
    if (this.cache[prevKey]) {
      return this.cache[prevKey].value;
    }
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (this.cache[prevKey]) {
          clearInterval(intervalId);
          resolve(this.cache[prevKey].value);
        }
      }, 100);
    });
  }

  clear() {
    this.cache = {};
    this.cacheKeys.clear();
  }
}

export default function ServerSideCursorNonBlocking() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: true, minDelay: 200, maxDelay: 500 },
  );
  const cache = React.useMemo(() => new Cache(), []);

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        cache.pushKey(params);
        const latestResponse = await cache.getLast(params);
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          cursor: String(latestResponse?.pageInfo?.nextCursor ?? ''),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          pageInfo: { nextCursor: getRowsResponse.pageInfo?.nextCursor },
        };
      },
    }),
    [fetchRows, cache],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={cache}
        pagination
        initialState={{
          ...initialState,
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
            rowCount: 0,
          },
        }}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
