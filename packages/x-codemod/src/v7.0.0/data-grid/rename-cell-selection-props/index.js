"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameProps_1 = require("../../../util/renameProps");
var componentNames = ['DataGridPremium'];
var props = {
    unstable_cellSelection: 'cellSelection',
    unstable_cellSelectionModel: 'cellSelectionModel',
    unstable_onCellSelectionModelChange: 'onCellSelectionModelChange',
    unstable_ignoreValueFormatterDuringExport: 'ignoreValueFormatterDuringExport',
    unstable_splitClipboardPastedText: 'splitClipboardPastedText',
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    return (0, renameProps_1.default)({ root: root, j: j, props: props, componentNames: componentNames }).toSource(printOptions);
}
