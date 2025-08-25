"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MobileTimePicker_1 = require("@mui/x-date-pickers/MobileTimePicker");
describe('<MobileTimePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(MobileTimePicker_1.MobileTimePicker, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'picker',
    }); });
});
