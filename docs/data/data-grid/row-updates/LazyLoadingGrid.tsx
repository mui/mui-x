import * as React from 'react';
import {
  DataGridPro,
  GridFetchRowsParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  createFakeServer,
  QueryOptions,
  loadServerRows,
  UseDemoDataOptions,
} from '@mui/x-data-grid-generator';

const DATASET_OPTION: UseDemoDataOptions = {
  dataSet: 'Employee',
  rowLength: 10000,
};

const { columns, columnsWithDefaultColDef, useQuery } =
  createFakeServer(DATASET_OPTION);

export default function LazyLoadingGrid() {
  const apiRef = useGridApiRef();
  const [queryOptions, setQueryOptions] = React.useState<QueryOptions>({});
  const { data } = useQuery(queryOptions);
  const initialRows = React.useMemo(() => data.slice(0, 10), [data]);

  const handleFetchRows = async (params: GridFetchRowsParams) => {
    // Bug, it shouldn't be triggered for the initial rendering
    if (data.length === 0) {
      return;
    }

    setQueryOptions((prev) => {
      if (
        prev.filterModel === params.filterModel &&
        prev.sortModel === params.sortModel
      ) {
        return prev;
      }

      return {
        filterModel: params.filterModel,
        sortModel: params.sortModel,
      };
    });

    const serverRows = await loadServerRows(
      data,
      {
        filterModel: params.filterModel,
        sortModel: params.sortModel,
      },
      {
        minDelay: 300,
        maxDelay: 800,
        useCursorPagination: false,
      },
      columnsWithDefaultColDef,
    );

    apiRef.current.replaceRows(
      params.firstRowToRender,
      params.lastRowToRender,
      serverRows.returnedRows.slice(params.firstRowToRender, params.lastRowToRender),
    );
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        rows={initialRows}
        apiRef={apiRef}
        hideFooterPagination
        rowCount={data.length}
        sortingMode="server"
        filterMode="server"
        rowsLoadingMode="server"
        onFetchRows={handleFetchRows}
        experimentalFeatures={{
          lazyLoading: true,
        }}
      />
    </div>
  );
}
