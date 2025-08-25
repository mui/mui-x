"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFilterForm = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var capitalize_1 = require("@mui/utils/capitalize");
var styles_1 = require("@mui/material/styles");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var cssVariables_1 = require("../../../constants/cssVariables");
var gridColumnsSelector_1 = require("../../../hooks/features/columns/gridColumnsSelector");
var gridFilterSelector_1 = require("../../../hooks/features/filter/gridFilterSelector");
var useGridSelector_1 = require("../../../hooks/utils/useGridSelector");
var gridFilterItem_1 = require("../../../models/gridFilterItem");
var useGridApiContext_1 = require("../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../../constants/gridClasses");
var filterPanelUtils_1 = require("./filterPanelUtils");
var pivoting_1 = require("../../../hooks/features/pivoting");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['filterForm'],
        deleteIcon: ['filterFormDeleteIcon'],
        logicOperatorInput: ['filterFormLogicOperatorInput'],
        columnInput: ['filterFormColumnInput'],
        operatorInput: ['filterFormOperatorInput'],
        valueInput: ['filterFormValueInput'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridFilterFormRoot = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FilterForm',
})({
    display: 'flex',
    gap: cssVariables_1.vars.spacing(1.5),
});
var FilterFormDeleteIcon = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormDeleteIcon',
})({
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
var FilterFormLogicOperatorInput = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormLogicOperatorInput',
})({
    minWidth: 75,
    justifyContent: 'end',
});
var FilterFormColumnInput = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormColumnInput',
})({ width: 150 });
var FilterFormOperatorInput = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormOperatorInput',
})({ width: 150 });
var FilterFormValueInput = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FilterFormValueInput',
})({ width: 190 });
var getLogicOperatorLocaleKey = function (logicOperator) {
    switch (logicOperator) {
        case gridFilterItem_1.GridLogicOperator.And:
            return 'filterPanelOperatorAnd';
        case gridFilterItem_1.GridLogicOperator.Or:
            return 'filterPanelOperatorOr';
        default:
            throw new Error('MUI X: Invalid `logicOperator` property in the `GridFilterPanel`.');
    }
};
var getColumnLabel = function (col) { return col.headerName || col.field; };
var collator = new Intl.Collator();
var GridFilterForm = (0, forwardRef_1.forwardRef)(function GridFilterForm(props, ref) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var item = props.item, hasMultipleFilters = props.hasMultipleFilters, deleteFilter = props.deleteFilter, applyFilterChanges = props.applyFilterChanges, showMultiFilterOperators = props.showMultiFilterOperators, disableMultiFilterOperator = props.disableMultiFilterOperator, applyMultiFilterOperatorChanges = props.applyMultiFilterOperatorChanges, focusElementRef = props.focusElementRef, _k = props.logicOperators, logicOperators = _k === void 0 ? [gridFilterItem_1.GridLogicOperator.And, gridFilterItem_1.GridLogicOperator.Or] : _k, columnsSort = props.columnsSort, filterColumns = props.filterColumns, _l = props.deleteIconProps, deleteIconProps = _l === void 0 ? {} : _l, _m = props.logicOperatorInputProps, logicOperatorInputProps = _m === void 0 ? {} : _m, _o = props.operatorInputProps, operatorInputProps = _o === void 0 ? {} : _o, _p = props.columnInputProps, columnInputProps = _p === void 0 ? {} : _p, _q = props.valueInputProps, valueInputProps = _q === void 0 ? {} : _q, readOnly = props.readOnly, children = props.children, other = __rest(props, ["item", "hasMultipleFilters", "deleteFilter", "applyFilterChanges", "showMultiFilterOperators", "disableMultiFilterOperator", "applyMultiFilterOperatorChanges", "focusElementRef", "logicOperators", "columnsSort", "filterColumns", "deleteIconProps", "logicOperatorInputProps", "operatorInputProps", "columnInputProps", "valueInputProps", "readOnly", "children"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var columnLookup = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnLookupSelector);
    var filterableColumns = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridFilterableColumnDefinitionsSelector);
    var filterModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridFilterModelSelector);
    var columnSelectId = (0, useId_1.default)();
    var columnSelectLabelId = (0, useId_1.default)();
    var operatorSelectId = (0, useId_1.default)();
    var operatorSelectLabelId = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var valueRef = React.useRef(null);
    var filterSelectorRef = React.useRef(null);
    var multiFilterOperator = (_a = filterModel.logicOperator) !== null && _a !== void 0 ? _a : gridFilterItem_1.GridLogicOperator.And;
    var hasLogicOperatorColumn = hasMultipleFilters && logicOperators.length > 0;
    var baseSelectProps = ((_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseSelect) || {};
    var isBaseSelectNative = (_c = baseSelectProps.native) !== null && _c !== void 0 ? _c : false;
    var baseSelectOptionProps = ((_d = rootProps.slotProps) === null || _d === void 0 ? void 0 : _d.baseSelectOption) || {};
    var InputComponentProps = valueInputProps.InputComponentProps, valueInputPropsOther = __rest(valueInputProps, ["InputComponentProps"]);
    var pivotActive = (0, useGridSelector_1.useGridSelector)(apiRef, pivoting_1.gridPivotActiveSelector);
    var initialColumns = (0, useGridSelector_1.useGridSelector)(apiRef, pivoting_1.gridPivotInitialColumnsSelector);
    var _r = React.useMemo(function () {
        var itemField = item.field;
        // Yields a valid value if the current filter belongs to a column that is not filterable
        var selectedNonFilterableColumn = columnLookup[item.field].filterable === false ? columnLookup[item.field] : null;
        if (selectedNonFilterableColumn) {
            return {
                filteredColumns: [selectedNonFilterableColumn],
                selectedField: itemField,
            };
        }
        if (pivotActive) {
            return {
                filteredColumns: filterableColumns.filter(function (column) { return initialColumns.get(column.field) !== undefined; }),
                selectedField: itemField,
            };
        }
        if (filterColumns === undefined || typeof filterColumns !== 'function') {
            return { filteredColumns: filterableColumns, selectedField: itemField };
        }
        var filteredFields = filterColumns({
            field: item.field,
            columns: filterableColumns,
            currentFilters: (filterModel === null || filterModel === void 0 ? void 0 : filterModel.items) || [],
        });
        return {
            filteredColumns: filterableColumns.filter(function (column) {
                var isFieldIncluded = filteredFields.includes(column.field);
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
        filterModel === null || filterModel === void 0 ? void 0 : filterModel.items,
        initialColumns,
    ]), filteredColumns = _r.filteredColumns, selectedField = _r.selectedField;
    var sortedFilteredColumns = React.useMemo(function () {
        switch (columnsSort) {
            case 'asc':
                return filteredColumns.sort(function (a, b) {
                    return collator.compare(getColumnLabel(a), getColumnLabel(b));
                });
            case 'desc':
                return filteredColumns.sort(function (a, b) { return -collator.compare(getColumnLabel(a), getColumnLabel(b)); });
            default:
                return filteredColumns;
        }
    }, [filteredColumns, columnsSort]);
    var currentColumn = item.field ? apiRef.current.getColumn(item.field) : null;
    var currentOperator = React.useMemo(function () {
        var _a;
        if (!item.operator || !currentColumn) {
            return null;
        }
        return (_a = currentColumn.filterOperators) === null || _a === void 0 ? void 0 : _a.find(function (operator) { return operator.value === item.operator; });
    }, [item, currentColumn]);
    var changeColumn = React.useCallback(function (event) {
        var field = event.target.value;
        var column = apiRef.current.getColumn(field);
        if (column.field === currentColumn.field) {
            // column did not change
            return;
        }
        // try to keep the same operator when column change
        var newOperator = column.filterOperators.find(function (operator) { return operator.value === item.operator; }) ||
            column.filterOperators[0];
        // Erase filter value if the input component or filtered column type is modified
        var eraseFilterValue = !newOperator.InputComponent ||
            newOperator.InputComponent !== (currentOperator === null || currentOperator === void 0 ? void 0 : currentOperator.InputComponent) ||
            column.type !== currentColumn.type;
        var filterValue = eraseFilterValue ? undefined : item.value;
        // Check filter value against the new valueOptions
        if (column.type === 'singleSelect' && filterValue !== undefined) {
            var colDef_1 = column;
            var valueOptions_1 = (0, filterPanelUtils_1.getValueOptions)(colDef_1);
            if (Array.isArray(filterValue)) {
                filterValue = filterValue.filter(function (val) {
                    return (
                    // Only keep values that are in the new value options
                    (0, filterPanelUtils_1.getValueFromValueOptions)(val, valueOptions_1, colDef_1 === null || colDef_1 === void 0 ? void 0 : colDef_1.getOptionValue) !== undefined);
                });
            }
            else if ((0, filterPanelUtils_1.getValueFromValueOptions)(item.value, valueOptions_1, colDef_1 === null || colDef_1 === void 0 ? void 0 : colDef_1.getOptionValue) ===
                undefined) {
                // Reset the filter value if it is not in the new value options
                filterValue = undefined;
            }
        }
        applyFilterChanges(__assign(__assign({}, item), { field: field, operator: newOperator.value, value: filterValue }));
    }, [apiRef, applyFilterChanges, item, currentColumn, currentOperator]);
    var changeOperator = React.useCallback(function (event) {
        var operator = event.target.value;
        var newOperator = currentColumn === null || currentColumn === void 0 ? void 0 : currentColumn.filterOperators.find(function (op) { return op.value === operator; });
        var eraseItemValue = !(newOperator === null || newOperator === void 0 ? void 0 : newOperator.InputComponent) ||
            (newOperator === null || newOperator === void 0 ? void 0 : newOperator.InputComponent) !== (currentOperator === null || currentOperator === void 0 ? void 0 : currentOperator.InputComponent);
        applyFilterChanges(__assign(__assign({}, item), { operator: operator, value: eraseItemValue ? undefined : item.value }));
    }, [applyFilterChanges, item, currentColumn, currentOperator]);
    var changeLogicOperator = React.useCallback(function (event) {
        var logicOperator = event.target.value === gridFilterItem_1.GridLogicOperator.And.toString()
            ? gridFilterItem_1.GridLogicOperator.And
            : gridFilterItem_1.GridLogicOperator.Or;
        applyMultiFilterOperatorChanges(logicOperator);
    }, [applyMultiFilterOperatorChanges]);
    var handleDeleteFilter = function () {
        deleteFilter(item);
    };
    React.useImperativeHandle(focusElementRef, function () { return ({
        focus: function () {
            var _a;
            if (currentOperator === null || currentOperator === void 0 ? void 0 : currentOperator.InputComponent) {
                (_a = valueRef === null || valueRef === void 0 ? void 0 : valueRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                filterSelectorRef.current.focus();
            }
        },
    }); }, [currentOperator]);
    return (<GridFilterFormRoot className={classes.root} data-id={item.id} ownerState={rootProps} {...other} ref={ref}>
        <FilterFormDeleteIcon {...deleteIconProps} className={(0, clsx_1.default)(classes.deleteIcon, deleteIconProps.className)} ownerState={rootProps}>
          <rootProps.slots.baseIconButton aria-label={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')} title={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')} onClick={handleDeleteFilter} size="small" disabled={readOnly} {...(_e = rootProps.slotProps) === null || _e === void 0 ? void 0 : _e.baseIconButton}>
            <rootProps.slots.filterPanelDeleteIcon fontSize="small"/>
          </rootProps.slots.baseIconButton>
        </FilterFormDeleteIcon>
        <FilterFormLogicOperatorInput as={rootProps.slots.baseSelect} sx={[
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
        ]} className={(0, clsx_1.default)(classes.logicOperatorInput, logicOperatorInputProps.className)} ownerState={rootProps} {...logicOperatorInputProps} size="small" slotProps={{
            htmlInput: {
                'aria-label': apiRef.current.getLocaleText('filterPanelLogicOperator'),
            },
        }} value={multiFilterOperator !== null && multiFilterOperator !== void 0 ? multiFilterOperator : ''} onChange={changeLogicOperator} disabled={!!disableMultiFilterOperator || logicOperators.length === 1} native={isBaseSelectNative} {...(_f = rootProps.slotProps) === null || _f === void 0 ? void 0 : _f.baseSelect}>
          {logicOperators.map(function (logicOperator) { return (<rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isBaseSelectNative} key={logicOperator.toString()} value={logicOperator.toString()}>
              {apiRef.current.getLocaleText(getLogicOperatorLocaleKey(logicOperator))}
            </rootProps.slots.baseSelectOption>); })}
        </FilterFormLogicOperatorInput>
        <FilterFormColumnInput as={rootProps.slots.baseSelect} {...columnInputProps} className={(0, clsx_1.default)(classes.columnInput, columnInputProps.className)} ownerState={rootProps} size="small" labelId={columnSelectLabelId} id={columnSelectId} label={apiRef.current.getLocaleText('filterPanelColumns')} value={selectedField !== null && selectedField !== void 0 ? selectedField : ''} onChange={changeColumn} native={isBaseSelectNative} disabled={readOnly} {...(_g = rootProps.slotProps) === null || _g === void 0 ? void 0 : _g.baseSelect}>
          {sortedFilteredColumns.map(function (col) { return (<rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isBaseSelectNative} key={col.field} value={col.field}>
              {getColumnLabel(col)}
            </rootProps.slots.baseSelectOption>); })}
        </FilterFormColumnInput>
        <FilterFormOperatorInput as={rootProps.slots.baseSelect} size="small" {...operatorInputProps} className={(0, clsx_1.default)(classes.operatorInput, operatorInputProps.className)} ownerState={rootProps} labelId={operatorSelectLabelId} label={apiRef.current.getLocaleText('filterPanelOperator')} id={operatorSelectId} value={item.operator} onChange={changeOperator} native={isBaseSelectNative} inputRef={filterSelectorRef} disabled={readOnly} {...(_h = rootProps.slotProps) === null || _h === void 0 ? void 0 : _h.baseSelect}>
          {(_j = currentColumn === null || currentColumn === void 0 ? void 0 : currentColumn.filterOperators) === null || _j === void 0 ? void 0 : _j.map(function (operator) { return (<rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isBaseSelectNative} key={operator.value} value={operator.value}>
              {operator.label ||
                apiRef.current.getLocaleText("filterOperator".concat((0, capitalize_1.default)(operator.value)))}
            </rootProps.slots.baseSelectOption>); })}
        </FilterFormOperatorInput>
        <FilterFormValueInput {...valueInputPropsOther} className={(0, clsx_1.default)(classes.valueInput, valueInputPropsOther.className)} ownerState={rootProps}>
          {(currentOperator === null || currentOperator === void 0 ? void 0 : currentOperator.InputComponent) ? (<currentOperator.InputComponent apiRef={apiRef} item={item} applyValue={applyFilterChanges} focusElementRef={valueRef} disabled={readOnly} key={item.field} slotProps={{
                root: { size: 'small' },
            }} {...currentOperator.InputComponentProps} {...InputComponentProps}/>) : null}
        </FilterFormValueInput>
      </GridFilterFormRoot>);
});
exports.GridFilterForm = GridFilterForm;
GridFilterForm.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback called when the operator, column field or value is changed.
     * @param {GridFilterItem} item The updated [[GridFilterItem]].
     */
    applyFilterChanges: prop_types_1.default.func.isRequired,
    /**
     * Callback called when the logic operator is changed.
     * @param {GridLogicOperator} operator The new logic operator.
     */
    applyMultiFilterOperatorChanges: prop_types_1.default.func.isRequired,
    /**
     * @ignore - do not document.
     */
    children: prop_types_1.default.node,
    /**
     * Props passed to the column input component.
     * @default {}
     */
    columnInputProps: prop_types_1.default.any,
    /**
     * Changes how the options in the columns selector should be ordered.
     * If not specified, the order is derived from the `columns` prop.
     */
    columnsSort: prop_types_1.default.oneOf(['asc', 'desc']),
    /**
     * Callback called when the delete button is clicked.
     * @param {GridFilterItem} item The deleted [[GridFilterItem]].
     */
    deleteFilter: prop_types_1.default.func.isRequired,
    /**
     * Props passed to the delete icon.
     * @default {}
     */
    deleteIconProps: prop_types_1.default.any,
    /**
     * If `true`, disables the logic operator field but still renders it.
     */
    disableMultiFilterOperator: prop_types_1.default.bool,
    /**
     * Allows to filter the columns displayed in the filter form.
     * @param {FilterColumnsArgs} args The columns of the grid and name of field.
     * @returns {GridColDef['field'][]} The filtered fields array.
     */
    filterColumns: prop_types_1.default.func,
    /**
     * A ref allowing to set imperative focus.
     * It can be passed to the el
     */
    focusElementRef: prop_types_1.default /* @typescript-to-proptypes-ignore */.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * If `true`, the logic operator field is rendered.
     * The field will be invisible if `showMultiFilterOperators` is also `true`.
     */
    hasMultipleFilters: prop_types_1.default.bool.isRequired,
    /**
     * The [[GridFilterItem]] representing this form.
     */
    item: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        operator: prop_types_1.default.string.isRequired,
        value: prop_types_1.default.any,
    }).isRequired,
    /**
     * Props passed to the logic operator input component.
     * @default {}
     */
    logicOperatorInputProps: prop_types_1.default.any,
    /**
     * Sets the available logic operators.
     * @default [GridLogicOperator.And, GridLogicOperator.Or]
     */
    logicOperators: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['and', 'or']).isRequired),
    /**
     * Props passed to the operator input component.
     * @default {}
     */
    operatorInputProps: prop_types_1.default.any,
    /**
     * `true` if the filter is disabled/read only.
     * i.e. `colDef.fiterable = false` but passed in `filterModel`
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * If `true`, the logic operator field is visible.
     */
    showMultiFilterOperators: prop_types_1.default.bool,
    /**
     * Props passed to the value input component.
     * @default {}
     */
    valueInputProps: prop_types_1.default.any,
};
