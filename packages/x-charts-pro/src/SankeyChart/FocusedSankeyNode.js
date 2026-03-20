"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusedSankeyNode = FocusedSankeyNode;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var hooks_1 = require("../hooks");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
function FocusedSankeyNode(props) {
    var _a, _b, _c, _d, _e;
    var focusedItem = (0, hooks_1.useFocusedItem)();
    var layout = (0, useSankeySeries_1.useSankeyLayout)();
    var theme = (0, styles_1.useTheme)();
    if (!focusedItem || focusedItem.type !== 'sankey' || focusedItem.subType !== 'node' || !layout) {
        return null;
    }
    var node = layout === null || layout === void 0 ? void 0 : layout.nodes.find(function (_a) {
        var id = _a.id;
        return id === focusedItem.nodeId;
    });
    if (!node) {
        return null;
    }
    var x0 = (_a = node.x0) !== null && _a !== void 0 ? _a : 0;
    var y0 = (_b = node.y0) !== null && _b !== void 0 ? _b : 0;
    var x1 = (_c = node.x1) !== null && _c !== void 0 ? _c : 0;
    var y1 = (_d = node.y1) !== null && _d !== void 0 ? _d : 0;
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: "none", stroke: ((_e = theme.vars) !== null && _e !== void 0 ? _e : theme).palette.text.primary, strokeWidth: 2, pointerEvents: "none" }, props)));
}
