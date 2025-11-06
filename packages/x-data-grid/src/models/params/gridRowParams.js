"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRowEditStopReasons = exports.GridRowEditStartReasons = void 0;
var GridRowEditStartReasons;
(function (GridRowEditStartReasons) {
    GridRowEditStartReasons["enterKeyDown"] = "enterKeyDown";
    GridRowEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
    GridRowEditStartReasons["printableKeyDown"] = "printableKeyDown";
    GridRowEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
})(GridRowEditStartReasons || (exports.GridRowEditStartReasons = GridRowEditStartReasons = {}));
var GridRowEditStopReasons;
(function (GridRowEditStopReasons) {
    GridRowEditStopReasons["rowFocusOut"] = "rowFocusOut";
    GridRowEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
    GridRowEditStopReasons["enterKeyDown"] = "enterKeyDown";
    GridRowEditStopReasons["tabKeyDown"] = "tabKeyDown";
    GridRowEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridRowEditStopReasons || (exports.GridRowEditStopReasons = GridRowEditStopReasons = {}));
