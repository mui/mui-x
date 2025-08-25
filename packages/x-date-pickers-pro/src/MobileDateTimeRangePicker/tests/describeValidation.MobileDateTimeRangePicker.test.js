"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MobileDateTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateTimeRangePicker");
describe('<MobileDateTimeRangePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(MobileDateTimeRangePicker_1.MobileDateTimeRangePicker, function () { return ({
        render: render,
        views: ['day', 'hours', 'minutes'],
        componentFamily: 'picker',
        variant: 'mobile',
        fieldType: 'single-input',
    }); });
});
