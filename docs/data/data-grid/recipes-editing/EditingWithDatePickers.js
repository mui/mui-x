import * as React from 'react';
import PropTypes from 'prop-types';
import {
  DataGrid,
  useGridApiContext,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
  GRID_TIME_COL_DEF,
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

function buildApplyDateFilterFn(filterItem, compareFn, dateType) {
  if (!filterItem.value) {
    return null;
  }

  const filterValueMs = filterItem.value.getTime();

  return ({ value }) => {
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

function getDateFilterOperators(dateType) {
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
        return ({ value }) => {
          return value == null;
        };
      },
      requiresFilterValue: false,
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFn: () => {
        return ({ value }) => {
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

const dateColumnType = {
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

function GridEditDateCell({ id, field, value, colDef }) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker;

  const handleChange = (newValue) => {
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

GridEditDateCell.propTypes = {
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
};

function GridFilterDateInput(props) {
  const { item, dateType, applyValue, apiRef } = props;

  let Component = DatePicker;
  if (dateType === 'time') {
    Component = TimePicker;
  } else if (dateType === 'dateTime') {
    Component = DateTimePicker;
  }

  const handleFilterChange = (newValue) => {
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

const timeColumnType = {
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

function GridEditTimeCell({ id, field, value }) {
  const apiRef = useGridApiContext();

  const handleChange = (newValue) => {
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

GridFilterDateInput.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  dateType: PropTypes.oneOf(['date', 'time', 'dateTime']),
  item: PropTypes.shape({
    /**
     * The column from which we want to filter the rows.
     */
    columnField: PropTypes.string.isRequired,
    /**
     * Must be unique.
     * Only useful when the model contains several items.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * The name of the operator we want to apply.
     * Will become required on `@mui/x-data-grid@6.X`.
     */
    operatorValue: PropTypes.string,
    /**
     * The filtering value.
     * The operator filtering function will decide for each row if the row values is correct compared to this value.
     */
    value: PropTypes.any,
  }).isRequired,
};

const dateTimeColumnType = {
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

const rows = [
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
