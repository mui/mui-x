"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimePicker_1 = require("@mui/x-date-pickers/DesktopDateTimePicker");
describe('<DesktopDateTimePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(DesktopDateTimePicker_1.DesktopDateTimePicker, function () { return ({
        render: render,
        views: ['year', 'month', 'day', 'hours', 'minutes'],
        componentFamily: 'picker',
    }); });
});
