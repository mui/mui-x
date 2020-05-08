import React, { useState } from 'react';
import { GridDataSet } from '../components/grid-dataset';
import { GridData } from '../data/data-service';
import { getDate, random } from '../data/random-generator';

import { ColDef, Grid } from '@material-ui-x/grid';

export default {
  title: 'Grid Columns',
};

export const SmallColSizes = () => {
  const transformColSizes = (data: GridData) => data.columns.map(c => (c.width = 60));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const VerySmallColSizes = () => {
  const transformColSizes = (data: GridData) => data.columns.map(c => (c.width = 30));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const RandomColSizes = () => {
  const transformColSizes = (data: GridData) => data.columns.map(c => (c.width = Number(random(30, 300).toFixed())));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const HideCols = () => {
  const transformColSizes = (data: GridData) => data.columns.map((c, idx) => (c.hide = idx % 2 === 0));

  return <GridDataSet nbRows={100} nbCols={20} onData={transformColSizes} />;
};

export const withButtonToChangeColProp: React.FC = () => {
  const size = { width: 800, height: 600 };
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'age' },
    { field: 'age1' },
    { field: 'age2' },
    { field: 'age3' },
    { field: 'age4' },
    { field: 'fullName' },
    { field: 'isRegistered' },
    { field: 'registerDate' },
    { field: 'lastLoginDate' },
  ];

  const rows = [
    { id: 1, firstName: 'alice', age: 40 },
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'bob',
      isRegistered: true,
      age: 30,
      age1: 23,
      age2: 54,
      age3: 24,
      age4: 342,
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cols, setCols] = useState(columns);
  const changeCols = () => {
    if (cols.length === columns.length) {
      const newCols = columns.filter(c => c.field.indexOf('age') === -1);
      newCols.forEach(c => (c.resizable = false));
      setCols(newCols);
    } else {
      setCols(columns);
    }
  };

  return (
    <div>
      <div>
        <button onClick={changeCols}>Change cols </button>
      </div>
      <div style={{ width: size.width, height: size.height, resize: 'both' }}>
        <Grid rows={rows} columns={cols} />
      </div>
    </div>
  );
};
