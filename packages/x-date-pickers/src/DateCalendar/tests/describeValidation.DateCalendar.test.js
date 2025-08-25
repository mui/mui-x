"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var pickers_1 = require("test/utils/pickers");
describe('<DateCalendar /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValidation)(DateCalendar_1.DateCalendar, function () { return ({
        render: render,
        views: ['year', 'month', 'day'],
        componentFamily: 'calendar',
    }); });
});
