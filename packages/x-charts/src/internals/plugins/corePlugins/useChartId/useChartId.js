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
exports.useChartId = void 0;
var React = require("react");
var useChartId_utils_1 = require("./useChartId.utils");
var useChartId = function (_a) {
    var params = _a.params, store = _a.store;
    React.useEffect(function () {
        store.update(function (prevState) {
            var _a;
            if (params.id === undefined ||
                (params.id === prevState.id.providedChartId && prevState.id.chartId !== undefined)) {
                return prevState;
            }
            return __assign(__assign({}, prevState), { id: __assign(__assign({}, prevState.id), { chartId: (_a = params.id) !== null && _a !== void 0 ? _a : (0, useChartId_utils_1.createChartDefaultId)() }) });
        });
    }, [store, params.id]);
    return {};
};
exports.useChartId = useChartId;
exports.useChartId.params = {
    id: true,
};
exports.useChartId.getInitialState = function (_a) {
    var id = _a.id;
    return ({
        id: { chartId: id, providedChartId: id },
    });
};
