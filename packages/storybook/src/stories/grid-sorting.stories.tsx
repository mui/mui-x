import { Button } from '@material-ui/core';
import { randomInt } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import {
  ColDef,
  XGrid,
  RowsProp,
  SortModelParams,
  SortModel,
  useApiRef,
} from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'X-Grid Tests/Sorting',
  component: XGrid,
  decorators: [withKnobs],
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
    <React.Fragment>
      <p>Click column headers to sort</p>
      <div className="grid-container">
        <XGrid rows={getRows()} columns={getColumns()} />
      </div>
    </React.Fragment>
  );
};

export const SortingOrderOverrideOption = () => {
  return (
    <React.Fragment>
      <p>Click column headers to sort</p>
      <div className="grid-container">
        <XGrid rows={getRows()} columns={getColumns()} {...{ sortingOrder: ['desc', 'asc'] }} />
      </div>
    </React.Fragment>
  );
};

export const StringSortingAsc = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const StringSortingDesc = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const NumberSortingAsc = () => {
  const columns = getColumns();
  columns[2] = { ...columns[2], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const NumberSortingDesc = () => {
  const columns = getColumns();
  columns[2] = { ...columns[2], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateSortingAsc = () => {
  const columns = getColumns();
  columns[3] = { ...columns[3], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateSortingDesc = () => {
  const columns = getColumns();
  columns[3] = { ...columns[3], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateTimeSortingAsc = () => {
  const columns = getColumns();
  columns[4] = { ...columns[4], sortDirection: 'asc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};
export const DateTimeSortingDesc = () => {
  const columns = getColumns();
  columns[4] = { ...columns[4], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const MultipleSorting = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'asc' };
  columns[2] = { ...columns[2], sortDirection: 'desc' };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const MultipleAndSortIndex = () => {
  const columns = getColumns();
  columns[1] = { ...columns[1], sortDirection: 'asc', sortIndex: 2 };
  columns[2] = { ...columns[2], sortDirection: 'desc', sortIndex: 1 };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const UnsortableLastCol = () => {
  const columns = getColumns();
  columns[columns.length] = {
    field: 'username',
    sortable: false,
    valueGetter: (params) =>
      `${params.getValue('name') || 'unknown'}_${params.getValue('age') || 'x'}`,
    width: 150,
  };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const CustomComparator = () => {
  const columns = getColumns();
  columns[columns.length] = {
    field: 'username',
    valueGetter: (params) =>
      `${params.getValue('name') || 'unknown'}_${params.getValue('age') || 'x'}`,
    sortComparator: (v1, v2, cellParams1, cellParams2) =>
      cellParams1.data.age - cellParams2.data.age,
    sortDirection: 'asc',
    width: 150,
  };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const SortingWithFormatter = () => {
  const columns = getColumns();
  columns[2] = {
    ...columns[2],
    sortDirection: 'desc',
    valueFormatter: (params) => (params.value ? `${params.value} years ` : 'unknown'),
  };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const SortModelOptionsMultiple = () => {
  const sortModel: SortModel = React.useMemo(
    () => [
      { field: 'age', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ],
    [],
  );

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={getColumns()} {...{ sortModel }} />
    </div>
  );
};
export const ApiSingleSorted = () => {
  const apiRef = useApiRef();
  React.useEffect(() => {
    apiRef.current.setSortModel([{ field: 'name', sort: 'asc' }]);
  }, [apiRef]);

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={getColumns()} apiRef={apiRef} />
    </div>
  );
};
export const ApiMultipleSorted = () => {
  const apiRef = useApiRef();
  React.useEffect(() => {
    apiRef.current.setSortModel([
      { field: 'age', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ]);
  }, [apiRef]);

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={getColumns()} apiRef={apiRef} />
    </div>
  );
};

export const SortedEventsApi = () => {
  const apiRef = useApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  const [loggedEvents, setEvents] = React.useState<any[]>([]);

  const handleEvent = React.useCallback((name, params) => {
    action(name)(params);
    setEvents((prev: any[]) => [...prev, name]);
  }, []);

  React.useEffect(() => {
    apiRef.current.onSortModelChange((params) => handleEvent('onSortModelChange', params));

    apiRef.current.setSortModel([
      { field: 'age', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ]);
  }, [apiRef, handleEvent]);

  // We had the ol so we can test it with image snapshots
  return (
    <React.Fragment>
      <div>
        <h1 style={{ fontSize: '16pt' }}>Triggered Events in order </h1>
        <ol>
          {loggedEvents.map((event, idx) => (
            <li key={event + idx}>{event}</li>
          ))}
        </ol>
      </div>
      <div className="grid-container">
        <XGrid rows={rows} columns={cols} apiRef={apiRef} />
      </div>
    </React.Fragment>
  );
};
export const SortedEventsOptions = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  const [loggedEvents, setEvents] = React.useState<any[]>([]);

  const handleEvent = React.useCallback((name, params) => {
    action(name)(params);
    setEvents((prev: any[]) => [...prev, name]);
  }, []);

  const onSortModelChange = React.useCallback(
    (params) => handleEvent('onSortModelChange', params),
    [handleEvent],
  );
  const sortModel = React.useMemo(
    () =>
      [
        { field: 'age', sort: 'desc' },
        { field: 'name', sort: 'asc' },
      ] as SortModel,
    [],
  );

  // We had the ol so we can test it with image snapshots
  return (
    <React.Fragment>
      <div>
        <h1 style={{ fontSize: '16pt' }}>Triggered Events in order </h1>
        <ol>
          {loggedEvents.map((event, idx) => (
            <li key={event + idx}>{event}</li>
          ))}
        </ol>
      </div>
      <div className="grid-container">
        <XGrid
          rows={rows}
          columns={cols}
          {...{
            onSortModelChange,
            sortModel,
          }}
        />
      </div>
    </React.Fragment>
  );
};

function sortServerRows(rows: any[], params: SortModelParams): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (params.sortModel.length === 0) {
        resolve(getRows());
        return;
      }
      const sortedCol = params.sortModel[0];
      const comparator = params.columns[0].sortComparator!;
      let sortedRows = [
        ...rows.sort((a, b) => comparator(a[sortedCol.field], b[sortedCol.field], a, b)),
      ];

      if (params.sortModel[0].sort === 'desc') {
        sortedRows = sortedRows.reverse();
      }

      resolve(sortedRows);
    }, 500);
  });
}

export const ServerSideSorting = () => {
  const [rows, setRows] = React.useState<RowsProp>(getRows());
  const [columns] = React.useState<ColDef[]>(getColumns());
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSortModelChange = React.useCallback(
    async (params: SortModelParams) => {
      setLoading(true);
      action('onSortModelChange')(params);

      const newRows = await sortServerRows(rows, params);
      setRows(newRows);
      setLoading(false);
    },
    [rows],
  );

  // We use `useMemo` here, to keep the same ref and not trigger another sort on the next rendering
  const sortBy: SortModel = React.useMemo(() => [{ field: 'age', sort: 'desc' }], []);

  return (
    <div className="grid-container">
      <XGrid
        rows={rows}
        columns={columns}
        onSortModelChange={onSortModelChange}
        sortingMode="server"
        disableMultipleColumnsSorting
        sortModel={sortBy}
        loading={loading}
      />
    </div>
  );
};

export const ResetSortingRows = () => {
  const columns = [
    {
      field: 'name',
      width: 200,
    },
    {
      field: 'team',
      width: 200,
      type: 'number',
    },
  ];
  const [rows, setRows] = React.useState<RowsProp>([]);

  const createRandomRows = () => {
    const randomRows: any[] = [];

    for (let i = 0; i < 10; i += 1) {
      const id = randomInt(0, 100000).toString();
      randomRows.push({ id, name: 'name test', team: id });
    }

    setRows(randomRows);
  };

  return (
    <div className="grid-container" style={{ flexDirection: 'column' }}>
      <Button onClick={() => createRandomRows()}>Random Rows</Button>
      <XGrid rows={rows} columns={columns} sortModel={[{ field: 'team', sort: 'asc' }]} />
    </div>
  );
};
