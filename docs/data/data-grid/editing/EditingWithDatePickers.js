import * as React from 'react';
import PropTypes from 'prop-types';
import {
  DataGrid,
  useGridApiContext,
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
import locale from 'date-fns/locale/en-US';

function buildApplyDateFilterFn(filterItem, compareFn, showTime = false) {
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
      showTime ? value.getHours() : 0,
      showTime ? value.getMinutes() : 0,
      0,
      0,
    );

    const cellValueMs = dateCopy.getTime();

    return compareFn(cellValueMs, filterValueMs);
  };
}

function getDateFilterOperators(showTime = false) {
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
        return ({ value }) => {
          return value == null;
        };
      },
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFn: () => {
        return ({ value }) => {
          return value != null;
        };
      },
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
  filterOperators: getDateFilterOperators(),
  valueFormatter: (params) => {
    if (params.value) {
      return dateAdapter.format(params.value, 'keyboardDate');
    }
    return '';
  },
};

function GridEditDateCell({ id, field, value }) {
  const apiRef = useGridApiContext();

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <DatePicker
      value={value}
      renderInput={(params) => <TextField {...params} />}
      onChange={handleChange}
    />
  );
}

GridEditDateCell.propTypes = {
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.instanceOf(Date),
};

function GridFilterDateInput(props) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

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
 * `dateTime` column
 */

GridFilterDateInput.propTypes = {
  apiRef: PropTypes.any.isRequired,
  applyValue: PropTypes.func.isRequired,
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
  showTime: PropTypes.bool,
};

const dateTimeColumnType = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateTimeCell {...params} />;
  },
  filterOperators: getDateFilterOperators(true),
  valueFormatter: (params) => {
    if (params.value) {
      return dateAdapter.format(params.value, 'keyboardDateTime');
    }
    return '';
  },
};

function GridEditDateTimeCell({ id, field, value }) {
  const apiRef = useGridApiContext();

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <DateTimePicker
      value={value}
      renderInput={(params) => <TextField {...params} />}
      onChange={handleChange}
    />
  );
}

GridEditDateTimeCell.propTypes = {
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.instanceOf(Date),
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
