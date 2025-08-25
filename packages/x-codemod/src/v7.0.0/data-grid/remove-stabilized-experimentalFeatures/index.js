"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var removeObjectProperty_1 = require("../../../util/removeObjectProperty");
var componentsNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
var propName = 'experimentalFeatures';
var propKeys = ['columnGrouping', 'clipboardPaste', 'lazyLoading', 'ariaV7'];
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    propKeys.forEach(function (propKey) {
        (0, removeObjectProperty_1.default)({ root: root, j: j, propName: propName, componentsNames: componentsNames, propKey: propKey });
    });
    return root.toSource(printOptions);
}
