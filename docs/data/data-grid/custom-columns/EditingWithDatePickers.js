import * as React from 'react';
import {
  DataGrid,
  useGridApiContext,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
  getGridDateOperators,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputBase from '@mui/material/InputBase';
import { enUS as locale } from 'date-fns/locale';
import { styled } from '@mui/material/styles';

const dateAdapter = new AdapterDateFns({ locale });

/**
 * `date` column
 */

const dateColumnType = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getGridDateOperators(false).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
    InputComponentProps: { showTime: false },
  })),
  valueFormatter: (value) => {
    if (value) {
      return dateAdapter.format(value, 'keyboardDate');
    }
    return '';
  },
};

const GridEditDateInput = styled(InputBase)({
  fontSize: 'inherit',
  padding: '0 9px',
});

function WrappedGridEditDateInput(props) {
  const { InputProps, focused, ...other } = props;
  return <GridEditDateInput fullWidth {...InputProps} {...other} />;
}

function GridEditDateCell({ id, field, value, colDef }) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker;

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Component
      value={value}
      autoFocus
      onChange={handleChange}
      slots={{ textField: WrappedGridEditDateInput }}
    />
  );
}

function GridFilterDateInput(props) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

  const handleFilterChange = (newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value ? new Date(item.value) : null}
      autoFocus
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      slotProps={{
        textField: {
          variant: 'standard',
        },
        inputAdornment: {
          sx: {
            '& .MuiButtonBase-root': {
              marginRight: -1,
            },
          },
        },
      }}
      onChange={handleFilterChange}
    />
  );
}

/**
 * `dateTime` column
 */

const dateTimeColumnType = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getGridDateOperators(true).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
    InputComponentProps: { showTime: true },
  })),
  valueFormatter: (value) => {
    if (value) {
      return dateAdapter.format(value, 'keyboardDateTime');
    }
    return '';
  },
};

const columns = [
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
    width: 230,
    editable: true,
  },
];

export default function EditingWithDatePickers() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
        <DataGrid rows={rows} columns={columns} />
      </LocalizationProvider>
    </div>
  );
}

const rows = [
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
