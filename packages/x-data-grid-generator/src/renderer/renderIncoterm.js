"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderIncoterm = renderIncoterm;
var jsx_runtime_1 = require("react/jsx-runtime");
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
    return ((0, jsx_runtime_1.jsxs)(Box_1.default, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: code }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { title: tooltip, children: (0, jsx_runtime_1.jsx)(Info_1.default, { sx: { color: '#2196f3', alignSelf: 'center', ml: '8px' } }) })] }));
});
function renderIncoterm(params) {
    return (0, jsx_runtime_1.jsx)(Incoterm, { value: params.value });
}
