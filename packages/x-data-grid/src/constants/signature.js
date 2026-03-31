/**
 * Signal to the underlying logic what version of the public component API
 * of the Data Grid is exposed.
 */
export var GridSignature;
(function (GridSignature) {
    GridSignature["DataGrid"] = "DataGrid";
    GridSignature["DataGridPro"] = "DataGridPro";
    GridSignature["DataGridPremium"] = "DataGridPremium";
})(GridSignature || (GridSignature = {}));
