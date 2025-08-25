"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable material-ui/disallow-active-element-as-key-event-target */
var React = require("react");
var sinon_1 = require("sinon");
var DigitalClock_1 = require("@mui/x-date-pickers/DigitalClock");
var pickers_1 = require("test/utils/pickers");
var internal_test_utils_1 = require("@mui/internal-test-utils");
describe('<DigitalClock />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('Reference date', function () {
        it('should use `referenceDate` when no value defined', function () {
            var onChange = (0, sinon_1.spy)();
            var referenceDate = '2018-01-01T12:30:00';
            render(<DigitalClock_1.DigitalClock onChange={onChange} referenceDate={pickers_1.adapterToUse.date(referenceDate)}/>);
            // the first item should not be initially focusable when `referenceDate` is defined
            expect(internal_test_utils_1.screen.getByRole('option', {
                name: (0, pickers_1.formatFullTimeValue)(pickers_1.adapterToUse, pickers_1.adapterToUse.date('2018-01-01T00:00:00')),
            })).to.have.attribute('tabindex', '-1');
            // check that the relevant time based on the `referenceDate` is focusable
            expect(internal_test_utils_1.screen.getByRole('option', {
                name: (0, pickers_1.formatFullTimeValue)(pickers_1.adapterToUse, pickers_1.adapterToUse.date(referenceDate)),
            })).to.have.attribute('tabindex', '0');
            pickers_1.digitalClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setMinutes(pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 15), 30));
            expect(onChange.callCount).to.equal(1);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
        });
        it('should fallback to making the first entry focusable when `referenceDate` does not map to any option', function () {
            var referenceDate = '2018-01-01T12:33:00';
            render(<DigitalClock_1.DigitalClock referenceDate={pickers_1.adapterToUse.date(referenceDate)}/>);
            expect(internal_test_utils_1.screen.getByRole('option', {
                name: (0, pickers_1.formatFullTimeValue)(pickers_1.adapterToUse, new Date(2018, 0, 1, 0, 0, 0)),
            })).to.have.attribute('tabindex', '0');
        });
        it('should not use `referenceDate` when a value is defined', function () {
            var onChange = (0, sinon_1.spy)();
            render(<DigitalClock_1.DigitalClock onChange={onChange} value={pickers_1.adapterToUse.date('2019-01-01T12:30:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')}/>);
            pickers_1.digitalClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setMinutes(pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 15), 30));
            expect(onChange.callCount).to.equal(1);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
        });
        it('should not use `referenceDate` when a defaultValue is defined', function () {
            var onChange = (0, sinon_1.spy)();
            render(<DigitalClock_1.DigitalClock onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2019-01-01T12:30:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')}/>);
            pickers_1.digitalClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setMinutes(pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 15), 30));
            expect(onChange.callCount).to.equal(1);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
        });
    });
    describe('Keyboard support', function () {
        it('should move focus up by 5 on PageUp press', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<DigitalClock_1.DigitalClock autoFocus onChange={handleChange}/>);
            var options = internal_test_utils_1.screen.getAllByRole('option');
            var lastOptionIndex = options.length - 1;
            internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End' }); // moves focus to last element
            internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(options[lastOptionIndex - 5]);
            internal_test_utils_1.fireEvent.keyDown(options[lastOptionIndex - 5], { key: 'PageUp' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(options[lastOptionIndex - 10]);
        });
        it('should move focus to first item on PageUp press when current focused item index is among the first 5 items', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<DigitalClock_1.DigitalClock autoFocus onChange={handleChange}/>);
            var options = internal_test_utils_1.screen.getAllByRole('option');
            // moves focus to 4th element using arrow down
            [0, 1, 2].forEach(function (index) {
                internal_test_utils_1.fireEvent.keyDown(options[index], { key: 'ArrowDown' });
            });
            internal_test_utils_1.fireEvent.keyDown(options[3], { key: 'PageUp' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(options[0]);
        });
        it('should move focus down by 5 on PageDown press', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<DigitalClock_1.DigitalClock autoFocus onChange={handleChange}/>);
            var options = internal_test_utils_1.screen.getAllByRole('option');
            internal_test_utils_1.fireEvent.keyDown(options[0], { key: 'PageDown' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(options[5]);
            internal_test_utils_1.fireEvent.keyDown(options[5], { key: 'PageDown' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(options[10]);
        });
        it('should move focus to last item on PageDown press when current focused item index is among the last 5 items', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<DigitalClock_1.DigitalClock autoFocus onChange={handleChange}/>);
            var options = internal_test_utils_1.screen.getAllByRole('option');
            var lastOptionIndex = options.length - 1;
            var lastElement = options[lastOptionIndex];
            internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End' }); // moves focus to last element
            // moves focus 4 steps above last item using arrow up
            [0, 1, 2].forEach(function (index) {
                internal_test_utils_1.fireEvent.keyDown(options[lastOptionIndex - index], { key: 'ArrowUp' });
            });
            internal_test_utils_1.fireEvent.keyDown(options[lastOptionIndex - 3], { key: 'PageDown' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(lastElement);
        });
    });
    it('forwards list class to MenuList', function () {
        render(<DigitalClock_1.DigitalClock classes={{ list: 'foo' }}/>);
        expect(internal_test_utils_1.screen.getByRole('listbox')).to.have.class('foo');
    });
    it('forwards item class to clock item', function () {
        render(<DigitalClock_1.DigitalClock classes={{ item: 'bar' }}/>);
        var options = internal_test_utils_1.screen.getAllByRole('option');
        expect(options[0]).to.have.class('bar');
    });
});
