# Data Grid - Server-side filter

Filter rows on the server.

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

The example below demonstrates how to achieve server-side filtering.

```tsx
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

```

:::success
You can combine server-side filtering with [server-side sorting](/x/react-data-grid/sorting/#server-side-sorting) and [server-side pagination](/x/react-data-grid/pagination/#server-side-pagination) to avoid fetching more data than needed, since it's already processed outside of the Data Grid.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
