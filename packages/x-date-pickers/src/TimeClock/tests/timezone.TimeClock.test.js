"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var TimeClock_1 = require("@mui/x-date-pickers/TimeClock");
var pickers_1 = require("test/utils/pickers");
var TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];
describe('<TimeClock /> - Timezone', function () {
    (0, pickers_1.describeAdapters)('Timezone prop', TimeClock_1.TimeClock, function (_a) {
        var adapter = _a.adapter, render = _a.render;
        describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', function () {
            it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', function () {
                var onChange = (0, sinon_1.spy)();
                render(<TimeClock_1.TimeClock onChange={onChange}/>);
                var hourClockEvent = (0, pickers_1.getClockTouchEvent)(8, '12hours');
                (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', hourClockEvent);
                (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', hourClockEvent);
                var expectedDate = adapter.setHours(adapter.date(), 8);
                // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
                var actualDate = onChange.lastCall.firstArg;
                // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
                // In a real world scenario, this should probably never occur.
                expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
                expect(actualDate).toEqualDateTime(expectedDate);
            });
            TIMEZONE_TO_TEST.forEach(function (timezone) {
                describe("Timezone: ".concat(timezone), function () {
                    it('should use timezone prop for onChange when no value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        render(<TimeClock_1.TimeClock onChange={onChange} timezone={timezone}/>);
                        var hourClockEvent = (0, pickers_1.getClockTouchEvent)(8, '12hours');
                        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', hourClockEvent);
                        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', hourClockEvent);
                        var expectedDate = adapter.setHours(adapter.startOfDay(adapter.date(undefined, timezone)), 8);
                        // Check the `onChange` value (uses timezone prop)
                        var actualDate = onChange.lastCall.firstArg;
                        expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' && timezone === 'system' ? 'UTC' : timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                    it('should use timezone prop for rendering and value timezone for onChange when a value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        var value = adapter.date('2022-04-17T04:30', timezone);
                        render(<TimeClock_1.TimeClock defaultValue={value} onChange={onChange} timezone="America/Chicago" views={['hours']}/>);
                        var renderedHourBefore = (0, pickers_1.getTimeClockValue)();
                        var offsetDiff = (0, pickers_1.getDateOffset)(adapter, adapter.setTimezone(value, 'America/Chicago')) -
                            (0, pickers_1.getDateOffset)(adapter, value);
                        expect(renderedHourBefore).to.equal((adapter.getHours(value) + offsetDiff / 60 + 12) % 12);
                        var hourClockEvent = (0, pickers_1.getClockTouchEvent)(8, '12hours');
                        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', hourClockEvent);
                        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', hourClockEvent);
                        var actualDate = onChange.lastCall.firstArg;
                        var renderedHourAfter = (0, pickers_1.getTimeClockValue)();
                        expect(renderedHourAfter).to.equal((adapter.getHours(actualDate) + offsetDiff / 60 + 12) % 12);
                        var expectedDate = adapter.addHours(value, renderedHourAfter - renderedHourBefore);
                        expect(adapter.getTimezone(actualDate)).to.equal(timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                });
            });
        });
    });
});
