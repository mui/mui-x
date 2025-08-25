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
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                if (elementPath.node.type !== 'JSXElement') {
                    return;
                }
                var chartProps = elementPath.value.openingElement.attributes;
                var slotProps = chartProps === null || chartProps === void 0 ? void 0 : chartProps.find(function (elementNode) {
                    return elementNode.type === 'JSXAttribute' && elementNode.name.name === 'slotProps';
                });
                if (slotProps === null) {
                    // No slotProps to manage
                    return;
                }
                var legendSlotProps = (_d = (_c = (_b = (_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.value) === null || _a === void 0 ? void 0 : _a.expression) === null || _b === void 0 ? void 0 : _b.properties) === null || _c === void 0 ? void 0 : _c.find(function (v) { var _a; 
                // @ts-expect-error
                return ((_a = v === null || v === void 0 ? void 0 : v.key) === null || _a === void 0 ? void 0 : _a.name) === 'legend'; })) === null || _d === void 0 ? void 0 : _d.value;
                var hiddenIndex = (_e = legendSlotProps === null || legendSlotProps === void 0 ? void 0 : legendSlotProps.properties) === null || _e === void 0 ? void 0 : _e.findIndex(function (v) { var _a; return ((_a = v === null || v === void 0 ? void 0 : v.key) === null || _a === void 0 ? void 0 : _a.name) === 'hidden'; });
                if (hiddenIndex === undefined || hiddenIndex === -1) {
                    return;
                }
                var hidden = (_g = (_f = legendSlotProps === null || legendSlotProps === void 0 ? void 0 : legendSlotProps.properties) === null || _f === void 0 ? void 0 : _f[hiddenIndex]) === null || _g === void 0 ? void 0 : _g.value;
                if (!hidden) {
                    return;
                }
                legendSlotProps.properties.splice(hiddenIndex, 1);
                if (((_h = slotProps.value) === null || _h === void 0 ? void 0 : _h.type) === 'JSXExpressionContainer' &&
                    legendSlotProps.properties.length === 0) {
                    var slotPropsObject = (_j = slotProps.value) === null || _j === void 0 ? void 0 : _j.expression;
                    if (slotPropsObject.type === 'ObjectExpression') {
                        slotPropsObject.properties = slotPropsObject.properties.filter(function (prop) {
                            return prop.type !== 'ObjectProperty' ||
                                prop.key.type !== 'Identifier' ||
                                prop.key.name !== 'legend';
                        });
                    }
                }
                if (((_k = slotProps.value) === null || _k === void 0 ? void 0 : _k.type) === 'JSXExpressionContainer' &&
                    slotProps.value.expression.type === 'ObjectExpression' &&
                    slotProps.value.expression.properties.length === 0) {
                    chartProps = chartProps === null || chartProps === void 0 ? void 0 : chartProps.filter(function (attr) { return attr.type !== 'JSXAttribute' || attr.name.name !== 'slotProps'; });
                }
                chartProps === null || chartProps === void 0 ? void 0 : chartProps.push(j.jsxAttribute(j.jsxIdentifier('hideLegend'), j.jsxExpressionContainer(hidden)));
                elementPath.value.openingElement.attributes = chartProps;
            });
        });
    });
    var transformed = root.findJSXElements();
    return transformed.toSource(printOptions);
}
