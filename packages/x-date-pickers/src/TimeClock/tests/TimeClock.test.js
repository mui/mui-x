"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var TimeClock_1 = require("@mui/x-date-pickers/TimeClock");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
describe('<TimeClock />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('renders a listbox with a name', function () {
        render(<TimeClock_1.TimeClock value={null} onChange={function () { }}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        expect(listbox).toHaveAccessibleName('Select hours. No time selected');
    });
    it('has a name depending on the `date`', function () {
        render(<TimeClock_1.TimeClock value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={function () { }}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        expect(listbox).toHaveAccessibleName('Select hours. Selected time is 04:20 AM');
    });
    it('renders the current value as an accessible option', function () {
        render(<TimeClock_1.TimeClock value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={function () { }}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        var selectedOption = (0, internal_test_utils_1.within)(listbox).getByRole('option', { selected: true });
        expect(selectedOption).toHaveAccessibleName('4 hours');
        expect(listbox).to.have.attribute('aria-activedescendant', selectedOption.id);
    });
    it('can be autofocused on mount', function () {
        render(<TimeClock_1.TimeClock autoFocus value={null} onChange={function () { }}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        expect(listbox).toHaveFocus();
    });
    it('stays focused when the view changes', function () {
        var setProps = render(<TimeClock_1.TimeClock autoFocus value={null} onChange={function () { }} view="hours"/>).setProps;
        setProps({ view: 'minutes' });
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        expect(listbox).toHaveFocus();
    });
    it('selects the current date on mount', function () {
        render(<TimeClock_1.TimeClock value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={function () { }}/>);
        var selectedOption = internal_test_utils_1.screen.getByRole('option', { selected: true });
        expect(selectedOption).toHaveAccessibleName('4 hours');
    });
    it('selects the first hour on Home press', function () {
        var handleChange = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={handleChange}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'Home' });
        expect(handleChange.callCount).to.equal(1);
        var _a = handleChange.firstCall.args, newDate = _a[0], reason = _a[1];
        // TODO: Can't find the GH issue regarding this
        // expect(newDate).toEqualDateTime(new Date(2019, 0, 1, 0, 20));
        // but the year, mont, day is different
        expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(0);
        expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(20);
        expect(reason).to.equal('partial');
    });
    it('selects the last hour on End press', function () {
        var handleChange = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={handleChange}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'End' });
        expect(handleChange.callCount).to.equal(1);
        var _a = handleChange.firstCall.args, newDate = _a[0], reason = _a[1];
        expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(11);
        expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(20);
        expect(reason).to.equal('partial');
    });
    it('selects the next hour on ArrowUp press', function () {
        var handleChange = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={handleChange}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'ArrowUp' });
        expect(handleChange.callCount).to.equal(1);
        var _a = handleChange.firstCall.args, newDate = _a[0], reason = _a[1];
        expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(5);
        expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(20);
        expect(reason).to.equal('partial');
    });
    it('selects the previous hour on ArrowDown press', function () {
        var handleChange = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={handleChange}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'ArrowDown' });
        expect(handleChange.callCount).to.equal(1);
        var _a = handleChange.firstCall.args, newDate = _a[0], reason = _a[1];
        expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(3);
        expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(20);
        expect(reason).to.equal('partial');
    });
    it('should increase hour selection by 5 on PageUp press', function () {
        var handleChange = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T22:20:00')} onChange={handleChange}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'PageUp' });
        expect(handleChange.callCount).to.equal(1);
        var _a = handleChange.firstCall.args, newDate = _a[0], reason = _a[1];
        expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(23);
        expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(20);
        expect(reason).to.equal('partial');
    });
    it('should decrease hour selection by 5 on PageDown press', function () {
        var handleChange = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T02:20:00')} onChange={handleChange}/>);
        var listbox = internal_test_utils_1.screen.getByRole('listbox');
        internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'PageDown' });
        expect(handleChange.callCount).to.equal(1);
        var _a = handleChange.firstCall.args, newDate = _a[0], reason = _a[1];
        expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(0);
        expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(20);
        expect(reason).to.equal('partial');
    });
    [
        {
            keyName: 'Enter',
            keyValue: 'Enter',
        },
        {
            keyName: 'Space',
            keyValue: ' ',
        },
    ].forEach(function (_a) {
        var keyName = _a.keyName, keyValue = _a.keyValue;
        it("sets value on ".concat(keyName, " press"), function () {
            var _a;
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock autoFocus defaultValue={pickers_1.adapterToUse.date('2019-01-01T04:20:00')} onChange={handleChange}/>);
            var listbox = internal_test_utils_1.screen.getByRole('listbox');
            internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'ArrowDown' });
            internal_test_utils_1.fireEvent.keyDown(listbox, { key: keyValue });
            expect(handleChange.callCount).to.equal(2);
            var _b = handleChange.lastCall.args, newDate = _b[0], reason = _b[1];
            expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(3);
            expect(reason).to.equal('partial');
            internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'ArrowUp' });
            internal_test_utils_1.fireEvent.keyDown(listbox, { key: keyValue });
            expect(handleChange.callCount).to.equal(4);
            _a = handleChange.lastCall.args, newDate = _a[0], reason = _a[1];
            expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(21);
            expect(reason).to.equal('finish');
        });
    });
    it.skipIf(!skipIf_1.hasTouchSupport)('should display options, but not update value when readOnly prop is passed', function () {
        var selectEvent = {
            changedTouches: [
                {
                    clientX: 150,
                    clientY: 60,
                },
            ],
        };
        var onChangeMock = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChangeMock} readOnly/>);
        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', selectEvent);
        expect(onChangeMock.callCount).to.equal(0);
        // hours are not disabled
        var hoursContainer = internal_test_utils_1.screen.getByRole('listbox');
        var hours = (0, internal_test_utils_1.within)(hoursContainer).getAllByRole('option');
        var disabledHours = hours.filter(function (hour) { return hour.getAttribute('aria-disabled') === 'true'; });
        expect(hours.length).to.equal(12);
        expect(disabledHours.length).to.equal(0);
    });
    it.skipIf(!skipIf_1.hasTouchSupport)('should display disabled options when disabled prop is passed', function () {
        var selectEvent = {
            changedTouches: [
                {
                    clientX: 150,
                    clientY: 60,
                },
            ],
        };
        var onChangeMock = (0, sinon_1.spy)();
        render(<TimeClock_1.TimeClock value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChangeMock} disabled/>);
        (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', selectEvent);
        expect(onChangeMock.callCount).to.equal(0);
        // hours are disabled
        var hoursContainer = internal_test_utils_1.screen.getByRole('listbox');
        var hours = (0, internal_test_utils_1.within)(hoursContainer).getAllByRole('option');
        var disabledHours = hours.filter(function (hour) { return hour.getAttribute('aria-disabled') === 'true'; });
        expect(hours.length).to.equal(12);
        expect(disabledHours.length).to.equal(12);
    });
    describe.skipIf(!skipIf_1.hasTouchSupport)('Time validation on touch ', function () {
        var clockTouchEvent = {
            '13:--': {
                changedTouches: [
                    {
                        clientX: 150,
                        clientY: 60,
                    },
                ],
            },
            '19:--': {
                changedTouches: [
                    {
                        clientX: 66,
                        clientY: 157,
                    },
                ],
            },
            '--:10': {
                changedTouches: [
                    {
                        clientX: 190,
                        clientY: 60,
                    },
                ],
            },
            '--:20': {
                changedTouches: [
                    {
                        clientX: 222,
                        clientY: 180,
                    },
                ],
            },
        };
        it('should select enabled hour', function () {
            var handleChange = (0, sinon_1.spy)();
            var handleViewChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01')} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} onViewChange={handleViewChange}/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['13:--']);
            expect(handleChange.callCount).to.equal(1);
            var _a = handleChange.firstCall.args, date = _a[0], selectionState = _a[1];
            expect(date).toEqualDateTime(new Date(2018, 0, 1, 13));
            expect(selectionState).to.equal('shallow');
            expect(handleViewChange.callCount).to.equal(0);
        });
        it('should select enabled minute', function () {
            var handleChange = (0, sinon_1.spy)();
            var handleViewChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01T13:00:00')} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} onViewChange={handleViewChange} view="minutes"/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['--:20']);
            expect(handleChange.callCount).to.equal(1);
            var _a = handleChange.firstCall.args, date = _a[0], selectionState = _a[1];
            expect(date).toEqualDateTime(new Date(2018, 0, 1, 13, 20));
            expect(selectionState).to.equal('shallow');
            expect(handleViewChange.callCount).to.equal(0);
        });
        it('should not select minute when time is disabled', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01T01:20:00')} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} view="minutes"/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['--:20']);
            expect(handleChange.callCount).to.equal(0);
        });
        it('should not select minute when time is disabled (no current value)', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={null} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} view="minutes"/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['--:20']);
            expect(handleChange.callCount).to.equal(0);
        });
        it('should not select disabled hour', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01T13:00:00')} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} view="hours"/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['19:--']);
            expect(handleChange.callCount).to.equal(0);
        });
        it('should not select disabled hour (no current value)', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={null} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} view="hours"/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['19:--']);
            expect(handleChange.callCount).to.equal(0);
        });
        it('should visually disable the dates not matching minutesStep', function () {
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01T13:20:00')} minutesStep={15} onChange={function () { }} view="minutes"/>);
            expect(internal_test_utils_1.screen.getByLabelText('25 minutes')).to.have.class('Mui-disabled');
            expect(internal_test_utils_1.screen.getByLabelText('30 minutes')).not.to.have.class('Mui-disabled');
        });
        it('should select enabled second', function () {
            var handleChange = (0, sinon_1.spy)();
            var handleViewChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01T13:20:00')} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} onViewChange={handleViewChange} views={['seconds']}/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['--:10']);
            expect(handleChange.callCount).to.equal(1);
            var _a = handleChange.firstCall.args, date = _a[0], selectionState = _a[1];
            expect(date).toEqualDateTime(new Date(2018, 0, 1, 13, 20, 10));
            expect(selectionState).to.equal('shallow');
            expect(handleViewChange.callCount).to.equal(0);
        });
        it('should not select second when time is disabled', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01')} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} views={['seconds']}/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['--:20']);
            expect(handleChange.callCount).to.equal(0);
        });
        it('should not select second when time is disabled (no current value)', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={null} minTime={pickers_1.adapterToUse.date('2018-01-01T12:15:00')} maxTime={pickers_1.adapterToUse.date('2018-01-01T15:45:30')} onChange={handleChange} views={['seconds']}/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['--:20']);
            expect(handleChange.callCount).to.equal(0);
        });
        it('should select enabled hour on touch and drag', function () {
            var handleChange = (0, sinon_1.spy)();
            var handleViewChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01')} onChange={handleChange} onViewChange={handleViewChange}/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['13:--']);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchmove', clockTouchEvent['19:--']);
            expect(handleChange.callCount).to.equal(2);
            var _a = handleChange.lastCall.args, date = _a[0], selectionState = _a[1];
            expect(date).toEqualDateTime(new Date(2018, 0, 1, 19));
            expect(selectionState).to.equal('shallow');
            expect(handleViewChange.callCount).to.equal(0);
        });
        it('should select enabled hour and move to next view on touch end', function () {
            var handleChange = (0, sinon_1.spy)();
            var handleViewChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock ampm={false} value={pickers_1.adapterToUse.date('2018-01-01')} onChange={handleChange} onViewChange={handleViewChange}/>);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchstart', clockTouchEvent['13:--']);
            (0, internal_test_utils_1.fireTouchChangedEvent)(internal_test_utils_1.screen.getByTestId('clock'), 'touchend', clockTouchEvent['13:--']);
            expect(handleChange.callCount).to.equal(2);
            var _a = handleChange.lastCall.args, date = _a[0], selectionState = _a[1];
            expect(date).toEqualDateTime(new Date(2018, 0, 1, 13));
            expect(selectionState).to.equal('partial');
            expect(handleViewChange.callCount).to.equal(1);
        });
    });
    describe('default value', function () {
        it('if value is provided, keeps minutes and seconds when changing hour', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock autoFocus value={pickers_1.adapterToUse.date('2019-01-01T04:19:47')} onChange={handleChange}/>);
            var listbox = internal_test_utils_1.screen.getByRole('listbox');
            internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'ArrowUp' });
            expect(handleChange.callCount).to.equal(1);
            var newDate = handleChange.firstCall.args[0];
            expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(5);
            expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(19);
            expect(pickers_1.adapterToUse.getSeconds(newDate)).to.equal(47);
        });
        it('if value is not provided, uses zero as default for minutes and seconds when selecting hour', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock autoFocus value={null} onChange={handleChange}/>);
            var listbox = internal_test_utils_1.screen.getByRole('listbox');
            internal_test_utils_1.fireEvent.keyDown(listbox, { key: 'ArrowUp' });
            expect(handleChange.callCount).to.equal(1);
            var newDate = handleChange.firstCall.args[0];
            expect(pickers_1.adapterToUse.getHours(newDate)).to.equal(1);
            expect(pickers_1.adapterToUse.getMinutes(newDate)).to.equal(0);
            expect(pickers_1.adapterToUse.getSeconds(newDate)).to.equal(0);
        });
    });
    describe('Reference date', function () {
        it('should use `referenceDate` when no value defined', function () {
            var onChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock onChange={onChange} referenceDate={pickers_1.adapterToUse.date('2018-01-01T12:30:00')}/>);
            pickers_1.timeClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 3), 'hours');
            expect(onChange.callCount).to.equal(2);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
        });
        it('should not use `referenceDate` when a value is defined', function () {
            var onChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock onChange={onChange} value={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')}/>);
            pickers_1.timeClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 3), 'hours');
            expect(onChange.callCount).to.equal(2);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 20));
        });
        it('should not use `referenceDate` when a defaultValue is defined', function () {
            var onChange = (0, sinon_1.spy)();
            render(<TimeClock_1.TimeClock onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')}/>);
            pickers_1.timeClockHandler.setViewValue(pickers_1.adapterToUse, pickers_1.adapterToUse.setHours(pickers_1.adapterToUse.date(), 3), 'hours');
            expect(onChange.callCount).to.equal(2);
            expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 20));
        });
    });
});
