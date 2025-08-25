"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiInputTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputTimeRangeField");
var pickers_1 = require("test/utils/pickers");
describe('<MultiInputTimeRangeField /> - Describe Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeRangeValidation)(MultiInputTimeRangeField_1.MultiInputTimeRangeField, function () { return ({
        render: render,
        componentFamily: 'field',
        views: ['hours', 'minutes'],
        fieldType: 'multi-input',
        setValue: function (value, _a) {
            var _b = _a === void 0 ? {} : _a, setEndDate = _b.setEndDate;
            (0, pickers_1.setValueOnFieldInput)(pickers_1.adapterToUse.format(value, pickers_1.adapterToUse.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h'), setEndDate ? 1 : 0);
        },
    }); });
});
