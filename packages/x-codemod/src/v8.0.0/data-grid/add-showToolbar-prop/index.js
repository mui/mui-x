"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    // List of DataGrid components
    var dataGridComponents = new Set(['DataGrid', 'DataGridPro', 'DataGridPremium']);
    // List of allowed import sources
    var dataGridSources = new Set([
        '@mui/x-data-grid',
        '@mui/x-data-grid-pro',
        '@mui/x-data-grid-premium',
    ]);
    // Find relevant DataGrid imports
    var importedDataGrids = new Set();
    root.find(j.ImportDeclaration).forEach(function (path) {
        var _a;
        if (dataGridSources.has(path.node.source.value)) {
            (_a = path.node.specifiers) === null || _a === void 0 ? void 0 : _a.forEach(function (specifier) {
                var _a;
                if (specifier.type === 'ImportSpecifier' &&
                    dataGridComponents.has(specifier.imported.name)) {
                    var localName = (_a = specifier.local) === null || _a === void 0 ? void 0 : _a.name;
                    if (localName) {
                        importedDataGrids.add(localName);
                    }
                }
            });
        }
    });
    if (importedDataGrids.size === 0) {
        return file.source;
    }
    root.find(j.JSXOpeningElement).forEach(function (path) {
        var _a, _b;
        if (!importedDataGrids.has(path.node.name.name)) {
            return;
        }
        var hasSlotsToolbar = false;
        var hasShowToolbar = false;
        (_a = path.node.attributes) === null || _a === void 0 ? void 0 : _a.forEach(function (attr) {
            if (attr.type === 'JSXAttribute') {
                if (attr.name.name === 'slots') {
                    if (attr.value &&
                        attr.value.type === 'JSXExpressionContainer' &&
                        attr.value.expression.type === 'ObjectExpression') {
                        hasSlotsToolbar = attr.value.expression.properties.some(function (prop) { return prop.key.name === 'toolbar'; });
                    }
                }
                if (attr.name.name === 'showToolbar') {
                    hasShowToolbar = true;
                }
            }
        });
        if (hasSlotsToolbar && !hasShowToolbar) {
            (_b = path.node.attributes) === null || _b === void 0 ? void 0 : _b.push(j.jsxAttribute(j.jsxIdentifier('showToolbar')));
        }
    });
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    return root.toSource(printOptions);
}
