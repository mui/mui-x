"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridDensityFactorSelector = exports.gridDensitySelector = exports.COMFORTABLE_DENSITY_FACTOR = exports.COMPACT_DENSITY_FACTOR = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.COMPACT_DENSITY_FACTOR = 0.7;
exports.COMFORTABLE_DENSITY_FACTOR = 1.3;
var DENSITY_FACTORS = {
    compact: exports.COMPACT_DENSITY_FACTOR,
    comfortable: exports.COMFORTABLE_DENSITY_FACTOR,
    standard: 1,
};
exports.gridDensitySelector = (0, createSelector_1.createRootSelector)(function (state) { return state.density; });
exports.gridDensityFactorSelector = (0, createSelector_1.createSelector)(exports.gridDensitySelector, function (density) { return DENSITY_FACTORS[density]; });
