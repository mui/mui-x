import * as React from 'react';
import {
  DataGrid,
  GridColumns,
  GridRowsProp,
  useGridApiContext,
  GridColDef,
  GridRenderEditCellParams,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';

function GridEditDateCell({
  id,
  field,
  value,
}: GridRenderEditCellParams<Date | null>) {
  const apiRef = useGridApiContext();

  function handleChange(newValue: unknown) {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  }

  return (
    <DatePicker
      value={value}
      renderInput={(params) => <TextField {...params} />}
      onChange={handleChange}
    />
  );
}

const renderDateEditCell: GridColDef['renderEditCell'] = (params) => {
  return <GridEditDateCell {...params} />;
};

const dateColumnType = {
  ...GRID_DATE_COL_DEF,
  renderEditCell: renderDateEditCell,
};

function GridEditDateTimeCell({
  id,
  field,
  value,
}: GridRenderEditCellParams<Date | null>) {
  const apiRef = useGridApiContext();

  function handleChange(newValue: unknown) {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  }

  return (
    <DateTimePicker
      value={value}
      renderInput={(params) => <TextField {...params} />}
      onChange={handleChange}
      ampm={false}
    />
  );
}

const renderDateTimeEditCell: GridColDef['renderEditCell'] = (params) => {
  return <GridEditDateTimeCell {...params} />;
};

const dateTimeColumnType = {
  ...GRID_DATETIME_COL_DEF,
  renderEditCell: renderDateTimeEditCell,
};

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    ...dateColumnType,
    headerName: 'Date Created',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    ...dateTimeColumnType,
    headerName: 'Last Login',
    width: 220,
    editable: true,
  },
];

export default function EditingWithDatePickers() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DataGrid
          rows={rows}
          columns={columns}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </LocalizationProvider>
    </div>
  );
}

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
