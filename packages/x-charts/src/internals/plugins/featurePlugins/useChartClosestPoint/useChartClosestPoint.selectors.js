"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsIsVoronoiEnabled = void 0;
var store_1 = require("@mui/x-internals/store");
var selectVoronoi = function (state) { return state.voronoi; };
exports.selectorChartsIsVoronoiEnabled = (0, store_1.createSelector)(selectVoronoi, function (voronoi) { return voronoi === null || voronoi === void 0 ? void 0 : voronoi.isVoronoiEnabled; });
