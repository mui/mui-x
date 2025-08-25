"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeObjectProperty;
var getAttributeName = function (attribute) {
    return attribute.name.type === 'JSXIdentifier' ? attribute.name.name : attribute.name.name.name;
};
function removeObjectProperty(_a) {
    var root = _a.root, propName = _a.propName, componentsNames = _a.componentsNames, propKey = _a.propKey, j = _a.j;
    root
        .find(j.JSXElement)
        .filter(function (path) {
        switch (path.value.openingElement.name.type) {
            case 'JSXNamespacedName':
                return componentsNames.includes(path.value.openingElement.name.name.name);
            case 'JSXIdentifier':
                return componentsNames.includes(path.value.openingElement.name.name);
            default:
                return false;
        }
    })
        .forEach(function (element) {
        var _a, _b;
        var targetAttribute = (_b = (_a = element.value.openingElement.attributes) === null || _a === void 0 ? void 0 : _a.filter(function (attribute) { return attribute.type === 'JSXAttribute'; })) === null || _b === void 0 ? void 0 : _b.find(function (attribute) { return getAttributeName(attribute) === propName; });
        if (!targetAttribute) {
            return;
        }
        var definedKeys = [];
        var properties = j(targetAttribute).find(j.Property);
        var objectProperties = j(targetAttribute).find(j.ObjectProperty);
        var propertiesToProcess = properties.length > 0 ? properties : objectProperties;
        if (propertiesToProcess.length === 0) {
            return;
        }
        propertiesToProcess.forEach(function (path) {
            var keyName = path.value.key.name;
            if (keyName) {
                definedKeys.push(keyName);
            }
        });
        if (definedKeys.length === 1 && definedKeys[0] === propKey) {
            // only that property is defined, remove the whole prop
            j(element)
                .find(j.JSXAttribute)
                .filter(function (a) { return a.value.name.name === propName; })
                .forEach(function (path) {
                j(path).remove();
            });
        }
        else {
            propertiesToProcess.forEach(function (path) {
                var name = path.value.key.name;
                if (name === propKey) {
                    j(path).remove();
                }
            });
        }
    });
}
