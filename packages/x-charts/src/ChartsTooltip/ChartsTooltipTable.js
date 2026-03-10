"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsTooltipCell = exports.ChartsTooltipRow = exports.ChartsTooltipTable = exports.ChartsTooltipPaper = void 0;
var styles_1 = require("@mui/material/styles");
var Typography_1 = require("@mui/material/Typography");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
/**
 * @ignore - internal component.
 */
exports.ChartsTooltipPaper = (0, styles_1.styled)('div', {
    name: 'MuiChartsTooltip',
    slot: 'Container',
    overridesResolver: function (props, styles) { return styles.paper; }, // FIXME: Inconsistent naming with slot
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return ({
        backgroundColor: (theme.vars || theme).palette.background.paper,
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (_b = (theme.vars || theme).shape) === null || _b === void 0 ? void 0 : _b.borderRadius,
        border: "solid ".concat((theme.vars || theme).palette.divider, " 1px"),
    });
});
/**
 * @ignore - internal component.
 */
exports.ChartsTooltipTable = (0, styles_1.styled)('table', {
    name: 'MuiChartsTooltip',
    slot: 'Table',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            borderSpacing: 0
        },
        _b["& .".concat(chartsTooltipClasses_1.chartsTooltipClasses.markContainer)] = {
            display: 'inline-block',
            width: "calc(20px + ".concat(theme.spacing(1.5), ")"),
            verticalAlign: 'middle',
        },
        _b['& caption'] = {
            borderBottom: "solid ".concat((theme.vars || theme).palette.divider, " 1px"),
            padding: theme.spacing(0.5, 1.5),
            textAlign: 'start',
            whiteSpace: 'nowrap',
            '& span': {
                marginRight: theme.spacing(1.5),
            },
        },
        _b);
});
/**
 * @ignore - internal component.
 */
exports.ChartsTooltipRow = (0, styles_1.styled)('tr', {
    name: 'MuiChartsTooltip',
    slot: 'Row',
})(function (_a) {
    var theme = _a.theme;
    return ({
        'tr:first-of-type& td': {
            paddingTop: theme.spacing(0.5),
        },
        'tr:last-of-type& td': {
            paddingBottom: theme.spacing(0.5),
        },
    });
});
/**
 * @ignore - internal component.
 */
exports.ChartsTooltipCell = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiChartsTooltip',
    slot: 'Cell',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            verticalAlign: 'middle',
            color: (theme.vars || theme).palette.text.secondary,
            textAlign: 'start'
        },
        _b["&.".concat(chartsTooltipClasses_1.chartsTooltipClasses.cell)] = {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        _b["&.".concat(chartsTooltipClasses_1.chartsTooltipClasses.labelCell)] = {
            whiteSpace: 'nowrap',
            fontWeight: theme.typography.fontWeightRegular,
        },
        _b["&.".concat(chartsTooltipClasses_1.chartsTooltipClasses.valueCell, ", &.").concat(chartsTooltipClasses_1.chartsTooltipClasses.axisValueCell)] = {
            color: (theme.vars || theme).palette.text.primary,
            fontWeight: theme.typography.fontWeightMedium,
        },
        _b["&.".concat(chartsTooltipClasses_1.chartsTooltipClasses.valueCell)] = {
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
        },
        _b['td:first-of-type&, th:first-of-type&'] = {
            paddingLeft: theme.spacing(1.5),
        },
        _b['td:last-of-type&, th:last-of-type&'] = {
            paddingRight: theme.spacing(1.5),
        },
        _b);
});
