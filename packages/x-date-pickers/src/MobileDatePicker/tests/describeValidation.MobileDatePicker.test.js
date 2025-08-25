"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MobileDatePicker_1 = require("@mui/x-date-pickers/MobileDatePicker");
describe('<MobileDatePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(MobileDatePicker_1.MobileDatePicker, function () { return ({
        render: render,
        views: ['year', 'month', 'day'],
        componentFamily: 'picker',
    }); });
});
