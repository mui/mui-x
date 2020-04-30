import React, { useState } from 'react';
import { ColDef, ElementSize, Grid, GridOptionsProp } from 'fin-ui-grid';
import { GridDataSet } from '../components/grid-dataset';
import { GridData } from '../data/data-service';
import '../style/grid-stories.css';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import {getDate} from "../data/random-generator";

export default {
  title: 'Grid Style',
};

export const Resize = () => {
  const [size, setSize] = useState<ElementSize>({ width: 800, height: 600 });

  return (
    <>
      <button
        onClick={() => setSize(p => ({ width: p.height, height: p.width }))}
        style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
      >
        Switch sizes
      </button>
      <GridDataSet nbRows={200} nbCols={200} container={size} />
    </>
  );
};

export const WithTooltip = () => {
  const transformColSizes = (data: GridData) =>
    data.columns.map(c => {
      if (c.field === 'currencyPair') {
        c.description = 'This is the currency pair column';
        c.width = 100;
      } else {
        c.width = 40;
      }
      return c;
    });

  return <GridDataSet nbRows={200} nbCols={200} onData={transformColSizes} />;
};

export const Big = () => {
  const options: GridOptionsProp = {
    headerHeight: 50,
    rowHeight: 35,
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};

export const Unset = () => {
  return <GridDataSet nbRows={200} nbCols={200} />;
};

export const Small = () => {
  const options: GridOptionsProp = {
    headerHeight: 30,
    rowHeight: 22,
  };

  return <GridDataSet nbRows={200} nbCols={200} options={options} />;
};

const IsDone: React.FC<{ value: boolean }> = ({ value }) => (
  value ? <DoneIcon fontSize={'small'} /> : <ClearIcon fontSize={'small'} />
);

export const withCellClass = () => {
  const size = { width: 800, height: 600 };
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    {
      field: 'age',
      cellClass: ['age', 'shine'],
      headerClass: 'age',
      type: 'number',
    },
    {
      field: 'fullName',
      description:'this column has a value getter and is not sortable',
      sortable: false,
      valueGetter: (params)=> `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
      cellClassRules: {
        common: params => params.data['lastName'] === 'Smith',
        unknown: params => !params.data['lastName'],
      },
    },
    {
      field: 'isRegistered',
      description: 'Is Registered',
      align: 'center',
      cellRenderer: params => <IsDone value={!!params.value} />,
      headerComponent: params=> <CreateIcon />,
      headerAlign: 'center'
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
      width: 200
    },
  ];

  const rows = [
    { id: 1, firstName: 'alice', age: 40 },
    { id: 2, lastName: 'Smith', firstName: 'bob',   isRegistered: true, age: 30, registerDate: getDate(), lastLoginDate: getDate()},
    { id: 3, lastName: 'Smith', firstName: 'igor',  isRegistered: false, age: 40, registerDate: getDate() },
    { id: 4, lastName: 'James', firstName: 'clara', isRegistered: true, age: 40, registerDate: getDate(), lastLoginDate: getDate() },
    { id: 5, lastName: 'Bobby', firstName: 'clara', isRegistered: false, age: null, registerDate: getDate(), lastLoginDate: getDate() },
    { id: 6, lastName: 'James', firstName: null,    isRegistered: false, age: 40, registerDate: getDate(), lastLoginDate: getDate() },
    { id: 7, lastName: 'Smith', firstName: '',      isRegistered: true, age: 40 },
  ];

  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid rows={rows} columns={columns} />
    </div>
  );
};