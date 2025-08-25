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
    // Move the handler to the container
    root
        .findJSXElements()
        .filter(function (path) {
        return Boolean(path.node.openingElement) &&
            path.node.openingElement.name.type === 'JSXIdentifier' &&
            path.node.openingElement.name.name.includes('ChartContainer');
    })
        .forEach(function (path) {
        var _a, _b, _c, _d;
        // We find the <ChartsOnAxisClickHandler /> node
        var clickHandler = (_a = path.node.children) === null || _a === void 0 ? void 0 : _a.find(function (child) {
            if (child.type !== 'JSXElement') {
                return false;
            }
            if (child.openingElement.name.type !== 'JSXIdentifier') {
                return false;
            }
            return child.openingElement.name.name === 'ChartsOnAxisClickHandler';
        });
        if (!clickHandler) {
            return;
        }
        var clickCallback = (_b = clickHandler.openingElement.attributes) === null || _b === void 0 ? void 0 : _b.find(function (attr) {
            return attr.type === 'JSXAttribute' && attr.name.name === 'onAxisClick';
        });
        if (!clickCallback) {
            return;
        }
        // Move the callback to the container
        (_c = path.node.openingElement.attributes) === null || _c === void 0 ? void 0 : _c.push(clickCallback);
        // Remove the children
        path.node.children = (_d = path.node.children) === null || _d === void 0 ? void 0 : _d.filter(function (child) {
            if (child.type !== 'JSXElement') {
                return true;
            }
            if (child.openingElement.name.type !== 'JSXIdentifier') {
                return true;
            }
            return child.openingElement.name.name !== 'ChartsOnAxisClickHandler';
        });
    });
    // Remove nested import
    root
        .find(j.ImportDeclaration, { source: { value: '@mui/x-charts/ChartsOnAxisClickHandler' } })
        .remove();
    // Remove global import
    root.find(j.ImportDeclaration).forEach(function (path) {
        var _a;
        if (typeof path.node.source.value !== 'string') {
            return;
        }
        if (!path.node.source.value.includes('@mui/x-charts')) {
            return;
        }
        path.node.specifiers = (_a = path.node.specifiers) === null || _a === void 0 ? void 0 : _a.filter(function (specifier) {
            if (specifier.type !== 'ImportSpecifier') {
                return true;
            }
            return specifier.imported.name !== 'ChartsOnAxisClickHandler';
        });
    });
    return root.toSource(printOptions);
}
