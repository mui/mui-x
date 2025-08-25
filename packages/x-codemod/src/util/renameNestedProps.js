"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renameNestedProps;
function renameNestedProps(_a) {
    var root = _a.root, componentNames = _a.componentNames, nestedProps = _a.nestedProps, j = _a.j;
    return root
        .find(j.JSXElement)
        .filter(function (path) { return componentNames.includes(path.value.openingElement.name.name); })
        .find(j.JSXAttribute)
        .filter(function (attribute) { return Object.keys(nestedProps).includes(attribute.node.name.name); })
        .forEach(function (attribute) {
        Object.entries(nestedProps).forEach(function (_a) {
            var _b, _c;
            var rootPropName = _a[0], props = _a[1];
            if (attribute.node.name.name === rootPropName &&
                ((_b = attribute.node.value) === null || _b === void 0 ? void 0 : _b.type) === 'JSXExpressionContainer' &&
                ((_c = attribute.node.value) === null || _c === void 0 ? void 0 : _c.expression.type) === 'ObjectExpression') {
                var existingProperties = attribute.node.value.expression.properties;
                existingProperties.forEach(function (property) {
                    if (property.type === 'Property' &&
                        property.key.type === 'Identifier' &&
                        props[property.key.name]) {
                        property.key.name = props[property.key.name];
                    }
                });
            }
        });
    });
}
