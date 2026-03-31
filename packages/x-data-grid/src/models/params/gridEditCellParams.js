var GridCellEditStartReasons;
(function (GridCellEditStartReasons) {
    GridCellEditStartReasons["enterKeyDown"] = "enterKeyDown";
    GridCellEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
    GridCellEditStartReasons["printableKeyDown"] = "printableKeyDown";
    GridCellEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
    GridCellEditStartReasons["pasteKeyDown"] = "pasteKeyDown";
})(GridCellEditStartReasons || (GridCellEditStartReasons = {}));
var GridCellEditStopReasons;
(function (GridCellEditStopReasons) {
    GridCellEditStopReasons["cellFocusOut"] = "cellFocusOut";
    GridCellEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
    GridCellEditStopReasons["enterKeyDown"] = "enterKeyDown";
    GridCellEditStopReasons["tabKeyDown"] = "tabKeyDown";
    GridCellEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridCellEditStopReasons || (GridCellEditStopReasons = {}));
// https://github.com/mui/mui-x/pull/3738#discussion_r798504277
export { GridCellEditStartReasons, GridCellEditStopReasons };
