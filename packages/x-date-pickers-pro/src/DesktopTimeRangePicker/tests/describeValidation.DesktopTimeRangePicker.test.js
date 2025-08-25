"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopTimeRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopTimeRangePicker");
describe('<DesktopTimeRangePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(DesktopTimeRangePicker_1.DesktopTimeRangePicker, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'picker',
        variant: 'desktop',
        fieldType: 'single-input',
    }); });
});
