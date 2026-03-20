"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaletteOption = PaletteOption;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var icons_1 = require("../icons");
var PaletteOptionRoot = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PaletteOptionRoot',
})(function (_a) {
    var theme = _a.theme;
    return ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    });
});
var PaletteOptionIcon = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PaletteOptionIcon',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: 24,
        height: 24,
        borderRadius: 4,
        border: "1px solid ".concat((theme.vars || theme).palette.divider),
        backgroundColor: (theme.vars || theme).palette.background.default,
    });
});
function PaletteOption(props) {
    var _a;
    var theme = (0, styles_1.useTheme)();
    var colors = props.palette((_a = theme.palette.mode) !== null && _a !== void 0 ? _a : 'light');
    return ((0, jsx_runtime_1.jsxs)(PaletteOptionRoot, { children: [(0, jsx_runtime_1.jsx)(PaletteOptionIcon, { children: (0, jsx_runtime_1.jsx)(icons_1.GridChartsPaletteIcon, { style: Object.fromEntries(colors.map(function (color, index) { return ["--color-".concat(index + 1), color]; })) }) }), props.children] }));
}
