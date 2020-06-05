import React, { useState } from 'react';
import { ColDef, ElementSize, Grid, GridOptionsProp } from '@material-ui-x/grid';
import { useData } from '../components/grid-dataset';

import '../style/grid-stories.css';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import { getDate } from '../data/random-generator';

export default {
  title: 'Grid Style',
};

export const Resize = () => {
  const [size, setSize] = useState<ElementSize>({ width: 800, height: 600 });
  const data = useData(200, 200);

  return (
    <>
      <button
        onClick={() => setSize(p => ({ width: p.height, height: p.width }))}
        style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
      >
        Switch sizes
      </button>
      <div style={{ width: size.width, height: size.height }}>
        <Grid rows={data.rows} columns={data.columns} />
      </div>
    </>
  );
};

export const WithTooltip = () => {
  const data = useData(200, 200);
  const transformColSizes = (columns: ColDef[]) =>
    columns.map(c => {
      if (c.field === 'currencyPair') {
        return { ...c, width: 100, description: 'This is the currency pair column' };
      } else {
        return { ...c, width: 40 };
      }
    });

  return <Grid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const Big = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    headerHeight: 80,
    rowHeight: 60,
    checkboxSelection: true,
  };

  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};

export const Unset = () => {
  const data = useData(200, 200);
  return <Grid rows={data.rows} columns={data.columns} />;
};

export const Small = () => {
  const data = useData(200, 200);
  const options: GridOptionsProp = {
    headerHeight: 30,
    rowHeight: 22,
  };
  return <Grid rows={data.rows} columns={data.columns} options={options} />;
};

const IsDone: React.FC<{ value: boolean }> = ({ value }) =>
  value ? <DoneIcon fontSize={'small'} /> : <ClearIcon fontSize={'small'} />;

export const withCellClass = () => {
  const size = { width: 800, height: 600 };
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    {
      field: 'age',
      cellClass: ['age', 'shine'],
      headerClass: ['age', 'shine'],
      type: 'number',
      sortDirection: 'desc',
    },
    {
      field: 'fullName',
      description: 'this column has a value getter and is not sortable',
      headerClass: 'highlight',
      sortable: false,
      valueGetter: params => `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
      cellClassRules: {
        common: params => params.data['lastName'] === 'Smith',
        unknown: params => !params.data['lastName'],
      },
    },
    {
      field: 'isRegistered',
      description: 'Is Registered',
      align: 'center',
      // eslint-disable-next-line react/display-name
      cellRenderer: params => <IsDone value={!!params.value} />,
      // eslint-disable-next-line react/display-name
      headerComponent: params => <CreateIcon className={'icon'} />,
      headerAlign: 'center',
    },
    {
      field: 'registerDate',
      headerName: 'Registered on',
      sortDirection: 'asc',
      type: 'date',
    },
    {
      field: 'lastLoginDate',
      headerName: 'Last Seen',
      type: 'dateTime',
      width: 200,
    },
  ];

  const rows = [
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
    { id: 3, lastName: 'Smith', firstName: 'igor', isRegistered: false, age: 40, registerDate: getDate() },
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

  return (
    <div style={{ width: size.width, height: size.height, padding: '0 10px' }}>
      <Grid rows={rows} columns={columns}></Grid>
    </div>
  );
};
