import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import * as React from 'react';
import { filterableColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { FilterItem, LinkOperator } from '../../hooks/features/filter/visibleRowsState';
import { ColDef } from '../../models/colDef/colDef';
import { ApiContext } from '../api-context';
import { CloseIcon, LoadIcon } from '../icons/index';

export interface FilterFormProps {
  item: FilterItem;

  showMultiFilterOperators?: boolean;
  multiFilterOperator?: LinkOperator;
  disableMultiFilterOperator?: boolean;

  applyFilterChanges: (item: FilterItem) => void;
  applyMultiFilterOperatorChanges: (operator: LinkOperator) => void;
  deleteFilter: (item: FilterItem) => void;
  onSelectOpen: (event: React.ChangeEvent<{}>) => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  item,
  onSelectOpen,
  deleteFilter,
  applyFilterChanges,
  multiFilterOperator,
  showMultiFilterOperators,
  disableMultiFilterOperator,
  applyMultiFilterOperatorChanges,
}) => {
  const apiRef = React.useContext(ApiContext);
  const filterableColumns = useGridSelector(apiRef, filterableColumnsSelector);

  const [currentColumn, setCurrentColumn] = React.useState<ColDef | null>(() => {
    if (!item.columnField) {
      return null;
    }
    return apiRef!.current.getColumnFromField(item.columnField)!;
  });

  const changeColumn = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const columnField = event.target.value as string;
      const column = apiRef!.current.getColumnFromField(columnField)!;
      setCurrentColumn(column);

      applyFilterChanges({ ...item, columnField });
    },
    [apiRef, applyFilterChanges, item],
  );

  const changeOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      applyFilterChanges({
        ...item,
        operator: currentColumn!.filterOperators!.find(
          (op) => op.value === (event.target.value as string),
        )!,
      });
    },
    [applyFilterChanges, currentColumn, item],
  );

  const changeLinkOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const linkOperator =
        (event.target.value as string) === LinkOperator.And.toString()
          ? LinkOperator.And
          : LinkOperator.Or;
      applyMultiFilterOperatorChanges(linkOperator);
    },
    [applyMultiFilterOperatorChanges],
  );

  const handleDeleteFilter = React.useCallback(() => {
    deleteFilter(item);
  }, [deleteFilter, item]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
      <FormControl
        style={{ width: 60, visibility: showMultiFilterOperators ? 'visible' : 'hidden' }}
      >
        <InputLabel id="columns-filter-operator-select-label">Operators</InputLabel>
        <Select
          labelId="columns-filter-operator-select-label"
          id="columns-filter-operator-select"
          value={multiFilterOperator}
          onOpen={onSelectOpen}
          onChange={changeLinkOperator}
          disabled={!!disableMultiFilterOperator}
        >
          <MenuItem key={LinkOperator.And.toString()} value={LinkOperator.And.toString()}>
            And
          </MenuItem>
          <MenuItem key={LinkOperator.Or.toString()} value={LinkOperator.Or.toString()}>
            Or
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl style={{ width: 150 }}>
        <InputLabel id="columns-filter-select-label">Columns</InputLabel>
        <Select
          labelId="columns-filter-select-label"
          id="columns-filter-select"
          value={item.columnField || ''}
          onChange={changeColumn}
          onOpen={onSelectOpen}
        >
          {filterableColumns.map((col) => (
            <MenuItem key={col.field} value={col.field}>
              {col.headerName || col.field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ width: 120 }}>
        <InputLabel id="columns-operators-select-label">Operators</InputLabel>
        <Select
          labelId="columns-operators-select-label"
          id="columns-operators-select"
          value={item.operator?.value}
          onOpen={onSelectOpen}
          onChange={changeOperator}
        >
          {currentColumn?.filterOperators?.map((operator) => (
            <MenuItem key={operator.value} value={operator.value}>
              {operator.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ width: 120 }}>
        {item.operator &&
          React.createElement(item.operator?.InputComponent, {
            item,
            applyValue: applyFilterChanges,
          })}
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
