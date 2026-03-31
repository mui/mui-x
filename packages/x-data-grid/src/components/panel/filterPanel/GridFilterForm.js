'use client';
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import capitalize from '@mui/utils/capitalize';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../../../constants/cssVariables';
import { gridFilterableColumnDefinitionsSelector, gridColumnLookupSelector, } from '../../../hooks/features/columns/gridColumnsSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridLogicOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import { getValueFromValueOptions, getValueOptions } from './filterPanelUtils';
import { gridPivotActiveSelector, gridPivotInitialColumnsSelector, } from '../../../hooks/features/pivoting';
const useUtilityClasses = (ownerState) => {
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
})({
    display: 'flex',
    gap: vars.spacing(1.5),
});
const FilterFormDeleteIcon = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormDeleteIcon',
})({
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
const FilterFormLogicOperatorInput = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormLogicOperatorInput',
})({
    minWidth: 75,
    justifyContent: 'end',
});
const FilterFormColumnInput = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormColumnInput',
})({ width: 150 });
const FilterFormOperatorInput = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormOperatorInput',
})({ width: 150 });
const FilterFormValueInput = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormValueInput',
})({ width: 190 });
const getLogicOperatorLocaleKey = (logicOperator) => {
    switch (logicOperator) {
        case GridLogicOperator.And:
            return 'filterPanelOperatorAnd';
        case GridLogicOperator.Or:
            return 'filterPanelOperatorOr';
        default:
            throw new Error('MUI X: Invalid `logicOperator` property in the `GridFilterPanel`.');
    }
};
const getColumnLabel = (col) => col.headerName || col.field;
const collator = new Intl.Collator();
const GridFilterForm = forwardRef(function GridFilterForm(props, ref) {
    const { item, hasMultipleFilters, deleteFilter, applyFilterChanges, showMultiFilterOperators, disableMultiFilterOperator, applyMultiFilterOperatorChanges, focusElementRef, logicOperators = [GridLogicOperator.And, GridLogicOperator.Or], columnsSort, filterColumns, deleteIconProps = {}, logicOperatorInputProps = {}, operatorInputProps = {}, columnInputProps = {}, valueInputProps = {}, readOnly, children, ...other } = props;
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
    const valueRef = React.useRef(null);
    const filterSelectorRef = React.useRef(null);
    const multiFilterOperator = filterModel.logicOperator ?? GridLogicOperator.And;
    const hasLogicOperatorColumn = hasMultipleFilters && logicOperators.length > 0;
    const baseSelectProps = rootProps.slotProps?.baseSelect || {};
    const isBaseSelectNative = baseSelectProps.native ?? false;
    const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};
    const { InputComponentProps, ...valueInputPropsOther } = valueInputProps;
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const initialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
    const { filteredColumns, selectedField } = React.useMemo(() => {
        let itemField = item.field;
        // Yields a valid value if the current filter belongs to a column that is not filterable
        const selectedNonFilterableColumn = columnLookup[item.field].filterable === false ? columnLookup[item.field] : null;
        if (selectedNonFilterableColumn) {
            return {
                filteredColumns: [selectedNonFilterableColumn],
                selectedField: itemField,
            };
        }
        if (pivotActive) {
            return {
                filteredColumns: filterableColumns.filter((column) => initialColumns.get(column.field) !== undefined),
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
    }, [
        item.field,
        columnLookup,
        pivotActive,
        filterColumns,
        filterableColumns,
        filterModel?.items,
        initialColumns,
    ]);
    const sortedFilteredColumns = React.useMemo(() => {
        switch (columnsSort) {
            case 'asc':
                return filteredColumns.sort((a, b) => collator.compare(getColumnLabel(a), getColumnLabel(b)));
            case 'desc':
                return filteredColumns.sort((a, b) => -collator.compare(getColumnLabel(a), getColumnLabel(b)));
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
    const changeColumn = React.useCallback((event) => {
        const field = event.target.value;
        const column = apiRef.current.getColumn(field);
        if (column.field === currentColumn.field) {
            // column did not change
            return;
        }
        // try to keep the same operator when column change
        const newOperator = column.filterOperators.find((operator) => operator.value === item.operator) ||
            column.filterOperators[0];
        // Erase filter value if the input component or filtered column type is modified
        const eraseFilterValue = !newOperator.InputComponent ||
            newOperator.InputComponent !== currentOperator?.InputComponent ||
            column.type !== currentColumn.type;
        let filterValue = eraseFilterValue ? undefined : item.value;
        // Check filter value against the new valueOptions
        if (column.type === 'singleSelect' && filterValue !== undefined) {
            const colDef = column;
            const valueOptions = getValueOptions(colDef);
            if (Array.isArray(filterValue)) {
                filterValue = filterValue.filter((val) => {
                    return (
                    // Only keep values that are in the new value options
                    getValueFromValueOptions(val, valueOptions, colDef?.getOptionValue) !== undefined);
                });
            }
            else if (getValueFromValueOptions(item.value, valueOptions, colDef?.getOptionValue) === undefined) {
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
    }, [apiRef, applyFilterChanges, item, currentColumn, currentOperator]);
    const changeOperator = React.useCallback((event) => {
        const operator = event.target.value;
        const newOperator = currentColumn?.filterOperators.find((op) => op.value === operator);
        const eraseItemValue = !newOperator?.InputComponent ||
            newOperator?.InputComponent !== currentOperator?.InputComponent;
        applyFilterChanges({
            ...item,
            operator,
            value: eraseItemValue ? undefined : item.value,
        });
    }, [applyFilterChanges, item, currentColumn, currentOperator]);
    const changeLogicOperator = React.useCallback((event) => {
        const logicOperator = event.target.value === GridLogicOperator.And.toString()
            ? GridLogicOperator.And
            : GridLogicOperator.Or;
        applyMultiFilterOperatorChanges(logicOperator);
    }, [applyMultiFilterOperatorChanges]);
    const handleDeleteFilter = () => {
        deleteFilter(item);
    };
    React.useImperativeHandle(focusElementRef, () => ({
        focus: () => {
            if (currentOperator?.InputComponent) {
                valueRef?.current?.focus();
            }
            else {
                filterSelectorRef.current.focus();
            }
        },
    }), [currentOperator]);
    return (_jsxs(GridFilterFormRoot, { className: classes.root, "data-id": item.id, ownerState: rootProps, ...other, ref: ref, children: [_jsx(FilterFormDeleteIcon, { ...deleteIconProps, className: clsx(classes.deleteIcon, deleteIconProps.className), ownerState: rootProps, children: _jsx(rootProps.slots.baseIconButton, { "aria-label": apiRef.current.getLocaleText('filterPanelDeleteIconLabel'), title: apiRef.current.getLocaleText('filterPanelDeleteIconLabel'), onClick: handleDeleteFilter, size: "small", disabled: readOnly, ...rootProps.slotProps?.baseIconButton, children: _jsx(rootProps.slots.filterPanelDeleteIcon, { fontSize: "small" }) }) }), _jsx(FilterFormLogicOperatorInput, { as: rootProps.slots.baseSelect, sx: [
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
                    logicOperatorInputProps.sx,
                ], className: clsx(classes.logicOperatorInput, logicOperatorInputProps.className), ownerState: rootProps, ...logicOperatorInputProps, size: "small", slotProps: {
                    htmlInput: {
                        'aria-label': apiRef.current.getLocaleText('filterPanelLogicOperator'),
                    },
                }, value: multiFilterOperator ?? '', onChange: changeLogicOperator, disabled: !!disableMultiFilterOperator || logicOperators.length === 1, native: isBaseSelectNative, ...rootProps.slotProps?.baseSelect, children: logicOperators.map((logicOperator) => (_createElement(rootProps.slots.baseSelectOption, { ...baseSelectOptionProps, native: isBaseSelectNative, key: logicOperator.toString(), value: logicOperator.toString() }, apiRef.current.getLocaleText(getLogicOperatorLocaleKey(logicOperator))))) }), _jsx(FilterFormColumnInput, { as: rootProps.slots.baseSelect, ...columnInputProps, className: clsx(classes.columnInput, columnInputProps.className), ownerState: rootProps, size: "small", labelId: columnSelectLabelId, id: columnSelectId, label: apiRef.current.getLocaleText('filterPanelColumns'), value: selectedField ?? '', onChange: changeColumn, native: isBaseSelectNative, disabled: readOnly, ...rootProps.slotProps?.baseSelect, children: sortedFilteredColumns.map((col) => (_createElement(rootProps.slots.baseSelectOption, { ...baseSelectOptionProps, native: isBaseSelectNative, key: col.field, value: col.field }, getColumnLabel(col)))) }), _jsx(FilterFormOperatorInput, { as: rootProps.slots.baseSelect, size: "small", ...operatorInputProps, className: clsx(classes.operatorInput, operatorInputProps.className), ownerState: rootProps, labelId: operatorSelectLabelId, label: apiRef.current.getLocaleText('filterPanelOperator'), id: operatorSelectId, value: item.operator, onChange: changeOperator, native: isBaseSelectNative, inputRef: filterSelectorRef, disabled: readOnly, ...rootProps.slotProps?.baseSelect, children: currentColumn?.filterOperators?.map((operator) => (_createElement(rootProps.slots.baseSelectOption, { ...baseSelectOptionProps, native: isBaseSelectNative, key: operator.value, value: operator.value }, operator.label ||
                    apiRef.current.getLocaleText(`filterOperator${capitalize(operator.value)}`)))) }), _jsx(FilterFormValueInput, { ...valueInputPropsOther, className: clsx(classes.valueInput, valueInputPropsOther.className), ownerState: rootProps, children: currentOperator?.InputComponent ? (_jsx(currentOperator.InputComponent, { apiRef: apiRef, item: item, applyValue: applyFilterChanges, focusElementRef: valueRef, disabled: readOnly, slotProps: {
                        root: { size: 'small' },
                    }, ...currentOperator.InputComponentProps, ...InputComponentProps }, item.field)) : null })] }));
});
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
};
/**
 * Demos:
 * - [Filtering - overview](https://mui.com/x/react-data-grid/filtering/)
 *
 * API:
 * - [GridFilterForm API](https://mui.com/x/api/data-grid/grid-filter-form/)
 */
export { GridFilterForm };
