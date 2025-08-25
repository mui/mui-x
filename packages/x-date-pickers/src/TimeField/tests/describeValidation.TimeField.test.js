"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var TimeField_1 = require("@mui/x-date-pickers/TimeField");
describe('<TimeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(TimeField_1.TimeField, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'field',
    }); });
});
