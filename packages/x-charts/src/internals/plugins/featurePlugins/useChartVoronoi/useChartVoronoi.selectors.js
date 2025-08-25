"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsVoronoiIsVoronoiEnabled = void 0;
var selectors_1 = require("../../utils/selectors");
var selectVoronoi = function (state) { return state.voronoi; };
exports.selectorChartsVoronoiIsVoronoiEnabled = (0, selectors_1.createSelector)([selectVoronoi], function (voronoi) { return voronoi === null || voronoi === void 0 ? void 0 : voronoi.isVoronoiEnabled; });
