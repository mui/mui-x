"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeProps;
function removeProps(_a) {
    var root = _a.root, componentNames = _a.componentNames, props = _a.props, j = _a.j;
    return root
        .find(j.JSXElement)
        .filter(function (path) {
        return componentNames.includes(path.value.openingElement.name.name);
    })
        .find(j.JSXAttribute)
        .filter(function (attribute) { return props.includes(attribute.node.name.name); })
        .forEach(function (attribute) {
        // Only remove props from components in componentNames. Not nested ones.
        var attributeParent = attribute.parentPath.parentPath;
        if (attributeParent.value.type === 'JSXOpeningElement' &&
            componentNames.includes(attributeParent.value.name.name)) {
            j(attribute).remove();
        }
    });
}
