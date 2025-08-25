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
exports.defaultSlotsMaterial = void 0;
var Tooltip_1 = require("@mui/material/Tooltip");
var MenuList_1 = require("@mui/material/MenuList");
var Divider_1 = require("@mui/material/Divider");
var internals_1 = require("@mui/x-charts/internals");
var BaseMenuItem_1 = require("./components/BaseMenuItem");
var BasePopper_1 = require("./components/BasePopper");
var icons_1 = require("./icons");
var baseSlots = {
    baseTooltip: Tooltip_1.default,
    basePopper: BasePopper_1.BasePopper,
    baseMenuList: MenuList_1.default,
    baseMenuItem: BaseMenuItem_1.BaseMenuItem,
    baseDivider: Divider_1.default,
};
var iconSlots = {
    zoomInIcon: icons_1.ChartsZoomInIcon,
    zoomOutIcon: icons_1.ChartsZoomOutIcon,
    exportIcon: icons_1.ChartsExportIcon,
};
exports.defaultSlotsMaterial = __assign(__assign(__assign({}, internals_1.defaultSlotsMaterial), baseSlots), iconSlots);
