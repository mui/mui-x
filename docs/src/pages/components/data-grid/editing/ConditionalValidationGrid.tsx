import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  DataGridPro,
  GridColumns,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { randomPrice } from '@mui/x-data-grid-generator';

const defaultTheme = createTheme();

const useStyles = makeStyles(
  (theme) => {
    const isDark = theme.palette.mode === 'dark';

    return {
      root: {
        '& .MuiDataGrid-cell--editing': {
          backgroundColor: 'rgb(255,215,115, 0.19)',
          color: '#1a3e72',
        },
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
          color: theme.palette.error.main,
        },
      },
    };
  },
  { defaultTheme },
);

const rows: GridRowsProp = [
  {
    id: 1,
    expense: 'Light bill',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 6, 8),
    isPaid: false,
  },
  {
    id: 2,
    expense: 'Rent',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 7, 1),
    isPaid: false,
  },
  {
    id: 3,
    expense: 'Car insurance',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 7, 4),
    isPaid: true,
    paymentMethod: 'Wire transfer',
  },
];

export default function ConditionalValidationGrid() {
  const classes = useStyles();
  const apiRef = useGridApiRef();

  const columns: GridColumns = [
    { field: 'expense', headerName: 'Expense', width: 160, editable: true },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      field: 'dueAt',
      headerName: 'Due at',
      type: 'date',
      width: 120,
      editable: true,
    },
    {
      field: 'isPaid',
      headerName: 'Is paid?',
      type: 'boolean',
      width: 140,
      editable: true,
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment method',
      type: 'singleSelect',
      valueOptions: ['Credit card', 'Wire transfer', 'Cash'],
      width: 160,
      editable: true,
      preProcessEditCellProps: (params) => {
        const editRowsModel = apiRef.current.getEditRowsModel();
        const isPaidProps = editRowsModel[params.id].isPaid;
        const hasError = isPaidProps.value && !params.props.value;
        return { ...params.props, error: hasError };
      },
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        apiRef={apiRef}
        className={classes.root}
        rows={rows}
        columns={columns}
        editMode="row"
      />
    </div>
  );
}
