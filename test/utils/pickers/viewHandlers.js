"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiSectionDigitalClockHandler = exports.digitalClockHandler = exports.timeClockHandler = void 0;
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var internals_1 = require("@mui/x-date-pickers/internals");
exports.timeClockHandler = {
    setViewValue: function (adapter, value, view) {
        var hasMeridiem = adapter.is12HourCycleInCurrentLocale();
        var valueInt;
        var clockView;
        if (view === 'hours') {
            valueInt = adapter.getHours(value);
            clockView = hasMeridiem ? '12hours' : '24hours';
        }
        else if (view === 'minutes') {
            valueInt = adapter.getMinutes(value);
            clockView = 'minutes';
        }
        else {
            throw new Error('View not supported');
        }
        var hourClockEvent = (0, pickers_1.getClockTouchEvent)(valueInt, clockView);
        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', hourClockEvent);
        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', hourClockEvent);
    },
};
exports.digitalClockHandler = {
    setViewValue: function (adapter, value) {
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: (0, pickers_1.formatFullTimeValue)(adapter, value) }));
    },
};
exports.multiSectionDigitalClockHandler = {
    setViewValue: function (adapter, value) {
        var hasMeridiem = adapter.is12HourCycleInCurrentLocale();
        var hoursLabel = parseInt(adapter.format(value, hasMeridiem ? 'hours12h' : 'hours24h'), 10);
        var minutesLabel = adapter.getMinutes(value).toString();
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(hoursLabel, " hours") }));
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: "".concat(minutesLabel, " minutes") }));
        if (hasMeridiem) {
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', {
                name: (0, internals_1.formatMeridiem)(adapter, adapter.getHours(value) >= 12 ? 'pm' : 'am'),
            }));
        }
    },
};
