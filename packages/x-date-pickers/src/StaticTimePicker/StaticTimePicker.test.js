"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var StaticTimePicker_1 = require("@mui/x-date-pickers/StaticTimePicker");
var describeConformance_1 = require("test/utils/describeConformance");
var skipIf_1 = require("test/utils/skipIf");
describe('<StaticTimePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)({
        clockConfig: new Date(2018, 2, 12, 8, 16, 0),
    }).render;
    (0, pickers_1.describeValidation)(StaticTimePicker_1.StaticTimePicker, function () { return ({
        render: render,
        views: ['hours', 'minutes'],
        componentFamily: 'static-picker',
    }); });
    (0, describeConformance_1.describeConformance)(<StaticTimePicker_1.StaticTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiStaticTimePicker',
        refInstanceof: window.HTMLDivElement,
        skip: [
            'componentProp',
            'componentsProp',
            'themeDefaultProps',
            'themeStyleOverrides',
            'themeVariants',
            'mergeClassName',
            'propsSpread',
        ],
    }); });
    it.skipIf(!skipIf_1.hasTouchSupport)('should allow view modification, but not update value when `readOnly` prop is passed', function () {
        var selectEvent = {
            changedTouches: [
                {
                    clientX: 150,
                    clientY: 60,
                },
            ],
        };
        var onChange = (0, sinon_1.spy)();
        var onViewChange = (0, sinon_1.spy)();
        render(<StaticTimePicker_1.StaticTimePicker value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChange} onViewChange={onViewChange} readOnly/>);
        // Can switch between views
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByTestId('minutes'));
        expect(onViewChange.callCount).to.equal(1);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByTestId('hours'));
        expect(onViewChange.callCount).to.equal(2);
        // Can not switch between meridiem
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /AM/i }));
        expect(onChange.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /PM/i }));
        expect(onChange.callCount).to.equal(0);
        // Can not set value
        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', selectEvent);
        expect(onChange.callCount).to.equal(0);
        // hours are not disabled
        var hoursContainer = internal_test_utils_1.screen.getByRole('listbox');
        var hours = (0, internal_test_utils_1.within)(hoursContainer).getAllByRole('option');
        var disabledHours = hours.filter(function (day) { return day.getAttribute('aria-disabled') === 'true'; });
        expect(hours.length).to.equal(12);
        expect(disabledHours.length).to.equal(0);
    });
    it.skipIf(!skipIf_1.hasTouchSupport)('should allow switching between views and display disabled options when `disabled` prop is passed', function () {
        var selectEvent = {
            changedTouches: [
                {
                    clientX: 150,
                    clientY: 60,
                },
            ],
        };
        var onChange = (0, sinon_1.spy)();
        var onViewChange = (0, sinon_1.spy)();
        render(<StaticTimePicker_1.StaticTimePicker value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChange} onViewChange={onViewChange} disabled/>);
        // Can switch between views
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByTestId('minutes'));
        expect(onViewChange.callCount).to.equal(1);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByTestId('hours'));
        expect(onViewChange.callCount).to.equal(2);
        // Can not switch between meridiem
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /AM/i }));
        expect(onChange.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /PM/i }));
        expect(onChange.callCount).to.equal(0);
        // Can not set value
        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', selectEvent);
        expect(onChange.callCount).to.equal(0);
        // hours are disabled
        var hoursContainer = internal_test_utils_1.screen.getByRole('listbox');
        var hours = (0, internal_test_utils_1.within)(hoursContainer).getAllByRole('option');
        var disabledHours = hours.filter(function (hour) { return hour.getAttribute('aria-disabled') === 'true'; });
        expect(hours.length).to.equal(12);
        expect(disabledHours.length).to.equal(12);
        // meridiem are disabled
        expect(internal_test_utils_1.screen.getByRole('button', { name: /AM/i })).to.have.attribute('disabled');
        expect(internal_test_utils_1.screen.getByRole('button', { name: /PM/i })).to.have.attribute('disabled');
    });
});
