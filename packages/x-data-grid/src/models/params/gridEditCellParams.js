"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridCellEditStopReasons = exports.GridCellEditStartReasons = void 0;
var GridCellEditStartReasons;
(function (GridCellEditStartReasons) {
    GridCellEditStartReasons["enterKeyDown"] = "enterKeyDown";
    GridCellEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
    GridCellEditStartReasons["printableKeyDown"] = "printableKeyDown";
    GridCellEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
    GridCellEditStartReasons["pasteKeyDown"] = "pasteKeyDown";
})(GridCellEditStartReasons || (exports.GridCellEditStartReasons = GridCellEditStartReasons = {}));
var GridCellEditStopReasons;
(function (GridCellEditStopReasons) {
    GridCellEditStopReasons["cellFocusOut"] = "cellFocusOut";
    GridCellEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
    GridCellEditStopReasons["enterKeyDown"] = "enterKeyDown";
    GridCellEditStopReasons["tabKeyDown"] = "tabKeyDown";
    GridCellEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridCellEditStopReasons || (exports.GridCellEditStopReasons = GridCellEditStopReasons = {}));
