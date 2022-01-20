import * as React from 'react';
import clsx from 'clsx';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { useData } from '../hooks/useData';
import '../style/grid-stories.css';

export default {
  title: 'DataGridPro Test/Styling',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const BigRowsAndHeader = () => {
  const data = useData(200, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      headerHeight={80}
      rowHeight={60}
      checkboxSelection
    />
  );
};

export const Unset = () => {
  const data = useData(200, 200);
  return <DataGridPro rows={data.rows} columns={data.columns} />;
};

export const Small = () => {
  const data = useData(200, 200);

  return <DataGridPro rows={data.rows} columns={data.columns} headerHeight={35} rowHeight={27} />;
};

interface IsDoneProps {
  value: boolean;
}

const IsDone = (props: IsDoneProps) =>
  props.value ? <DoneIcon fontSize="small" /> : <ClearIcon fontSize="small" />;

const getColumns: () => GridColDef[] = () => [
  { field: 'id' },
  { field: 'firstName' },
  { field: 'lastName' },
  {
    field: 'age',
    type: 'number',
  },
  {
    field: 'fullName',
    description: 'this column has a value getter and is not sortable',
    sortable: false,
    valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`.trim(),
  },
  {
    field: 'isRegistered',
    description: 'Is Registered',
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'registerDate',
    headerName: 'Registered on',
    type: 'date',
  },
  {
    field: 'lastLoginDate',
    headerName: 'Last Seen',
    type: 'dateTime',
    width: 200,
  },
];

const getRows = () => [
  { id: 1, firstName: 'alice', age: 40 },
  {
    id: 2,
    lastName: 'Smith',
    firstName: 'bob',
    isRegistered: true,
    age: 30,
    registerDate: new Date(2011, 6, 16),
    lastLoginDate: new Date(2020, 2, 14, 7, 30, 25),
  },
  {
    id: 3,
    lastName: 'Smith',
    firstName: 'igor',
    isRegistered: false,
    age: 40,
    registerDate: new Date(2016, 8, 1),
  },
  {
    id: 4,
    lastName: 'James',
    firstName: 'clara',
    isRegistered: true,
    age: 40,
    registerDate: new Date(2011, 1, 1),
    lastLoginDate: new Date(2020, 2, 10, 15, 30, 25),
  },
  {
    id: 5,
    lastName: 'Bobby',
    firstName: 'clara',
    isRegistered: false,
    age: null,
    registerDate: new Date(2018, 0, 1),
    lastLoginDate: new Date(2020, 5, 29, 18, 0, 25),
  },
  {
    id: 6,
    lastName: 'James',
    firstName: null,
    isRegistered: false,
    age: 40,
    registerDate: new Date(2013, 8, 16),
    lastLoginDate: new Date(2019, 6, 4, 22, 36, 25),
  },
  { id: 7, lastName: 'Smith', firstName: '', isRegistered: true, age: 40 },
];

export const ColumnCellClass = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[3].cellClassName = () => clsx('age', 'shine');
  cols[1].cellClassName = (params) => (!params.value ? 'unknown' : '');

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={cols} />
    </div>
  );
};
export const ColumnHeaderClass = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[3].headerClassName = () => clsx('age', 'shine');

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={cols} />
    </div>
  );
};

export const ColumnCellRenderer = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[5].renderCell = (params) => <IsDone value={!!params.value} />;

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={cols} />
    </div>
  );
};
export const ColumnCellRendererWithPadding = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[5].renderCell = (params) => <IsDone value={!!params.value} />;

  return (
    <div className="grid-container" style={{ padding: 50 }}>
      <DataGridPro rows={rows} columns={cols} />
    </div>
  );
};
