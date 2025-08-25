"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMenuItem = BaseMenuItem;
var React = require("react");
var MenuItem_1 = require("@mui/material/MenuItem");
var ListItemIcon_1 = require("@mui/material/ListItemIcon");
var ListItemText_1 = require("@mui/material/ListItemText");
function BaseMenuItem(props) {
    var inert = props.inert, iconStart = props.iconStart, iconEnd = props.iconEnd, children = props.children, other = __rest(props, ["inert", "iconStart", "iconEnd", "children"]);
    return (<MenuItem_1.default {...other} disableRipple={inert ? true : other.disableRipple}>
      {iconStart && <ListItemIcon_1.default key="1">{iconStart}</ListItemIcon_1.default>}
      <ListItemText_1.default key="2">{children}</ListItemText_1.default>
      {iconEnd && <ListItemIcon_1.default key="3">{iconEnd}</ListItemIcon_1.default>}
    </MenuItem_1.default>);
}
