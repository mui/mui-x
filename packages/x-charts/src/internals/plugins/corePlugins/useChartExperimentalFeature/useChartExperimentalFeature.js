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
exports.useChartExperimentalFeatures = void 0;
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useChartExperimentalFeatures = function (_a) {
    var params = _a.params, store = _a.store;
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prevState) {
            return __assign(__assign({}, prevState), { experimentalFeatures: params.experimentalFeatures });
        });
    }, [store, params.experimentalFeatures]);
    return {};
};
exports.useChartExperimentalFeatures = useChartExperimentalFeatures;
exports.useChartExperimentalFeatures.params = {
    experimentalFeatures: true,
};
exports.useChartExperimentalFeatures.getInitialState = function (_a) {
    var experimentalFeatures = _a.experimentalFeatures;
    return {
        experimentalFeatures: experimentalFeatures,
    };
};
