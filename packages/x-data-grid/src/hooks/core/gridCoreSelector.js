"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridIsRtlSelector = void 0;
var createSelector_1 = require("../../utils/createSelector");
/**
 * Get the theme state
 * @category Core
 */
exports.gridIsRtlSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.isRtl; });
