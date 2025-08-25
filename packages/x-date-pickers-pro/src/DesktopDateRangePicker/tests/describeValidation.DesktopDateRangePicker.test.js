"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopDateRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopDateRangePicker");
describe('<DesktopDateRangePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(DesktopDateRangePicker_1.DesktopDateRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        views: ['day'],
        variant: 'desktop',
        fieldType: 'single-input',
    }); });
});
