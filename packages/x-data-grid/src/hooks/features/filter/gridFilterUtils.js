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
Object.defineProperty(exports, "__esModule", { value: true });
exports.passFilterLogic = exports.buildAggregatedFilterApplier = exports.shouldQuickFilterExcludeHiddenColumns = exports.removeDiacritics = exports.mergeStateWithFilterModel = exports.sanitizeFilterModel = exports.cleanFilterItem = void 0;
var warning_1 = require("@mui/x-internals/warning");
var models_1 = require("../../../models");
var gridFilterState_1 = require("./gridFilterState");
var getPublicApiRef_1 = require("../../../utils/getPublicApiRef");
var columns_1 = require("../columns");
var hasEval;
function getHasEval() {
    if (hasEval !== undefined) {
        return hasEval;
    }
    try {
        // eslint-disable-next-line no-new-func
        hasEval = new Function('return true')();
    }
    catch (_) {
        hasEval = false;
    }
    return hasEval;
}
/**
 * Adds default values to the optional fields of a filter items.
 * @param {GridFilterItem} item The raw filter item.
 * @param {RefObject<GridPrivateApiCommunity>} apiRef The API of the grid.
 * @return {GridFilterItem} The clean filter item with an uniq ID and an always-defined operator.
 * TODO: Make the typing reflect the different between GridFilterInputItem and GridFilterItem.
 */
