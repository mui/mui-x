"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var removeProps_1 = require("../../../util/removeProps");
var componentNames = ['LineChart', 'LineChartPro', 'MarkPlot'];
var props = ['experimentalMarkRendering'];
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    return (0, removeProps_1.default)({ root: root, j: j, props: props, componentNames: componentNames }).toSource(printOptions);
}
