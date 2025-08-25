"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapTooltipAxesValue = void 0;
var styles_1 = require("@mui/material/styles");
/**
 * @ignore - internal component.
 */
exports.HeatmapTooltipAxesValue = (0, styles_1.styled)('caption', {
    name: 'MuiChartsHeatmapTooltip',
    slot: 'AxesValue',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            textAlign: 'start',
            whiteSpace: 'nowrap',
            padding: theme.spacing(0.5, 1.5),
            color: (theme.vars || theme).palette.text.secondary,
            borderBottom: "solid ".concat((theme.vars || theme).palette.divider, " 1px")
        },
        _b["& span"] = {
            marginRight: theme.spacing(1.5),
        },
        _b);
});
