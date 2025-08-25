"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAvatar = renderAvatar;
var React = require("react");
var Avatar_1 = require("@mui/material/Avatar");
function renderAvatar(params) {
    if (params.value == null) {
        return '';
    }
    return (<Avatar_1.default style={{ backgroundColor: params.value.color }}>
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar_1.default>);
}
