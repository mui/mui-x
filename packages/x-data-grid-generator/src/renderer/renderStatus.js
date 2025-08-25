"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderStatus = renderStatus;
var React = require("react");
var ReportProblem_1 = require("@mui/icons-material/ReportProblem");
var Info_1 = require("@mui/icons-material/Info");
var Autorenew_1 = require("@mui/icons-material/Autorenew");
var Done_1 = require("@mui/icons-material/Done");
var Chip_1 = require("@mui/material/Chip");
var styles_1 = require("@mui/material/styles");
var StyledChip = (0, styles_1.styled)(Chip_1.default)(function (_a) {
    var theme = _a.theme;
    return ({
        justifyContent: 'left',
        '& .icon': {
            color: 'inherit',
        },
        '&.Open': {
            color: (theme.vars || theme).palette.info.dark,
            border: "1px solid ".concat((theme.vars || theme).palette.info.main),
        },
        '&.Filled': {
            color: (theme.vars || theme).palette.success.dark,
            border: "1px solid ".concat((theme.vars || theme).palette.success.main),
        },
        '&.PartiallyFilled': {
            color: (theme.vars || theme).palette.warning.dark,
            border: "1px solid ".concat((theme.vars || theme).palette.warning.main),
        },
        '&.Rejected': {
            color: (theme.vars || theme).palette.error.dark,
            border: "1px solid ".concat((theme.vars || theme).palette.error.main),
        },
    });
});
var Status = React.memo(function (props) {
    var status = props.status;
    var icon = null;
    if (status === 'Rejected') {
        icon = <ReportProblem_1.default className="icon"/>;
    }
    else if (status === 'Open') {
        icon = <Info_1.default className="icon"/>;
    }
    else if (status === 'PartiallyFilled') {
        icon = <Autorenew_1.default className="icon"/>;
    }
    else if (status === 'Filled') {
        icon = <Done_1.default className="icon"/>;
    }
    var label = status;
    if (status === 'PartiallyFilled') {
        label = 'Partially Filled';
    }
    return (<StyledChip className={status} icon={icon} size="small" label={label} variant="outlined"/>);
});
function renderStatus(params) {
    if (params.value == null) {
        return '';
    }
    return <Status status={params.value}/>;
}
