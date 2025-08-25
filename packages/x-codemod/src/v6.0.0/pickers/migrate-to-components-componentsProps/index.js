"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var addComponentsSlots_1 = require("../../../util/addComponentsSlots");
var removeProps_1 = require("../../../util/removeProps");
var renameComponentsSlots_1 = require("../../../util/renameComponentsSlots");
var propsToSlots = {
    // components
    TransitionComponent: { prop: 'components', path: 'DesktopTransition' },
    // componentsProps
    PopperProps: { prop: 'componentsProps', path: 'popper' },
    DialogProps: { prop: 'componentsProps', path: 'dialog' },
    PaperProps: { prop: 'componentsProps', path: 'desktopPaper' },
    TrapFocusProps: { prop: 'componentsProps', path: 'desktopTrapFocus' },
    InputProps: { prop: 'componentsProps', path: 'textField.InputProps' },
    InputAdornmentProps: { prop: 'componentsProps', path: 'inputAdornment' },
    OpenPickerButtonProps: { prop: 'componentsProps', path: 'openPickerButton' },
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var componentNames = new Set();
    root
        .find(j.ImportDeclaration)
        .filter(function (_a) {
        var node = _a.node;
        return node.source.value.startsWith('@mui/x-date-pickers');
    })
        .forEach(function (path) {
        path.node.specifiers.forEach(function (node) {
            // Process only date-pickers components
            root.findJSXElements(node.local.name).forEach(function (elementPath) {
                if (elementPath.node.type !== 'JSXElement') {
                    return;
                }
                componentNames.add(node.local.name);
                var attributesToTransform = j(elementPath)
                    .find(j.JSXAttribute)
                    .filter(function (attribute) {
                    var attributeParent = attribute.parentPath.parentPath;
                    if (attribute.parentPath.parentPath.value.type !== 'JSXOpeningElement' ||
                        attributeParent.value.name.name !== node.local.name) {
                        return false;
                    }
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
                    (0, addComponentsSlots_1.transformNestedProp)(elementPath, propsToSlots[attributeName].prop, propsToSlots[attributeName].path, value, j);
                });
            });
            (0, removeProps_1.default)({
                root: root,
                componentNames: [node.local.name],
                props: Object.keys(propsToSlots),
                j: j,
            });
        });
    });
    return (0, renameComponentsSlots_1.default)({
        root: root,
        componentNames: Array.from(componentNames),
        translation: {
            input: 'textField',
        },
        j: j,
    }).toSource(printOptions);
}
