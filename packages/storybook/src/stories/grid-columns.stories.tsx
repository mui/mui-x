import React, { useState } from 'react';
import { useData } from '../components/grid-dataset';

import { getDate, random } from '../data/random-generator';

import { ColDef, Grid } from '@material-ui-x/grid';

export default {
  title: 'Grid Columns',
};

export const SmallColSizes = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) => columns.map(c => ({ ...c, width: 60 }));

  return <Grid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const VerySmallColSizes = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) => columns.map(c => ({ ...c, width: 50 }));
  return <Grid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const RandomColSizes = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) =>
    columns.map(c => ({ ...c, width: Number(random(50, 300).toFixed()) }));
  return <Grid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const HideCols = () => {
  const data = useData(100, 20);
  const transformColSizes = (columns: ColDef[]) => columns.map((c, idx) => ({ ...c, hide: idx % 2 === 0 }));
  return <Grid rows={data.rows} columns={transformColSizes(data.columns)} />;
};

export const withButtonToChangeColProp: React.FC = () => {
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
    <>
      <div>
        <button onClick={changeCols}>Change cols </button>
      </div>
      <div style={{ display: 'flex', flexGrow: 1, padding: '10px' }}>
        <Grid rows={rows} columns={cols} />
      </div>
    </>
  );
};
