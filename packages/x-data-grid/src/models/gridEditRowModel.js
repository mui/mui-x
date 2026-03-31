var GridEditModes;
(function (GridEditModes) {
    GridEditModes["Cell"] = "cell";
    GridEditModes["Row"] = "row";
})(GridEditModes || (GridEditModes = {}));
var GridCellModes;
(function (GridCellModes) {
    GridCellModes["Edit"] = "edit";
    GridCellModes["View"] = "view";
})(GridCellModes || (GridCellModes = {}));
var GridRowModes;
(function (GridRowModes) {
    GridRowModes["Edit"] = "edit";
    GridRowModes["View"] = "view";
})(GridRowModes || (GridRowModes = {}));
export { GridEditModes, GridCellModes, GridRowModes };
