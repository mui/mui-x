import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import { SelectChangeEvent } from '@mui/material/Select';
import { capitalize, unstable_useId as useId } from '@mui/material/utils';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { filterableGridColumnsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridCloseIcon } from '../../icons/index';
import { GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../gridClasses';

export interface GridFilterFormProps {
  item: GridFilterItem;
  hasMultipleFilters: boolean;
  showMultiFilterOperators?: boolean;
  multiFilterOperator?: GridLinkOperator;
  disableMultiFilterOperator?: boolean;
  focusElementRef?: React.Ref<any>;
  applyFilterChanges: (item: GridFilterItem) => void;
  applyMultiFilterOperatorChanges: (operator: GridLinkOperator) => void;
  deleteFilter: (item: GridFilterItem) => void;
  linkOperators?: GridLinkOperator[];
  columnsSort?: 'asc' | 'desc';
  deleteIconContainerSx?: SxProps<Theme>;
  linkOperatorContainerSx?: SxProps<Theme>;
  columnContainerSx?: SxProps<Theme>;
  operatorContainerSx?: SxProps<Theme>;
  valueContainerSx?: SxProps<Theme>;
}

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['filterForm', 'filterPanelFilterForm'],
    closeIcon: ['filterPanelDeleteIcon'],
    linkOperator: ['filterPanelLinkOperatorInput'],
    column: ['filterPanelColumnInput'],
    operator: ['filterPanelOperatorInput'],
    value: ['filterPanelValueInput'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridFilterFormRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterForm',
  overridesResolver: (props, styles) => styles.filterForm,
})(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
}));

const getLinkOperatorLocaleKey = (linkOperator: GridLinkOperator) => {
  switch (linkOperator) {
    case GridLinkOperator.And:
      return 'filterPanelOperatorAnd';
    case GridLinkOperator.Or:
      return 'filterPanelOperatorOr';
    default:
      throw new Error('MUI: Invalid `linkOperator` property in the `GridFilterPanel`.');
  }
};

const getColumnLabel = (col) => col.headerName || col.field;

