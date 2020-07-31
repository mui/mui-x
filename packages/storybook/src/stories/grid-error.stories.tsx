import * as React from 'react';
import {XGrid, GridOptionsProp, ColDef, useApiRef, GridOverlay} from '@material-ui/x-grid';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';
import '../style/grid-stories.css';
import {useEffect} from "react";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import LinearProgress from "@material-ui/core/LinearProgress";

export default {
  title: 'X-Grid Tests/Error Handling',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

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

export const throwException = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[4].cellClassRules = {
    common: () => {
      throw new Error('Some bad stuff happened!');
    }
  };

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} />
    </div>
  );
};

export const showErrorApi = () => {
  const api = useApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);

  useEffect(()=> {
    if(api && api.current ) {
        api.current!.showError({message: 'Error loading rows!'})
    }
  },[api])

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} apiRef={api}/>
    </div>
  );
};


function CustomErrorOverlay(props) {
  return (
    <GridOverlay className="custom-overlay">
      <div style={{textAlign: "center"}}>
        <h1>{props.title}</h1>
        <p>{typeof props.error === 'string' ? props.error : props.error.message}</p>
      </div>
    </GridOverlay>
  );
}

export const CustomError = () => {
  const api = useApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);

  useEffect(() => {
    if (api && api.current) {
      api.current!.showError({error: 'Something bad happened!', title: 'BIG ERROR'})
    }
  }, [api])

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols} apiRef={api}
             components={{
               errorOverlay: CustomErrorOverlay
             }}
      />
    </div>
  );
};
export const CustomErrorWithException = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[4].cellClassRules = {
    common: () => {
      throw new Error('Some bad stuff happened!');
    }
  };

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={cols}
             components={{
        errorOverlay: CustomErrorOverlay
      }}/>
    </div>
  );
};