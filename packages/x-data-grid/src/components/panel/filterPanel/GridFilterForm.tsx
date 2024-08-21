import * as React from 'react';
import PropTypes from 'prop-types';
import {
  unstable_composeClasses as composeClasses,
  unstable_useId as useId,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { SelectChangeEvent } from '@mui/material/Select';
import clsx from 'clsx';
import { styled } from '../../../utils/styled';
import {
  gridFilterableColumnDefinitionsSelector,
  gridColumnLookupSelector,
} from '../../../hooks/features/columns/gridColumnsSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridFilterItem, GridLogicOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import {
  GridColDef,
  GridSingleSelectColDef,
  GridStateColDef,
} from '../../../models/colDef/gridColDef';
import { getValueFromValueOptions, getValueOptions } from './filterPanelUtils';

export interface FilterColumnsArgs {
  field: GridColDef['field'];
  columns: GridStateColDef[];
  currentFilters: GridFilterItem[];
}

export interface GridFilterFormProps {
  /**
   * The [[GridFilterItem]] representing this form.
   */
  item: GridFilterItem;
  /**
   * If `true`, the logic operator field is rendered.
   * The field will be invisible if `showMultiFilterOperators` is also `true`.
   */
  hasMultipleFilters: boolean;
  /**
   * If `true`, the logic operator field is visible.
   */
  showMultiFilterOperators?: boolean;
  /**
   * If `true`, disables the logic operator field but still renders it.
   */
  disableMultiFilterOperator?: boolean;
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the el
   */
  focusElementRef?: React.Ref<any>;
  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: (item: GridFilterItem) => void;
  /**
   * Callback called when the logic operator is changed.
   * @param {GridLogicOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: (operator: GridLogicOperator) => void;
  /**
   * Callback called when the delete button is clicked.
   * @param {GridFilterItem} item The deleted [[GridFilterItem]].
   */
  deleteFilter: (item: GridFilterItem) => void;
  /**
   * Allows to filter the columns displayed in the filter form.
   * @param {FilterColumnsArgs} args The columns of the grid and name of field.
   * @returns {GridColDef['field'][]} The filtered fields array.
   */
  filterColumns?: (args: FilterColumnsArgs) => GridColDef['field'][];
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators?: GridLogicOperator[];
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort?: 'asc' | 'desc';
  /**
   * Props passed to the delete icon.
   * @default {}
   */
  deleteIconProps?: any;
  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  logicOperatorInputProps?: any;
  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps?: any;
  /**
   * Props passed to the column input component.
   * @default {}
   */
  columnInputProps?: any;
  /**
   * `true` if the filter is disabled/read only.
   * i.e. `colDef.fiterable = false` but passed in `filterModel`
   * @default false
   */
  readOnly?: boolean;
  /**
   * Props passed to the value input component.
   * @default {}
   */
  valueInputProps?: any;
  /**
   * @ignore - do not document.
   */
  children?: React.ReactNode;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['filterForm'],
    deleteIcon: ['filterFormDeleteIcon'],
    logicOperatorInput: ['filterFormLogicOperatorInput'],
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
})<{ ownerState: OwnerState }>(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
}));

const FilterFormDeleteIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormDeleteIcon',
  overridesResolver: (_, styles) => styles.filterFormDeleteIcon,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  flexShrink: 0,
  justifyContent: 'flex-end',
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.2),
}));

const FilterFormLogicOperatorInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormLogicOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormLogicOperatorInput,
})<{ ownerState: OwnerState }>({
  minWidth: 55,
  marginRight: 5,
  justifyContent: 'end',
});

const FilterFormColumnInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormColumnInput',
  overridesResolver: (_, styles) => styles.filterFormColumnInput,
})<{ ownerState: OwnerState }>({ width: 150 });

const FilterFormOperatorInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormOperatorInput,
})<{ ownerState: OwnerState }>({ width: 120 });

const FilterFormValueInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput,
})<{ ownerState: OwnerState }>({ width: 190 });

const getLogicOperatorLocaleKey = (logicOperator: GridLogicOperator) => {
  switch (logicOperator) {
    case GridLogicOperator.And:
      return 'filterPanelOperatorAnd';
    case GridLogicOperator.Or:
      return 'filterPanelOperatorOr';
    default:
      throw new Error('MUI X: Invalid `logicOperator` property in the `GridFilterPanel`.');
  }
};

const getColumnLabel = (col: GridColDef) => col.headerName || col.field;

const collator = new Intl.Collator();

