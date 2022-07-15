import * as React from 'react';
import {
  DataGrid,
  GridColumns,
  GridRowsProp,
  useGridApiContext,
  GridRenderEditCellParams,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
  GridFilterItem,
  GridCellParams,
  GridColTypeDef,
  GridFilterInputValueProps,
  GRID_TIME_COL_DEF,
  DateType,
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
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import locale from 'date-fns/locale/en-US';
import { styled } from '@mui/material/styles';

function buildApplyDateFilterFn(
  filterItem: GridFilterItem,
  compareFn: (value1: number, value2: number) => boolean,
  dateType: DateType,
) {
  if (!filterItem.value) {
    return null;
  }

  const filterValueMs = filterItem.value.getTime();

  return ({ value }: GridCellParams<Date, any, any>): boolean => {
    if (!value) {
      return false;
    }

    // Make a copy of the date to not reset the hours in the original object
    const dateCopy = new Date(value);
    dateCopy.setHours(
      dateType === 'time' || dateType === 'dateTime' ? value.getHours() : 0,
      dateType === 'time' || dateType === 'dateTime' ? value.getMinutes() : 0,
      0,
      0,
    );
    const cellValueMs = dateCopy.getTime();

    return compareFn(cellValueMs, filterValueMs);
  };
}

function getDateFilterOperators(
  dateType: DateType,
): GridColTypeDef['filterOperators'] {
  return [
    {
      value: 'is',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 === value2,
          dateType,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { dateType },
    },
    {
      value: 'not',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 !== value2,
          dateType,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { dateType },
    },
    {
      value: 'after',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 > value2,
          dateType,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { dateType },
    },
    {
      value: 'onOrAfter',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 >= value2,
          dateType,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { dateType },
    },
    {
      value: 'before',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 < value2,
          dateType,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { dateType },
    },
    {
      value: 'onOrBefore',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 <= value2,
          dateType,
        );
      },
      InputComponent: GridFilterDateInput,
      InputComponentProps: { dateType },
    },
    {
      value: 'isEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value == null;
        };
      },
      requiresFilterValue: false,
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value != null;
        };
      },
      requiresFilterValue: false,
    },
  ];
}

const dateAdapter = new AdapterDateFns({ locale });

/**
 * `date` column
 */

const dateColumnType: GridColTypeDef<Date | string, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getDateFilterOperators('date'),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return dateAdapter.format(params.value, 'keyboardDate');
    }
    return '';
  },
};

const GridEditDateInput = styled(InputBase)({
  fontSize: 'inherit',
  padding: '0 9px',
});

function GridEditDateCell({
  id,
  field,
  value,
  colDef,
}: GridRenderEditCellParams<Date | string | null>) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker;

  const handleChange = (newValue: unknown) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Component
      value={value}
      renderInput={({ inputRef, inputProps, InputProps, disabled, error }) => (
        <GridEditDateInput
          fullWidth
          autoFocus
          ref={inputRef}
          {...InputProps}
          disabled={disabled}
          error={error}
          inputProps={inputProps}
        />
      )}
      onChange={handleChange}
    />
  );
}

function GridFilterDateInput(
  props: GridFilterInputValueProps & { showTime?: boolean },
) {
  const { item, dateType, applyValue, apiRef } = props;

  let Component: typeof DatePicker | typeof TimePicker | typeof DateTimePicker =
    DatePicker;
  if (dateType === 'time') {
    Component = TimePicker;
  } else if (dateType === 'dateTime') {
    Component = DateTimePicker;
  }

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value || null}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        />
      )}
      InputAdornmentProps={{
        sx: {
          '& .MuiButtonBase-root': {
            marginRight: -1,
          },
        },
      }}
      onChange={handleFilterChange}
    />
  );
}

/**
 * `time` column
 */

const timeColumnType: GridColTypeDef<Date | string, string> = {
  ...GRID_TIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditTimeCell {...params} />;
  },
  filterOperators: getDateFilterOperators('time'),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return dateAdapter.format(params.value, 'fullTime');
    }
    return '';
  },
};

function GridEditTimeCell({
  id,
  field,
  value,
}: GridRenderEditCellParams<Date | string | null>) {
  const apiRef = useGridApiContext();

  const handleChange = (newValue: unknown) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <TimePicker
      value={value}
      renderInput={(params) => <TextField {...params} />}
      onChange={handleChange}
    />
  );
}

/**
 * `dateTime` column
 */

const dateTimeColumnType: GridColTypeDef<Date | string, string> = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getDateFilterOperators('dateTime'),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return dateAdapter.format(params.value, 'keyboardDateTime');
    }
    return '';
  },
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
    field: 'hourUpdated',
    ...timeColumnType,
    headerName: 'Hour Updated',
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
    hourUpdated: randomUpdatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    hourUpdated: randomUpdatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    hourUpdated: randomUpdatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    hourUpdated: randomUpdatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    hourUpdated: randomUpdatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
