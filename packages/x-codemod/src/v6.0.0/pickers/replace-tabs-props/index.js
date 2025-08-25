"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameComponentsSlots_1 = require("../../../util/renameComponentsSlots");
var addComponentsSlots_1 = require("../../../util/addComponentsSlots");
var removeProps_1 = require("../../../util/removeProps");
var propsToComponentsProps = {
    hideTabs: 'tabs.hidden',
    dateRangeIcon: 'tabs.dateIcon',
    timeIcon: 'tabs.timeIcon',
};
var COMPONENTS = [
    'DateTimePicker',
    'MobileDateTimePicker',
    'DesktopDateTimePicker',
    'StaticDateTimePicker',
];
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
        return COMPONENTS.includes(path.value.openingElement.name.name);
    })
        .forEach(function (path) {
        var attributesToTransform = j(path)
            .find(j.JSXAttribute)
            .filter(function (attribute) {
            return Object.keys(propsToComponentsProps).includes(attribute.value.name.name);
        });
        attributesToTransform.forEach(function (attribute) {
            var _a;
            var attributeName = attribute.value.name.name;
            // Get the value in case it's:
            // - prop={value}
            // - prop="value"
            // - prop (which means true)
            var value = ((_a = attribute.value.value) === null || _a === void 0 ? void 0 : _a.type) === 'JSXExpressionContainer'
                ? attribute.value.value.expression
                : attribute.value.value || j.booleanLiteral(true);
            (0, addComponentsSlots_1.transformNestedProp)(path, 'componentsProps', propsToComponentsProps[attributeName], value, j);
        });
    });
    (0, removeProps_1.default)({ root: root, componentNames: COMPONENTS, props: Object.keys(propsToComponentsProps), j: j });
    return (0, renameComponentsSlots_1.default)({
        root: root,
        componentNames: COMPONENTS,
        translation: { dateRangeIcon: 'dateIcon' },
        j: j,
    }).toSource(printOptions);
}
