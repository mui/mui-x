"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MonthCalendar_1 = require("@mui/x-date-pickers/MonthCalendar");
describe('<MonthCalendar /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MonthCalendar_1.MonthCalendar, function () { return ({
        render: render,
        componentFamily: 'calendar',
        values: [pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-02-01')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var activeMonth = internal_test_utils_1.screen
                .queryAllByRole('radio')
                .find(function (cell) { return cell.getAttribute('tabindex') === '0'; });
            expect(activeMonth).not.to.equal(null);
            if (expectedValue == null) {
                expect(activeMonth).to.have.attribute('aria-checked', 'false');
            }
            else {
                expect(activeMonth).to.have.text(pickers_1.adapterToUse.format(expectedValue, 'monthShort').toString());
                expect(activeMonth).to.have.attribute('aria-checked', 'true');
            }
        },
        setNewValue: function (value) {
            var newValue = pickers_1.adapterToUse.addMonths(value, 1);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('radio', { name: pickers_1.adapterToUse.format(newValue, 'month') }));
            return newValue;
        },
    }); });
});
