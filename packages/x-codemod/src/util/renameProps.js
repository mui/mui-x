"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renameProps;
function renameProps(_a) {
    var root = _a.root, componentNames = _a.componentNames, props = _a.props, j = _a.j;
    return root
        .find(j.JSXElement)
        .filter(function (path) {
        return componentNames.includes(path.value.openingElement.name.name);
    })
        .find(j.JSXAttribute)
        .filter(function (attribute) { return Object.keys(props).includes(attribute.node.name.name); })
        .forEach(function (attribute) {
        j(attribute).replaceWith(j.jsxAttribute(j.jsxIdentifier(props[attribute.node.name.name]), attribute.node.value));
    });
}
