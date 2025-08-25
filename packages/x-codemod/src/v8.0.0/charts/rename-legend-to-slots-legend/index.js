"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var addComponentsSlots_1 = require("../../../util/addComponentsSlots");
/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var printOptions = options.printOptions;
    var root = j(file.source);
    root
        .find(j.ImportDeclaration)
        .filter(function (_a) {
        var node = _a.node;
        return typeof node.source.value === 'string' && node.source.value.startsWith('@mui/x-charts');
    })
        .forEach(function (path) {
        var _a;
        (_a = path.node.specifiers) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
            var _a;
            root.findJSXElements((_a = node.local) === null || _a === void 0 ? void 0 : _a.name).forEach(function (elementPath) {
                var _a, _b, _c;
                if (elementPath.node.type !== 'JSXElement') {
                    return;
                }
                var legendProps = (_a = elementPath.node.openingElement.attributes) === null || _a === void 0 ? void 0 : _a.find(function (elementNode) {
                    return elementNode.type === 'JSXAttribute' && elementNode.name.name === 'legend';
                });
                if (!legendProps) {
                    // No legend props to manage
                    return;
                }
                var slotProps = (_b = elementPath.node.openingElement.attributes) === null || _b === void 0 ? void 0 : _b.find(function (elementNode) {
                    return elementNode.type === 'JSXAttribute' && elementNode.name.name === 'slotProps';
                });
                if (slotProps === null) {
                    // We create a new slotProps object
                    (_c = elementPath.node.openingElement.attributes) === null || _c === void 0 ? void 0 : _c.push(j.jsxAttribute(j.jsxIdentifier('slotProps'), j.jsxExpressionContainer(j.objectExpression([
                        // @ts-ignore legend receives an object.
                        j.objectProperty(j.identifier('legend'), legendProps.value.expression),
                    ]))));
                }
                else {
                    (0, addComponentsSlots_1.transformNestedProp)(elementPath, 'slotProps', 'legend', 
                    // @ts-ignore legend receives an object.
                    legendProps.value.expression, j);
                }
                // Remove the legend prop
                j(elementPath)
                    .find(j.JSXAttribute)
                    .filter(function (a) { return a.value.name.name === 'legend'; })
                    .forEach(function (pathToRemove) {
                    j(pathToRemove).remove();
                });
            });
        });
    });
    var transformed = root.findJSXElements();
    return transformed.toSource(printOptions);
}
