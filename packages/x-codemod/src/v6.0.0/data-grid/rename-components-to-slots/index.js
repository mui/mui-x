"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameIdentifiers_1 = require("../../../util/renameIdentifiers");
var preRequisites = {
    components: ['DataGrid', 'DataGridPro', 'DataGridPremium'],
    packageRegex: /@mui\/x-data-grid(-pro|-premium)?/,
};
function transformComponentsProp(attributeNode) {
    attributeNode.value.name.name = 'slots';
    var valueExpression = attributeNode.value.value.expression;
    if (!valueExpression || valueExpression.type !== 'ObjectExpression') {
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
    attributeNode.value.name.name = 'slotProps';
}
/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var isGridUsed = (0, renameIdentifiers_1.checkPreRequisitesSatisfied)(j, root, preRequisites);
    if (isGridUsed) {
        root
            .find(j.JSXElement)
            .filter(function (path) {
            return preRequisites.components.includes(path.value.openingElement.name.name);
        })
            .find(j.JSXAttribute)
            .forEach(function (attribute) {
            // Only remove props from components in componentNames. Not nested ones.
            if (!preRequisites.components.includes(attribute.parent.value.name.name)) {
                return;
            }
            if (attribute.value.name.name === 'components') {
                transformComponentsProp(attribute);
            }
            else if (attribute.value.name.name === 'componentsProps') {
                transformComponentsPropsProp(attribute);
            }
        });
    }
    return root.toSource(printOptions);
}
