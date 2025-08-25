"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopTimePicker_1 = require("@mui/x-date-pickers/DesktopTimePicker");
describe('<DesktopTimePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(DesktopTimePicker_1.DesktopTimePicker, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'picker',
    }); });
});
