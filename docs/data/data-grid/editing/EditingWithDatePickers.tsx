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
  GridFilterItem,
  GridCellParams,
  GridColTypeDef,
  GridFilterInputValueProps,
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
import locale from 'date-fns/locale/en-US';

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

function GridFilterDateInput(props: GridFilterInputValueProps) {
  const { item, applyValue, apiRef } = props;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <DatePicker
      value={item.value || null}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        />
      )}
      onChange={handleFilterChange}
    />
  );
}

function GridFilterDateTimeInput(props: GridFilterInputValueProps) {
  const { item, applyValue, apiRef } = props;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <DateTimePicker
      value={item.value || null}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        />
      )}
      onChange={handleFilterChange}
    />
  );
}

function buildApplyDateFilterFn(
  filterItem: GridFilterItem,
  compareFn: (value1: number, value2: number) => boolean,
  showTime: boolean = false,
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
      showTime ? value.getHours() : 0,
      showTime ? value.getMinutes() : 0,
      0,
      0,
    );
    const cellValueMs = dateCopy.getTime();

    return compareFn(cellValueMs, filterValueMs);
  };
}

function getDateFilterOperators(
  showTime: boolean = false,
): GridColTypeDef['filterOperators'] {
  const InputComponent = showTime ? GridFilterDateTimeInput : GridFilterDateInput;

  return [
    {
      value: 'is',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 === value2,
          showTime,
        );
      },
      InputComponent,
    },
    {
      value: 'not',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 !== value2,
          showTime,
        );
      },
      InputComponent,
    },
    {
      value: 'after',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 > value2,
          showTime,
        );
      },
      InputComponent,
    },
    {
      value: 'onOrAfter',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 >= value2,
          showTime,
        );
      },
      InputComponent,
    },
    {
      value: 'before',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 < value2,
          showTime,
        );
      },
      InputComponent,
    },
    {
      value: 'onOrBefore',
      getApplyFilterFn: (filterItem) => {
        return buildApplyDateFilterFn(
          filterItem,
          (value1, value2) => value1 <= value2,
          showTime,
        );
      },
      InputComponent,
    },
    {
      value: 'isEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value == null;
        };
      },
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value != null;
        };
      },
    },
  ];
}

const dateAdapter = new AdapterDateFns({ locale });

const dateColumnType: GridColTypeDef = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: renderDateEditCell,
  filterOperators: getDateFilterOperators(),
  valueFormatter: (params) => {
    if (params.value) {
      return dateAdapter.format(params.value, 'keyboardDate');
    }
    return '';
  },
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
    />
  );
}

const renderDateTimeEditCell: GridColDef['renderEditCell'] = (params) => {
  return <GridEditDateTimeCell {...params} />;
};

const dateTimeColumnType: GridColTypeDef<Date | string, string> = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: renderDateTimeEditCell,
  filterOperators: getDateFilterOperators(true),
  valueFormatter: (params) => {
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
