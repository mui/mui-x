import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { randomPrice } from '@mui/x-data-grid-generator';

const StyledBox = styled('div')(({ theme }) => ({
  height: 300,
  width: '100%',
  '& .MuiDataGrid-cell--editing': {
    backgroundColor: 'rgb(255,215,115, 0.19)',
    color: '#1a3e72',
    '& .MuiInputBase-root': {
      height: '100%',
    },
  },
  '& .Mui-error': {
    backgroundColor: 'rgb(126,10,15, 0.1)',
    color: theme.palette.error.main,
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgb(126,10,15, 0)',
    }),
  },
}));

const rows = [
  {
    id: 1,
    expense: 'Light bill',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 6, 8),
    isPaid: false,
    paymentMethod: '',
  },
  {
    id: 2,
    expense: 'Rent',
    price: randomPrice(0, 1000),
    dueAt: new Date(2021, 7, 1),
    isPaid: false,
    paymentMethod: '',
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
  const columns = [
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
        const isPaidProps = params.otherFieldsProps.isPaid;
        const hasError = isPaidProps.value && !params.props.value;
        return { ...params.props, error: hasError };
      },
    },
  ];

  return (
    <StyledBox>
      <DataGrid rows={rows} columns={columns} editMode="row" />
    </StyledBox>
  );
}
