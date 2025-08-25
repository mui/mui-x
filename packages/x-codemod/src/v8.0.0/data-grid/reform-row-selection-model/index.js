"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
var attrName = 'rowSelectionModel';
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    // Step 1: Collect variable names used in <DataGrid rowSelectionModel={...} />
    var usedInDataGrid = new Set();
    root
        .find(j.JSXOpeningElement)
        .filter(function (path) {
        return j.JSXIdentifier.check(path.node.name) &&
            componentNames.some(function (name) { return name === path.node.name.name; });
    })
        .forEach(function (path) {
        var _a;
        (_a = path.node.attributes) === null || _a === void 0 ? void 0 : _a.forEach(function (attr) {
            if (j.JSXAttribute.check(attr) &&
                j.JSXIdentifier.check(attr.name) &&
                attr.name.name === attrName &&
                attr.value &&
                j.JSXExpressionContainer.check(attr.value) &&
                j.Identifier.check(attr.value.expression)) {
                usedInDataGrid.add(attr.value.expression.name);
            }
        });
    });
    if (usedInDataGrid.size === 0) {
        return file.source; // No relevant transformations needed
    }
    // Step 2: Convert only relevant `useState` or `useMemo` variables
    root
        .find(j.VariableDeclarator)
        .filter(function (path) {
        return j.ArrayPattern.check(path.node.id) &&
            path.node.id.elements.length === 2 &&
            j.Identifier.check(path.node.id.elements[0]) &&
            usedInDataGrid.has(path.node.id.elements[0].name) && // Only modify if used in `componentNames`
            path.node.init &&
            j.CallExpression.check(path.node.init) &&
            ((j.MemberExpression.check(path.node.init.callee) &&
                j.Identifier.check(path.node.init.callee.object) &&
                ['React', 'useState', 'useMemo'].includes(path.node.init.callee.object.name)) ||
                ['useState', 'useMemo'].includes(path.node.init.callee.name)) && // Handle direct calls
            path.node.init.arguments.length > 0 &&
            (j.ArrayExpression.check(path.node.init.arguments[0]) ||
                (j.ArrowFunctionExpression.check(path.node.init.arguments[0]) &&
                    j.BlockStatement.check(path.node.init.arguments[0].body) === false &&
                    j.ArrayExpression.check(path.node.init.arguments[0].body)));
    })
        .forEach(function (path) {
        var _a, _b, _c, _d;
        var arrayExpression = j.ArrayExpression.check((_a = path.node.init) === null || _a === void 0 ? void 0 : _a.arguments[0])
            ? (_b = path.node.init) === null || _b === void 0 ? void 0 : _b.arguments[0]
            : (_d = (_c = path.node.init) === null || _c === void 0 ? void 0 : _c.arguments[0]) === null || _d === void 0 ? void 0 : _d.body;
        var newObject = j.objectExpression([
            j.property('init', j.identifier('type'), j.literal('include')),
            j.property('init', j.identifier('ids'), j.newExpression(j.identifier('Set'), [arrayExpression])),
        ]);
        if (j.ArrayExpression.check(path.node.init.arguments[0])) {
            path.node.init.arguments[0] = newObject;
        }
        else {
            path.node.init.arguments[0].body = newObject;
        }
    });
    var printOptions = (options === null || options === void 0 ? void 0 : options.printOptions) || {
        quote: 'single',
        trailingComma: true,
    };
    return root.toSource(printOptions);
}
