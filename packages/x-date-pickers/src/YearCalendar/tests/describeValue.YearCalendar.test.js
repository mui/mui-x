"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var YearCalendar_1 = require("@mui/x-date-pickers/YearCalendar");
var pickers_1 = require("test/utils/pickers");
describe('<YearCalendar /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(YearCalendar_1.YearCalendar, function () { return ({
        render: render,
        componentFamily: 'calendar',
        values: [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-01')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var activeYear = internal_test_utils_1.screen
                .queryAllByRole('radio')
                .find(function (cell) { return cell.getAttribute('aria-checked') === 'true'; });
            if (expectedValue == null) {
                expect(activeYear).to.equal(undefined);
            }
            else {
                expect(activeYear).not.to.equal(undefined);
                expect(activeYear).to.have.text(pickers_1.adapterToUse.getYear(expectedValue).toString());
            }
        },
        setNewValue: function (value) {
            var newValue = pickers_1.adapterToUse.addYears(value, 1);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('radio', { name: pickers_1.adapterToUse.getYear(newValue).toString() }));
            return newValue;
        },
    }); });
});
