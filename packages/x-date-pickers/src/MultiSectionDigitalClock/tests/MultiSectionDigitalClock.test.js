"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable material-ui/disallow-active-element-as-key-event-target */
var React = require("react");
var sinon_1 = require("sinon");
var MultiSectionDigitalClock_1 = require("@mui/x-date-pickers/MultiSectionDigitalClock");
var pickers_1 = require("test/utils/pickers");
var internal_test_utils_1 = require("@mui/internal-test-utils");
describe('<MultiSectionDigitalClock />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('Reference date', function () {
        it('should use `referenceDate` when no value defined', function () {
            var onChange = (0, sinon_1.spy)();
            var referenceDate = '2018-01-01T13:30:00';
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock onChange={onChange} referenceDate={pickers_1.adapterToUse.date(referenceDate)}/>);
            // the first section items should not be initially focusable when `referenceDate` is defined
            expect(internal_test_utils_1.screen.getByRole('option', { name: '12 hours' })).to.have.attribute('tabindex', '-1');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '0 minutes' })).to.have.attribute('tabindex', '-1');
            expect(internal_test_utils_1.screen.getByRole('option', { name: 'AM' })).to.have.attribute('tabindex', '-1');
            // check that the relevant time based on the `referenceDate` is focusable
            expect(internal_test_utils_1.screen.getByRole('option', { name: '1 hours' })).to.have.attribute('tabindex', '0');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '30 minutes' })).to.have.attribute('tabindex', '0');
            expect(internal_test_utils_1.screen.getByRole('option', { name: 'PM' })).to.have.attribute('tabindex', '0');
            pickers_1.multiSectionDigitalClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setMinutes(pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 15), 30));
            expect(onChange.callCount).to.equal(3);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
        });
        it('should fallback to making the first entry focusable when `referenceDate` does not map to an option', function () {
            var referenceDate = '2018-01-01T13:33:00';
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock referenceDate={pickers_1.adapterToUse.date(referenceDate)}/>);
            expect(internal_test_utils_1.screen.getByRole('option', { name: '0 minutes' })).to.have.attribute('tabindex', '0');
        });
        it('should not use `referenceDate` when a value is defined', function () {
            var onChange = (0, sinon_1.spy)();
            function ControlledMultiSectionDigitalClock(props) {
                var _a = React.useState(props.value), value = _a[0], setValue = _a[1];
                return (<MultiSectionDigitalClock_1.MultiSectionDigitalClock {...props} value={value} onChange={function (newValue) {
                        var _a;
                        setValue(newValue);
                        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, newValue);
                    }}/>);
            }
            render(<ControlledMultiSectionDigitalClock onChange={onChange} value={pickers_1.adapterToUse.date('2019-01-01T12:30:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')}/>);
            pickers_1.multiSectionDigitalClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setMinutes(pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 15), 30));
            expect(onChange.callCount).to.equal(3);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
        });
        it('should not use `referenceDate` when a defaultValue is defined', function () {
            var onChange = (0, sinon_1.spy)();
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2019-01-01T12:30:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')}/>);
            pickers_1.multiSectionDigitalClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setMinutes(pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 15), 30));
            expect(onChange.callCount).to.equal(3);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
        });
    });
    describe('Keyboard support', function () {
        it('should move item focus up by 5 on PageUp press', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock autoFocus onChange={handleChange}/>);
            var hoursSectionListbox = internal_test_utils_1.screen.getAllByRole('listbox')[0]; // get only hour section
            var hoursOptions = (0, internal_test_utils_1.within)(hoursSectionListbox).getAllByRole('option');
            var lastOptionIndex = hoursOptions.length - 1;
            internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End' }); // moves focus to last element
            internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(hoursOptions[lastOptionIndex - 5]);
            internal_test_utils_1.fireEvent.keyDown(hoursOptions[lastOptionIndex - 5], { key: 'PageUp' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(hoursOptions[lastOptionIndex - 10]);
        });
        it('should move focus to first item on PageUp press when current focused item index is among the first 5 items', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock autoFocus onChange={handleChange}/>);
            var hoursSectionListbox = internal_test_utils_1.screen.getAllByRole('listbox')[0]; // get only hour section
            var hoursOptions = (0, internal_test_utils_1.within)(hoursSectionListbox).getAllByRole('option');
            // moves focus to 4th element using arrow down
            [0, 1, 2].forEach(function (index) {
                internal_test_utils_1.fireEvent.keyDown(hoursOptions[index], { key: 'ArrowDown' });
            });
            internal_test_utils_1.fireEvent.keyDown(hoursOptions[3], { key: 'PageUp' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(hoursOptions[0]);
        });
        it('should move item focus down by 5 on PageDown press', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock autoFocus onChange={handleChange}/>);
            var hoursSectionListbox = internal_test_utils_1.screen.getAllByRole('listbox')[0]; // get only hour section
            var hoursOptions = (0, internal_test_utils_1.within)(hoursSectionListbox).getAllByRole('option');
            internal_test_utils_1.fireEvent.keyDown(hoursOptions[0], { key: 'PageDown' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(hoursOptions[5]);
            internal_test_utils_1.fireEvent.keyDown(hoursOptions[5], { key: 'PageDown' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(hoursOptions[10]);
        });
        it('should move focus to last item on PageDown press when current focused item index is among the last 5 items', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<MultiSectionDigitalClock_1.MultiSectionDigitalClock autoFocus onChange={handleChange}/>);
            var hoursSectionListbox = internal_test_utils_1.screen.getAllByRole('listbox')[0]; // get only hour section
            var hoursOptions = (0, internal_test_utils_1.within)(hoursSectionListbox).getAllByRole('option');
            var lastOptionIndex = hoursOptions.length - 1;
            var lastElement = hoursOptions[lastOptionIndex];
            internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End' }); // moves focus to last element
            // moves focus 4 steps above last item using arrow up
            [0, 1, 2].forEach(function (index) {
                internal_test_utils_1.fireEvent.keyDown(hoursOptions[lastOptionIndex - index], { key: 'ArrowUp' });
            });
            internal_test_utils_1.fireEvent.keyDown(hoursOptions[lastOptionIndex - 3], { key: 'PageDown' });
            expect(handleChange.callCount).to.equal(0);
            expect(document.activeElement).to.equal(lastElement);
        });
    });
});
