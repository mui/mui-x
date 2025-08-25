"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsTooltipZoomSliderValue = ChartsTooltipZoomSliderValue;
var React = require("react");
var NoSsr_1 = require("@mui/material/NoSsr");
var Popper_1 = require("@mui/material/Popper");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
/**
 * The root component of the zoom slider tooltip.
 * @ignore - internal component.
 */
var ChartsZoomSliderTooltipRoot = (0, styles_1.styled)(Popper_1.default, {
    name: 'MuiChartsZoomSliderTooltip',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        pointerEvents: 'none',
        zIndex: theme.zIndex.modal,
    });
});
var MODIFIERS = [
    {
        name: 'offset',
        options: { offset: [0, 4] },
    },
];
function ChartsTooltipZoomSliderValue(_a) {
    var anchorEl = _a.anchorEl, open = _a.open, placement = _a.placement, _b = _a.modifiers, modifiers = _b === void 0 ? MODIFIERS : _b, children = _a.children;
    return (<NoSsr_1.default>
      {open ? (<ChartsZoomSliderTooltipRoot open={open} anchorEl={anchorEl} placement={placement} modifiers={modifiers}>
          <ChartsTooltip_1.ChartsTooltipPaper sx={{ paddingX: 0.5 }}>
            <Typography_1.default variant="caption">{children}</Typography_1.default>
          </ChartsTooltip_1.ChartsTooltipPaper>
        </ChartsZoomSliderTooltipRoot>) : null}
    </NoSsr_1.default>);
}
