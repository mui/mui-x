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
exports.useGridChartsIntegration = exports.chartsIntegrationStateInitializer = exports.EMPTY_CHART_INTEGRATION_CONTEXT_STATE = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var debounce_1 = require("@mui/utils/debounce");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridRowGroupingUtils_1 = require("../rowGrouping/gridRowGroupingUtils");
var gridChartsIntegrationSelectors_1 = require("./gridChartsIntegrationSelectors");
var useGridChartIntegration_1 = require("../../utils/useGridChartIntegration");
var utils_1 = require("./utils");
var gridRowGroupingSelector_1 = require("../rowGrouping/gridRowGroupingSelector");
var sidebar_1 = require("../sidebar");
var gridAggregationUtils_1 = require("../aggregation/gridAggregationUtils");
var gridAggregationSelectors_1 = require("../aggregation/gridAggregationSelectors");
var gridPivotingSelectors_1 = require("../pivoting/gridPivotingSelectors");
var EMPTY_CHART_INTEGRATION_CONTEXT = {
    chartStateLookup: {},
    setChartState: function () { },
};
exports.EMPTY_CHART_INTEGRATION_CONTEXT_STATE = {
    synced: true,
    dimensions: [],
    values: [],
    type: '',
    configuration: {},
};
var chartsIntegrationStateInitializer = function (state, props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (!props.chartsIntegration || !((_a = props.experimentalFeatures) === null || _a === void 0 ? void 0 : _a.charts)) {
        return __assign(__assign({}, state), { chartsIntegration: {
                activeChartId: '',
                charts: {},
            } });
    }
    var rowGroupingModel = ((_c = (_b = state.rowGrouping) === null || _b === void 0 ? void 0 : _b.model) !== null && _c !== void 0 ? _c : []).filter(function (item) { return item !== undefined; });
    var pivotModel = ((_d = state.pivoting) === null || _d === void 0 ? void 0 : _d.active) ? (_e = state.pivoting) === null || _e === void 0 ? void 0 : _e.model : undefined;
    var columnsLookup = (_g = (_f = state.columns) === null || _f === void 0 ? void 0 : _f.lookup) !== null && _g !== void 0 ? _g : {};
    var charts = Object.fromEntries(Object.entries(((_j = (_h = props.initialState) === null || _h === void 0 ? void 0 : _h.chartsIntegration) === null || _j === void 0 ? void 0 : _j.charts) || {}).map(function (_a) {
        var chartId = _a[0], chart = _a[1];
        return [
            chartId,
            {
                dimensions: (chart.dimensions || [])
                    .map(function (dimension) {
                    return typeof dimension === 'string' ? { field: dimension, hidden: false } : dimension;
                })
                    .filter(function (dimension) {
                    var _a;
                    return ((_a = columnsLookup[dimension.field]) === null || _a === void 0 ? void 0 : _a.chartable) === true &&
                        !(0, utils_1.isBlockedForSection)(columnsLookup[dimension.field], 'dimensions', rowGroupingModel, pivotModel);
                }),
                values: (chart.values || [])
                    .map(function (value) { return (typeof value === 'string' ? { field: value, hidden: false } : value); })
                    .filter(function (value) {
                    var _a;
                    return ((_a = columnsLookup[value.field]) === null || _a === void 0 ? void 0 : _a.chartable) === true &&
                        !(0, utils_1.isBlockedForSection)(columnsLookup[value.field], 'values', rowGroupingModel, pivotModel);
                }),
            },
        ];
    }));
    return __assign(__assign({}, state), { chartsIntegration: {
            activeChartId: (_o = (_k = props.activeChartId) !== null && _k !== void 0 ? _k : (_m = (_l = props.initialState) === null || _l === void 0 ? void 0 : _l.chartsIntegration) === null || _m === void 0 ? void 0 : _m.activeChartId) !== null && _o !== void 0 ? _o : '',
            charts: charts,
        } });
};
exports.chartsIntegrationStateInitializer = chartsIntegrationStateInitializer;
var useGridChartsIntegration = function (apiRef, props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var visibleDimensions = React.useRef({});
    var visibleValues = React.useRef({});
    var schema = React.useMemo(function () { var _a, _b; return ((_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.chartsPanel) === null || _b === void 0 ? void 0 : _b.schema) || {}; }, [(_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.chartsPanel) === null || _b === void 0 ? void 0 : _b.schema]);
    var context = (0, useGridChartIntegration_1.useGridChartsIntegrationContext)(true);
    var isChartsIntegrationAvailable = !!props.chartsIntegration && !!((_c = props.experimentalFeatures) === null || _c === void 0 ? void 0 : _c.charts) && !!context;
    var activeChartId = (0, gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector)(apiRef);
    var aggregationModel = (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef);
    var pivotActive = (0, internals_1.gridPivotActiveSelector)(apiRef);
    var pivotModel = (0, gridPivotingSelectors_1.gridPivotModelSelector)(apiRef);
    var _l = context || EMPTY_CHART_INTEGRATION_CONTEXT, chartStateLookup = _l.chartStateLookup, setChartState = _l.setChartState;
    var availableChartIds = React.useMemo(function () {
        var ids = Object.keys(chartStateLookup);
        // cleanup visibleDimensions and visibleValues references
        Object.keys(visibleDimensions.current).forEach(function (chartId) {
            if (!ids.includes(chartId)) {
                delete visibleDimensions.current[chartId];
                delete visibleValues.current[chartId];
            }
        });
        return ids;
    }, [chartStateLookup]);
    var syncedChartIds = React.useMemo(function () { return availableChartIds.filter(function (chartId) { return chartStateLookup[chartId].synced !== false; }); }, [availableChartIds, chartStateLookup]);
    var getColumnName = React.useCallback(function (field) {
        var _a, _b, _c, _d;
        var customFieldName = (_c = (_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.chartsPanel) === null || _b === void 0 ? void 0 : _b.getColumnName) === null || _c === void 0 ? void 0 : _c.call(_b, field);
        if (customFieldName) {
            return customFieldName;
        }
        var columns = (0, internals_1.gridColumnLookupSelector)(apiRef);
        var columnGroupPath = (_d = (0, x_data_grid_pro_1.gridColumnGroupsUnwrappedModelSelector)(apiRef)[field]) !== null && _d !== void 0 ? _d : [];
        var columnGroupLookup = (0, x_data_grid_pro_1.gridColumnGroupsLookupSelector)(apiRef);
        var column = columns[field];
        var columnName = (column === null || column === void 0 ? void 0 : column.headerName) || field;
        if (!pivotActive || !columnGroupPath) {
            return columnName;
        }
        var groupNames = columnGroupPath.map(function (group) { return columnGroupLookup[group].headerName || group; });
        return __spreadArray([columnName], groupNames, true).join(' - ');
    }, [apiRef, pivotActive, (_d = props.slotProps) === null || _d === void 0 ? void 0 : _d.chartsPanel]);
    // Adds aggregation function label to the column name
    var getValueDatasetLabel = React.useCallback(function (field) {
        var _a, _b, _c;
        var customFieldName = (_c = (_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.chartsPanel) === null || _b === void 0 ? void 0 : _b.getColumnName) === null || _c === void 0 ? void 0 : _c.call(_b, field);
        if (customFieldName) {
            return customFieldName;
        }
        var columnName = getColumnName(field);
        var fieldAggregation = (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef)[field];
        var suffix = fieldAggregation
            ? " (".concat((0, gridAggregationUtils_1.getAggregationFunctionLabel)({
                apiRef: apiRef,
                aggregationRule: {
                    aggregationFunctionName: fieldAggregation,
                    aggregationFunction: props.aggregationFunctions[fieldAggregation] || {},
                },
            }), ")")
            : '';
        return "".concat(columnName).concat(suffix);
    }, [apiRef, props.aggregationFunctions, (_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.chartsPanel, getColumnName]);
    apiRef.current.registerControlState({
        stateId: 'activeChartId',
        propModel: props.activeChartId,
        propOnChange: props.onActiveChartIdChange,
        stateSelector: gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector,
        changeEvent: 'activeChartIdChange',
    });
    // sometimes, updates made to the chart dimensions and values require updating other models
    // for example, if we are adding more than one dimension, we need to set the new grouping model
    // if we are adding new value dataset to the grouped data, we need to set the aggregation model, otherwise the values will be undefined
    var updateOtherModels = React.useCallback(function () {
        var _a;
        var rowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        if (((_a = visibleDimensions.current[activeChartId]) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
            // if there was row grouping or if we are adding more than one dimension, set the new grouping model
            (rowGroupingModel.length > 0 || visibleDimensions.current[activeChartId].length > 1) &&
            // if row grouping model starts with dimensions in the same order, we don't have to do anything
            visibleDimensions.current[activeChartId].some(function (item, index) { return item.field !== rowGroupingModel[index]; })) {
            // if pivoting is enabled, then the row grouping model is driven by the pivoting rows
            var newGroupingModel_1 = visibleDimensions.current[activeChartId].map(function (item) { return item.field; });
            if (pivotActive) {
                apiRef.current.setPivotModel(function (prev) { return (__assign(__assign({}, prev), { rows: newGroupingModel_1.map(function (item) { return ({ field: item, hidden: false }); }) })); });
            }
            else {
                apiRef.current.setRowGroupingModel(newGroupingModel_1);
                apiRef.current.setColumnVisibilityModel(__assign(__assign(__assign({}, apiRef.current.state.columns.columnVisibilityModel), Object.fromEntries(rowGroupingModel.map(function (item) { return [item, true]; }))), Object.fromEntries(newGroupingModel_1.map(function (item) { return [item, false]; }))));
            }
        }
        if (!pivotActive && visibleValues.current[activeChartId] && rowGroupingModel.length > 0) {
            // with row grouping add the aggregation model to the newly added value dataset
            var aggregatedFields_1 = Object.keys(aggregationModel);
            var aggregationsToAdd_1 = {};
            visibleValues.current[activeChartId].forEach(function (item) {
                var hasAggregation = aggregatedFields_1.includes(item.field);
                if (!hasAggregation) {
                    // use the first available aggregation function
                    aggregationsToAdd_1[item.field] = (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
                        aggregationFunctions: props.aggregationFunctions,
                        colDef: item,
                        isDataSource: !!props.dataSource,
                    })[0];
                }
            });
            if (Object.keys(aggregationsToAdd_1).length > 0) {
                apiRef.current.setAggregationModel(__assign(__assign({}, aggregationModel), aggregationsToAdd_1));
            }
        }
    }, [
        apiRef,
        props.aggregationFunctions,
        props.dataSource,
        activeChartId,
        pivotActive,
        aggregationModel,
    ]);
    var handleRowDataUpdate = React.useCallback(function (chartIds) {
        var _a, _b, _c;
        if (chartIds.length === 0 ||
            chartIds.some(function (chartId) { return !visibleDimensions.current[chartId] || !visibleValues.current[chartId]; })) {
            return;
        }
        var orderedFields = (0, internals_1.gridColumnFieldsSelector)(apiRef);
        var rowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        var rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
        var rowsPerDepth = (0, internals_1.gridFilteredSortedDepthRowEntriesSelector)(apiRef);
        var currentChartId = (0, gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector)(apiRef);
        var defaultDepth = Math.max(0, ((_b = (_a = visibleDimensions.current[currentChartId]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) - 1);
        var rowsAtDefaultDepth = ((_c = rowsPerDepth[defaultDepth]) !== null && _c !== void 0 ? _c : []).length;
        // keep only unique columns and transform the grouped column to carry the correct field name to get the grouped value
        var dataColumns = __spreadArray([], new Set(__spreadArray(__spreadArray([], Object.values(visibleDimensions.current).flat(), true), Object.values(visibleValues.current).flat(), true)), true).map(function (column) {
            var isColumnGrouped = rowGroupingModel.includes(column.field);
            if (isColumnGrouped) {
                var groupedFieldName = isColumnGrouped
                    ? (0, gridRowGroupingUtils_1.getRowGroupingFieldFromGroupingCriteria)(orderedFields.includes(internals_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD)
                        ? null
                        : column.field)
                    : column.field;
                var columnDefinition = apiRef.current.getColumn(groupedFieldName);
                return __assign(__assign({}, columnDefinition), { dataFieldName: column.field, depth: rowGroupingModel.indexOf(column.field) });
            }
            return __assign(__assign({}, column), { dataFieldName: column.field, depth: defaultDepth });
        });
        // go through the data only once and collect everything that will be needed
        var data = Object.fromEntries(dataColumns.map(function (column) { return [column.dataFieldName, []]; }));
        var dataColumnsCount = dataColumns.length;
        for (var i = 0; i < rowsAtDefaultDepth; i += 1) {
            for (var j = 0; j < dataColumnsCount; j += 1) {
                // if multiple columns are grouped, we need to get the value from the parent to properly create dimension groups
                var targetRow = rowsPerDepth[defaultDepth][i].model;
                // if we are not at the same depth as the column we are currently processing change the target to the parent at the correct depth
                for (var d = defaultDepth; d > dataColumns[j].depth; d -= 1) {
                    var rowId = (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, targetRow);
                    targetRow = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, rowTree[rowId].parent);
                }
                var value = apiRef.current.getRowValue(targetRow, dataColumns[j]);
                if (value !== null) {
                    data[dataColumns[j].dataFieldName].push(typeof value === 'object' && 'label' in value ? value.label : value);
                }
            }
        }
        chartIds.forEach(function (chartId) {
            setChartState(chartId, {
                dimensions: visibleDimensions.current[chartId].map(function (dimension) { return ({
                    id: dimension.field,
                    label: getColumnName(dimension.field),
                    data: data[dimension.field] || [],
                }); }),
                values: visibleValues.current[chartId].map(function (value) { return ({
                    id: value.field,
                    label: getValueDatasetLabel(value.field),
                    data: (data[value.field] || []),
                }); }),
            });
        });
    }, [apiRef, getColumnName, getValueDatasetLabel, setChartState]);
    var debouncedHandleRowDataUpdate = React.useMemo(function () { return (0, debounce_1.default)(handleRowDataUpdate, 0); }, [handleRowDataUpdate]);
    var handleColumnDataUpdate = React.useCallback(function (chartIds, updatedChartStateLookup) {
        // if there are no charts, skip the data processing
        if (chartIds.length === 0) {
            return;
        }
        var rowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        var chartableColumns = (0, gridChartsIntegrationSelectors_1.gridChartableColumnsSelector)(apiRef);
        var selectedFields = chartIds.reduce(function (acc, chartId) {
            var _a;
            var values = (0, gridChartsIntegrationSelectors_1.gridChartsValuesSelector)(apiRef, chartId);
            var dimensions = (0, gridChartsIntegrationSelectors_1.gridChartsDimensionsSelector)(apiRef, chartId);
            return __assign(__assign({}, acc), (_a = {}, _a[chartId] = {
                values: values,
                dimensions: dimensions,
            }, _a));
        }, {});
        var values = {};
        var dimensions = {};
        chartIds.forEach(function (chartId) {
            dimensions[chartId] = [];
            values[chartId] = [];
            // loop through dimensions and values datasets either through their length or to the max limit
            // if the current selection is greater than the max limit, the state will be updated
            var chartState = (updatedChartStateLookup === null || updatedChartStateLookup === void 0 ? void 0 : updatedChartStateLookup[chartId]) || chartStateLookup[chartId];
            var dimensionsSize = (chartState === null || chartState === void 0 ? void 0 : chartState.maxDimensions)
                ? Math.min(chartState.maxDimensions, selectedFields[chartId].dimensions.length)
                : selectedFields[chartId].dimensions.length;
            var valuesSize = (chartState === null || chartState === void 0 ? void 0 : chartState.maxValues)
                ? Math.min(chartState.maxValues, selectedFields[chartId].values.length)
                : selectedFields[chartId].values.length;
            // sanitize selectedDimensions and selectedValues while maintaining their order
            for (var i = 0; i < valuesSize; i += 1) {
                if (chartableColumns[selectedFields[chartId].values[i].field] &&
                    !(0, utils_1.isBlockedForSection)(chartableColumns[selectedFields[chartId].values[i].field], 'values', rowGroupingModel, pivotActive ? pivotModel : undefined)) {
                    if (!values[chartId]) {
                        values[chartId] = [];
                    }
                    values[chartId].push(selectedFields[chartId].values[i]);
                }
            }
            var _loop_1 = function (i) {
                var item = selectedFields[chartId].dimensions[i];
                if (!selectedFields[chartId].values.some(function (valueItem) { return valueItem.field === item.field; }) &&
                    chartableColumns[item.field] &&
                    !(0, utils_1.isBlockedForSection)(chartableColumns[item.field], 'dimensions', rowGroupingModel, pivotActive ? pivotModel : undefined)) {
                    if (!dimensions[chartId]) {
                        dimensions[chartId] = [];
                    }
                    dimensions[chartId].push(item);
                }
            };
            // dimensions cannot contain fields that are already in values
            for (var i = 0; i < dimensionsSize; i += 1) {
                _loop_1(i);
            }
            // we can compare the lengths, because this function is called after the state was updated.
            // different lengths will occur only if some items were removed during the checks above
            if (dimensions[chartId] &&
                selectedFields[chartId].dimensions.length !== dimensions[chartId].length) {
                apiRef.current.updateChartDimensionsData(chartId, dimensions[chartId]);
            }
            if (values[chartId] && selectedFields[chartId].values.length !== values[chartId].length) {
                apiRef.current.updateChartValuesData(chartId, values[chartId]);
            }
            visibleDimensions.current[chartId] = dimensions[chartId]
                .filter(function (dimension) { return dimension.hidden !== true; })
                .map(function (dimension) { return chartableColumns[dimension.field]; });
            visibleValues.current[chartId] = values[chartId]
                .filter(function (value) { return value.hidden !== true; })
                .map(function (value) { return chartableColumns[value.field]; });
            // we need to have both dimensions and values to be able to display the chart
            if (visibleDimensions.current[chartId].length === 0 ||
                visibleValues.current[chartId].length === 0) {
                visibleDimensions.current[chartId] = [];
                visibleValues.current[chartId] = [];
            }
        });
        updateOtherModels();
        debouncedHandleRowDataUpdate(chartIds);
    }, [
        apiRef,
        chartStateLookup,
        pivotActive,
        pivotModel,
        debouncedHandleRowDataUpdate,
        updateOtherModels,
    ]);
    var debouncedHandleColumnDataUpdate = React.useMemo(function () { return (0, debounce_1.default)(handleColumnDataUpdate, 0); }, [handleColumnDataUpdate]);
    var setChartsPanelOpen = React.useCallback(function (callback) {
        if (!isChartsIntegrationAvailable) {
            return;
        }
        var panelOpen = (0, gridChartsIntegrationSelectors_1.gridChartsPanelOpenSelector)(apiRef);
        var newPanelOpen = typeof callback === 'function' ? callback(panelOpen) : callback;
        if (panelOpen === newPanelOpen) {
            return;
        }
        if (newPanelOpen) {
            apiRef.current.showSidebar(sidebar_1.GridSidebarValue.Charts);
        }
        else {
            apiRef.current.hideSidebar();
        }
    }, [apiRef, isChartsIntegrationAvailable]);
    var updateChartDimensionsData = React.useCallback(function (chartId, dimensions) {
        if (!isChartsIntegrationAvailable) {
            return;
        }
        apiRef.current.setState(function (state) {
            var _a;
            var newDimensions = typeof dimensions === 'function'
                ? dimensions(state.chartsIntegration.charts[chartId].dimensions)
                : dimensions;
            return __assign(__assign({}, state), { chartsIntegration: __assign(__assign({}, state.chartsIntegration), { charts: __assign(__assign({}, state.chartsIntegration.charts), (_a = {}, _a[chartId] = __assign(__assign({}, state.chartsIntegration.charts[chartId]), { dimensions: newDimensions }), _a)) }) });
        });
        debouncedHandleColumnDataUpdate(syncedChartIds);
    }, [apiRef, isChartsIntegrationAvailable, syncedChartIds, debouncedHandleColumnDataUpdate]);
    var updateChartValuesData = React.useCallback(function (chartId, values) {
        if (!isChartsIntegrationAvailable) {
            return;
        }
        apiRef.current.setState(function (state) {
            var _a;
            var newValues = typeof values === 'function'
                ? values(state.chartsIntegration.charts[chartId].values)
                : values;
            return __assign(__assign({}, state), { chartsIntegration: __assign(__assign({}, state.chartsIntegration), { charts: __assign(__assign({}, state.chartsIntegration.charts), (_a = {}, _a[chartId] = __assign(__assign({}, state.chartsIntegration.charts[chartId]), { values: newValues }), _a)) }) });
        });
        debouncedHandleColumnDataUpdate(syncedChartIds);
    }, [apiRef, isChartsIntegrationAvailable, syncedChartIds, debouncedHandleColumnDataUpdate]);
    var setActiveChartId = React.useCallback(function (chartId) {
        if (!isChartsIntegrationAvailable) {
            return;
        }
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { chartsIntegration: __assign(__assign({}, state.chartsIntegration), { activeChartId: chartId }) })); });
    }, [apiRef, isChartsIntegrationAvailable]);
    var setChartType = React.useCallback(function (chartId, type) {
        var _a;
        var _b, _c, _d, _e;
        if (!isChartsIntegrationAvailable || !chartStateLookup[chartId]) {
            return;
        }
        var stateUpdate = {
            type: type,
            dimensionsLabel: (_b = schema[type]) === null || _b === void 0 ? void 0 : _b.dimensionsLabel,
            valuesLabel: (_c = schema[type]) === null || _c === void 0 ? void 0 : _c.valuesLabel,
            maxDimensions: (_d = schema[type]) === null || _d === void 0 ? void 0 : _d.maxDimensions,
            maxValues: (_e = schema[type]) === null || _e === void 0 ? void 0 : _e.maxValues,
        };
        var updatedChartStateLookup = __assign(__assign({}, chartStateLookup), (_a = {}, _a[chartId] = __assign(__assign({}, chartStateLookup[chartId]), stateUpdate), _a));
        // make sure that the new dimensions and values limits are applied before changing the chart type
        handleColumnDataUpdate([chartId], updatedChartStateLookup);
        setChartState(chartId, stateUpdate);
    }, [isChartsIntegrationAvailable, chartStateLookup, schema, setChartState, handleColumnDataUpdate]);
    var setChartSynchronizationState = React.useCallback(function (chartId, synced) {
        var _a;
        if (!isChartsIntegrationAvailable || !chartStateLookup[chartId]) {
            return;
        }
        var stateUpdate = {
            synced: synced,
        };
        var updatedChartStateLookup = __assign(__assign({}, chartStateLookup), (_a = {}, _a[chartId] = __assign(__assign({}, chartStateLookup[chartId]), stateUpdate), _a));
        setChartState(chartId, stateUpdate);
        apiRef.current.publishEvent('chartSynchronizationStateChange', { chartId: chartId, synced: synced });
        if (synced) {
            debouncedHandleColumnDataUpdate([chartId], updatedChartStateLookup);
        }
    }, [
        apiRef,
        isChartsIntegrationAvailable,
        chartStateLookup,
        setChartState,
        debouncedHandleColumnDataUpdate,
    ]);
    // called when a column is dragged and dropped to a different section
    var updateDataReference = React.useCallback(function (field, originSection, targetSection, targetField, placementRelativeToTargetField) {
        var _a;
        var _b, _c;
        var columns = (0, internals_1.gridColumnLookupSelector)(apiRef);
        var dimensions = (0, gridChartsIntegrationSelectors_1.gridChartsDimensionsSelector)(apiRef, activeChartId);
        var values = (0, gridChartsIntegrationSelectors_1.gridChartsValuesSelector)(apiRef, activeChartId);
        var rowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        if (targetSection) {
            if ((0, utils_1.isBlockedForSection)(columns[field], targetSection, rowGroupingModel, pivotActive ? pivotModel : undefined)) {
                return;
            }
            var currentTargetItems = targetSection === 'dimensions' ? dimensions : values;
            var currentMaxItems = targetSection === 'dimensions'
                ? (_b = chartStateLookup[activeChartId]) === null || _b === void 0 ? void 0 : _b.maxDimensions
                : (_c = chartStateLookup[activeChartId]) === null || _c === void 0 ? void 0 : _c.maxValues;
            if (currentMaxItems && currentTargetItems.length >= currentMaxItems) {
                return;
            }
        }
        var hidden;
        if (originSection) {
            var method = originSection === 'dimensions' ? updateChartDimensionsData : updateChartValuesData;
            var currentItems = originSection === 'dimensions' ? __spreadArray([], dimensions, true) : __spreadArray([], values, true);
            var fieldIndex = currentItems.findIndex(function (item) { return item.field === field; });
            if (fieldIndex !== -1) {
                hidden = currentItems[fieldIndex].hidden;
            }
            // if the target is another section, remove the field from the origin section
            if (targetSection !== originSection) {
                currentItems.splice(fieldIndex, 1);
                method(activeChartId, currentItems);
            }
        }
        if (targetSection) {
            var method = targetSection === 'dimensions' ? updateChartDimensionsData : updateChartValuesData;
            var currentItems = targetSection === 'dimensions' ? dimensions : values;
            var remainingItems = targetSection === originSection
                ? currentItems.filter(function (item) { return item.field !== field; })
                : __spreadArray([], currentItems, true);
            // with row grouping add the aggregation model to the newly added values dataset
            if (rowGroupingModel.length > 0 && targetSection === 'values') {
                var hasAggregation = Object.keys(aggregationModel).includes(field);
                if (!hasAggregation) {
                    apiRef.current.setAggregationModel(__assign(__assign({}, aggregationModel), (_a = {}, _a[field] = (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
                        aggregationFunctions: props.aggregationFunctions,
                        colDef: columns[field],
                        isDataSource: !!props.dataSource,
                    })[0], _a)));
                }
            }
            if (targetField) {
                var targetFieldIndex = remainingItems.findIndex(function (item) { return item.field === targetField; });
                var targetIndex = placementRelativeToTargetField === 'top' ? targetFieldIndex : targetFieldIndex + 1;
                remainingItems.splice(targetIndex, 0, { field: field, hidden: hidden });
                method(activeChartId, remainingItems);
            }
            else {
                method(activeChartId, __spreadArray(__spreadArray([], remainingItems, true), [{ field: field, hidden: hidden }], false));
            }
        }
    }, [
        apiRef,
        props.aggregationFunctions,
        props.dataSource,
        activeChartId,
        chartStateLookup,
        updateChartDimensionsData,
        updateChartValuesData,
        aggregationModel,
        pivotActive,
        pivotModel,
    ]);
    var addColumnMenuButton = React.useCallback(function (menuItems) {
        if (isChartsIntegrationAvailable) {
            return __spreadArray(__spreadArray([], menuItems, true), ['columnMenuManagePanelItem'], false);
        }
        return menuItems;
    }, [isChartsIntegrationAvailable]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuButton);
    var addChartsPanel = React.useCallback(function (initialValue, value) {
        var _a;
        if (props.slots.chartsPanel &&
            isChartsIntegrationAvailable &&
            value === sidebar_1.GridSidebarValue.Charts) {
            return (0, jsx_runtime_1.jsx)(props.slots.chartsPanel, __assign({}, (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.chartsPanel));
        }
        return initialValue;
    }, [props, isChartsIntegrationAvailable]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'sidebar', addChartsPanel);
    (0, internals_1.useGridApiMethod)(apiRef, { chartsIntegration: { updateDataReference: updateDataReference, getColumnName: getColumnName } }, 'private');
    (0, internals_1.useGridApiMethod)(apiRef, ((_f = props.experimentalFeatures) === null || _f === void 0 ? void 0 : _f.charts)
        ? {
            setChartsPanelOpen: setChartsPanelOpen,
            setActiveChartId: setActiveChartId,
            setChartType: setChartType,
            setChartSynchronizationState: setChartSynchronizationState,
            updateChartDimensionsData: updateChartDimensionsData,
            updateChartValuesData: updateChartValuesData,
        }
        : {}, 'public');
    (0, internals_1.useGridEvent)(apiRef, 'columnsChange', (0, internals_1.runIf)(isChartsIntegrationAvailable, function () { return debouncedHandleColumnDataUpdate(syncedChartIds); }));
    (0, internals_1.useGridEvent)(apiRef, 'pivotModeChange', (0, internals_1.runIf)(isChartsIntegrationAvailable, function () { return debouncedHandleColumnDataUpdate(syncedChartIds); }));
    (0, internals_1.useGridEvent)(apiRef, 'filteredRowsSet', (0, internals_1.runIf)(isChartsIntegrationAvailable, function () { return debouncedHandleRowDataUpdate(syncedChartIds); }));
    (0, internals_1.useGridEvent)(apiRef, 'sortedRowsSet', (0, internals_1.runIf)(isChartsIntegrationAvailable, function () { return debouncedHandleRowDataUpdate(syncedChartIds); }));
    var stateExportPreProcessing = React.useCallback(function (prevState, exportContext) {
        var _a, _b;
        if (!props.chartsIntegration || !((_a = props.experimentalFeatures) === null || _a === void 0 ? void 0 : _a.charts)) {
            return prevState;
        }
        var currentActiveChartId = (0, gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector)(apiRef);
        var chartsLookup = (0, gridChartsIntegrationSelectors_1.gridChartsIntegrationChartsLookupSelector)(apiRef);
        var integrationContextToExport = Object.fromEntries(Object.entries(chartStateLookup).map(function (_a) {
            var chartId = _a[0], chartState = _a[1];
            return [
                chartId,
                // keep only the state that is controlled by the user, drop the data and labels
                {
                    synced: chartState.synced,
                    type: chartState.type,
                    configuration: chartState.configuration,
                },
            ];
        }));
        var shouldExportChartState = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !exportContext.exportOnlyDirtyModels ||
            // Always export if the chart state has been initialized
            ((_b = props.initialState) === null || _b === void 0 ? void 0 : _b.chartsIntegration) != null ||
            // Export if the chart model or context is not empty
            Object.keys(chartsLookup).length > 0 ||
            Object.keys(integrationContextToExport).length > 0;
        if (!shouldExportChartState) {
            return prevState;
        }
        var chartStateToExport = {
            activeChartId: currentActiveChartId,
            charts: chartsLookup,
            // add a custom prop to keep the integration context in the exported state
            integrationContext: integrationContextToExport,
        };
        return __assign(__assign({}, prevState), { chartsIntegration: chartStateToExport });
    }, [
        apiRef,
        chartStateLookup,
        props.chartsIntegration,
        (_g = props.experimentalFeatures) === null || _g === void 0 ? void 0 : _g.charts,
        (_h = props.initialState) === null || _h === void 0 ? void 0 : _h.chartsIntegration,
    ]);
    var stateRestorePreProcessing = React.useCallback(function (params, restoreContext) {
        var chartsRestoreState = restoreContext.stateToRestore.chartsIntegration;
        if (!chartsRestoreState) {
            return params;
        }
        var _a = chartsRestoreState, activeChartIdToRestore = _a.activeChartId, chartsToRestore = _a.charts, integrationContext = _a.integrationContext;
        if (activeChartIdToRestore === undefined ||
            chartsToRestore === undefined ||
            Object.keys(chartsToRestore).length === 0) {
            return params;
        }
        apiRef.current.setState(__assign(__assign({}, apiRef.current.state), { chartsIntegration: {
                activeChartId: activeChartIdToRestore,
                charts: chartsToRestore,
            } }));
        // restore the integration context for each chart
        Object.entries(integrationContext).forEach(function (_a) {
            var chartId = _a[0], chartContextState = _a[1];
            setChartState(chartId, chartContextState);
        });
        return params;
    }, [apiRef, setChartState]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    React.useEffect(function () {
        if (!activeChartId && availableChartIds.length > 0) {
            setActiveChartId(availableChartIds[0]);
        }
    }, [availableChartIds, activeChartId, setActiveChartId]);
    var isInitialized = React.useRef(false);
    React.useEffect(function () {
        if (isInitialized.current) {
            return;
        }
        if (availableChartIds.length === 0) {
            return;
        }
        isInitialized.current = true;
        availableChartIds.forEach(function (chartId) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var chartType = ((_d = (_c = (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.chartsIntegration) === null || _b === void 0 ? void 0 : _b.charts) === null || _c === void 0 ? void 0 : _c[chartId]) === null || _d === void 0 ? void 0 : _d.chartType) || '';
            setChartState(chartId, {
                type: chartType,
                maxDimensions: (_e = schema[chartType]) === null || _e === void 0 ? void 0 : _e.maxDimensions,
                maxValues: (_f = schema[chartType]) === null || _f === void 0 ? void 0 : _f.maxValues,
                dimensionsLabel: (_g = schema[chartType]) === null || _g === void 0 ? void 0 : _g.dimensionsLabel,
                valuesLabel: (_h = schema[chartType]) === null || _h === void 0 ? void 0 : _h.valuesLabel,
                configuration: ((_m = (_l = (_k = (_j = props.initialState) === null || _j === void 0 ? void 0 : _j.chartsIntegration) === null || _k === void 0 ? void 0 : _k.charts) === null || _l === void 0 ? void 0 : _l[chartId]) === null || _m === void 0 ? void 0 : _m.configuration) || {},
            });
        });
        debouncedHandleColumnDataUpdate(syncedChartIds);
    }, [
        schema,
        availableChartIds,
        syncedChartIds,
        (_k = (_j = props.initialState) === null || _j === void 0 ? void 0 : _j.chartsIntegration) === null || _k === void 0 ? void 0 : _k.charts,
        setChartState,
        debouncedHandleColumnDataUpdate,
    ]);
};
exports.useGridChartsIntegration = useGridChartsIntegration;
