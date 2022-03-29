import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const DATASET_OPTION = {
  dataSet: 'Employee',
  visibleFields: VISIBLE_FIELDS,
  rowLength: 100,
};

const { columns, useQuery } = createFakeServer(DATASET_OPTION);

export default function ServerSortingGrid() {
  const [queryOptions, setQueryOptions] = React.useState({});

  const handleSortModelChange = React.useCallback((sortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({ sortModel: [...sortModel] });
  }, []);

  const { isLoading, data } = useQuery(queryOptions);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        loading={isLoading}
      />
    </div>
  );
}
