"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridCellSelectionStateSelector = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
exports.gridCellSelectionStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.cellSelection; });
