"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateField_1 = require("@mui/x-date-pickers/DateField");
var pickers_1 = require("test/utils/pickers");
describe('<DateField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(DateField_1.DateField, function () { return ({
        render: render,
        views: ['year', 'month', 'day'],
        componentFamily: 'field',
    }); });
});
