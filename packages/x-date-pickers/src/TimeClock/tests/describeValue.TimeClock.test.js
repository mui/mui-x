"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var TimeClock_1 = require("@mui/x-date-pickers/TimeClock");
var pickers_1 = require("test/utils/pickers");
describe('<TimeClock /> - Describe Value', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describeValue)(TimeClock_1.TimeClock, function () { return ({
        render: render,
        componentFamily: 'clock',
        values: [pickers_1.adapterToUse.date('2018-01-01T12:30:00'), pickers_1.adapterToUse.date('2018-01-01T13:35:00')],
        emptyValue: null,
        assertRenderedValue: function (expectedValue) {
            var _a, _b;
            var clockPointer = document.querySelector(".".concat(TimeClock_1.clockPointerClasses.root));
            if (expectedValue == null) {
                expect(clockPointer).to.equal(null);
            }
            else {
                var transform = (_a = clockPointer === null || clockPointer === void 0 ? void 0 : clockPointer.style) === null || _a === void 0 ? void 0 : _a.transform;
                var isMinutesView = (_b = internal_test_utils_1.screen
                    .getByRole('listbox')
                    .getAttribute('aria-label')) === null || _b === void 0 ? void 0 : _b.includes('minutes');
                if (isMinutesView) {
                    expect(transform).to.equal("rotateZ(".concat(pickers_1.adapterToUse.getMinutes(expectedValue) * 6, "deg)"));
                }
                else {
                    var hours = pickers_1.adapterToUse.getHours(expectedValue);
                    expect(transform).to.equal("rotateZ(".concat((hours > 12 ? hours % 12 : hours) * 30, "deg)"));
                }
            }
        },
        setNewValue: function (value) {
            var newValue = pickers_1.adapterToUse.addMinutes(pickers_1.adapterToUse.addHours(value, 1), 5);
            pickers_1.timeClockHandler.setViewValue(pickers_1.adapterToUse, newValue, 'hours');
            pickers_1.timeClockHandler.setViewValue(pickers_1.adapterToUse, newValue, 'minutes');
            return newValue;
        },
    }); });
});
