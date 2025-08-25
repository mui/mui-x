"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameComponentsSlots_1 = require("../../../util/renameComponentsSlots");
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
            });
        });
    });
    return (0, renameComponentsSlots_1.default)({
        root: root,
        componentNames: Array.from(componentNames),
        translation: {
            LeftArrowButton: 'PreviousIconButton',
            RightArrowButton: 'NextIconButton',
        },
        j: j,
    }).toSource(printOptions);
}
