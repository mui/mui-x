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
exports.useChartSeriesConfig = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var serializeIdentifier_1 = require("./utils/serializeIdentifier");
var cleanIdentifier_1 = require("./utils/cleanIdentifier");
var useChartSeriesConfig = function (_a) {
    var store = _a.store;
    var serializeIdentifier = (0, useEventCallback_1.default)(function (identifier) {
        return (0, serializeIdentifier_1.serializeIdentifier)(store.state.seriesConfig.config, identifier);
    });
    var cleanIdentifier = (0, useEventCallback_1.default)(function (identifier) {
        return (0, cleanIdentifier_1.cleanIdentifier)(store.state.seriesConfig.config, identifier);
    });
    return {
        instance: {
            serializeIdentifier: serializeIdentifier,
            cleanIdentifier: cleanIdentifier,
        },
    };
};
exports.useChartSeriesConfig = useChartSeriesConfig;
exports.useChartSeriesConfig.params = {
    seriesConfig: true,
};
exports.useChartSeriesConfig.getDefaultizedParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { seriesConfig: (_b = params.seriesConfig) !== null && _b !== void 0 ? _b : {} }));
};
exports.useChartSeriesConfig.getInitialState = function (_a) {
    var seriesConfig = _a.seriesConfig;
    return {
        seriesConfig: {
            config: seriesConfig,
        },
    };
};
