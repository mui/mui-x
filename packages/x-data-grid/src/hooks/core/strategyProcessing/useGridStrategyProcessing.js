"use strict";
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
exports.useGridStrategyProcessing = exports.GRID_STRATEGIES_PROCESSORS = exports.GRID_DEFAULT_STRATEGY = void 0;
var React = require("react");
var gridStrategyProcessingApi_1 = require("./gridStrategyProcessingApi");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
exports.GRID_DEFAULT_STRATEGY = 'none';
exports.GRID_STRATEGIES_PROCESSORS = {
    dataSourceRowsUpdate: gridStrategyProcessingApi_1.GridStrategyGroup.DataSource,
    rowTreeCreation: gridStrategyProcessingApi_1.GridStrategyGroup.RowTree,
    filtering: gridStrategyProcessingApi_1.GridStrategyGroup.RowTree,
    sorting: gridStrategyProcessingApi_1.GridStrategyGroup.RowTree,
    visibleRowsLookupCreation: gridStrategyProcessingApi_1.GridStrategyGroup.RowTree,
};
/**
 * Implements a variant of the Strategy Pattern (see https://en.wikipedia.org/wiki/Strategy_pattern)
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic that must only be applied if the right strategy is active.
 * For instance, the row grouping plugin has a custom filtering algorithm.
 * This algorithm must be applied by the filtering plugin if the row grouping is the current way of grouping rows,
 * but not if the tree data is the current way of grouping rows.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterStrategyProcessor` to register their processor.
 *   When the processor of the active strategy changes, it will fire `"activeStrategyProcessorChange"` to re-apply the processor.
 *
 * - `apiRef.current.setStrategyAvailability` to tell if their strategy can be used.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to apply the custom logic of the current strategy must use:
 *
 * - `apiRef.current.applyStrategyProcessor` to run the processor of the active strategy for a given processor name.
 *
 * - the "strategyAvailabilityChange" event to update something when the active strategy changes.
 *    Warning: Be careful not to apply the processor several times.
 *    For instance "rowsSet" is fired by `useGridRows` whenever the active strategy changes.
 *    So listening to both would most likely run your logic twice.
 *
 * - The "activeStrategyProcessorChange" event to update something when the processor of the active strategy changes.
 *
 * =====================================================================================================================
 *
 * Each processor name is part of a strategy group which can only have one active strategy at the time.
 * There are two active groups named `rowTree` and `dataSource`.
 */
var useGridStrategyProcessing = function (apiRef) {
    var availableStrategies = React.useRef(new Map());
    var strategiesCache = React.useRef({});
    var registerStrategyProcessor = React.useCallback(function (strategyName, processorName, processor) {
        var cleanup = function () {
            var _a = strategiesCache.current[processorName], _b = strategyName, removedPreProcessor = _a[_b], otherProcessors = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            strategiesCache.current[processorName] = otherProcessors;
        };
        if (!strategiesCache.current[processorName]) {
            strategiesCache.current[processorName] = {};
        }
        var groupPreProcessors = strategiesCache.current[processorName];
        var previousProcessor = groupPreProcessors[strategyName];
        groupPreProcessors[strategyName] = processor;
        if (!previousProcessor || previousProcessor === processor) {
            return cleanup;
        }
        if (strategyName === apiRef.current.getActiveStrategy(exports.GRID_STRATEGIES_PROCESSORS[processorName])) {
            apiRef.current.publishEvent('activeStrategyProcessorChange', processorName);
        }
        return cleanup;
    }, [apiRef]);
    var applyStrategyProcessor = React.useCallback(function (processorName, params) {
        var activeStrategy = apiRef.current.getActiveStrategy(exports.GRID_STRATEGIES_PROCESSORS[processorName]);
        if (activeStrategy == null) {
            throw new Error("Can't apply a strategy processor before defining an active strategy");
        }
        var groupCache = strategiesCache.current[processorName];
        if (!groupCache || !groupCache[activeStrategy]) {
            throw new Error("No processor found for processor \"".concat(processorName, "\" on strategy \"").concat(activeStrategy, "\""));
        }
        var processor = groupCache[activeStrategy];
        return processor(params);
    }, [apiRef]);
    var getActiveStrategy = React.useCallback(function (strategyGroup) {
        var _a;
        var strategyEntries = Array.from(availableStrategies.current.entries());
        var availableStrategyEntry = strategyEntries.find(function (_a) {
            var strategy = _a[1];
            if (strategy.group !== strategyGroup) {
                return false;
            }
            return strategy.isAvailable();
        });
        return (_a = availableStrategyEntry === null || availableStrategyEntry === void 0 ? void 0 : availableStrategyEntry[0]) !== null && _a !== void 0 ? _a : exports.GRID_DEFAULT_STRATEGY;
    }, []);
    var setStrategyAvailability = React.useCallback(function (strategyGroup, strategyName, isAvailable) {
        availableStrategies.current.set(strategyName, { group: strategyGroup, isAvailable: isAvailable });
        apiRef.current.publishEvent('strategyAvailabilityChange');
    }, [apiRef]);
    var strategyProcessingApi = {
        registerStrategyProcessor: registerStrategyProcessor,
        applyStrategyProcessor: applyStrategyProcessor,
        getActiveStrategy: getActiveStrategy,
        setStrategyAvailability: setStrategyAvailability,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, strategyProcessingApi, 'private');
};
exports.useGridStrategyProcessing = useGridStrategyProcessing;
