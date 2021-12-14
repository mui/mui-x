import * as React from 'react';
import { DataGridPro, GridColDef, useGridApiRef, GridOverlay } from '@mui/x-data-grid-pro';
import '../style/grid-stories.css';

export default {
  title: 'DataGridPro Test/Error Handling',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

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
    valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
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

export const ThrowException = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[1].cellClassName = (params) => {
    if (params.value === 'alice') {
      throw new Error('Alice created an error!');
    }
    return '';
  };

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={cols} />
    </div>
  );
};

export const ShowErrorApi = () => {
  const api = useGridApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    if (api && api.current) {
      api.current!.showError({ message: 'Error loading rows!' });
    }
  }, [api]);

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={cols} apiRef={api} />
    </div>
  );
};
export const ErrorProp = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);

  return (
    <div className="grid-container">
      <DataGridPro
        rows={rows}
        columns={cols}
        error={{ message: 'Error can also be set in props!' }}
      />
    </div>
  );
};
function CustomErrorOverlay(props) {
  return (
    <GridOverlay className="custom-overlay">
      <div style={{ textAlign: 'center' }}>
        <h1>{props.title}</h1>
        <p>{typeof props.error === 'string' ? props.error : props.error.message}</p>
      </div>
    </GridOverlay>
  );
}

export const CustomError = () => {
  const api = useGridApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    if (api && api.current) {
      api.current!.showError({ error: 'Something bad happened!', title: 'BIG ERROR' });
    }
  }, [api]);

  return (
    <div className="grid-container">
      <DataGridPro
        rows={rows}
        columns={cols}
        apiRef={api}
        components={{
          ErrorOverlay: CustomErrorOverlay,
        }}
      />
    </div>
  );
};
export const CustomErrorWithException = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  cols[1].cellClassName = (params) => {
    if (params.value === 'alice') {
      throw new Error('Alice created an error!');
    }
    return '';
  };

  return (
    <div className="grid-container">
      <DataGridPro
        rows={rows}
        columns={cols}
        components={{
          ErrorOverlay: CustomErrorOverlay,
        }}
      />
    </div>
  );
};
function fetchError(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Bad fetch'));
    }, 0);
  });
}

export const AsyncErrorApi = () => {
  const api = useGridApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    fetchError().catch((err) => {
      api.current!.showError(err);
    });
  }, [api]);

  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={cols} apiRef={api} />
    </div>
  );
};

export const OnErrorHandler = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  const [errorMessage, setErrorMessage] = React.useState('');

  cols[1].cellClassName = (params) => {
    if (params.value === 'alice') {
      throw new Error('Alice created an error!');
    }
    return '';
  };

  const onError = React.useCallback(({ error }) => {
    setErrorMessage(`Oops! Something went wrong! ${error.message}`);
  }, []);

  return (
    <React.Fragment>
      <div>{errorMessage}</div>
      <div className="grid-container">
        <DataGridPro rows={rows} columns={cols} {...{ onError }} />
      </div>
    </React.Fragment>
  );
};
