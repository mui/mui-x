"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DigitalClock_1 = require("@mui/x-date-pickers/DigitalClock");
describe('<DigitalClock /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(DigitalClock_1.DigitalClock, function () { return ({
        render: render,
        views: ['hours'],
        componentFamily: 'digital-clock',
    }); });
});
