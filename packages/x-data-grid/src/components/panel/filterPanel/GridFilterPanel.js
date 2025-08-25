"use strict";
'use client';
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridFilter = exports.GridFilterPanel = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var gridFilterItem_1 = require("../../../models/gridFilterItem");
var useGridApiContext_1 = require("../../../hooks/utils/useGridApiContext");
var GridPanelContent_1 = require("../GridPanelContent");
var GridPanelFooter_1 = require("../GridPanelFooter");
var GridPanelWrapper_1 = require("../GridPanelWrapper");
var GridFilterForm_1 = require("./GridFilterForm");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var useGridSelector_1 = require("../../../hooks/utils/useGridSelector");
var gridFilterSelector_1 = require("../../../hooks/features/filter/gridFilterSelector");
var gridColumnsSelector_1 = require("../../../hooks/features/columns/gridColumnsSelector");
var getGridFilter = function (col) { return ({
    field: col.field,
    operator: col.filterOperators[0].value,
    id: Math.round(Math.random() * 1e5),
}); };
exports.getGridFilter = getGridFilter;
var GridFilterPanel = (0, forwardRef_1.forwardRef)(function GridFilterPanel(props, ref) {
    var _a, _b;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var filterModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridFilterModelSelector);
    var filterableColumns = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridFilterableColumnDefinitionsSelector);
    var filterableColumnsLookup = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridFilterableColumnLookupSelector);
    var lastFilterRef = React.useRef(null);
    var placeholderFilter = React.useRef(null);
    var _c = props.logicOperators, logicOperators = _c === void 0 ? [gridFilterItem_1.GridLogicOperator.And, gridFilterItem_1.GridLogicOperator.Or] : _c, columnsSort = props.columnsSort, filterFormProps = props.filterFormProps, getColumnForNewFilter = props.getColumnForNewFilter, children = props.children, _d = props.disableAddFilterButton, disableAddFilterButton = _d === void 0 ? false : _d, _e = props.disableRemoveAllButton, disableRemoveAllButton = _e === void 0 ? false : _e, other = __rest(props, ["logicOperators", "columnsSort", "filterFormProps", "getColumnForNewFilter", "children", "disableAddFilterButton", "disableRemoveAllButton"]);
    var applyFilter = apiRef.current.upsertFilterItem;
    var applyFilterLogicOperator = React.useCallback(function (operator) {
        apiRef.current.setFilterLogicOperator(operator);
    }, [apiRef]);
    var getDefaultFilter = React.useCallback(function () {
        var nextColumnWithOperator;
        if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
            // To allow override the column for default (first) filter
            var nextFieldName_1 = getColumnForNewFilter({
                currentFilters: (filterModel === null || filterModel === void 0 ? void 0 : filterModel.items) || [],
                columns: filterableColumns,
            });
            if (nextFieldName_1 === null) {
                return null;
            }
            nextColumnWithOperator = filterableColumns.find(function (_a) {
                var field = _a.field;
                return field === nextFieldName_1;
            });
        }
        else {
            nextColumnWithOperator = filterableColumns.find(function (colDef) { var _a; return (_a = colDef.filterOperators) === null || _a === void 0 ? void 0 : _a.length; });
        }
        if (!nextColumnWithOperator) {
            return null;
        }
        return getGridFilter(nextColumnWithOperator);
    }, [filterModel === null || filterModel === void 0 ? void 0 : filterModel.items, filterableColumns, getColumnForNewFilter]);
    var getNewFilter = React.useCallback(function () {
        if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
            return getDefaultFilter();
        }
        var currentFilters = filterModel.items.length
            ? filterModel.items
            : [getDefaultFilter()].filter(Boolean);
        // If no items are there in filterModel, we have to pass defaultFilter
        var nextColumnFieldName = getColumnForNewFilter({
            currentFilters: currentFilters,
            columns: filterableColumns,
        });
        if (nextColumnFieldName === null) {
            return null;
        }
        var nextColumnWithOperator = filterableColumns.find(function (_a) {
            var field = _a.field;
            return field === nextColumnFieldName;
        });
        if (!nextColumnWithOperator) {
            return null;
        }
        return getGridFilter(nextColumnWithOperator);
    }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);
    var items = React.useMemo(function () {
        if (filterModel.items.length) {
            return filterModel.items;
        }
        if (!placeholderFilter.current) {
            placeholderFilter.current = getDefaultFilter();
        }
        return placeholderFilter.current ? [placeholderFilter.current] : [];
    }, [filterModel.items, getDefaultFilter]);
    var hasMultipleFilters = items.length > 1;
    var _f = React.useMemo(function () {
        return items.reduce(function (acc, item) {
            if (filterableColumnsLookup[item.field]) {
                acc.validFilters.push(item);
            }
            else {
                acc.readOnlyFilters.push(item);
            }
            return acc;
        }, { readOnlyFilters: [], validFilters: [] });
    }, [items, filterableColumnsLookup]), readOnlyFilters = _f.readOnlyFilters, validFilters = _f.validFilters;
    var addNewFilter = React.useCallback(function () {
        var newFilter = getNewFilter();
        if (!newFilter) {
            return;
        }
        apiRef.current.upsertFilterItems(__spreadArray(__spreadArray([], items, true), [newFilter], false));
    }, [apiRef, getNewFilter, items]);
    var deleteFilter = React.useCallback(function (item) {
        var shouldCloseFilterPanel = validFilters.length === 1;
        apiRef.current.deleteFilterItem(item);
        if (shouldCloseFilterPanel) {
            apiRef.current.hideFilterPanel();
        }
    }, [apiRef, validFilters.length]);
    var handleRemoveAll = React.useCallback(function () {
        if (validFilters.length === 1 && validFilters[0].value === undefined) {
            apiRef.current.deleteFilterItem(validFilters[0]);
            return apiRef.current.hideFilterPanel();
        }
        return apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { items: readOnlyFilters }), 'removeAllFilterItems');
    }, [apiRef, readOnlyFilters, filterModel, validFilters]);
    React.useEffect(function () {
        if (logicOperators.length > 0 &&
            filterModel.logicOperator &&
            !logicOperators.includes(filterModel.logicOperator)) {
            applyFilterLogicOperator(logicOperators[0]);
        }
    }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);
    React.useEffect(function () {
        if (validFilters.length > 0) {
            lastFilterRef.current.focus();
        }
    }, [validFilters.length]);
    return (<GridPanelWrapper_1.GridPanelWrapper {...other} ref={ref}>
        <GridPanelContent_1.GridPanelContent>
          {readOnlyFilters.map(function (item, index) { return (<GridFilterForm_1.GridFilterForm key={item.id == null ? index : item.id} item={item} applyFilterChanges={applyFilter} deleteFilter={deleteFilter} hasMultipleFilters={hasMultipleFilters} showMultiFilterOperators={index > 0} disableMultiFilterOperator={index !== 1} applyMultiFilterOperatorChanges={applyFilterLogicOperator} focusElementRef={null} readOnly logicOperators={logicOperators} columnsSort={columnsSort} {...filterFormProps}/>); })}
          {validFilters.map(function (item, index) { return (<GridFilterForm_1.GridFilterForm key={item.id == null ? index + readOnlyFilters.length : item.id} item={item} applyFilterChanges={applyFilter} deleteFilter={deleteFilter} hasMultipleFilters={hasMultipleFilters} showMultiFilterOperators={readOnlyFilters.length + index > 0} disableMultiFilterOperator={readOnlyFilters.length + index !== 1} applyMultiFilterOperatorChanges={applyFilterLogicOperator} focusElementRef={index === validFilters.length - 1 ? lastFilterRef : null} logicOperators={logicOperators} columnsSort={columnsSort} {...filterFormProps}/>); })}
        </GridPanelContent_1.GridPanelContent>
        {!rootProps.disableMultipleColumnsFiltering &&
            !(disableAddFilterButton && disableRemoveAllButton) ? (<GridPanelFooter_1.GridPanelFooter>
            {!disableAddFilterButton ? (<rootProps.slots.baseButton onClick={addNewFilter} startIcon={<rootProps.slots.filterPanelAddIcon />} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseButton}>
                {apiRef.current.getLocaleText('filterPanelAddFilter')}
              </rootProps.slots.baseButton>) : (<span />)}

            {!disableRemoveAllButton && validFilters.length > 0 ? (<rootProps.slots.baseButton onClick={handleRemoveAll} startIcon={<rootProps.slots.filterPanelRemoveAllIcon />} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton}>
                {apiRef.current.getLocaleText('filterPanelRemoveAll')}
              </rootProps.slots.baseButton>) : null}
          </GridPanelFooter_1.GridPanelFooter>) : null}
      </GridPanelWrapper_1.GridPanelWrapper>);
});
exports.GridFilterPanel = GridFilterPanel;
GridFilterPanel.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * @ignore - do not document.
     */
    children: prop_types_1.default.node,
    /**
     * Changes how the options in the columns selector should be ordered.
     * If not specified, the order is derived from the `columns` prop.
     */
    columnsSort: prop_types_1.default.oneOf(['asc', 'desc']),
    /**
     * If `true`, the `Add filter` button will not be displayed.
     * @default false
     */
    disableAddFilterButton: prop_types_1.default.bool,
    /**
     * If `true`, the `Remove all` button will be disabled
     * @default false
     */
    disableRemoveAllButton: prop_types_1.default.bool,
    /**
     * Props passed to each filter form.
     */
    filterFormProps: prop_types_1.default.shape({
        columnInputProps: prop_types_1.default.any,
        columnsSort: prop_types_1.default.oneOf(['asc', 'desc']),
        deleteIconProps: prop_types_1.default.any,
        filterColumns: prop_types_1.default.func,
        logicOperatorInputProps: prop_types_1.default.any,
        operatorInputProps: prop_types_1.default.any,
        valueInputProps: prop_types_1.default.any,
    }),
    /**
     * Function that returns the next filter item to be picked as default filter.
     * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
     * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
     */
    getColumnForNewFilter: prop_types_1.default.func,
    /**
     * Sets the available logic operators.
     * @default [GridLogicOperator.And, GridLogicOperator.Or]
     */
    logicOperators: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['and', 'or']).isRequired),
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
