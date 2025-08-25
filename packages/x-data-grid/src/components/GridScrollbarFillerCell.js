"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridScrollbarFillerCell = GridScrollbarFillerCell;
var React = require("react");
var clsx_1 = require("clsx");
var constants_1 = require("../constants");
var classes = {
    root: constants_1.gridClasses.scrollbarFiller,
    header: constants_1.gridClasses['scrollbarFiller--header'],
    borderTop: constants_1.gridClasses['scrollbarFiller--borderTop'],
    borderBottom: constants_1.gridClasses['scrollbarFiller--borderBottom'],
    pinnedRight: constants_1.gridClasses['scrollbarFiller--pinnedRight'],
};
function GridScrollbarFillerCell(_a) {
    var header = _a.header, _b = _a.borderTop, borderTop = _b === void 0 ? true : _b, borderBottom = _a.borderBottom, pinnedRight = _a.pinnedRight;
    return (<div role="presentation" className={(0, clsx_1.default)(classes.root, header && classes.header, borderTop && classes.borderTop, borderBottom && classes.borderBottom, pinnedRight && classes.pinnedRight)}/>);
}
