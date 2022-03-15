import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { serverConfiguration } from '@mui/x-data-grid-generator';

const DATASET_OPTION = {
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6,
};

const SERVER_OPTIONS = {
  minDelay: 100,
  maxDelay: 300,
  useCursorPagination: true,
};

const { columns, useQuery } = serverConfiguration(DATASET_OPTION, SERVER_OPTIONS);

export default function ServerFilterGrid() {
  const [queryOptions, setQueryOptions] = React.useState({});

  const onFilterChange = React.useCallback((filterModel) => {
    // Here you save the data you need from the filter model
    setQueryOptions({ filterModel: { ...filterModel } });
  }, []);

  const { isLoading, data } = useQuery(queryOptions);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        loading={isLoading}
      />
    </div>
  );
}
