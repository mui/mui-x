"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaterialCSSVariables = useMaterialCSSVariables;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var styles_2 = require("@mui/material/styles");
var hash_1 = require("@mui/x-internals/hash");
var cssVariables_1 = require("../constants/cssVariables");
function useMaterialCSSVariables() {
    var theme = (0, styles_2.useTheme)();
    return React.useMemo(function () {
        var id = (0, hash_1.hash)((0, hash_1.stringify)(theme));
        var variables = transformTheme(theme);
        return { id: id, variables: variables };
    }, [theme]);
}
function transformTheme(t) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var borderColor = getBorderColor(t);
    var dataGridPalette = (t.vars || t).palette.DataGrid;
    var backgroundBase = (_b = dataGridPalette === null || dataGridPalette === void 0 ? void 0 : dataGridPalette.bg) !== null && _b !== void 0 ? _b : (t.vars || t).palette.background.default;
    var backgroundHeader = (_c = dataGridPalette === null || dataGridPalette === void 0 ? void 0 : dataGridPalette.headerBg) !== null && _c !== void 0 ? _c : backgroundBase;
    var backgroundPinned = (_d = dataGridPalette === null || dataGridPalette === void 0 ? void 0 : dataGridPalette.pinnedBg) !== null && _d !== void 0 ? _d : backgroundBase;
    var backgroundBackdrop = t.vars
        ? "rgba(".concat(t.vars.palette.background.defaultChannel, " / ").concat(t.vars.palette.action.disabledOpacity, ")")
        : (0, styles_1.alpha)(t.palette.background.default, t.palette.action.disabledOpacity);
    var backgroundOverlay = t.palette.mode === 'dark'
        ? "color-mix(in srgb, ".concat((t.vars || t).palette.background.paper, " 95%, #fff)")
        : (t.vars || t).palette.background.paper;
    var selectedColor = t.vars
        ? "rgb(".concat(t.vars.palette.primary.mainChannel, ")")
        : t.palette.primary.main;
    var radius = getRadius(t);
    var fontBody = (_g = (_f = (_e = t.vars) === null || _e === void 0 ? void 0 : _e.font) === null || _f === void 0 ? void 0 : _f.body2) !== null && _g !== void 0 ? _g : formatFont(t.typography.body2);
    var fontSmall = (_k = (_j = (_h = t.vars) === null || _h === void 0 ? void 0 : _h.font) === null || _j === void 0 ? void 0 : _j.caption) !== null && _k !== void 0 ? _k : formatFont(t.typography.caption);
    var fontLarge = (_o = (_m = (_l = t.vars) === null || _l === void 0 ? void 0 : _l.font) === null || _m === void 0 ? void 0 : _m.body1) !== null && _o !== void 0 ? _o : formatFont(t.typography.body1);
    var k = cssVariables_1.vars.keys;
    return _a = {},
        _a[k.spacingUnit] = t.vars ? ((_p = t.vars.spacing) !== null && _p !== void 0 ? _p : t.spacing(1)) : t.spacing(1),
        _a[k.colors.border.base] = borderColor,
        _a[k.colors.background.base] = backgroundBase,
        _a[k.colors.background.overlay] = backgroundOverlay,
        _a[k.colors.background.backdrop] = backgroundBackdrop,
        _a[k.colors.foreground.base] = (t.vars || t).palette.text.primary,
        _a[k.colors.foreground.muted] = (t.vars || t).palette.text.secondary,
        _a[k.colors.foreground.accent] = (t.vars || t).palette.primary.dark,
        _a[k.colors.foreground.disabled] = (t.vars || t).palette.text.disabled,
        _a[k.colors.foreground.error] = (t.vars || t).palette.error.dark,
        _a[k.colors.interactive.hover] = (t.vars || t).palette.action.hover,
        _a[k.colors.interactive.hoverOpacity] = (t.vars || t).palette.action.hoverOpacity,
        _a[k.colors.interactive.focus] = removeOpacity((t.vars || t).palette.primary.main),
        _a[k.colors.interactive.focusOpacity] = (t.vars || t).palette.action.focusOpacity,
        _a[k.colors.interactive.disabled] = removeOpacity((t.vars || t).palette.action.disabled),
        _a[k.colors.interactive.disabledOpacity] = (t.vars || t).palette.action.disabledOpacity,
        _a[k.colors.interactive.selected] = selectedColor,
        _a[k.colors.interactive.selectedOpacity] = (t.vars || t).palette.action.selectedOpacity,
        _a[k.header.background.base] = backgroundHeader,
        _a[k.cell.background.pinned] = backgroundPinned,
        _a[k.radius.base] = radius,
        _a[k.typography.fontFamily.base] = t.typography.fontFamily,
        _a[k.typography.fontWeight.light] = t.typography.fontWeightLight,
        _a[k.typography.fontWeight.regular] = t.typography.fontWeightRegular,
        _a[k.typography.fontWeight.medium] = t.typography.fontWeightMedium,
        _a[k.typography.fontWeight.bold] = t.typography.fontWeightBold,
        _a[k.typography.font.body] = fontBody,
        _a[k.typography.font.small] = fontSmall,
        _a[k.typography.font.large] = fontLarge,
        _a[k.transitions.easing.easeIn] = t.transitions.easing.easeIn,
        _a[k.transitions.easing.easeOut] = t.transitions.easing.easeOut,
        _a[k.transitions.easing.easeInOut] = t.transitions.easing.easeInOut,
        _a[k.transitions.duration.short] = "".concat(t.transitions.duration.shorter, "ms"),
        _a[k.transitions.duration.base] = "".concat(t.transitions.duration.short, "ms"),
        _a[k.transitions.duration.long] = "".concat(t.transitions.duration.standard, "ms"),
        _a[k.shadows.base] = (t.vars || t).shadows[2],
        _a[k.shadows.overlay] = (t.vars || t).shadows[8],
        _a[k.zIndex.panel] = (t.vars || t).zIndex.modal,
        _a[k.zIndex.menu] = (t.vars || t).zIndex.modal,
        _a;
}
function getRadius(theme) {
    if (theme.vars) {
        return theme.vars.shape.borderRadius;
    }
    return typeof theme.shape.borderRadius === 'number'
        ? "".concat(theme.shape.borderRadius, "px")
        : theme.shape.borderRadius;
}
function getBorderColor(theme) {
    if (theme.vars) {
        return theme.vars.palette.TableCell.border;
    }
    if (theme.palette.mode === 'light') {
        return (0, styles_1.lighten)((0, styles_1.alpha)(theme.palette.divider, 1), 0.88);
    }
    return (0, styles_1.darken)((0, styles_1.alpha)(theme.palette.divider, 1), 0.68);
}
function setOpacity(color, opacity) {
    return "rgba(from ".concat(color, " r g b / ").concat(opacity, ")");
}
function removeOpacity(color) {
    return setOpacity(color, 1);
}
function formatFont(font) {
    // Accounts for disabled typography variants
    // See: https://github.com/mui/mui-x/issues/17812
    if (!font) {
        return undefined;
    }
    return "".concat(font.fontWeight, " ").concat(font.fontSize, " / ").concat(font.lineHeight, " ").concat(font.fontFamily);
}
