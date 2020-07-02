import * as React from 'react';
import { Columns, Grid, RowsProp } from '@material-ui/x-grid';
import { useCallback, useMemo, useState } from 'react';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';
import { Button } from '@material-ui/core';
import {CellValue} from "@material-ui/x-grid-modules/dist/src";

export const ColumnTypesDemo = () => {
  const columns: Columns = useMemo(
    () => [
      { field: 'id', hide: true },
      { field: 'name', type: 'string' },
      { field: 'age', type: 'number' },
      { field: 'dateCreated', type: 'date', width: 180 },
      { field: 'lastLogin', type: 'dateTime', width: 180 },
    ],
    [],
  );

  const rows: RowsProp = useMemo(
    () => [
      {
        id: 1,
        name: 'Damien',
        age: 25,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 2,
        name: 'Nicolas',
        age: 36,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 3,
        name: 'Kate',
        age: 19,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 4,
        name: 'Sebastien',
        age: 28,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 5,
        name: 'Louise',
        age: 23,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
    ],
    [],
  );

  //TODO use XGrid when published
  return (
    <div style={{ width: 800, height: 500 }}>
      <Grid rows={rows} columns={columns} options={{ hideFooter: true }} />
    </div>
  );
};

export const HideColumnDemo = () => {
  const [columns, setColumns] = useState<Columns>([
    { field: 'id', hide: true },
    { field: 'name', type: 'string' },
    { field: 'age', type: 'number' },
    { field: 'dateCreated', type: 'date', width: 180 },
    { field: 'lastLogin', type: 'dateTime', width: 180 },
  ]);

  const rows: RowsProp = useMemo(
    () => [
      {
        id: 1,
        name: 'Damien',
        age: 25,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 2,
        name: 'Nicolas',
        age: 36,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 3,
        name: 'Kate',
        age: 19,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 4,
        name: 'Sebastien',
        age: 28,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 5,
        name: 'Louise',
        age: 23,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
    ],
    [],
  );

  const toggleLastLogin = useCallback(() => {
    setColumns(cols =>
      cols.map(col => {
        if (col.field === 'lastLogin') {
          col.hide = !col.hide;
        }
        return col;
      }),
    );
  }, [setColumns]);

  //TODO use XGrid when published
  return (
    <>
      <Button onClick={toggleLastLogin} color={'primary'} variant={"contained"} size={"small"}>
        Toggle Last Login Column
      </Button>
      <div style={{ width: 800, height: 500, padding:'10px 0' }}>
        <Grid rows={rows} columns={columns} options={{ hideFooter: true }} />
      </div>
    </>
  );
};

export const ValueGetterDemo = () => {
  const columns = useMemo<Columns>(()=> [
    { field: 'firstName'},
    { field: 'lastName' },
    { field: 'fullName', width: 200, valueGetter: ({data})=> `${data.firstName} ${data.lastName}` }
  ], []);

  const rows: RowsProp = useMemo(
    () => [
      {
        id: 1,
        firstName: 'Paul',
        lastName: 'Kenton',
      },
      {
        id: 2,
        firstName: 'Jack',
        lastName: 'Kilby',
      },
      {
        id: 3,
        firstName: 'John',
        lastName: 'Napier',
      },
    ],
    [],
  );

  return (
      <div style={{ width: 800, height: 500, padding:'10px 0' }}>
        <Grid rows={rows} columns={columns} options={{ hideFooter: true }} />
      </div>
  );
};

export const FormattingDemo = () => {
  const columns = useMemo<Columns>(()=> [
    { field: 'date', headerName: 'Year', valueFormatter: ({value}: {value: CellValue})=> (value as Date).getFullYear() }
  ], []);

  const rows: RowsProp = useMemo(
    () => [
      {
        id: 1,
        date: new Date(1979, 0, 1),
      },
      {
        id: 2,
        date: new Date(1984, 1, 1)
      },
      {
        id: 3,
        date: new Date(1992, 2, 1)
      },
    ],
    [],
  );

  return (
    <div style={{ width: 800, height: 500, padding:'10px 0' }}>
      <Grid rows={rows} columns={columns} options={{ hideFooter: true }} />
    </div>
  );
};
