"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridSignature = void 0;
/**
 * Signal to the underlying logic what version of the public component API
 * of the Data Grid is exposed.
 */
var GridSignature;
(function (GridSignature) {
    GridSignature["DataGrid"] = "DataGrid";
    GridSignature["DataGridPro"] = "DataGridPro";
    GridSignature["DataGridPremium"] = "DataGridPremium";
})(GridSignature || (exports.GridSignature = GridSignature = {}));
