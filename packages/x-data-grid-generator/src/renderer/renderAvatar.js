"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAvatar = renderAvatar;
var jsx_runtime_1 = require("react/jsx-runtime");
var Avatar_1 = require("@mui/material/Avatar");
function renderAvatar(params) {
    if (params.value == null) {
        return '';
    }
    return ((0, jsx_runtime_1.jsx)(Avatar_1.default, { style: { backgroundColor: params.value.color }, children: params.value.name.toUpperCase().substring(0, 1) }));
}
