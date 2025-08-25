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
exports.DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var GridPremiumColumnMenu_1 = require("../components/GridPremiumColumnMenu");
var material_1 = require("../material");
var GridBottomContainer_1 = require("../components/GridBottomContainer");
var GridEmptyPivotOverlay_1 = require("../components/GridEmptyPivotOverlay");
var GridPremiumToolbar_1 = require("../components/GridPremiumToolbar");
exports.DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS = __assign(__assign(__assign({}, internals_1.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS), material_1.default), { aiAssistantPanel: null, columnMenu: GridPremiumColumnMenu_1.GridPremiumColumnMenu, bottomContainer: GridBottomContainer_1.GridBottomContainer, emptyPivotOverlay: GridEmptyPivotOverlay_1.GridEmptyPivotOverlay, toolbar: GridPremiumToolbar_1.GridPremiumToolbar });
