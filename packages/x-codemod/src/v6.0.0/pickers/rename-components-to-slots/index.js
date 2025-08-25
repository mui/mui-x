"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
function transformComponentsProp(attributeNode) {
    attributeNode.name.name = 'slots';
    var valueExpression = attributeNode.value.expression;
    if ((valueExpression === null || valueExpression === void 0 ? void 0 : valueExpression.type) !== 'ObjectExpression') {
        return;
    }
    valueExpression.properties.forEach(function (property) {
        property.key.name = property.key.name[0].toLowerCase() + property.key.name.slice(1);
        if (property.shorthand) {
            property.shorthand = false;
        }
    });
}
function transformComponentsPropsProp(attributeNode) {
    attributeNode.name.name = 'slotProps';
}
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
        return node.source.value.startsWith('@mui/x-date-pickers');
    })
        .forEach(function (path) {
        path.node.specifiers.forEach(function (node) {
            // Process only date-pickers components
            root.findJSXElements(node.local.name).forEach(function (elementPath) {
                if (elementPath.node.type !== 'JSXElement') {
                    return;
                }
                elementPath.node.openingElement.attributes.forEach(function (elementNode) {
                    if (elementNode.type !== 'JSXAttribute') {
                        return;
                    }
                    switch (elementNode.name.name) {
                        case 'components':
                            transformComponentsProp(elementNode);
                            break;
                        case 'componentsProps':
                            transformComponentsPropsProp(elementNode);
                            break;
                        default:
                    }
                });
            });
        });
    });
    var transformed = root.findJSXElements();
    return transformed.toSource(printOptions);
}
