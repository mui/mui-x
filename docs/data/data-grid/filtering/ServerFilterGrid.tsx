import * as React from 'react';
import { DataGrid, GridFilterModel } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const { useQuery, ...data } = createFakeServer();

export default function ServerFilterGrid() {
  const [queryOptions, setQueryOptions] = React.useState({});

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    setQueryOptions({ filterModel: { ...filterModel } });
  }, []);

  const { isLoading, rows } = useQuery(queryOptions);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        rows={rows}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        loading={isLoading}
      />
    </div>
  );
}
