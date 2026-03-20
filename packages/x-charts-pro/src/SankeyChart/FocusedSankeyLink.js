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
exports.FocusedSankeyLink = FocusedSankeyLink;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var hooks_1 = require("../hooks");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
function FocusedSankeyLink(props) {
    var _a;
    var focusedItem = (0, hooks_1.useFocusedItem)();
    var layout = (0, useSankeySeries_1.useSankeyLayout)();
    var theme = (0, styles_1.useTheme)();
    if (!focusedItem || focusedItem.type !== 'sankey' || focusedItem.subType !== 'link' || !layout) {
        return null;
    }
    var link = layout === null || layout === void 0 ? void 0 : layout.links.find(function (_a) {
        var source = _a.source, target = _a.target;
        return source.id === focusedItem.sourceId && target.id === focusedItem.targetId;
    });
    if (!link || !link.path) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("path", __assign({ d: link.path, fill: "none", stroke: ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette.text.primary, strokeWidth: 2, pointerEvents: "none" }, props)));
}
