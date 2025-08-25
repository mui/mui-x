"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderProgress = renderProgress;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var Center = (0, styles_1.styled)('div')({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
});
var Element = (0, styles_1.styled)('div')(function (_a) {
    var theme = _a.theme;
    return ({
        border: "1px solid ".concat((theme.vars || theme).palette.divider),
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 26,
        borderRadius: 2,
    });
});
var Value = (0, styles_1.styled)('div')({
    position: 'absolute',
    lineHeight: '24px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
});
var Bar = (0, styles_1.styled)('div')({
    height: '100%',
    '&.low': {
        backgroundColor: '#f44336',
    },
    '&.medium': {
        backgroundColor: '#efbb5aa3',
    },
    '&.high': {
        backgroundColor: '#088208a3',
    },
});
var ProgressBar = React.memo(function ProgressBar(props) {
    var value = props.value;
    var valueInPercent = value * 100;
    return (<Element>
      <Value>{"".concat(valueInPercent.toLocaleString(), " %")}</Value>
      <Bar className={(0, clsx_1.default)({
            low: valueInPercent < 30,
            medium: valueInPercent >= 30 && valueInPercent <= 70,
            high: valueInPercent > 70,
        })} style={{ maxWidth: "".concat(valueInPercent, "%") }}/>
    </Element>);
});
function renderProgress(params) {
    if (params.value == null) {
        return '';
    }
    // If the aggregated value does not have the same unit as the other cell
    // Then we fall back to the default rendering based on `valueGetter` instead of rendering a progress bar.
    if (params.aggregation && !params.aggregation.hasCellUnit) {
        return null;
    }
    return (<Center>
      <ProgressBar value={params.value}/>
    </Center>);
}
