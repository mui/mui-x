"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridDataSource = void 0;
var React = require("react");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridRegisterStrategyProcessor_1 = require("../../core/strategyProcessing/useGridRegisterStrategyProcessor");
var useGridEvent_1 = require("../../utils/useGridEvent");
var useGridDataSourceBase_1 = require("./useGridDataSourceBase");
/**
 * Community version of the data source hook. Contains implementation of the `useGridDataSourceBase` hook.
 */
var useGridDataSource = function (apiRef, props) {
    var _a = (0, useGridDataSourceBase_1.useGridDataSourceBase)(apiRef, props), api = _a.api, strategyProcessor = _a.strategyProcessor, events = _a.events, setStrategyAvailability = _a.setStrategyAvailability;
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, api.public, 'public');
    (0, useGridRegisterStrategyProcessor_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessor.strategyName, strategyProcessor.group, strategyProcessor.processor);
    Object.entries(events).forEach(function (_a) {
        var event = _a[0], handler = _a[1];
        (0, useGridEvent_1.useGridEvent)(apiRef, event, handler);
    });
    React.useEffect(function () {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
exports.useGridDataSource = useGridDataSource;
