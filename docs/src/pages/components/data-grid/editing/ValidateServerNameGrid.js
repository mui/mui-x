import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useGridApiRef, DataGridPro } from '@mui/x-data-grid-pro';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => {
    const isDark = theme.palette.mode === 'dark';

    return {
      root: {
        '& .MuiDataGrid-cell--editable': {
          backgroundColor: isDark ? '#376331' : 'rgb(217 243 190)',
        },
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
          color: isDark ? '#ff4343' : '#750f0f',
        },
      },
    };
  },
  { defaultTheme },
);

let promiseTimeout;
function validateName(username) {
  const existingUsers = rows.map((row) => row.name.toLowerCase());

  return new Promise((resolve) => {
    promiseTimeout = setTimeout(() => {
      resolve(existingUsers.indexOf(username.toLowerCase()) === -1);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function ValidateServerNameGrid() {
  const apiRef = useGridApiRef();
  const classes = useStyles();

  const keyStrokeTimeoutRef = React.useRef();

  const preProcessEditCellProps = (params) =>
    new Promise((resolve) => {
      clearTimeout(promiseTimeout);
      clearTimeout(keyStrokeTimeoutRef.current);

      // basic debouncing here
      keyStrokeTimeoutRef.current = setTimeout(async () => {
        const isValid = await validateName(params.props.value.toString());
        resolve({ ...params.props, error: !isValid });
      }, 100);
    });

  const columns = [
    {
      field: 'name',
      headerName: 'MUI Contributor',
      width: 180,
      editable: true,
      preProcessEditCellProps,
    },
  ];

  React.useEffect(() => {
    return () => {
      clearTimeout(promiseTimeout);
      clearTimeout(keyStrokeTimeoutRef.current);
    };
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        className={classes.root}
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        isCellEditable={(params) => params.row.id === 5}
      />
    </div>
  );
}

const rows = [
  {
    id: 1,
    name: 'Damien',
  },
  {
    id: 2,
    name: 'Olivier',
  },
  {
    id: 3,
    name: 'Danail',
  },
  {
    id: 4,
    name: 'Matheus',
  },
  {
    id: 5,
    name: 'You?',
  },
];
