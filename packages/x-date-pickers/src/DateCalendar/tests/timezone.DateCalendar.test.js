"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];
describe('<DateCalendar /> - Timezone', function () {
    (0, pickers_1.describeAdapters)('Timezone prop', DateCalendar_1.DateCalendar, function (_a) {
        var adapter = _a.adapter, render = _a.render;
        describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', function () {
            it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', function () {
                var onChange = (0, sinon_1.spy)();
                render(<DateCalendar_1.DateCalendar onChange={onChange}/>);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '25' }));
                var expectedDate = adapter.setDate(adapter.date(undefined, 'default'), 25);
                // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
                var actualDate = onChange.lastCall.firstArg;
                // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
                // In a real world scenario, this should probably never occur.
                expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
                expect(actualDate).toEqualDateTime(expectedDate);
            });
            it('should use "default" timezone for onChange when provided', function () {
                var onChange = (0, sinon_1.spy)();
                var value = adapter.date('2022-04-25T15:30');
                render(<DateCalendar_1.DateCalendar value={value} onChange={onChange} timezone="default"/>);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '25' }));
                var expectedDate = adapter.setDate(value, 25);
                // Check the `onChange` value (uses timezone prop)
                var actualDate = onChange.lastCall.firstArg;
                expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
                expect(actualDate).toEqualDateTime(expectedDate);
            });
            it('should correctly render month days when timezone changes', function () {
                function DateCalendarWithControlledTimezone() {
                    var _a = React.useState('Europe/Paris'), timezone = _a[0], setTimezone = _a[1];
                    return (<React.Fragment>
              <DateCalendar_1.DateCalendar timezone={timezone}/>
              <button onClick={function () { return setTimezone('America/New_York'); }}>Switch timezone</button>
            </React.Fragment>);
                }
                render(<DateCalendarWithControlledTimezone />);
                expect(internal_test_utils_1.screen.getAllByRole('gridcell', {
                    name: function (_, element) { var _a; return ((_a = element.attributes.getNamedItem('data-testid')) === null || _a === void 0 ? void 0 : _a.value) === 'day'; },
                }).length).to.equal(30);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Switch timezone' }));
                // the amount of rendered days should remain the same after changing timezone
                expect(internal_test_utils_1.screen.getAllByRole('gridcell', {
                    name: function (_, element) { var _a; return ((_a = element.attributes.getNamedItem('data-testid')) === null || _a === void 0 ? void 0 : _a.value) === 'day'; },
                }).length).to.equal(30);
            });
            // See https://github.com/mui/mui-x/issues/14730
            it('should not render duplicate days when leaving DST in America/Asuncion', function () {
                render(<DateCalendar_1.DateCalendar timezone="America/Asuncion" value={adapter.date('2024-10-10')}/>);
                expect(internal_test_utils_1.screen.getAllByRole('gridcell', { name: '5' })).to.have.length(1);
            });
            TIMEZONE_TO_TEST.forEach(function (timezone) {
                describe("Timezone: ".concat(timezone), function () {
                    it('should use timezone prop for onChange when no value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        render(<DateCalendar_1.DateCalendar onChange={onChange} timezone={timezone}/>);
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '25' }));
                        var expectedDate = adapter.setDate(adapter.startOfDay(adapter.date(undefined, timezone)), 25);
                        // Check the `onChange` value (uses timezone prop)
                        var actualDate = onChange.lastCall.firstArg;
                        expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' && timezone === 'system' ? 'UTC' : timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                    it('should use value timezone for onChange when a value is provided', function () {
                        var onChange = (0, sinon_1.spy)();
                        var value = adapter.date('2022-04-25T15:30', timezone);
                        render(<DateCalendar_1.DateCalendar value={value} onChange={onChange} timezone="America/Chicago"/>);
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '25' }));
                        var expectedDate = adapter.setDate(value, 25);
                        // Check the `onChange` value (uses timezone prop)
                        var actualDate = onChange.lastCall.firstArg;
                        expect(adapter.getTimezone(actualDate)).to.equal(timezone);
                        expect(actualDate).toEqualDateTime(expectedDate);
                    });
                });
            });
        });
    });
});
