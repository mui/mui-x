import * as React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useMockServer } from '@mui/x-data-grid-generator';

function getKeyDefault(params) {
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.start,
    params.end,
  ]);
}

class Cache {
  constructor() {
    this.cache = {};
    this.cacheKeys = new Set();
    this.getKey = getKeyDefault;
  }

  set(key, value) {
    const keyString = this.getKey(key);
    this.cache[keyString] = { value };
  }

  get(key) {
    const keyString = this.getKey(key);
    const entry = this.cache[keyString];
    if (!entry) {
      return undefined;
    }

    return entry.value;
  }

  pushKey(key) {
    const keyString = this.getKey(key);
    this.cacheKeys.add(keyString);
  }

  deleteKey(key) {
    const keyString = this.getKey(key);
    delete this.cache[keyString];
    this.cacheKeys.delete(keyString);
  }

  async getLast(key) {
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
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = React.useState(null);
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: true, minDelay: 200, maxDelay: 500 },
  );
  const cache = React.useMemo(() => new Cache(), []);

  const dataSource = React.useMemo(
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
        try {
          if (params.paginationModel?.page === 7) {
            throw new Error('Simulate server error on page 8');
          }
          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );
          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
            pageInfo: { nextCursor: getRowsResponse.pageInfo?.nextCursor },
          };
        } catch (error) {
          cache.deleteKey(params);
          apiRef.current?.setPaginationModel({
            page: params.paginationModel.page - 1,
            pageSize: params.paginationModel.pageSize,
          });
          setSnackbar({ children: error.message, severity: 'error' });
          throw error;
        }
      },
    }),
    [fetchRows, cache, apiRef],
  );

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        apiRef={apiRef}
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
        onFilterModelChange={() => cache.clear()}
        onSortModelChange={() => cache.clear()}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
}
