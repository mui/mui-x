import React, { useEffect, useRef, useState } from 'react';
import { ColDef, Grid, GridApi } from '@material-ui-x/grid';

export default {
  title: 'Grid Sorting',
};

export const BasicTest = () => {
  const columns = [{ field: 'id' }, { field: 'name' }, { field: 'age' }];

  const rows = [
    { id: 1, name: 'alice', age: 40 },
    { id: 2, name: 'bob', age: 30 },
    { id: 3, name: 'igor', age: 40 },
    { id: 4, name: 'clara', age: 40 },
    { id: 5, name: 'clara', age: null },
    { id: 6, name: null, age: 40 },
    { id: 7, name: '', age: 40 },
  ];

  return (
    <>
      <p>Maintain CTRL or Command to sort by multiple fields</p>
      <div style={{ display: 'flex', flexGrow: 1, padding: '10px' }}>
        <Grid rows={rows} columns={columns} options={{ showColumnSeparator: false }} />
      </div>
    </>
  );
};
export const SortedWithColDef = () => {
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'name', sortDirection: 'asc' },
    { field: 'age', sortDirection: 'desc' },
  ];

  const rows = [
    { id: 1, name: 'alice', age: 40 },
    { id: 2, name: 'bob', age: 30 },
    { id: 3, name: 'igor', age: 40 },
    { id: 4, name: 'clara', age: 40 },
    { id: 5, name: 'clara', age: null },
    { id: 6, name: null, age: 25 },
    { id: 7, name: '', age: 42 },
  ];

  return (
    <>
      <p>Maintain CTRL or Command to sort by multiple fields</p>
      <div style={{ display: 'flex', flexGrow: 1, padding: '10px' }}>
        <Grid rows={rows} columns={columns} />
      </div>
    </>
  );
};

export const WithNotNullSortingOrder = () => {
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'name', sortDirection: 'asc' },
    { field: 'age', sortDirection: 'desc' },
  ];

  const rows = [
    { id: 1, name: 'alice', age: 40 },
    { id: 2, name: 'bob', age: 30 },
    { id: 3, name: 'igor', age: 40 },
    { id: 4, name: 'clara', age: 40 },
    { id: 5, name: 'clara', age: null },
    { id: 6, name: null, age: 25 },
    { id: 7, name: '', age: 42 },
  ];

  return (
    <>
      <p>Maintain CTRL or Command to sort by multiple fields</p>
      <div style={{ display: 'flex', flexGrow: 1, padding: '10px' }}>
        <Grid rows={rows} columns={columns} options={{ sortingOrder: ['desc', 'asc'] }} />
      </div>
    </>
  );
};
export const SortedWithApi = () => {
  const apiRef = useRef<GridApi>();
  useEffect(() => {
    if (apiRef && apiRef.current != null) {
      apiRef.current.setSortModel([{ colId: 'name', sort: 'asc' }]);
    }
  }, [apiRef]);

  const [columns] = useState([{ field: 'id' }, { field: 'name' }, { field: 'age' }]);

  const [rows] = useState([
    { id: 1, name: 'alice', age: 40 },
    { id: 2, name: 'bob', age: 30 },
    { id: 3, name: 'igor', age: 40 },
    { id: 4, name: 'clara', age: 40 },
    { id: 5, name: 'clara', age: null },
    { id: 6, name: null, age: 40 },
    { id: 7, name: '', age: 40 },
  ]);

  return (
    <>
      <div style={{ display: 'flex', flexGrow: 1, padding: '10px' }}>
        <Grid rows={rows} columns={columns} apiRef={apiRef} />
      </div>
    </>
  );
};

export const withValueGetterAndFormatter = () => {
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    {
      field: 'age',
      valueFormatter: params => (params.value ? `${params.value} years ` : 'unknown'),
    },
    {
      field: 'fullName',
      sortable: false,
      valueGetter: params => `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    },
  ];

  const rows = [
    { id: 1, firstName: 'alice', age: 40 },
    { id: 2, lastName: 'Smith', firstName: 'bob', age: 30 },
    { id: 3, lastName: 'Smith', firstName: 'igor', age: 40 },
    { id: 4, lastName: 'James', firstName: 'clara', age: 40 },
    { id: 5, lastName: 'Bob', firstName: 'clara', age: null },
    { id: 6, lastName: 'James', firstName: null, age: 40 },
    { id: 7, lastName: 'Smith', firstName: '', age: 40 },
  ];

  return (
    <>
      <p>Maintain CTRL or Command to sort by multiple fields</p>
      <div style={{ display: 'flex', flexGrow: 1, padding: '10px' }}>
        <Grid rows={rows} columns={columns} />
      </div>
    </>
  );
};
