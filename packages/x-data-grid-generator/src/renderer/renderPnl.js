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
exports.renderPnl = renderPnl;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var Value = (0, styles_1.styled)('div')(function (_a) {
    var theme = _a.theme;
    return ({
        width: '100%',
        fontVariantNumeric: 'tabular-nums',
        '&.positive': __assign({ color: theme.palette.success.light }, theme.applyStyles('light', {
            color: theme.palette.success.dark,
        })),
        '&.negative': __assign({ color: theme.palette.error.light }, theme.applyStyles('light', {
            color: theme.palette.error.dark,
        })),
    });
});
function pnlFormatter(value) {
    return value < 0 ? "(".concat(Math.abs(value).toLocaleString(), ")") : value.toLocaleString();
}
var Pnl = React.memo(function Pnl(props) {
    var value = props.value;
    return (<Value className={(0, clsx_1.default)({
            positive: value > 0,
            negative: value < 0,
        })}>
      {pnlFormatter(value)}
    </Value>);
});
function renderPnl(params) {
    if (params.value == null) {
        return '';
    }
    return <Pnl value={params.value}/>;
}
