"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var removeProps_1 = require("../../../util/removeProps");
var addComponentsSlots_1 = require("../../../util/addComponentsSlots");
var componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
var propsToRename = {
    onCellFocusOut: { prop: 'componentsProps', path: 'cell.onBlur' },
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    root
        .find(j.JSXElement)
        .filter(function (path) {
        return componentNames.includes(path.value.openingElement.name.name);
    })
        .forEach(function (path) {
        var attributesToTransform = j(path)
            .find(j.JSXAttribute)
            .filter(function (attribute) {
            return Object.keys(propsToRename).includes(attribute.value.name.name);
        });
        attributesToTransform.forEach(function (attribute) {
            var _a;
            var attributeName = attribute.value.name.name;
            var value = ((_a = attribute.value.value) === null || _a === void 0 ? void 0 : _a.type) === 'JSXExpressionContainer'
                ? attribute.value.value.expression
                : attribute.value.value;
            (0, addComponentsSlots_1.transformNestedProp)(path, propsToRename[attributeName].prop, propsToRename[attributeName].path, value, j);
        });
    });
    return (0, removeProps_1.default)({ root: root, j: j, props: Object.keys(propsToRename), componentNames: componentNames }).toSource(printOptions);
}
