import React from 'react';
import { ColDef, Grid, GridOverlay, Footer, GridApiRef, gridApiRef } from '@material-ui/x-grid';
import { LinearProgress } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { Pagination } from '@material-ui/lab';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import { useData } from '../../hooks/useData';

export default {
  title: 'X-Grid Demos/Custom-Components',
  component: Grid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
    docs: {
      page: null,
    },
  },
};

const columns: ColDef[] = [
  { field: 'id' },
  { field: 'name', sortDirection: 'asc' },
  { field: 'age', sortDirection: 'desc' },
];

const rows = [
  { id: 1, name: 'alice', age: 40 },
  { id: 2, name: 'bob', age: 30 },
  { id: 3, name: 'igor', age: 40 },
  { id: 4, name: 'clara', age: 40 },
  { id: 5, name: 'clara', age: null },
  { id: 6, name: null, age: 25 },
  { id: 7, name: '', age: 42 },
];

export const Loading = () => {
  const loadingComponent = (
    <GridOverlay className={'custom-overlay'}>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
  return (
    <div className="grid-container">
      <Grid
        rows={rows}
        columns={columns}
        options={{ loadingOverlayComponent: loadingComponent }}
        loading={true}
      />
    </div>
  );
};

export const NoRows = () => {
  const loadingComponent = (
    <GridOverlay className={'custom-overlay'}>
      <CodeIcon />
      <span style={{ lineHeight: '24px', padding: '0 10px' }}>No Rows</span>
      <CodeIcon />
    </GridOverlay>
  );
  return (
    <div className="grid-container">
      <Grid rows={[]} columns={columns} options={{ noRowsOverlayComponent: loadingComponent }} />
    </div>
  );
};
export const Icons = () => {
  return (
    <div className="grid-container">
      <Grid
        rows={rows}
        columns={columns}
        options={{
          icons: {
            // eslint-disable-next-line react/display-name
            columnSortedDescending: () => <ExpandMoreIcon className={'icon'} />,
            // eslint-disable-next-line react/display-name
            columnSortedAscending: () => <ExpandLessIcon className={'icon'} />,
          },
        }}
      />
    </div>
  );
};

export const CustomPagination = () => {
  const apiRef: GridApiRef = gridApiRef();
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        apiRef={apiRef}
        options={{
          pagination: true,
          paginationPageSize: 50,
          paginationComponent: paginationProps => (
            <Pagination
              className={'my-custom-pagination'}
              page={paginationProps.page}
              count={paginationProps.pageCount}
              onChange={(e, value) => paginationProps.setPage(value)}
            />
          ),
        }}
      />
    </div>
  );
};
export const CustomFooter = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useData(2000, 200);
  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 33,
          hideFooterPagination: true,
          hideFooter: true,
          footerComponent: ({ paginationProps }) => (
            <Footer className={'my-custom-footer'}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                This is my custom footer and pagination here!{' '}
              </span>
              <Pagination
                className={'my-custom-pagination'}
                page={paginationProps.page}
                count={paginationProps.pageCount}
                onChange={(e, value) => paginationProps.setPage(value)}
              />
            </Footer>
          ),
        }}
      />
    </div>
  );
};

export const HeaderAndFooter = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 33,
          hideFooterPagination: true,
          headerComponent: ({ paginationProps }) => (
            <div className={'custom-header'}>
              <Pagination
                className={'my-custom-pagination'}
                page={paginationProps.page}
                count={paginationProps.pageCount}
                onChange={(e, value) => paginationProps.setPage(value)}
              />
            </div>
          ),
          footerComponent: ({ paginationProps }) => (
            <div className="footer my-custom-footer">
              {' '}
              I counted {paginationProps.rowCount} row(s){' '}
            </div>
          ),
        }}
      />
    </div>
  );
};
const IsDone: React.FC<{ value: boolean }> = ({ value }) =>
  value ? <DoneIcon fontSize={'small'} /> : <ClearIcon fontSize={'small'} />;

export const StyledColumns = () => {
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
      valueGetter: params =>
        `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
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
      registerDate: new Date(2010, 10, 25),
      lastLoginDate: new Date(2019, 0, 30, 10, 55, 32),
    },
    {
      id: 3,
      lastName: 'Smith',
      firstName: 'igor',
      isRegistered: false,
      age: 40,
      registerDate: new Date(2013, 2, 13),
    },
    {
      id: 4,
      lastName: 'James',
      firstName: 'clara',
      isRegistered: true,
      age: 40,
      registerDate: new Date(2011, 2, 11),
      lastLoginDate: new Date(2020, 4, 28, 11, 30, 25),
    },
    {
      id: 5,
      lastName: 'Bobby',
      firstName: 'clara',
      isRegistered: false,
      age: null,
      registerDate: new Date(2010, 10, 2),
      lastLoginDate: new Date(2020, 0, 5, 10, 11, 32),
    },
    {
      id: 6,
      lastName: 'James',
      firstName: null,
      isRegistered: false,
      age: 40,
      registerDate: new Date(2015, 11, 6),
      lastLoginDate: new Date(2020, 5, 20, 15, 35, 10),
    },
    { id: 7, lastName: 'Smith', firstName: '', isRegistered: true, age: 40 },
  ];

  return (
    <div className="grid-container">
      <Grid rows={rows} columns={columns}></Grid>
    </div>
  );
};
