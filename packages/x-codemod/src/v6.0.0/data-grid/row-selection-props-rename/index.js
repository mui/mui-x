"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameProps_1 = require("../../../util/renameProps");
var props = {
    selectionModel: 'rowSelectionModel',
    onSelectionModelChange: 'onRowSelectionModelChange',
    disableSelectionOnClick: 'disableRowSelectionOnClick',
    disableMultipleSelection: 'disableMultipleRowSelection',
    showCellRightBorder: 'showCellVerticalBorder',
    showColumnRightBorder: 'showColumnVerticalBorder',
    headerHeight: 'columnHeaderHeight',
};
var componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    return (0, renameProps_1.default)({
        root: root,
        componentNames: componentNames,
        props: props,
        j: j,
    }).toSource(printOptions);
}
