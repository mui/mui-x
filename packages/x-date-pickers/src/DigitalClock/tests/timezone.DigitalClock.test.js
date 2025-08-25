"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DigitalClock_1 = require("@mui/x-date-pickers/DigitalClock");
var pickers_1 = require("test/utils/pickers");
var TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];
var get24HourFromDigitalClock = function () {
    var results = /([0-9]+):([0-9]+) (AM|PM)/.exec(internal_test_utils_1.screen.queryByRole('option', { selected: true }).innerHTML);
    return Number(results[1]) + (results[3] === 'AM' ? 0 : 12);
};
describe('<DigitalClock /> - Timezone', function () {
    (0, pickers_1.describeAdapters)('Timezone prop', DigitalClock_1.DigitalClock, function (_a) {
        var adapter = _a.adapter, render = _a.render;
        describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', function () {
            it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', function () {
                var onChange = (0, sinon_1.spy)();
                render(<DigitalClock_1.DigitalClock onChange={onChange}/>);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: '08:00 AM' }));
                var expectedDate = adapter.setHours(adapter.date(), 8);
                // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
                var actualDate = onChange.lastCall.firstArg;
                // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
                // In a real world scenario, this should probably never occur.
                expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
                expect(actualDate).toEqualDateTime(expectedDate);
            });
            it('should render correct time options when fall back DST occurs', function () {
                render(<DigitalClock_1.DigitalClock referenceDate={adapter.date('2023-11-05T12:00:00', 'America/New_York')} timezone="America/New_York" timeStep={30}/>);
                var oneAM = adapter.setMinutes(adapter.setHours(adapter.date(undefined, 'default'), 1), 0);
                var elevenPM = adapter.setMinutes(adapter.setHours(adapter.date(undefined, 'default'), 23), 0);
                expect(internal_test_utils_1.screen.getAllByText(adapter.format(oneAM, adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h'))).to.have.length(adapter.lib === 'dayjs' ? 1 : 2);
                expect(internal_test_utils_1.screen.getAllByText(adapter.format(elevenPM, adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h'))).to.have.length(1);
            });
            it('should contain time options until the end of day when spring forward DST occurs', function () {
                render(<DigitalClock_1.DigitalClock referenceDate={adapter.date('2024-03-10T12:00:00', 'America/New_York')} timezone="America/New_York" timeStep={30}/>);
                var startOfDay = adapter.setMinutes(adapter.setHours(adapter.date(undefined, 'default'), 0), 0);
                var eleven30PM = adapter.setMinutes(adapter.setHours(adapter.date(undefined, 'default'), 23), 30);
                expect(internal_test_utils_1.screen.getAllByText(adapter.format(startOfDay, adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h'))).to.have.length(1);
                expect(internal_test_utils_1.screen.getAllByText(adapter.format(eleven30PM, adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h'))).to.have.length(1);
            });
            TIMEZONE_TO_TEST.forEach(function (timezone) {
                describe("Timezone: ".concat(timezone), function () {
                    it('should use timezone prop for onChange when no value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        render(<DigitalClock_1.DigitalClock onChange={onChange} timezone={timezone}/>);
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: '08:00 AM' }));
                        var expectedDate = adapter.setHours(adapter.startOfDay(adapter.date(undefined, timezone)), 8);
                        // Check the `onChange` value (uses timezone prop)
                        var actualDate = onChange.lastCall.firstArg;
                        expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' && timezone === 'system' ? 'UTC' : timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                    it('should use timezone prop for rendering and value timezone for onChange when a value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        var value = adapter.date('2022-04-17T04:30', timezone);
                        render(<DigitalClock_1.DigitalClock defaultValue={value} onChange={onChange} timezone="America/Chicago"/>);
                        var renderedHourBefore = get24HourFromDigitalClock();
                        var offsetDiff = (0, pickers_1.getDateOffset)(adapter, adapter.setTimezone(value, 'America/Chicago')) -
                            (0, pickers_1.getDateOffset)(adapter, value);
                        expect(renderedHourBefore).to.equal((adapter.getHours(value) + offsetDiff / 60 + 24) % 24);
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: '08:30 PM' }));
                        var actualDate = onChange.lastCall.firstArg;
                        var renderedHourAfter = get24HourFromDigitalClock();
                        expect(renderedHourAfter).to.equal((adapter.getHours(actualDate) + offsetDiff / 60 + 24) % 24);
                        var expectedDate = adapter.addHours(value, renderedHourAfter - renderedHourBefore);
                        expect(adapter.getTimezone(actualDate)).to.equal(timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                });
            });
        });
    });
});
