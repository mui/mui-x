import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { capitalize, unstable_useId as useId } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import { filterableGridColumnsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridCloseIcon } from '../../icons/index';
import { GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../../GridComponentProps';
import { getDataGridUtilityClass } from '../../../gridClasses';

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

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['filterForm'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridFilterFormRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterForm',
  overridesResolver: (props, styles) => styles.filterForm,
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: theme.spacing(1),
}));

function GridFilterForm(props: GridFilterFormProps) {
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
  const apiRef = useGridApiContext();
  const filterableColumns = useGridSelector(apiRef, filterableGridColumnsSelector);
  const linkOperatorSelectId = useId();
  const linkOperatorSelectLabelId = useId();
  const columnSelectId = useId();
  const columnSelectLabelId = useId();
  const operatorSelectId = useId();
  const operatorSelectLabelId = useId();
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const currentColumn = item.columnField ? apiRef.current.getColumn(item.columnField) : null;

  const currentOperator = React.useMemo(() => {
    if (!item.operatorValue || !currentColumn) {
      return null;
    }

    return currentColumn.filterOperators?.find((operator) => operator.value === item.operatorValue);
  }, [item, currentColumn]);

  const changeColumn = React.useCallback(
    (event: SelectChangeEvent) => {
      const columnField = event.target.value as string;
      const column = apiRef.current.getColumn(columnField)!;
      const newOperator = column.filterOperators![0];

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
    (event: SelectChangeEvent) => {
      const operatorValue = event.target.value as string;
      applyFilterChanges({
        ...item,
        operatorValue,
      });
    },
    [applyFilterChanges, item],
  );

  const changeLinkOperator = React.useCallback(
    (event: SelectChangeEvent) => {
      const linkOperator =
        (event.target.value as string) === GridLinkOperator.And.toString()
          ? GridLinkOperator.And
          : GridLinkOperator.Or;
      applyMultiFilterOperatorChanges(linkOperator);
    },
    [applyMultiFilterOperatorChanges],
  );

  const handleDeleteFilter = () => {
    if (rootProps.disableMultipleColumnsFiltering) {
      applyFilterChanges({ ...item, value: undefined });
    } else {
      deleteFilter(item);
    }
  };

  return (
    <GridFilterFormRoot className={classes.root}>
      <FormControl
        variant="standard"
        sx={{ flexShrink: 0, justifyContent: 'flex-end', marginRight: 0.5, marginBottom: 0.2 }}
      >
        <IconButton
          aria-label={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
          title={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
          onClick={handleDeleteFilter}
          size="small"
        >
          <GridCloseIcon fontSize="small" />
        </IconButton>
      </FormControl>
      <FormControl
        variant="standard"
        sx={{
          minWidth: 60,
          display: hasMultipleFilters ? 'block' : 'none',
          visibility: showMultiFilterOperators ? 'visible' : 'hidden',
        }}
      >
        <InputLabel htmlFor={linkOperatorSelectId} id={linkOperatorSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <Select
          labelId={linkOperatorSelectLabelId}
          id={linkOperatorSelectId}
          value={multiFilterOperator}
          onChange={changeLinkOperator}
          disabled={!!disableMultiFilterOperator}
          native
        >
          <option key={GridLinkOperator.And.toString()} value={GridLinkOperator.And.toString()}>
            {apiRef.current.getLocaleText('filterPanelOperatorAnd')}
          </option>
          <option key={GridLinkOperator.Or.toString()} value={GridLinkOperator.Or.toString()}>
            {apiRef.current.getLocaleText('filterPanelOperatorOr')}
          </option>
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ width: 150 }}>
        <InputLabel htmlFor={columnSelectId} id={columnSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelColumns')}
        </InputLabel>
        <Select
          labelId={columnSelectLabelId}
          id={columnSelectId}
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
      <FormControl variant="standard" sx={{ width: 120 }}>
        <InputLabel htmlFor={operatorSelectId} id={operatorSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <Select
          labelId={operatorSelectLabelId}
          id={operatorSelectId}
          value={item.operatorValue}
          onChange={changeOperator}
          native
        >
          {currentColumn?.filterOperators?.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.label ||
                apiRef.current.getLocaleText(
                  `filterOperator${capitalize(operator.value)}` as GridTranslationKeys,
                )}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ width: 190 }}>
        {currentOperator?.InputComponent ? (
          <currentOperator.InputComponent
            apiRef={apiRef}
            item={item}
            applyValue={applyFilterChanges}
            {...currentOperator.InputComponentProps}
          />
        ) : null}
      </FormControl>
    </GridFilterFormRoot>
  );
}

GridFilterForm.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  applyFilterChanges: PropTypes.func.isRequired,
  applyMultiFilterOperatorChanges: PropTypes.func.isRequired,
  deleteFilter: PropTypes.func.isRequired,
  disableMultiFilterOperator: PropTypes.bool,
  hasMultipleFilters: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  multiFilterOperator: PropTypes.oneOf(['and', 'or']),
  showMultiFilterOperators: PropTypes.bool,
} as any;

export { GridFilterForm };
