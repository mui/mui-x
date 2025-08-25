"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MobileTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileTimeRangePicker");
describe('<MobileTimeRangePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(MobileTimeRangePicker_1.MobileTimeRangePicker, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'picker',
        variant: 'mobile',
        fieldType: 'single-input',
    }); });
});
