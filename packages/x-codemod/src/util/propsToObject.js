"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = propsToObject;
function propsToObject(_a) {
    var j = _a.j, root = _a.root, componentName = _a.componentName, aliasName = _a.aliasName, propName = _a.propName, props = _a.props;
    function buildObject(node, value) {
        var shorthand = node.value.expression && node.value.expression.name === node.name.name;
        var property = j.objectProperty(j.identifier(node.name.name), node.value.expression ? node.value.expression : node.value);
        property.shorthand = shorthand;
        value.push(property);
        return value;
    }
    var result = aliasName
        ? root.find(j.JSXElement, { openingElement: { name: { property: { name: componentName } } } })
        : root.findJSXElements(componentName);
    return result.forEach(function (path) {
        var _a;
        var _b;
        // @ts-expect-error
        if (!aliasName || (aliasName && path.node.openingElement.name.object.name === aliasName)) {
            var propValue_1 = [];
            var attributes_1 = path.node.openingElement.attributes;
            attributes_1 === null || attributes_1 === void 0 ? void 0 : attributes_1.forEach(function (node, index) {
                // Only transform whitelisted props
                if (node.type === 'JSXAttribute' && props.includes(node.name.name)) {
                    propValue_1 = buildObject(node, propValue_1);
                    delete attributes_1[index];
                }
            });
            if (propValue_1.length > 0) {
                var propNameAttr = attributes_1 === null || attributes_1 === void 0 ? void 0 : attributes_1.find(function (attr) { return attr.type === 'JSXAttribute' && attr.name.name === propName; });
                if (propNameAttr && propNameAttr.type === 'JSXAttribute') {
                    // @ts-expect-error
                    (_a = (((_b = propNameAttr.value.expression) === null || _b === void 0 ? void 0 : _b.properties) || [])).push.apply(_a, j.objectExpression(propValue_1).properties);
                }
                else {
                    attributes_1 === null || attributes_1 === void 0 ? void 0 : attributes_1.push(j.jsxAttribute(j.jsxIdentifier(propName), j.jsxExpressionContainer(j.objectExpression(propValue_1))));
                }
            }
        }
    });
}
