"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileTimePicker_1 = require("@mui/x-date-pickers/MobileTimePicker");
describe('<MobileTimePicker /> - Timezone', function () {
    (0, pickers_1.describeAdapters)('Timezone prop', MobileTimePicker_1.MobileTimePicker, function (_a) {
        var adapter = _a.adapter, render = _a.render;
        describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', function () {
            it('should use the timezone prop for the value displayed in the toolbar', function () {
                render(<MobileTimePicker_1.MobileTimePicker timezone="America/New_York" value={adapter.date('2022-04-17T15:30', 'default')} open/>);
                expect(internal_test_utils_1.screen.getByTestId('hours')).to.have.text('11');
            });
            it('should use the updated timezone prop for the value displayed in the toolbar', function () {
                var setProps = render(<MobileTimePicker_1.MobileTimePicker timezone="default" defaultValue={adapter.date('2022-04-17T15:30')} open/>).setProps;
                expect(internal_test_utils_1.screen.getByTestId('hours')).to.have.text('03');
                setProps({ timezone: 'America/New_York' });
                expect(internal_test_utils_1.screen.getByTestId('hours')).to.have.text('11');
            });
        });
    });
});
