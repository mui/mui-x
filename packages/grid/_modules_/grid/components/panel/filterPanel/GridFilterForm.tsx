import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { capitalize } from '@material-ui/core/utils';
import { makeStyles } from '@material-ui/core/styles';
import { filterableGridColumnsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridFilterOperator } from '../../../models/gridFilterOperator';
import { GridApiContext } from '../../GridApiContext';
import { GridCloseIcon } from '../../icons/index';
import { TranslationKeys } from '../../../models/api/gridLocaleTextApi';

export interface GridFilterFormProps {
  item: GridFilterItem;
  hasMultipleFilters: boolean;
  showMultiFilterOperators?: boolean;
  multiFilterOperator?: GridLinkOperator;
  disableMultiFilterOperator?: boolean;
  applyFilterChanges: (item: GridFilterItem) => void;
  applyMultiFilterOperatorChanges: (operator: GridLinkOperator) => void;
  deleteFilter: (item: GridFilterItem) => void;
}

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: 8,
    },
    linkOperatorSelect: {
      width: 60,
    },
    columnSelect: {
      width: 150,
    },
    operatorSelect: {
      width: 120,
    },
    filterValueInput: {
      width: 190,
    },
    closeIcon: {
      flexShrink: 0,
      justifyContent: 'flex-end',
      marginRight: 6,
      marginBottom: 2,
    },
  }),
  { name: 'MuiDataGridFilterForm' },
);

export function GridFilterForm(props: GridFilterFormProps) {
  const {
    item,
    hasMultipleFilters,
    deleteFilter,
    applyFilterChanges,
    multiFilterOperator,
    showMultiFilterOperators,
    disableMultiFilterOperator,
    applyMultiFilterOperatorChanges,
  } = props;
  const classes = useStyles();
  const apiRef = React.useContext(GridApiContext);
  const filterableColumns = useGridSelector(apiRef, filterableGridColumnsSelector);
  const [currentColumn, setCurrentColumn] = React.useState<GridColDef | null>(() => {
    if (!item.columnField) {
      return null;
    }
    return apiRef!.current.getColumnFromField(item.columnField)!;
  });
  const [currentOperator, setCurrentOperator] = React.useState<GridFilterOperator | null>(() => {
    if (!item.operatorValue || !currentColumn) {
      return null;
    }

    return (
      currentColumn.filterOperators?.find((operator) => operator.value === item.operatorValue) ||
      null
    );
  });

  const changeColumn = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const columnField = event.target.value as string;
      const column = apiRef!.current.getColumnFromField(columnField)!;
      const newOperator = column.filterOperators![0];
      setCurrentOperator(newOperator);
      setCurrentColumn(column);

      applyFilterChanges({
        ...item,
        value: undefined,
        columnField,
        operatorValue: newOperator.value,
      });
    },
    [apiRef, applyFilterChanges, item],
  );

  const changeOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const operatorValue = event.target.value as string;
      applyFilterChanges({
        ...item,
        operatorValue,
      });
      const newOperator =
        currentColumn!.filterOperators?.find((operator) => operator.value === operatorValue) ||
        null;
      setCurrentOperator(newOperator);
    },
    [applyFilterChanges, currentColumn, item],
  );

  const changeLinkOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const linkOperator =
        (event.target.value as string) === GridLinkOperator.And.toString()
          ? GridLinkOperator.And
          : GridLinkOperator.Or;
      applyMultiFilterOperatorChanges(linkOperator);
    },
    [applyMultiFilterOperatorChanges],
  );

  const handleDeleteFilter = React.useCallback(() => {
    deleteFilter(item);
  }, [deleteFilter, item]);

  return (
    <div className={classes.root}>
      <FormControl className={classes.closeIcon}>
        <IconButton
          aria-label={apiRef!.current.getLocaleText('filterPanelDeleteIconLabel')}
          title={apiRef!.current.getLocaleText('filterPanelDeleteIconLabel')}
          onClick={handleDeleteFilter}
          size="small"
        >
          <GridCloseIcon fontSize="small" />
        </IconButton>
      </FormControl>
      <FormControl
        className={classes.linkOperatorSelect}
        style={{
          display: hasMultipleFilters ? 'block' : 'none',
          visibility: showMultiFilterOperators ? 'visible' : 'hidden',
        }}
      >
        <InputLabel id="columns-filter-operator-select-label">
          {apiRef!.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <Select
          labelId="columns-filter-operator-select-label"
          id="columns-filter-operator-select"
          value={multiFilterOperator}
          onChange={changeLinkOperator}
          disabled={!!disableMultiFilterOperator}
          native
        >
          <option key={GridLinkOperator.And.toString()} value={GridLinkOperator.And.toString()}>
            {apiRef!.current.getLocaleText('filterPanelOperatorAnd')}
          </option>
          <option key={GridLinkOperator.Or.toString()} value={GridLinkOperator.Or.toString()}>
            {apiRef!.current.getLocaleText('filterPanelOperatorOr')}
          </option>
        </Select>
      </FormControl>
      <FormControl className={classes.columnSelect}>
        <InputLabel id="columns-filter-select-label">
          {apiRef!.current.getLocaleText('filterPanelColumns')}
        </InputLabel>
        <Select
          labelId="columns-filter-select-label"
          id="columns-filter-select"
          value={item.columnField || ''}
          onChange={changeColumn}
          native
        >
          {filterableColumns.map((col) => (
            <option key={col.field} value={col.field}>
              {col.headerName || col.field}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.operatorSelect}>
        <InputLabel id="columns-operators-select-label">
          {apiRef!.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <Select
          labelId="columns-operators-select-label"
          id="columns-operators-select"
          value={item.operatorValue}
          onChange={changeOperator}
          native
        >
          {currentColumn?.filterOperators?.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.label ||
                apiRef!.current.getLocaleText(
                  `filterOperator${capitalize(operator.value)}` as TranslationKeys,
                )}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.filterValueInput}>
        {currentColumn &&
          currentOperator &&
          React.createElement(currentOperator.InputComponent, {
            apiRef,
            item,
            applyValue: applyFilterChanges,
            ...currentOperator.InputComponentProps,
          })}
      </FormControl>
    </div>
  );
}
