import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { capitalize, unstable_useId as useId } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { gridFilterableColumnDefinitionsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';

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
  deleteIconProps?: any;
  linkOperatorInputProps?: any;
  operatorInputProps?: any;
  columnInputProps?: any;
  valueInputProps?: any;
}

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['filterForm'],
    deleteIcon: ['filterFormDeleteIcon'],
    linkOperatorInput: ['filterFormLinkOperatorInput'],
    columnInput: ['filterFormColumnInput'],
    operatorInput: ['filterFormOperatorInput'],
    valueInput: ['filterFormValueInput'],
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

const FilterFormDeleteIcon = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormDeleteIcon',
  overridesResolver: (_, styles) => styles.filterFormDeleteIcon,
})(({ theme }) => ({
  flexShrink: 0,
  justifyContent: 'flex-end',
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.2),
}));

const FilterFormLinkOperatorInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormLinkOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormLinkOperatorInput,
})({
  minWidth: 55,
  marginRight: 5,
  justifyContent: 'end',
});

const FilterFormColumnInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormColumnInput',
  overridesResolver: (_, styles) => styles.filterFormColumnInput,
})({ width: 150 });

const FilterFormOperatorInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormOperatorInput,
})({ width: 120 });

const FilterFormValueInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput,
})({ width: 190 });

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
    deleteIconProps = {},
    linkOperatorInputProps = {},
    operatorInputProps = {},
    columnInputProps = {},
    valueInputProps = {},
  } = props;
  const apiRef = useGridApiContext();
  const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
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

  const baseFormControlProps = rootProps.componentsProps?.baseFormControl || {};

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
      if (item.value === undefined) {
        deleteFilter(item);
      } else {
        // TODO v6: simplify the behavior by always remove the filter form
        applyFilterChanges({ ...item, value: undefined });
      }
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
      <FilterFormDeleteIcon
        variant="standard"
        as={rootProps.components.BaseFormControl}
        {...baseFormControlProps}
        {...deleteIconProps}
        className={clsx(
          classes.deleteIcon,
          baseFormControlProps.className,
          deleteIconProps.className,
        )}
      >
        <IconButton
          aria-label={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
          title={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
          onClick={handleDeleteFilter}
          size="small"
        >
          <rootProps.components.FilterPanelDeleteIcon fontSize="small" />
        </IconButton>
      </FilterFormDeleteIcon>
      <FilterFormLinkOperatorInput
        variant="standard"
        as={rootProps.components.BaseFormControl}
        {...baseFormControlProps}
        {...linkOperatorInputProps}
        sx={{
          display: hasLinkOperatorColumn ? 'flex' : 'none',
          visibility: showMultiFilterOperators ? 'visible' : 'hidden',
          ...(baseFormControlProps.sx || {}),
          ...(linkOperatorInputProps.sx || {}),
        }}
        className={clsx(
          classes.linkOperatorInput,
          baseFormControlProps.className,
          linkOperatorInputProps.className,
        )}
      >
        <rootProps.components.BaseSelect
          inputProps={{
            'aria-label': apiRef.current.getLocaleText('filterPanelLinkOperator'),
          }}
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
      </FilterFormLinkOperatorInput>
      <FilterFormColumnInput
        variant="standard"
        as={rootProps.components.BaseFormControl}
        {...baseFormControlProps}
        {...columnInputProps}
        className={clsx(
          classes.columnInput,
          baseFormControlProps.className,
          columnInputProps.className,
        )}
      >
        <InputLabel htmlFor={columnSelectId} id={columnSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelColumns')}
        </InputLabel>
        <rootProps.components.BaseSelect
          labelId={columnSelectLabelId}
          id={columnSelectId}
          label={apiRef.current.getLocaleText('filterPanelColumns')}
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
      </FilterFormColumnInput>
      <FilterFormOperatorInput
        variant="standard"
        as={rootProps.components.BaseFormControl}
        {...baseFormControlProps}
        {...operatorInputProps}
        className={clsx(
          classes.operatorInput,
          baseFormControlProps.className,
          operatorInputProps.className,
        )}
      >
        <InputLabel htmlFor={operatorSelectId} id={operatorSelectLabelId}>
          {apiRef.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <rootProps.components.BaseSelect
          labelId={operatorSelectLabelId}
          label={apiRef.current.getLocaleText('filterPanelOperators')}
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
      </FilterFormOperatorInput>
      <FilterFormValueInput
        variant="standard"
        as={rootProps.components.BaseFormControl}
        {...baseFormControlProps}
        {...valueInputProps}
        className={clsx(
          classes.valueInput,
          baseFormControlProps.className,
          valueInputProps.className,
        )}
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
      </FilterFormValueInput>
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
  columnInputProps: PropTypes.any,
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  deleteFilter: PropTypes.func.isRequired,
  deleteIconProps: PropTypes.any,
  disableMultiFilterOperator: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  hasMultipleFilters: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  linkOperatorInputProps: PropTypes.any,
  linkOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  multiFilterOperator: PropTypes.oneOf(['and', 'or']),
  operatorInputProps: PropTypes.any,
  showMultiFilterOperators: PropTypes.bool,
  valueInputProps: PropTypes.any,
} as any;

export { GridFilterForm };
