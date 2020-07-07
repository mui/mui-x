import * as React from 'react';
import { useMemo } from 'react';
import { XGrid, GridOptionsProp } from '@material-ui/x-grid';

import '../style/grid-stories.css';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { getDate } from '../data/random-generator';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';
import { ColDef } from '@material-ui/x-grid-modules/dist/src';

export default {
  title: 'X-Grid Tests/Styling',
  component: XGrid,
  decorators: [withKnobs, withA11y],
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

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
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
  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};

const IsDone: React.FC<{ value: boolean }> = ({ value }) =>
  value ? <DoneIcon fontSize={'small'} /> : <ClearIcon fontSize={'small'} />;

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
    valueGetter: params =>
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
    registerDate: getDate(),
    lastLoginDate: getDate(),
  },
  {
    id: 3,
    lastName: 'Smith',
    firstName: 'igor',
    isRegistered: false,
    age: 40,
    registerDate: getDate(),
  },
  {
    id: 4,
    lastName: 'James',
    firstName: 'clara',
    isRegistered: true,
    age: 40,
    registerDate: getDate(),
    lastLoginDate: getDate(),
  },
  {
    id: 5,
    lastName: 'Bobby',
    firstName: 'clara',
    isRegistered: false,
    age: null,
    registerDate: getDate(),
    lastLoginDate: getDate(),
  },
  {
    id: 6,
    lastName: 'James',
    firstName: null,
    isRegistered: false,
    age: 40,
    registerDate: getDate(),
    lastLoginDate: getDate(),
  },
  { id: 7, lastName: 'Smith', firstName: '', isRegistered: true, age: 40 },
];

export const ColumnCellClass = () => {
  const rows = useMemo(() => getRows(), []);
  const cols = useMemo(() => getColumns(), []);
  cols[3].cellClass = ['age', 'shine'];

  return (
    <div className={'grid-container'}>
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};
export const ColumnHeaderClass = () => {
  const rows = useMemo(() => getRows(), []);
  const cols = useMemo(() => getColumns(), []);
  cols[3].headerClass = ['age', 'shine'];

  return (
    <div className={'grid-container'}>
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};

export const ColumnCellClassRules = () => {
  const rows = useMemo(() => getRows(), []);
  const cols = useMemo(() => getColumns(), []);
  cols[4].cellClassRules = {
    common: params => params.data['lastName'] === 'Smith',
    unknown: params => !params.data['lastName'],
  };

  return (
    <div className={'grid-container'}>
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};

export const ColumnCellRenderer = () => {
  const rows = useMemo(() => getRows(), []);
  const cols = useMemo(() => getColumns(), []);
  cols[5].cellRenderer = params => <IsDone value={!!params.value} />;

  return (
    <div className={'grid-container'}>
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};
