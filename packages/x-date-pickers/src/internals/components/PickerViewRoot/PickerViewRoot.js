"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerViewRoot = void 0;
var styles_1 = require("@mui/material/styles");
var dimensions_1 = require("../../constants/dimensions");
exports.PickerViewRoot = (0, styles_1.styled)('div')({
    overflow: 'hidden',
    width: dimensions_1.DIALOG_WIDTH,
    maxHeight: dimensions_1.VIEW_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
});
