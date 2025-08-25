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
                if (elementPath.node.type !== 'JSXElement') {
                    return;
                }
                ['label', 'tick'].forEach(function (attributeName) {
                    var _a, _b, _c, _d;
                    var attributeValue = (_a = elementPath.node.openingElement.attributes) === null || _a === void 0 ? void 0 : _a.find(function (elementNode) {
                        return elementNode.type === 'JSXAttribute' &&
                            elementNode.name.name === "".concat(attributeName, "FontSize");
                    });
                    if (!attributeValue) {
                        return;
                    }
                    var attributeStyle = (_b = elementPath.node.openingElement.attributes) === null || _b === void 0 ? void 0 : _b.find(function (elementNode) {
                        return elementNode.type === 'JSXAttribute' &&
                            elementNode.name.name === "".concat(attributeName, "Style");
                    });
                    // @ts-ignore receives an object.
                    var styleValue = attributeStyle === null || attributeStyle === void 0 ? void 0 : attributeStyle.value.expression.properties.find(function (prop) { return prop.key.name === 'fontSize'; });
                    if (attributeStyle === null) {
                        // We create a new "style" object
                        (_c = elementPath.node.openingElement.attributes) === null || _c === void 0 ? void 0 : _c.push(j.jsxAttribute(j.jsxIdentifier("".concat(attributeName, "Style")), j.jsxExpressionContainer(j.objectExpression([
                            j.objectProperty(j.identifier('fontSize'), 
                            // @ts-ignore receives an object.
                            attributeValue.value.expression),
                        ]))));
                    }
                    else {
                        (0, addComponentsSlots_1.transformNestedProp)(elementPath, "".concat(attributeName, "Style"), 'fontSize', 
                        // @ts-ignore receives an object.
                        (_d = styleValue === null || styleValue === void 0 ? void 0 : styleValue.value) !== null && _d !== void 0 ? _d : attributeValue.value.expression, j);
                    }
                });
                // Remove the legend prop
                j(elementPath)
                    .find(j.JSXAttribute)
                    .filter(function (a) { return a.value.name.name === 'labelFontSize' || a.value.name.name === 'tickFontSize'; })
                    .forEach(function (pathToRemove) {
                    j(pathToRemove).remove();
                });
            });
        });
    });
    var transformed = root.findJSXElements();
    return transformed.toSource(printOptions);
}
