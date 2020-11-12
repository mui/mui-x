import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import * as React from 'react';
import { FilterItem } from '../../hooks/features/filter/hiddenRowsState';
import { ColDef } from '../../models/colDef/colDef';
import { CloseIcon } from '../icons/index';

export interface FilterFormProps {
  item: FilterItem;

  showMultiFilterOperators?: boolean;
  multiFilterOperator?: any;

  applyFilterChanges: (item: FilterItem) => void;
  deleteFilter: (item: FilterItem) => void;
  columns: ColDef[];
  onSelectOpen: (event: React.ChangeEvent<{}>) => void;
}
const SUBMIT_FILTER_STROKE_TIME = 500;

export const FilterForm: React.FC<FilterFormProps> = ({
  item,
  onSelectOpen,
  deleteFilter,
  applyFilterChanges,
  columns,
  multiFilterOperator,
  showMultiFilterOperators,
}) => {
  const [filterValueState, setFilterValueState] = React.useState(item.value);
  const [applying, setIsApplying] = React.useState(true);

  const filterTimeout = React.useRef<any>();

  const changeColFilter = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      applyFilterChanges({ ...item, columnField: event.target.value as string });
    },
    [applyFilterChanges, item],
  );

  const changeOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      applyFilterChanges({ ...item, operator: event.target.value as string });
    },
    [applyFilterChanges, item],
  );

  const onFilterChange = React.useCallback(
    (event) => {
      clearTimeout(filterTimeout.current);
      const value = event.target.value;
      setFilterValueState(value);
      filterTimeout.current = setTimeout(() => {
        setIsApplying(()=> true);
        applyFilterChanges({ ...item, value });
        setIsApplying(()=> false);
      }, SUBMIT_FILTER_STROKE_TIME);
    },
    [applyFilterChanges, item],
  );

  const handleDeleteFilter = React.useCallback(() => {
    deleteFilter(item);
  }, [deleteFilter, item]);

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {showMultiFilterOperators && (
        <FormControl style={{ width: 100 }}>
          <InputLabel id="columns-filter-operator-select-label">Operators</InputLabel>
          <Select
            labelId="columns-filter-operator-select-label"
            id="columns-filter-operator-select"
            value={multiFilterOperator}
            onOpen={onSelectOpen}
            onChange={changeOperator}
          >
            <MenuItem value={0}>And</MenuItem>
            <MenuItem value={1}>Or</MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl style={{ width: 100 }}>
        <InputLabel id="columns-filter-select-label">Columns</InputLabel>
        <Select
          labelId="columns-filter-select-label"
          id="columns-filter-select"
          value={item.columnField || ''}
          onChange={changeColFilter}
          onOpen={onSelectOpen}
        >
          {columns.map((col) => (
            <MenuItem key={col.field} value={col.field}>
              {col.headerName || col.field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ width: 100 }}>
        <InputLabel id="columns-operators-select-label">Operators</InputLabel>
        <Select
          labelId="columns-operators-select-label"
          id="columns-operators-select"
          value={item.operator}
          onOpen={onSelectOpen}
          onChange={changeOperator}
        >
          <MenuItem value={0}>Contains</MenuItem>
          <MenuItem value={1}>Equals</MenuItem>
          <MenuItem value={2}>Starts with</MenuItem>
          <MenuItem value={3}>Ends with</MenuItem>
        </Select>
      </FormControl>
      <FormControl style={{ width: 100 }}>
        <TextField
          label={'Value'}
          placeholder={'Filter value'}
          value={filterValueState}
          onChange={onFilterChange}
          inputProps={{
            endAdornment: applying &&  <CloseIcon /> //Not showing???
          }}
        />
      </FormControl>
      <FormControl>
        <IconButton
          color="primary"
          aria-label="Delete"
          component="span"
          onClick={handleDeleteFilter}
        >
          <CloseIcon />
        </IconButton>
      </FormControl>
    </div>
  );
};
