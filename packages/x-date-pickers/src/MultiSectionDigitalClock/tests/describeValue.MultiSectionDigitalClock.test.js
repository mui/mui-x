"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MultiSectionDigitalClock_1 = require("@mui/x-date-pickers/MultiSectionDigitalClock");
var internals_1 = require("@mui/x-date-pickers/internals");
describe('<MultiSectionDigitalClock /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(MultiSectionDigitalClock_1.MultiSectionDigitalClock, function () { return ({
        render: render,
        componentFamily: 'multi-section-digital-clock',
        type: 'time',
        values: [pickers_1.adapterToUse.date('2018-01-01T11:30:00'), pickers_1.adapterToUse.date('2018-01-01T12:35:00')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var hasMeridiem = pickers_1.adapterToUse.is12HourCycleInCurrentLocale();
            var selectedItems = internal_test_utils_1.screen.queryAllByRole('option', { selected: true });
            if (!expectedValue) {
                expect(selectedItems).to.have.length(0);
            }
            else {
                var hoursLabel = pickers_1.adapterToUse.format(expectedValue, hasMeridiem ? 'hours12h' : 'hours24h');
                var minutesLabel = pickers_1.adapterToUse.getMinutes(expectedValue).toString();
                expect(selectedItems[0]).to.have.text(hoursLabel);
                expect(selectedItems[1]).to.have.text(minutesLabel);
                if (hasMeridiem) {
                    expect(selectedItems[2]).to.have.text((0, internals_1.formatMeridiem)(pickers_1.adapterToUse, pickers_1.adapterToUse.getHours(expectedValue) >= 12 ? 'pm' : 'am'));
                }
            }
        },
        setNewValue: function (value) {
            var newValue = pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(value, 1), 5);
            pickers_1.multiSectionDigitalClockHandler.setViewValue(pickers_1.adapterToUse, newValue);
            return newValue;
        },
    }); });
});
