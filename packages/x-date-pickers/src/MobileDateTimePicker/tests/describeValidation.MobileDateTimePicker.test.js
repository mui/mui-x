"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MobileDateTimePicker_1 = require("@mui/x-date-pickers/MobileDateTimePicker");
describe('<MobileDateTimePicker /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(MobileDateTimePicker_1.MobileDateTimePicker, function () { return ({
        render: render,
        views: ['year', 'day', 'hours', 'minutes'],
        componentFamily: 'picker',
    }); });
});
