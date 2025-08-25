"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var PickersDay_1 = require("@mui/x-date-pickers/PickersDay");
var pickers_1 = require("test/utils/pickers");
describe('<DateCalendar /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DateCalendar_1.DateCalendar, function () { return ({
        render: render,
        componentFamily: 'calendar',
        values: [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-02')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var selectedCells = document.querySelectorAll(".".concat(PickersDay_1.pickersDayClasses.selected));
            if (expectedValue == null) {
                expect(selectedCells).to.have.length(0);
            }
            else {
                expect(selectedCells).to.have.length(1);
                expect(selectedCells[0]).to.have.text(pickers_1.adapterToUse.getDate(expectedValue).toString());
            }
        },
        setNewValue: function (value) {
            var newValue = pickers_1.adapterToUse.addDays(value, 1);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.getDate(newValue).toString() }));
            return newValue;
        },
    }); });
});