var cleanFilterItem = function (item, apiRef) {
    var cleanItem = __assign({}, item);
    if (cleanItem.id == null) {
        cleanItem.id = Math.round(Math.random() * 1e5);
    }
    if (cleanItem.operator == null) {
        // Selects a default operator
        // We don't use `apiRef.current.getColumn` because it is not ready during state initialization
        var column = (0, columns_1.gridColumnLookupSelector)(apiRef)[cleanItem.field];
        cleanItem.operator = column && column.filterOperators[0].value;
    }
    return cleanItem;
};
exports.cleanFilterItem = cleanFilterItem;
var sanitizeFilterModel = function (model, disableMultipleColumnsFiltering, apiRef) {
    var hasSeveralItems = model.items.length > 1;
    var items;
    if (hasSeveralItems && disableMultipleColumnsFiltering) {
        if (process.env.NODE_ENV !== 'production') {
            (0, warning_1.warnOnce)([
                'MUI X: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.',
                'If you are using the community version of the Data Grid, this prop is always `true`.',
            ], 'error');
        }
        items = [model.items[0]];
    }
    else {
        items = model.items;
    }
    var hasItemsWithoutIds = hasSeveralItems && items.some(function (item) { return item.id == null; });
    var hasItemWithoutOperator = items.some(function (item) { return item.operator == null; });
    if (process.env.NODE_ENV !== 'production') {
        if (hasItemsWithoutIds) {
            (0, warning_1.warnOnce)('MUI X: The `id` field is required on `filterModel.items` when you use multiple filters.', 'error');
        }
    }
    if (process.env.NODE_ENV !== 'production') {
        if (hasItemWithoutOperator) {
            (0, warning_1.warnOnce)('MUI X: The `operator` field is required on `filterModel.items`, one or more of your filtering item has no `operator` provided.', 'error');
        }
    }
    if (hasItemWithoutOperator || hasItemsWithoutIds) {
        return __assign(__assign({}, model), { items: items.map(function (item) { return (0, exports.cleanFilterItem)(item, apiRef); }) });
    }
    if (model.items !== items) {
        return __assign(__assign({}, model), { items: items });
    }
    return model;
};
exports.sanitizeFilterModel = sanitizeFilterModel;
var mergeStateWithFilterModel = function (filterModel, disableMultipleColumnsFiltering, apiRef) {
    return function (filteringState) { return (__assign(__assign({}, filteringState), { filterModel: (0, exports.sanitizeFilterModel)(filterModel, disableMultipleColumnsFiltering, apiRef) })); };
};
exports.mergeStateWithFilterModel = mergeStateWithFilterModel;
var removeDiacritics = function (value) {
    if (typeof value === 'string') {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return value;
};
exports.removeDiacritics = removeDiacritics;
var getFilterCallbackFromItem = function (filterItem, apiRef) {
    var _a;
    if (!filterItem.field || !filterItem.operator) {
        return null;
    }
    var column = apiRef.current.getColumn(filterItem.field);
    if (!column) {
        return null;
    }
    var parsedValue;
    if (column.valueParser) {
        var parser_1 = column.valueParser;
        parsedValue = Array.isArray(filterItem.value)
            ? (_a = filterItem.value) === null || _a === void 0 ? void 0 : _a.map(function (x) { return parser_1(x, undefined, column, apiRef); })
            : parser_1(filterItem.value, undefined, column, apiRef);
    }
    else {
        parsedValue = filterItem.value;
    }
    var ignoreDiacritics = apiRef.current.rootProps.ignoreDiacritics;
    if (ignoreDiacritics) {
        parsedValue = (0, exports.removeDiacritics)(parsedValue);
    }
    var newFilterItem = __assign(__assign({}, filterItem), { value: parsedValue });
    var filterOperators = column.filterOperators;
    if (!(filterOperators === null || filterOperators === void 0 ? void 0 : filterOperators.length)) {
        throw new Error("MUI X: No filter operators found for column '".concat(column.field, "'."));
    }
    var filterOperator = filterOperators.find(function (operator) { return operator.value === newFilterItem.operator; });
    if (!filterOperator) {
        throw new Error("MUI X: No filter operator found for column '".concat(column.field, "' and operator value '").concat(newFilterItem.operator, "'."));
    }
    var publicApiRef = (0, getPublicApiRef_1.getPublicApiRef)(apiRef);
    var applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column);
    if (typeof applyFilterOnRow !== 'function') {
        return null;
    }
    return {
        item: newFilterItem,
        fn: function (row) {
            var value = apiRef.current.getRowValue(row, column);
            if (ignoreDiacritics) {
                value = (0, exports.removeDiacritics)(value);
            }
            return applyFilterOnRow(value, row, column, publicApiRef);
        },
    };
};
var filterItemsApplierId = 1;
/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {RefObject<GridPrivateApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
var buildAggregatedFilterItemsApplier = function (filterModel, apiRef, disableEval) {
    var items = filterModel.items;
    var appliers = items
        .map(function (item) { return getFilterCallbackFromItem(item, apiRef); })
        .filter(function (callback) { return !!callback; });
    if (appliers.length === 0) {
        return null;
    }
    if (disableEval || !getHasEval()) {
        // This is the original logic, which is used if `eval()` is not supported (aka prevented by CSP).
        return function (row, shouldApplyFilter) {
            var resultPerItemId = {};
            for (var i = 0; i < appliers.length; i += 1) {
                var applier = appliers[i];
                if (!shouldApplyFilter || shouldApplyFilter(applier.item.field)) {
                    resultPerItemId[applier.item.id] = applier.fn(row);
                }
            }
            return resultPerItemId;
        };
    }
    // We generate a new function with `new Function()` to avoid expensive patterns for JS engines
    // such as a dynamic object assignment, for example `{ [dynamicKey]: value }`.
    // eslint-disable-next-line no-new-func
    var filterItemCore = new Function('appliers', 'row', 'shouldApplyFilter', "\"use strict\";\n".concat(appliers
        .map(function (applier, i) {
        return "const shouldApply".concat(i, " = !shouldApplyFilter || shouldApplyFilter(").concat(JSON.stringify(applier.item.field), ");");
    })
        .join('\n'), "\n\nconst result$$ = {\n").concat(appliers
        .map(function (applier, i) {
        return "  ".concat(JSON.stringify(String(applier.item.id)), ": !shouldApply").concat(i, " ? false : appliers[").concat(i, "].fn(row),");
    })
        .join('\n'), "\n};\n\nreturn result$$;").replaceAll('$$', String(filterItemsApplierId)));
    filterItemsApplierId += 1;
    // Assign to the arrow function a name to help debugging
    var filterItem = function (row, shouldApplyItem) {
        return filterItemCore(appliers, row, shouldApplyItem);
    };
    return filterItem;
};
var shouldQuickFilterExcludeHiddenColumns = function (filterModel) {
    var _a;
    return (_a = filterModel.quickFilterExcludeHiddenColumns) !== null && _a !== void 0 ? _a : true;
};
exports.shouldQuickFilterExcludeHiddenColumns = shouldQuickFilterExcludeHiddenColumns;
/**
 * Generates a method to easily check if a row is matching the current quick filter.
 * @param {any[]} filterModel The model with which we want to filter the rows.
 * @param {RefObject<GridPrivateApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
var buildAggregatedQuickFilterApplier = function (filterModel, apiRef) {
    var _a, _b;
    var quickFilterValues = (_b = (_a = filterModel.quickFilterValues) === null || _a === void 0 ? void 0 : _a.filter(Boolean)) !== null && _b !== void 0 ? _b : [];
    if (quickFilterValues.length === 0) {
        return null;
    }
    var allColumnFields = (0, columns_1.gridColumnFieldsSelector)(apiRef);
    var columnVisibilityModel = (0, columns_1.gridColumnVisibilityModelSelector)(apiRef);
    var columnFields;
    if ((0, exports.shouldQuickFilterExcludeHiddenColumns)(filterModel)) {
        // Do not use gridVisibleColumnFieldsSelector here, because quick filter won't work in the list view mode
        // See https://github.com/mui/mui-x/issues/19145
        columnFields = allColumnFields.filter(function (field) { return columnVisibilityModel[field] !== false; });
    }
    else {
        columnFields = allColumnFields;
    }
    var appliersPerField = [];
    var ignoreDiacritics = apiRef.current.rootProps.ignoreDiacritics;
    var publicApiRef = (0, getPublicApiRef_1.getPublicApiRef)(apiRef);
    columnFields.forEach(function (field) {
        var column = apiRef.current.getColumn(field);
        var getApplyQuickFilterFn = column === null || column === void 0 ? void 0 : column.getApplyQuickFilterFn;
        if (getApplyQuickFilterFn) {
            appliersPerField.push({
                column: column,
                appliers: quickFilterValues.map(function (quickFilterValue) {
                    var value = ignoreDiacritics ? (0, exports.removeDiacritics)(quickFilterValue) : quickFilterValue;
                    return {
                        fn: getApplyQuickFilterFn(value, column, publicApiRef),
                    };
                }),
            });
        }
    });
    return function isRowMatchingQuickFilter(row, shouldApplyFilter) {
        var result = {};
        /* eslint-disable no-labels */
        outer: for (var v = 0; v < quickFilterValues.length; v += 1) {
            var filterValue = quickFilterValues[v];
            for (var i = 0; i < appliersPerField.length; i += 1) {
                var _a = appliersPerField[i], column = _a.column, appliers = _a.appliers;
                var field = column.field;
                if (shouldApplyFilter && !shouldApplyFilter(field)) {
                    continue;
                }
                var applier = appliers[v];
                var value = apiRef.current.getRowValue(row, column);
                if (applier.fn === null) {
                    continue;
                }
                if (ignoreDiacritics) {
                    value = (0, exports.removeDiacritics)(value);
                }
                var isMatching = applier.fn(value, row, column, publicApiRef);
                if (isMatching) {
                    result[filterValue] = true;
                    continue outer;
                }
            }
            result[filterValue] = false;
        }
        return result;
    };
};
var buildAggregatedFilterApplier = function (filterModel, apiRef, disableEval) {
    var isRowMatchingFilterItems = buildAggregatedFilterItemsApplier(filterModel, apiRef, disableEval);
    var isRowMatchingQuickFilter = buildAggregatedQuickFilterApplier(filterModel, apiRef);
    return function isRowMatchingFilters(row, shouldApplyFilter, result) {
        var _a, _b;
        result.passingFilterItems = (_a = isRowMatchingFilterItems === null || isRowMatchingFilterItems === void 0 ? void 0 : isRowMatchingFilterItems(row, shouldApplyFilter)) !== null && _a !== void 0 ? _a : null;
        result.passingQuickFilterValues = (_b = isRowMatchingQuickFilter === null || isRowMatchingQuickFilter === void 0 ? void 0 : isRowMatchingQuickFilter(row, shouldApplyFilter)) !== null && _b !== void 0 ? _b : null;
    };
};
exports.buildAggregatedFilterApplier = buildAggregatedFilterApplier;
var isNotNull = function (result) { return result != null; };
var filterModelItems = function (cache, apiRef, items) {
    if (!cache.cleanedFilterItems) {
        cache.cleanedFilterItems = items.filter(function (item) { return getFilterCallbackFromItem(item, apiRef) !== null; });
    }
    return cache.cleanedFilterItems;
};
var passFilterLogic = function (allFilterItemResults, allQuickFilterResults, filterModel, apiRef, cache) {
    var _a, _b;
    var cleanedFilterItems = filterModelItems(cache, apiRef, filterModel.items);
    var cleanedFilterItemResults = allFilterItemResults.filter(isNotNull);
    var cleanedQuickFilterResults = allQuickFilterResults.filter(isNotNull);
    // get result for filter items model
    if (cleanedFilterItemResults.length > 0) {
        // Return true if the item pass with one of the rows
        var filterItemPredicate = function (item) {
            return cleanedFilterItemResults.some(function (filterItemResult) { return filterItemResult[item.id]; });
        };
        var logicOperator = (_a = filterModel.logicOperator) !== null && _a !== void 0 ? _a : (0, gridFilterState_1.getDefaultGridFilterModel)().logicOperator;
        if (logicOperator === models_1.GridLogicOperator.And) {
            var passesAllFilters = cleanedFilterItems.every(filterItemPredicate);
            if (!passesAllFilters) {
                return false;
            }
        }
        else {
            var passesSomeFilters = cleanedFilterItems.some(filterItemPredicate);
            if (!passesSomeFilters) {
                return false;
            }
        }
    }
    // get result for quick filter model
    if (cleanedQuickFilterResults.length > 0 && filterModel.quickFilterValues != null) {
        // Return true if the item pass with one of the rows
        var quickFilterValuePredicate = function (value) {
            return cleanedQuickFilterResults.some(function (quickFilterValueResult) { return quickFilterValueResult[value]; });
        };
        var quickFilterLogicOperator = (_b = filterModel.quickFilterLogicOperator) !== null && _b !== void 0 ? _b : (0, gridFilterState_1.getDefaultGridFilterModel)().quickFilterLogicOperator;
        if (quickFilterLogicOperator === models_1.GridLogicOperator.And) {
            var passesAllQuickFilterValues = filterModel.quickFilterValues.every(quickFilterValuePredicate);
            if (!passesAllQuickFilterValues) {
                return false;
            }
        }
        else {
            var passesSomeQuickFilterValues = filterModel.quickFilterValues.some(quickFilterValuePredicate);
            if (!passesSomeQuickFilterValues) {
                return false;
            }
        }
    }
    return true;
};
exports.passFilterLogic = passFilterLogic;
