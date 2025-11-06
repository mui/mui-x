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
exports.GridBottomContainer = GridBottomContainer;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var gridClasses_1 = require("../../constants/gridClasses");
var useUtilityClasses = function () {
    var slots = {
        root: ['bottomContainer'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, {});
};
var Element = (0, system_1.styled)('div')({
    position: 'sticky',
    zIndex: 40,
    bottom: 'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
});
function GridBottomContainer(props) {
    var classes = useUtilityClasses();
    return ((0, jsx_runtime_1.jsx)(Element, __assign({}, props, { className: (0, clsx_1.default)(classes.root, gridClasses_1.gridClasses['container--bottom']), role: "presentation" })));
}
