"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var addComponentsSlots_1 = require("../../../util/addComponentsSlots");
var removeProps_1 = require("../../../util/removeProps");
var propsToSlots = {
    ToolbarComponent: { prop: 'components', path: 'Toolbar' },
    toolbarPlaceholder: { prop: 'componentsProps', path: 'toolbar.toolbarPlaceholder' },
    toolbarFormat: { prop: 'componentsProps', path: 'toolbar.toolbarFormat' },
    showToolbar: { prop: 'componentsProps', path: 'toolbar.hidden' },
    toolbarTitle: { prop: 'localeText', path: 'toolbarTitle' },
};
var COMPONENTS = [
    'DateTimePicker',
    'MobileDateTimePicker',
    'DesktopDateTimePicker',
    'StaticDateTimePicker',
    'DatePicker',
    'MobileDatePicker',
    'DesktopDatePicker',
    'StaticDatePicker',
    'TimePicker',
    'MobileTimePicker',
    'DesktopTimePicker',
    'StaticTimePicker',
    'DateRangePicker',
    'MobileDateRangePicker',
    'DesktopDateRangePicker',
    'StaticDateRangePicker',
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
            return Object.keys(propsToSlots).includes(attribute.value.name.name);
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
            if (attributeName === 'showToolbar') {
                if (value.type === 'BooleanLiteral' ||
                    (value.type === 'Literal' && typeof value.value === 'boolean')) {
                    value.value = !value.value;
                }
                else {
                    value = j.unaryExpression('!', value);
                }
            }
            (0, addComponentsSlots_1.transformNestedProp)(path, propsToSlots[attributeName].prop, propsToSlots[attributeName].path, value, j);
        });
    });
    (0, removeProps_1.default)({ root: root, componentNames: COMPONENTS, props: Object.keys(propsToSlots), j: j });
    return root.toSource(printOptions);
}
