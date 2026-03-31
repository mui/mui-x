var GridRowEditStartReasons;
(function (GridRowEditStartReasons) {
    GridRowEditStartReasons["enterKeyDown"] = "enterKeyDown";
    GridRowEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
    GridRowEditStartReasons["printableKeyDown"] = "printableKeyDown";
    GridRowEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
})(GridRowEditStartReasons || (GridRowEditStartReasons = {}));
var GridRowEditStopReasons;
(function (GridRowEditStopReasons) {
    GridRowEditStopReasons["rowFocusOut"] = "rowFocusOut";
    GridRowEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
    GridRowEditStopReasons["enterKeyDown"] = "enterKeyDown";
    GridRowEditStopReasons["tabKeyDown"] = "tabKeyDown";
    GridRowEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridRowEditStopReasons || (GridRowEditStopReasons = {}));
// https://github.com/mui/mui-x/pull/3738#discussion_r798504277
export { GridRowEditStartReasons, GridRowEditStopReasons };
