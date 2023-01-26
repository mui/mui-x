import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  useGridApiContext,
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import locale from 'date-fns/locale/en-US';
import { styled } from '@mui/material/styles';
import { TextFieldProps } from '@mui/material/TextField';

function buildApplyDateFilterFn(
  filterItem: GridFilterItem,
  compareFn: (value1: number, value2: number) => boolean,
  showTime: boolean = false,
) {
  if (!filterItem.value) {
    return null;
  }

  // Make a copy of the date to not reset the hours in the original object
  const filterValueCopy = new Date(filterItem.value);
  filterValueCopy.setHours(0, 0, 0, 0);

  const filterValueMs = filterValueCopy.getTime();

  return ({ value }: GridCellParams<any, Date>): boolean => {
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
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
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
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
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
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
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
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
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
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
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
      InputComponent: GridFilterDateInput,
      InputComponentProps: { showTime },
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

const dateColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getDateFilterOperators(),
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

function WrappedGridEditDateInput(props: TextFieldProps) {
  const { inputRef, InputProps, ...other } = props;
  return (
    <GridEditDateInput
      fullWidth
      ref={inputRef}
      {...InputProps}
      {...(other as InputBaseProps)}
    />
  );
}

function GridEditDateCell({
  id,
  field,
  value,
  colDef,
}: GridRenderEditCellParams<any, Date | string | null>) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker;

  const handleChange = (newValue: unknown) => {
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

function GridFilterDateInput(
  props: GridFilterInputValueProps & { showTime?: boolean },
) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value || null}
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

const dateTimeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getDateFilterOperators(true),
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

const columns: GridColDef[] = [
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
