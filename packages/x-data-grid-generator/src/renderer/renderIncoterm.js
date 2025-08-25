"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderIncoterm = renderIncoterm;
var React = require("react");
var Tooltip_1 = require("@mui/material/Tooltip");
var Box_1 = require("@mui/material/Box");
var Info_1 = require("@mui/icons-material/Info");
var Incoterm = React.memo(function Incoterm(props) {
    var value = props.value;
    if (!value) {
        return null;
    }
    var valueStr = value.toString();
    var tooltip = valueStr.slice(valueStr.indexOf('(') + 1, valueStr.indexOf(')'));
    var code = valueStr.slice(0, valueStr.indexOf('(')).trim();
    return (<Box_1.default sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{code}</span>
      <Tooltip_1.default title={tooltip}>
        <Info_1.default sx={{ color: '#2196f3', alignSelf: 'center', ml: '8px' }}/>
      </Tooltip_1.default>
    </Box_1.default>);
});
function renderIncoterm(params) {
    return <Incoterm value={params.value}/>;
}
