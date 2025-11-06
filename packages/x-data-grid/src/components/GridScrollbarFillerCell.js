"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridScrollbarFillerCell = GridScrollbarFillerCell;
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = require("clsx");
var constants_1 = require("../constants");
var classes = {
    root: constants_1.gridClasses.scrollbarFiller,
    pinnedRight: constants_1.gridClasses['scrollbarFiller--pinnedRight'],
};
function GridScrollbarFillerCell(_a) {
    var pinnedRight = _a.pinnedRight;
    return ((0, jsx_runtime_1.jsx)("div", { role: "presentation", className: (0, clsx_1.default)(classes.root, pinnedRight && classes.pinnedRight) }));
}
