"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRowModes = exports.GridCellModes = exports.GridEditModes = void 0;
var GridEditModes;
(function (GridEditModes) {
    GridEditModes["Cell"] = "cell";
    GridEditModes["Row"] = "row";
})(GridEditModes || (exports.GridEditModes = GridEditModes = {}));
var GridCellModes;
(function (GridCellModes) {
    GridCellModes["Edit"] = "edit";
    GridCellModes["View"] = "view";
})(GridCellModes || (exports.GridCellModes = GridCellModes = {}));
var GridRowModes;
(function (GridRowModes) {
    GridRowModes["Edit"] = "edit";
    GridRowModes["View"] = "view";
})(GridRowModes || (exports.GridRowModes = GridRowModes = {}));