const GridFilterForm = React.forwardRef<HTMLDivElement, GridFilterFormProps>(
  function GridFilterForm(props, ref) {
    const {
      item,
      hasMultipleFilters,
      deleteFilter,
      applyFilterChanges,
      showMultiFilterOperators,
      disableMultiFilterOperator,
      applyMultiFilterOperatorChanges,
      focusElementRef,
      logicOperators = [GridLogicOperator.And, GridLogicOperator.Or],
      columnsSort,
      filterColumns,
      deleteIconProps = {},
      logicOperatorInputProps = {},
      operatorInputProps = {},
      columnInputProps = {},
      valueInputProps = {},
      readOnly,
      children,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const columnLookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const columnSelectId = useId();
    const columnSelectLabelId = useId();
    const operatorSelectId = useId();
    const operatorSelectLabelId = useId();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const valueRef = React.useRef<any>(null);
    const filterSelectorRef = React.useRef<HTMLInputElement>(null);
    const multiFilterOperator = filterModel.logicOperator ?? GridLogicOperator.And;

    const hasLogicOperatorColumn: boolean = hasMultipleFilters && logicOperators.length > 0;

    const baseFormControlProps = rootProps.slotProps?.baseFormControl || {};

    const baseSelectProps = rootProps.slotProps?.baseSelect || {};
    const isBaseSelectNative = baseSelectProps.native ?? false;

    const baseInputLabelProps = rootProps.slotProps?.baseInputLabel || {};
    const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};

    const { InputComponentProps, ...valueInputPropsOther } = valueInputProps;

    const { filteredColumns, selectedField } = React.useMemo(() => {
      let itemField: string | undefined = item.field;

      // Yields a valid value if the current filter belongs to a column that is not filterable
      const selectedNonFilterableColumn =
        columnLookup[item.field].filterable === false ? columnLookup[item.field] : null;

      if (selectedNonFilterableColumn) {
        return {
          filteredColumns: [selectedNonFilterableColumn],
          selectedField: itemField,
        };
      }

      if (filterColumns === undefined || typeof filterColumns !== 'function') {
        return { filteredColumns: filterableColumns, selectedField: itemField };
      }

      const filteredFields = filterColumns({
        field: item.field,
        columns: filterableColumns,
        currentFilters: filterModel?.items || [],
      });

      return {
        filteredColumns: filterableColumns.filter((column) => {
          const isFieldIncluded = filteredFields.includes(column.field);
          if (column.field === item.field && !isFieldIncluded) {
            itemField = undefined;
          }
          return isFieldIncluded;
        }),
        selectedField: itemField,
      };
    }, [filterColumns, filterModel?.items, filterableColumns, item.field, columnLookup]);

    const sortedFilteredColumns = React.useMemo(() => {
      switch (columnsSort) {
        case 'asc':
          return filteredColumns.sort((a, b) =>
            collator.compare(getColumnLabel(a), getColumnLabel(b)),
          );

        case 'desc':
          return filteredColumns.sort(
            (a, b) => -collator.compare(getColumnLabel(a), getColumnLabel(b)),
          );

        default:
          return filteredColumns;
      }
    }, [filteredColumns, columnsSort]);

    const currentColumn = item.field ? apiRef.current.getColumn(item.field) : null;

    const currentOperator = React.useMemo(() => {
      if (!item.operator || !currentColumn) {
        return null;
      }

      return currentColumn.filterOperators?.find((operator) => operator.value === item.operator);
    }, [item, currentColumn]);

    const changeColumn = React.useCallback(
      (event: SelectChangeEvent<any>) => {
        const field = event.target.value as string;
        const column = apiRef.current.getColumn(field)!;

        if (column.field === currentColumn!.field) {
          // column did not change
          return;
        }

        // try to keep the same operator when column change
        const newOperator =
          column.filterOperators!.find((operator) => operator.value === item.operator) ||
          column.filterOperators![0];

        // Erase filter value if the input component or filtered column type is modified
        const eraseFilterValue =
          !newOperator.InputComponent ||
          newOperator.InputComponent !== currentOperator?.InputComponent ||
          column.type !== currentColumn!.type;

        let filterValue = eraseFilterValue ? undefined : item.value;

        // Check filter value against the new valueOptions
        if (column.type === 'singleSelect' && filterValue !== undefined) {
          const colDef = column as GridSingleSelectColDef;
          const valueOptions = getValueOptions(colDef);
          if (Array.isArray(filterValue)) {
            filterValue = filterValue.filter((val) => {
              return (
                // Only keep values that are in the new value options
                getValueFromValueOptions(val, valueOptions, colDef?.getOptionValue!) !== undefined
              );
            });
          } else if (
            getValueFromValueOptions(item.value, valueOptions, colDef?.getOptionValue!) ===
            undefined
          ) {
            // Reset the filter value if it is not in the new value options
            filterValue = undefined;
          }
        }

        applyFilterChanges({
          ...item,
          field,
          operator: newOperator.value,
          value: filterValue,
        });
      },
      [apiRef, applyFilterChanges, item, currentColumn, currentOperator],
    );

    const changeOperator = React.useCallback(
      (event: SelectChangeEvent<any>) => {
        const operator = event.target.value as string;

        const newOperator = currentColumn?.filterOperators!.find((op) => op.value === operator);

        const eraseItemValue =
          !newOperator?.InputComponent ||
          newOperator?.InputComponent !== currentOperator?.InputComponent;

        applyFilterChanges({
          ...item,
          operator,
          value: eraseItemValue ? undefined : item.value,
        });
      },
      [applyFilterChanges, item, currentColumn, currentOperator],
    );

    const changeLogicOperator = React.useCallback(
      (event: SelectChangeEvent<any>) => {
        const logicOperator =
          (event.target.value as string) === GridLogicOperator.And.toString()
            ? GridLogicOperator.And
            : GridLogicOperator.Or;
        applyMultiFilterOperatorChanges(logicOperator);
      },
      [applyMultiFilterOperatorChanges],
    );

    const handleDeleteFilter = () => {
      deleteFilter(item);
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
      <GridFilterFormRoot
        ref={ref}
        className={classes.root}
        data-id={item.id}
        ownerState={rootProps}
        {...other}
      >
        <FilterFormDeleteIcon
          variant="standard"
          as={rootProps.slots.baseFormControl}
          {...baseFormControlProps}
          {...deleteIconProps}
          className={clsx(
            classes.deleteIcon,
            baseFormControlProps.className,
            deleteIconProps.className,
          )}
          ownerState={rootProps}
        >
          <rootProps.slots.baseIconButton
            aria-label={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
            title={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
            onClick={handleDeleteFilter}
            size="small"
            disabled={readOnly}
            {...rootProps.slotProps?.baseIconButton}
          >
            <rootProps.slots.filterPanelDeleteIcon fontSize="small" />
          </rootProps.slots.baseIconButton>
        </FilterFormDeleteIcon>
        <FilterFormLogicOperatorInput
          variant="standard"
          as={rootProps.slots.baseFormControl}
          {...baseFormControlProps}
          {...logicOperatorInputProps}
          sx={[
            hasLogicOperatorColumn
              ? {
                  display: 'flex',
                }
              : {
                  display: 'none',
                },
            showMultiFilterOperators
              ? {
                  visibility: 'visible',
                }
              : {
                  visibility: 'hidden',
                },
            baseFormControlProps.sx,
            logicOperatorInputProps.sx,
          ]}
          className={clsx(
            classes.logicOperatorInput,
            baseFormControlProps.className,
            logicOperatorInputProps.className,
          )}
          ownerState={rootProps}
        >
          <rootProps.slots.baseSelect
            inputProps={{
              'aria-label': apiRef.current.getLocaleText('filterPanelLogicOperator'),
            }}
            value={multiFilterOperator ?? ''}
            onChange={changeLogicOperator}
            disabled={!!disableMultiFilterOperator || logicOperators.length === 1}
            native={isBaseSelectNative}
            {...rootProps.slotProps?.baseSelect}
          >
            {logicOperators.map((logicOperator) => (
              <rootProps.slots.baseSelectOption
                {...baseSelectOptionProps}
                native={isBaseSelectNative}
                key={logicOperator.toString()}
                value={logicOperator.toString()}
              >
                {apiRef.current.getLocaleText(getLogicOperatorLocaleKey(logicOperator))}
              </rootProps.slots.baseSelectOption>
            ))}
          </rootProps.slots.baseSelect>
        </FilterFormLogicOperatorInput>
        <FilterFormColumnInput
          variant="standard"
          as={rootProps.slots.baseFormControl}
          {...baseFormControlProps}
          {...columnInputProps}
          className={clsx(
            classes.columnInput,
            baseFormControlProps.className,
            columnInputProps.className,
          )}
          ownerState={rootProps}
        >
          <rootProps.slots.baseInputLabel
            {...baseInputLabelProps}
            htmlFor={columnSelectId}
            id={columnSelectLabelId}
          >
            {apiRef.current.getLocaleText('filterPanelColumns')}
          </rootProps.slots.baseInputLabel>
          <rootProps.slots.baseSelect
            labelId={columnSelectLabelId}
            id={columnSelectId}
            label={apiRef.current.getLocaleText('filterPanelColumns')}
            value={selectedField ?? ''}
            onChange={changeColumn}
            native={isBaseSelectNative}
            disabled={readOnly}
            {...rootProps.slotProps?.baseSelect}
          >
            {sortedFilteredColumns.map((col) => (
              <rootProps.slots.baseSelectOption
                {...baseSelectOptionProps}
                native={isBaseSelectNative}
                key={col.field}
                value={col.field}
              >
                {getColumnLabel(col)}
              </rootProps.slots.baseSelectOption>
            ))}
          </rootProps.slots.baseSelect>
        </FilterFormColumnInput>
        <FilterFormOperatorInput
          variant="standard"
          as={rootProps.slots.baseFormControl}
          {...baseFormControlProps}
          {...operatorInputProps}
          className={clsx(
            classes.operatorInput,
            baseFormControlProps.className,
            operatorInputProps.className,
          )}
          ownerState={rootProps}
        >
          <rootProps.slots.baseInputLabel
            {...baseInputLabelProps}
            htmlFor={operatorSelectId}
            id={operatorSelectLabelId}
          >
            {apiRef.current.getLocaleText('filterPanelOperator')}
          </rootProps.slots.baseInputLabel>
          <rootProps.slots.baseSelect
            labelId={operatorSelectLabelId}
            label={apiRef.current.getLocaleText('filterPanelOperator')}
            id={operatorSelectId}
            value={item.operator}
            onChange={changeOperator}
            native={isBaseSelectNative}
            inputRef={filterSelectorRef}
            disabled={readOnly}
            {...rootProps.slotProps?.baseSelect}
          >
            {currentColumn?.filterOperators?.map((operator) => (
              <rootProps.slots.baseSelectOption
                {...baseSelectOptionProps}
                native={isBaseSelectNative}
                key={operator.value}
                value={operator.value}
              >
                {operator.label ||
                  apiRef.current.getLocaleText(
                    `filterOperator${capitalize(operator.value)}` as 'filterOperatorContains',
                  )}
              </rootProps.slots.baseSelectOption>
            ))}
          </rootProps.slots.baseSelect>
        </FilterFormOperatorInput>
        <FilterFormValueInput
          variant="standard"
          as={rootProps.slots.baseFormControl}
          {...baseFormControlProps}
          {...valueInputPropsOther}
          className={clsx(
            classes.valueInput,
            baseFormControlProps.className,
            valueInputPropsOther.className,
          )}
          ownerState={rootProps}
        >
          {currentOperator?.InputComponent ? (
            <currentOperator.InputComponent
              apiRef={apiRef}
              item={item}
              applyValue={applyFilterChanges}
              focusElementRef={valueRef}
              disabled={readOnly}
              key={item.field}
              {...currentOperator.InputComponentProps}
              {...InputComponentProps}
            />
          ) : null}
        </FilterFormValueInput>
      </GridFilterFormRoot>
    );
  },
);

GridFilterForm.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: PropTypes.func.isRequired,
  /**
   * Callback called when the logic operator is changed.
   * @param {GridLogicOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: PropTypes.func.isRequired,
  /**
   * @ignore - do not document.
   */
  children: PropTypes.node,
  /**
   * Props passed to the column input component.
   * @default {}
   */
  columnInputProps: PropTypes.any,
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Callback called when the delete button is clicked.
   * @param {GridFilterItem} item The deleted [[GridFilterItem]].
   */
  deleteFilter: PropTypes.func.isRequired,
  /**
   * Props passed to the delete icon.
   * @default {}
   */
  deleteIconProps: PropTypes.any,
  /**
   * If `true`, disables the logic operator field but still renders it.
   */
  disableMultiFilterOperator: PropTypes.bool,
  /**
   * Allows to filter the columns displayed in the filter form.
   * @param {FilterColumnsArgs} args The columns of the grid and name of field.
   * @returns {GridColDef['field'][]} The filtered fields array.
   */
  filterColumns: PropTypes.func,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the el
   */
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * If `true`, the logic operator field is rendered.
   * The field will be invisible if `showMultiFilterOperators` is also `true`.
   */
  hasMultipleFilters: PropTypes.bool.isRequired,
  /**
   * The [[GridFilterItem]] representing this form.
   */
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  logicOperatorInputProps: PropTypes.any,
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps: PropTypes.any,
  /**
   * `true` if the filter is disabled/read only.
   * i.e. `colDef.fiterable = false` but passed in `filterModel`
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * If `true`, the logic operator field is visible.
   */
  showMultiFilterOperators: PropTypes.bool,
  /**
   * Props passed to the value input component.
   * @default {}
   */
  valueInputProps: PropTypes.any,
} as any;

/**
 * Demos:
 * - [Filtering - overview](https://mui.com/x/react-data-grid/filtering/)
 *
 * API:
 * - [GridFilterForm API](https://mui.com/x/api/data-grid/grid-filter-form/)
 */
export { GridFilterForm };
