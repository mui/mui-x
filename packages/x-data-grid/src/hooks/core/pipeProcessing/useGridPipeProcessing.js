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
exports.useGridPipeProcessing = void 0;
var React = require("react");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
/**
 * Implement the Pipeline Pattern
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic to enrich data provided by other plugins or components.
 * For instance, the row grouping plugin needs to add / remove the grouping columns when the grid columns are updated.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterPipeProcessor` to register their processor.
 *
 * - `apiRef.current.requestPipeProcessorsApplication` to imperatively re-apply a group.
 *   This method should be used in last resort.
 *   Most of the time, the application should be triggered by an update on the deps of the processor.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to enrich its data must use:
 *
 * - `apiRef.current.unstable_applyPipeProcessors` to run in chain all the processors of a given group.
 *
 * - `useGridRegisterPipeApplier` to re-apply the whole pipe when requested.
 *   The applier will be called when:
 *   * a processor is registered.
 *   * `apiRef.current.requestPipeProcessorsApplication` is called for the given group.
 */
var useGridPipeProcessing = function (apiRef) {
    var cache = React.useRef({});
    var isRunning = React.useRef(false);
    var runAppliers = React.useCallback(function (groupCache) {
        if (isRunning.current || !groupCache) {
            return;
        }
        isRunning.current = true;
        Object.values(groupCache.appliers).forEach(function (callback) {
            callback();
        });
        isRunning.current = false;
    }, []);
    var registerPipeProcessor = React.useCallback(function (group, id, processor) {
        if (!cache.current[group]) {
            cache.current[group] = {
                processors: new Map(),
                processorsAsArray: [],
                appliers: {},
                processorsUpdated: false,
            };
        }
        var groupCache = cache.current[group];
        var oldProcessor = groupCache.processors.get(id);
        if (oldProcessor !== processor) {
            groupCache.processors.set(id, processor);
            groupCache.processorsAsArray = Array.from(cache.current[group].processors.values()).filter(function (processorValue) { return processorValue !== null; });
            groupCache.processorsUpdated = true;
        }
        return function () {
            cache.current[group].processors.set(id, null);
            cache.current[group].processorsAsArray = Array.from(cache.current[group].processors.values()).filter(function (processorValue) { return processorValue !== null; });
        };
    }, []);
    var registerPipeApplier = React.useCallback(function (group, id, applier) {
        if (!cache.current[group]) {
            cache.current[group] = {
                processors: new Map(),
                processorsAsArray: [],
                appliers: {},
                processorsUpdated: false,
            };
        }
        cache.current[group].appliers[id] = applier;
        return function () {
            var _a = cache.current[group].appliers, _b = id, removedGroupApplier = _a[_b], otherAppliers = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            cache.current[group].appliers = otherAppliers;
        };
    }, []);
    var requestPipeProcessorsApplication = React.useCallback(function (group) {
        runAppliers(cache.current[group]);
    }, [runAppliers]);
    var runAppliersForPendingProcessors = React.useCallback(function () {
        for (var group in cache.current) {
            if (!Object.prototype.hasOwnProperty.call(cache.current, group)) {
                continue;
            }
            var groupCache = cache.current[group];
            if (groupCache.processorsUpdated) {
                groupCache.processorsUpdated = false;
                runAppliers(groupCache);
            }
        }
    }, [runAppliers]);
    var applyPipeProcessors = React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = args, group = _a[0], value = _a[1], context = _a[2];
        if (!cache.current[group]) {
            return value;
        }
        var processors = cache.current[group].processorsAsArray;
        var result = value;
        for (var i = 0; i < processors.length; i += 1) {
            result = processors[i](result, context);
        }
        return result;
    }, []);
    var preProcessingPrivateApi = {
        registerPipeProcessor: registerPipeProcessor,
        registerPipeApplier: registerPipeApplier,
        requestPipeProcessorsApplication: requestPipeProcessorsApplication,
        runAppliersForPendingProcessors: runAppliersForPendingProcessors,
    };
    var preProcessingPublicApi = {
        unstable_applyPipeProcessors: applyPipeProcessors,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, preProcessingPrivateApi, 'private');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, preProcessingPublicApi, 'public');
};
exports.useGridPipeProcessing = useGridPipeProcessing;
