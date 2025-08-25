"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var removeObjectProperty_1 = require("../../../util/removeObjectProperty");
var componentsNames = ['DataGridPremium'];
var propName = 'experimentalFeatures';
var propKeys = ['ariaV8'];
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
