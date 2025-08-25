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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridAggregation = exports.aggregationStateInitializer = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridAggregationSelectors_1 = require("./gridAggregationSelectors");
var gridAggregationUtils_1 = require("./gridAggregationUtils");
var createAggregationLookup_1 = require("./createAggregationLookup");
var aggregationStateInitializer = function (state, props, apiRef) {
    var _a, _b, _c, _d;
    apiRef.current.caches.aggregation = {
        rulesOnLastColumnHydration: {},
        rulesOnLastRowHydration: {},
    };
    return __assign(__assign({}, state), { aggregation: {
            model: (_d = (_a = props.aggregationModel) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.aggregation) === null || _c === void 0 ? void 0 : _c.model) !== null && _d !== void 0 ? _d : {},
        } });
};
exports.aggregationStateInitializer = aggregationStateInitializer;
var useGridAggregation = function (apiRef, props) {
    apiRef.current.registerControlState({
        stateId: 'aggregation',
        propModel: props.aggregationModel,
        propOnChange: props.onAggregationModelChange,
        stateSelector: gridAggregationSelectors_1.gridAggregationModelSelector,
        changeEvent: 'aggregationModelChange',
    });
    /**
     * API METHODS
     */
    var setAggregationModel = React.useCallback(function (model) {
        var currentModel = (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef);
        if (currentModel !== model) {
            apiRef.current.setState((0, gridAggregationUtils_1.mergeStateWithAggregationModel)(model));
        }
    }, [apiRef]);
    var abortControllerRef = React.useRef(null);
    var applyAggregation = React.useCallback(function (reason) {
        // Abort previous if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        var abortController = new AbortController();
        abortControllerRef.current = abortController;
        var aggregationRules = (0, gridAggregationUtils_1.getAggregationRules)((0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef), (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef), props.aggregationFunctions, !!props.dataSource);
        var aggregatedFields = Object.keys(aggregationRules);
        var needsSorting = (0, createAggregationLookup_1.shouldApplySorting)(aggregationRules, aggregatedFields);
        if (reason === 'sort' && !needsSorting) {
            // no need to re-apply aggregation on `sortedRowsSet` if sorting is not needed
            return;
        }
        var renderContext = (0, x_data_grid_pro_1.gridRenderContextSelector)(apiRef);
        var visibleColumns = (0, x_data_grid_pro_1.gridVisibleColumnFieldsSelector)(apiRef);
        var chunks = [];
        var visibleAggregatedFields = visibleColumns
            .slice(renderContext.firstColumnIndex, renderContext.lastColumnIndex + 1)
            .filter(function (field) { return aggregatedFields.includes(field); });
        if (visibleAggregatedFields.length > 0) {
            chunks.push(visibleAggregatedFields);
        }
        var otherAggregatedFields = aggregatedFields.filter(function (field) { return !visibleAggregatedFields.includes(field); });
        var chunkSize = 20; // columns per chunk
        for (var i = 0; i < otherAggregatedFields.length; i += chunkSize) {
            chunks.push(otherAggregatedFields.slice(i, i + chunkSize));
        }
        var chunkIndex = 0;
        var aggregationLookup = {};
        var chunkStartTime = performance.now();
        var timeLimit = 1000 / 120;
        var processChunk = function () {
            var _a;
            if (abortController.signal.aborted) {
                return;
            }
            var currentChunk = chunks[chunkIndex];
            if (!currentChunk) {
                var sortModel = (0, x_data_grid_pro_1.gridSortModelSelector)(apiRef).map(function (s) { return s.field; });
                var hasAggregatedSorting = sortModel.some(function (field) { return aggregationRules[field]; });
                if (hasAggregatedSorting) {
                    apiRef.current.applySorting();
                }
                abortControllerRef.current = null;
                return;
            }
            var applySorting = (0, createAggregationLookup_1.shouldApplySorting)(aggregationRules, currentChunk);
            // createAggregationLookup now RETURNS new partial lookup
            var partialLookup = (0, createAggregationLookup_1.createAggregationLookup)({
                apiRef: apiRef,
                getAggregationPosition: props.getAggregationPosition,
                aggregatedFields: currentChunk,
                aggregationRules: aggregationRules,
                aggregationRowsScope: props.aggregationRowsScope,
                isDataSource: !!props.dataSource,
                applySorting: applySorting,
            });
            for (var _i = 0, _b = Object.keys(partialLookup); _i < _b.length; _i++) {
                var key = _b[_i];
                for (var _c = 0, _d = Object.keys(partialLookup[key]); _c < _d.length; _c++) {
                    var field = _d[_c];
                    (_a = aggregationLookup[key]) !== null && _a !== void 0 ? _a : (aggregationLookup[key] = {});
                    aggregationLookup[key][field] = partialLookup[key][field];
                }
            }
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { aggregation: __assign(__assign({}, state.aggregation), { lookup: __assign({}, aggregationLookup) }) })); });
            chunkIndex += 1;
            if (performance.now() - chunkStartTime < timeLimit) {
                processChunk();
                return;
            }
            setTimeout(function () {
                chunkStartTime = performance.now();
                processChunk();
            }, 0);
        };
        processChunk();
    }, [
        apiRef,
        props.getAggregationPosition,
        props.aggregationFunctions,
        props.aggregationRowsScope,
        props.dataSource,
    ]);
    React.useEffect(function () {
        return function () {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []);
    var deferredApplyAggregation = (0, x_data_grid_pro_1.useRunOncePerLoop)(applyAggregation);
    var aggregationApi = {
        setAggregationModel: setAggregationModel,
    };
    var aggregationPrivateApi = {
        applyAggregation: applyAggregation,
    };
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, aggregationApi, 'public');
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, aggregationPrivateApi, 'private');
    var addGetRowsParams = React.useCallback(function (params) {
        return __assign(__assign({}, params), { aggregationModel: (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef) });
    }, [apiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'getRowsParams', addGetRowsParams);
    /**
     * EVENTS
     */
    var checkAggregationRulesDiff = React.useCallback(function () {
        var _a = apiRef.current.caches.aggregation, rulesOnLastRowHydration = _a.rulesOnLastRowHydration, rulesOnLastColumnHydration = _a.rulesOnLastColumnHydration;
        var aggregationRules = props.disableAggregation
            ? {}
            : (0, gridAggregationUtils_1.getAggregationRules)((0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef), (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef), props.aggregationFunctions, !!props.dataSource);
        // Re-apply the row hydration to add / remove the aggregation footers
        if (!props.dataSource && !(0, gridAggregationUtils_1.areAggregationRulesEqual)(rulesOnLastRowHydration, aggregationRules)) {
            apiRef.current.requestPipeProcessorsApplication('hydrateRows');
            deferredApplyAggregation();
        }
        // Re-apply the column hydration to wrap / unwrap the aggregated columns
        if (!(0, gridAggregationUtils_1.areAggregationRulesEqual)(rulesOnLastColumnHydration, aggregationRules)) {
            apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
        }
    }, [
        apiRef,
        deferredApplyAggregation,
        props.aggregationFunctions,
        props.disableAggregation,
        props.dataSource,
    ]);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'aggregationModelChange', checkAggregationRulesDiff);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'columnsChange', checkAggregationRulesDiff);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'filteredRowsSet', deferredApplyAggregation);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'sortedRowsSet', function () { return deferredApplyAggregation('sort'); });
    /**
     * EFFECTS
     */
    React.useEffect(function () {
        if (props.aggregationModel !== undefined) {
            apiRef.current.setAggregationModel(props.aggregationModel);
        }
    }, [apiRef, props.aggregationModel]);
};
exports.useGridAggregation = useGridAggregation;
