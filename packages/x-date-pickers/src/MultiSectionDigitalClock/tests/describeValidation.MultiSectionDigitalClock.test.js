"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MultiSectionDigitalClock_1 = require("@mui/x-date-pickers/MultiSectionDigitalClock");
describe('<MultiSectionDigitalClock /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(MultiSectionDigitalClock_1.MultiSectionDigitalClock, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'multi-section-digital-clock',
    }); });
});
