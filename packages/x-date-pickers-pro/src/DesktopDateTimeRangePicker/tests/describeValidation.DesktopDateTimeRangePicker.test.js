"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimeRangePicker_1 = require("../DesktopDateTimeRangePicker");
describe('<DesktopDateTimeRangePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker, function () { return ({
        render: render,
        views: ['day', 'hours', 'minutes'],
        componentFamily: 'picker',
        variant: 'desktop',
        fieldType: 'single-input',
    }); });
});
