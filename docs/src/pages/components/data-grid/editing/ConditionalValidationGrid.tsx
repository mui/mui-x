import * as React from 'react';
import { createTheme, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
  DataGrid,
  GridColumns,
  GridEditRowsModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { randomPrice } from '@mui/x-data-grid-generator';

function getThemePaletteMode(palette: any): string {
  return palette.type || palette.mode;
}

const defaultTheme = createTheme();

const useStyles = makeStyles(
  (theme: Theme) => {
    const isDark = getThemePaletteMode(theme.palette) === 'dark';

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

const columns: GridColumns = [
  { field: 'expense', headerName: 'Expense', width: 160, editable: true },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 120,
    editable: true,
  },
  { field: 'dueAt', headerName: 'Due at', type: 'date', width: 160, editable: true },
  {
    field: 'isPaid',
    headerName: 'Is paid?',
    type: 'boolean',
    width: 140,
    editable: true,
  },
  {
    field: 'paidAt',
    headerName: 'Paid at',
    type: 'date',
    width: 160,
    editable: true,
  },
];

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
    paidAt: new Date(2021, 7, 2),
  },
];

export default function ConditionalValidationGrid() {
  const classes = useStyles();
  const [editRowsModel, setEditRowsModel] = React.useState<GridEditRowsModel>({});

  const handleEditRowsModelChange = React.useCallback(
    (newModel: GridEditRowsModel) => {
      const updatedModel = { ...newModel };
      Object.keys(updatedModel).forEach((id) => {
        const hasError =
          updatedModel[id].isPaid.value && !updatedModel[id].paidAt.value;
        updatedModel[id].paidAt = { ...updatedModel[id].paidAt, error: hasError };
      });
      setEditRowsModel(updatedModel);
    },
    [],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        className={classes.root}
        rows={rows}
        columns={columns}
        editMode="row"
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
      />
    </div>
  );
}