const collator = new Intl.Collator();

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
    focusElementRef,
    linkOperators = [GridLinkOperator.And, GridLinkOperator.Or],
    columnsSort,
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
  const valueRef = React.useRef<any>(null);
  const filterSelectorRef = React.useRef<HTMLInputElement>(null);

  const hasLinkOperatorColumn: boolean = hasMultipleFilters && linkOperators.length > 0;

  const { className: baseFormControlClassName, ...baseFormControl } =
    rootProps.componentsProps?.baseFormControl || {};

  const sortedFilterableColumns = React.useMemo(() => {
    switch (columnsSort) {
      case 'asc':
        return filterableColumns.sort((a, b) =>
          collator.compare(getColumnLabel(a), getColumnLabel(b)),
        );

      case 'desc':
        return filterableColumns.sort(
          (a, b) => -collator.compare(getColumnLabel(a), getColumnLabel(b)),
        );

      default:
        return filterableColumns;
    }
  }, [filterableColumns, columnsSort]);

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

      if (column.field === currentColumn!.field) {
        // column did not change
        return;
      }

      // try to keep the same operator when column change
      const newOperator =
        column.filterOperators!.find((operator) => operator.value === item.operatorValue) ||
        column.filterOperators![0];

      // Erase filter value if the input component is modified
      const eraseItemValue =
        !newOperator.InputComponent ||
        newOperator.InputComponent !== currentOperator?.InputComponent;

      applyFilterChanges({
        ...item,
        columnField,
        operatorValue: newOperator.value,
        value: eraseItemValue ? undefined : item.value,
      });
    },
    [apiRef, applyFilterChanges, item, currentColumn, currentOperator],
  );

  const changeOperator = React.useCallback(
    (event: SelectChangeEvent) => {
      const operatorValue = event.target.value as string;

      const newOperator = currentColumn?.filterOperators!.find(
        (operator) => operator.value === operatorValue,
      );

      const eraseItemValue =
        !newOperator?.InputComponent ||
        newOperator?.InputComponent !== currentOperator?.InputComponent;

      applyFilterChanges({
        ...item,
        operatorValue,
        value: eraseItemValue ? undefined : item.value,
      });
    },
    [applyFilterChanges, item, currentColumn, currentOperator],
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

  React.useImperativeHandle(
    focusElementRef,
    () => ({
      focus: () => {
        if (currentOperator?.InputComponent) {
          valueRef?.current?.focus();
        } else {
          filterSelectorRef.current!.focus();
        }
      },
    }),
    [currentOperator],
  );

  return (
    <GridFilterFormRoot className={classes.root}>
      <rootProps.components.BaseFormControl
        variant="standard"
        sx={{ flexShrink: 0, justifyContent: 'flex-end', marginRight: 0.5, marginBottom: 0.2 }}
        className={clsx(classes.closeIcon, baseFormControlClassName)}
        {...baseFormControl}
      >
        <IconButton
          aria-label={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
          title={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
          onClick={handleDeleteFilter}
          size="small"
        >
          <GridCloseIcon fontSize="small" />
        </IconButton>
      </rootProps.components.BaseFormControl>
      <rootProps.components.BaseFormControl
        variant="standard"
        sx={{
          minWidth: 60,
          display: hasLinkOperatorColumn ? 'block' : 'none',
          visibility: showMultiFilterOperators ? 'visible' : 'hidden',
        }}
        className={clsx(classes.linkOperator, baseFormControlClassName)}
        {...baseFormControl}
      >
        <InputLabel htmlFor={linkOperatorSelectId} id={linkOperatorSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <rootProps.components.BaseSelect
          labelId={linkOperatorSelectLabelId}
          id={linkOperatorSelectId}
          value={multiFilterOperator}
          onChange={changeLinkOperator}
          disabled={!!disableMultiFilterOperator || linkOperators.length === 1}
          native
          {...rootProps.componentsProps?.baseSelect}
        >
          {linkOperators.map((linkOperator) => (
            <option key={linkOperator.toString()} value={linkOperator.toString()}>
              {apiRef.current.getLocaleText(getLinkOperatorLocaleKey(linkOperator))}
            </option>
          ))}
        </rootProps.components.BaseSelect>
      </rootProps.components.BaseFormControl>
      <rootProps.components.BaseFormControl
        variant="standard"
        sx={{ width: 150 }}
        className={clsx(classes.column, baseFormControlClassName)}
        {...baseFormControl}
      >
        <InputLabel htmlFor={columnSelectId} id={columnSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelColumns')}
        </InputLabel>
        <rootProps.components.BaseSelect
          labelId={columnSelectLabelId}
          id={columnSelectId}
          value={item.columnField || ''}
          onChange={changeColumn}
          native
          {...rootProps.componentsProps?.baseSelect}
        >
          {sortedFilterableColumns.map((col) => (
            <option key={col.field} value={col.field}>
              {getColumnLabel(col)}
            </option>
          ))}
        </rootProps.components.BaseSelect>
      </rootProps.components.BaseFormControl>
      <rootProps.components.BaseFormControl
        variant="standard"
        sx={{ width: 120 }}
        className={clsx(classes.operator, baseFormControlClassName)}
        {...baseFormControl}
      >
        <InputLabel htmlFor={operatorSelectId} id={operatorSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <rootProps.components.BaseSelect
          labelId={operatorSelectLabelId}
          id={operatorSelectId}
          value={item.operatorValue}
          onChange={changeOperator}
          native
          inputRef={filterSelectorRef}
          {...rootProps.componentsProps?.baseSelect}
        >
          {currentColumn?.filterOperators?.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.label ||
                apiRef.current.getLocaleText(
                  `filterOperator${capitalize(operator.value)}` as GridTranslationKeys,
                )}
            </option>
          ))}
        </rootProps.components.BaseSelect>
      </rootProps.components.BaseFormControl>
      <rootProps.components.BaseFormControl
        variant="standard"
        sx={{ width: 190 }}
        className={clsx(classes.value, baseFormControlClassName)}
        {...baseFormControl}
      >
        {currentOperator?.InputComponent ? (
          <currentOperator.InputComponent
            apiRef={apiRef}
            item={item}
            applyValue={applyFilterChanges}
            focusElementRef={valueRef}
            {...currentOperator.InputComponentProps}
          />
        ) : null}
      </rootProps.components.BaseFormControl>
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
  columnContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  deleteFilter: PropTypes.func.isRequired,
  deleteIconContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  disableMultiFilterOperator: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  hasLinkOperatorColumn: PropTypes.bool,
  hasMultipleFilters: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  linkOperatorContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  linkOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  multiFilterOperator: PropTypes.oneOf(['and', 'or']),
  operatorContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  showMultiFilterOperators: PropTypes.bool,
  valueContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridFilterForm };
