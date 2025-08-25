"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopDatePicker_1 = require("@mui/x-date-pickers/DesktopDatePicker");
describe('<DesktopDatePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(DesktopDatePicker_1.DesktopDatePicker, { render: render, fieldType: 'single-input', variant: 'desktop' });
    (0, pickers_1.describeValidation)(DesktopDatePicker_1.DesktopDatePicker, function () { return ({
        render: render,
        views: ['year', 'month', 'day'],
        componentFamily: 'picker',
    }); });
});
