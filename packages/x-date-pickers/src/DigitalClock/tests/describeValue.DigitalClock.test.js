"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DigitalClock_1 = require("@mui/x-date-pickers/DigitalClock");
describe('<DigitalClock /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(DigitalClock_1.DigitalClock, function () { return ({
        render: render,
        componentFamily: 'digital-clock',
        type: 'time',
        defaultProps: {
            views: ['hours'],
        },
        values: [pickers_1.adapterToUse.date('2018-01-01T15:30:00'), pickers_1.adapterToUse.date('2018-01-01T17:00:00')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var selectedItem = internal_test_utils_1.screen.queryByRole('option', { selected: true });
            if (!expectedValue) {
                expect(selectedItem).to.equal(null);
            }
            else {
                expect(selectedItem).to.have.text((0, pickers_1.formatFullTimeValue)(pickers_1.adapterToUse, expectedValue));
            }
        },
        setNewValue: function (value) {
            var newValue = pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(value, 1), 30);
            pickers_1.digitalClockHandler.setViewValue(pickers_1.adapterToUse, newValue);
            return newValue;
        },
    }); });
});
