"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var printOptions = options.printOptions;
    var root = j(file.source);
    var componentNames = ['SparkLineChart'];
    var props = { colors: 'color' };
    var colorAttributes = root
        .find(j.JSXElement)
        .filter(function (path) {
        return componentNames.includes(path.value.openingElement.name.name);
    })
        .find(j.JSXAttribute)
        .filter(function (attribute) { return Object.keys(props).includes(attribute.node.name.name); });
    return colorAttributes
        .forEach(function (attribute) {
        var _a;
        var colorsAttributeExpression = ((_a = attribute.node.value) === null || _a === void 0 ? void 0 : _a.type) === 'JSXExpressionContainer'
            ? attribute.node.value.expression
            : null;
        var colorAttributeExpression;
        if ((colorsAttributeExpression === null || colorsAttributeExpression === void 0 ? void 0 : colorsAttributeExpression.type) === 'ArrayExpression') {
            colorAttributeExpression = colorsAttributeExpression.elements[0];
        }
        else if ((colorsAttributeExpression === null || colorsAttributeExpression === void 0 ? void 0 : colorsAttributeExpression.type) === 'Identifier') {
            colorAttributeExpression = j.conditionalExpression(j.binaryExpression('===', j.unaryExpression('typeof', colorsAttributeExpression), j.literal('function')), j.arrowFunctionExpression([j.identifier('mode')], j.chainExpression(j.optionalMemberExpression(j.callExpression(colorsAttributeExpression, [j.identifier('mode')]), j.literal(0)))), colorsAttributeExpression);
        }
        else {
            // Don't know how to handle this case
        }
        // Only transform the value if we know how to handle it, otherwise rename the prop and add a comment
        if (colorAttributeExpression) {
            j(attribute).replaceWith(j.jsxAttribute(j.jsxIdentifier(props[attribute.node.name.name]), j.jsxExpressionContainer(colorAttributeExpression)));
        }
        else {
            j(attribute)
                .replaceWith(j.jsxAttribute(j.jsxIdentifier(props[attribute.node.name.name]), attribute.node.value))
                .insertBefore(j.commentBlock(" mui-x-codemod: We renamed the `colors` prop to `color`, but didn't change the value. Please ensure sure this prop receives a string or a function that returns a string. "));
        }
    })
        .toSource(printOptions);
}
