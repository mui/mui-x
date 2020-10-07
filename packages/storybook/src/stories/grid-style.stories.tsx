import * as React from 'react';
import { XGrid, GridOptionsProp, ColDef } from '@material-ui/x-grid';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { withKnobs } from '@storybook/addon-knobs';
import { useData } from '../hooks/useData';
import '../style/grid-stories.css';

export default {
  title: 'X-Grid Tests/Styling',
  component: XGrid,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const BigRowsAndHeader = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    headerHeight: 80,
    rowHeight: 60,
    checkboxSelection: true,
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const Unset = () => {
  const data = useData(200, 200);
  return <XGrid rows={data.rows} columns={data.columns} />;
};

export const Small = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    headerHeight: 35,
    rowHeight: 27,
  };
  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

const IsDone: React.FC<{ value: boolean }> = ({ value }) =>
  value ? <DoneIcon fontSize="small" /> : <ClearIcon fontSize="small" />;

const getColumns: () => ColDef[] = () => [
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
    valueGetter: (params) =>
      `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
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
  cols[3].cellClassName = ['age', 'shine'];

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};
export const ColumnHeaderClass = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[3].headerClassName = ['age', 'shine'];

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};

export const ColumnCellClassRules = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[4].cellClassRules = {
    common: (params) => params.data.lastName === 'Smith',
    unknown: (params) => !params.data.lastName,
    border: true,
  };

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};

export const ColumnCellRenderer = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[5].renderCell = (params) => <IsDone value={!!params.value} />;

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};
export const ColumnCellRendererWithPadding = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[5].renderCell = (params) => <IsDone value={!!params.value} />;

  return (
    <div className="grid-container" style={{ padding: 50 }}>
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};
