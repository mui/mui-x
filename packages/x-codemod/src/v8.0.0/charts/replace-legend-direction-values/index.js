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
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (elementPath.node.type !== 'JSXElement') {
                    return;
                }
                var slotProps = (_a = elementPath.node.openingElement.attributes) === null || _a === void 0 ? void 0 : _a.find(function (elementNode) {
                    return elementNode.type === 'JSXAttribute' && elementNode.name.name === 'slotProps';
                });
                if (slotProps === null) {
                    // No slotProps to manage
                    return;
                }
                var direction = (_g = (_f = (_e = (_d = (_c = (_b = slotProps === null || slotProps === void 0 ? void 0 : slotProps.value) === null || _b === void 0 ? void 0 : _b.expression) === null || _c === void 0 ? void 0 : _c.properties) === null || _d === void 0 ? void 0 : _d.find(function (v) { var _a; return ((_a = v === null || v === void 0 ? void 0 : v.key) === null || _a === void 0 ? void 0 : _a.name) === 'legend'; })) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.properties) === null || _g === void 0 ? void 0 : _g.find(function (v) { var _a; return ((_a = v === null || v === void 0 ? void 0 : v.key) === null || _a === void 0 ? void 0 : _a.name) === 'direction'; });
                if (direction === undefined ||
                    (direction === null || direction === void 0 ? void 0 : direction.value) === undefined ||
                    ((_h = direction === null || direction === void 0 ? void 0 : direction.value) === null || _h === void 0 ? void 0 : _h.value) === undefined) {
                    return;
                }
                var directionValue = direction.value;
                directionValue.value = mapFix(directionValue.value);
                (0, addComponentsSlots_1.transformNestedProp)(elementPath, 'slotProps', 'legend.direction', directionValue, j);
            });
        });
    });
    var transformed = root.findJSXElements();
    return transformed.toSource(printOptions);
}
function mapFix(v) {
    switch (v) {
        case 'row':
            return 'horizontal';
        case 'column':
            return 'vertical';
        default:
            return v;
    }
}
