"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renameComponentsSlots;
var lowerCase = function (key) { return "".concat(key.slice(0, 1).toLowerCase()).concat(key.slice(1)); };
var getSlotsTranslation = function (translations) {
    var lowercasedTranslation = {};
    Object.entries(translations).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        lowercasedTranslation[lowerCase(key)] = lowerCase(value);
    });
    return lowercasedTranslation;
};
function renameComponentsSlots(_a) {
    var root = _a.root, componentNames = _a.componentNames, translation = _a.translation, j = _a.j;
    return root
        .find(j.JSXElement)
        .filter(function (path) {
        return componentNames.includes(path.value.openingElement.name.name);
    })
        .find(j.JSXAttribute)
        .filter(function (attribute) {
        return ['components', 'componentsProps', 'slots', 'slotProps'].includes(attribute.node.name.name);
    })
        .forEach(function (attribute) {
        var usedTranslation = attribute.node.name.name === 'components'
            ? translation
            : getSlotsTranslation(translation);
        j(attribute)
            .find(j.Property)
            .forEach(function (property) {
            if (property.value.key.type === 'Identifier' &&
                usedTranslation[property.value.key.name] !== undefined) {
                property.value.key.name = usedTranslation[property.value.key.name];
            }
        });
    });
}
