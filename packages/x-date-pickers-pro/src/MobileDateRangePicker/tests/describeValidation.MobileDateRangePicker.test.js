"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MobileDateRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateRangePicker");
var pickers_1 = require("test/utils/pickers");
describe('<MobileDateRangePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(MobileDateRangePicker_1.MobileDateRangePicker, function () { return ({
        render: render,
        componentFamily: 'picker',
        views: ['day'],
        variant: 'mobile',
        fieldType: 'single-input',
    }); });
});
