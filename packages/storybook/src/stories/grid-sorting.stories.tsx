import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColDef, Grid, GridApi } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';

export default {
  title: 'X-Grid Tests/Sorting',
  component: Grid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/action/panel' },
    docs: {
      page: null,
    },
  },
};

const getColumns: () => ColDef[] = () => [
  { field: 'id', type: 'number' },
  { field: 'name', type: 'string' },
  { field: 'age', type: 'number', width: 100 },
  { field: 'born', type: 'date' },
  { field: 'updatedOn', type: 'dateTime', width: 180 },
];

const getRows = () => [
  {
    id: 1,
    name: 'alice',
    age: 40,
    born: new Date(1990, 10, 8),
    updatedOn: new Date(2020, 6, 21, 21, 0, 0),
  },
  {
    id: 2,
    name: 'bob',
    age: 30,
    born: new Date(1990, 9, 8),
    updatedOn: new Date(2020, 6, 21, 20, 0, 0),
  },
  {
    id: 3,
    name: 'igor',
    age: 40,
    born: new Date(1990, 10, 7),
    updatedOn: new Date(2020, 6, 21, 19, 50, 0),
  },
  {
    id: 4,
    name: 'clara',
    age: 40,
    born: new Date(1989, 1, 30),
    updatedOn: new Date(2020, 5, 18, 10, 11, 0),
  },
  {
    id: 5,
    name: 'clara',
    age: null,
    born: new Date(1984, 6, 11),
    updatedOn: new Date(2020, 6, 8, 23, 33, 25),
  },
  { id: 6, name: null, age: 25, born: null, updatedOn: new Date(2020, 6, 11, 11, 45, 53) },
  { id: 7, name: '', age: 42, born: new Date(2010, 12, 25), updatedOn: null },
];

export const HeadersClick = () => {
  return (
    <>
      <p>Click column headers to sort</p>
      <div className="grid-container">
        <Grid rows={getRows()} columns={getColumns()} />
      </div>
    </>
  );
};

export const SortingOrderOverrideOption = () => {
  return (
    <>
      <p>Click column headers to sort</p>
      <div className="grid-container">
        <Grid rows={getRows()} columns={getColumns()} options={{ sortingOrder: ['desc', 'asc'] }} />
      </div>
    </>
  );
};

export const StringSortingAsc = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const StringSortingDesc = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const NumberSortingAsc = () => {
  const columns = getColumns();
  columns[2] = { ...columns[2], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const NumberSortingDesc = () => {
  const columns = getColumns();
  columns[2] = { ...columns[2], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateSortingAsc = () => {
  const columns = getColumns();
  columns[3] = { ...columns[3], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateSortingDesc = () => {
  const columns = getColumns();
  columns[3] = { ...columns[3], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateTimeSortingAsc = () => {
  const columns = getColumns();
  columns[4] = { ...columns[4], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateTimeSortingDesc = () => {
  const columns = getColumns();
  columns[4] = { ...columns[4], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};

export const MultipleSorting = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'asc' };
  columns[2] = { ...columns[2], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};

export const MultipleAndSortIndex = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'asc', sortIndex: 2 };
  columns[2] = { ...columns[2], sortDirection: 'desc', sortIndex: 1 };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};

export const UnsortableLastCol = () => {
  const columns = getColumns();
  columns[columns.length] = {
    field: 'username',
    sortable: false,
    valueGetter: params =>
      `${params.getValue('name') || 'unknown'}_${params.getValue('age') || 'x'}`,
    width: 150,
  };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};

export const CustomComparator = () => {
  const columns = getColumns();
  columns[columns.length] = {
    field: 'username',
    valueGetter: params =>
      `${params.getValue('name') || 'unknown'}_${params.getValue('age') || 'x'}`,
    sortComparator: (v1, v2, row1, row2) => row1.data['age'] - row2.data['age'],
    sortDirection: 'asc',
    width: 150,
  };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};

export const SortingWithFormatter = () => {
  const columns = getColumns();
  columns[2] = {
    ...columns[2],
    sortDirection: 'desc',
    valueFormatter: params => (params.value ? `${params.value} years ` : 'unknown'),
  };

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={columns} />
    </div>
  );
};

export const ApiSingleSorted = () => {
  const apiRef = useRef<GridApi>();
  useEffect(() => {
    if (apiRef && apiRef.current != null) {
      apiRef.current.setSortModel([{ colId: 'name', sort: 'asc' }]);
    }
  }, [apiRef]);

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={getColumns()} apiRef={apiRef} />
    </div>
  );
};
export const ApiMultipleSorted = () => {
  const apiRef = useRef<GridApi>();
  useEffect(() => {
    if (apiRef && apiRef.current != null) {
      apiRef.current.setSortModel([
        { colId: 'age', sort: 'desc' },
        { colId: 'name', sort: 'asc' },
      ]);
    }
  }, [apiRef]);

  return (
    <div className="grid-container">
      <Grid rows={getRows()} columns={getColumns()} apiRef={apiRef} />
    </div>
  );
};

export const SortedEventsApi = () => {
  const apiRef = useRef<GridApi>();
  const rows = useMemo(() => getRows(), []);
  const cols = useMemo(() => getColumns(), []);
  const [loggedEvents, setEvents] = useState<any[]>([]);

  const handleEvent = useCallback(
    (name, params) => {
      action(name)(params);
      setEvents((prev: any[]) => [...prev, name]);
    },
    [setEvents],
  );

  useEffect(() => {
    if (apiRef && apiRef.current != null) {
      apiRef.current.onColumnsSorted(params => handleEvent('ColumnsSorted', params));
      apiRef.current.on('sortModelUpdated', params => handleEvent('sortModelUpdated', params));
      apiRef.current.on('postSort', params => handleEvent('postSort', params));

      apiRef.current.setSortModel([
        { colId: 'age', sort: 'desc' },
        { colId: 'name', sort: 'asc' },
      ]);
    }
  }, [apiRef]);

  //We had the ol so we can test it with image snapshots
  return (
    <>
      <div>
        <h1 style={{ fontSize: '16pt' }}>Triggered Events in order </h1>
        <ol>{...loggedEvents.map((evt, idx) => <li key={evt + idx}>{evt}</li>)}</ol>
      </div>
      <div className="grid-container">
        <Grid rows={rows} columns={cols} apiRef={apiRef} />
      </div>
    </>
  );
};
