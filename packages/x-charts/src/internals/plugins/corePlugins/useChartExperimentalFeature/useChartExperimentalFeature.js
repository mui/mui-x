"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartExperimentalFeatures = void 0;
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useChartExperimentalFeatures = function (_a) {
    var params = _a.params, store = _a.store;
    (0, useEnhancedEffect_1.default)(function () {
        store.set('experimentalFeatures', params.experimentalFeatures);
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
