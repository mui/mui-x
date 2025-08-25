"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DateRangeCalendar_1 = require("./DateRangeCalendar");
describe('<DateRangeCalendar /> - Timezone', function () {
    (0, pickers_1.describeAdapters)('Timezone prop', DateRangeCalendar_1.DateRangeCalendar, function (_a) {
        var adapter = _a.adapter, render = _a.render;
        describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', function () {
            it('should correctly render month days when timezone changes', function () {
                function DateCalendarWithControlledTimezone() {
                    var _a = React.useState('Europe/Paris'), timezone = _a[0], setTimezone = _a[1];
                    return (<React.Fragment>
              <DateRangeCalendar_1.DateRangeCalendar timezone={timezone} calendars={1}/>
              <button onClick={function () { return setTimezone('America/New_York'); }}>Switch timezone</button>
            </React.Fragment>);
                }
                render(<DateCalendarWithControlledTimezone />);
                expect(internal_test_utils_1.screen.getAllByRole('gridcell', {
                    name: function (_, element) { var _a; return ((_a = element.attributes.getNamedItem('data-testid')) === null || _a === void 0 ? void 0 : _a.value) === 'DateRangePickerDay'; },
                }).length).to.equal(30);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Switch timezone' }));
                // the amount of rendered days should remain the same after changing timezone
                expect(internal_test_utils_1.screen.getAllByRole('gridcell', {
                    name: function (_, element) { var _a; return ((_a = element.attributes.getNamedItem('data-testid')) === null || _a === void 0 ? void 0 : _a.value) === 'DateRangePickerDay'; },
                }).length).to.equal(30);
            });
        });
    });
});
