"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var YearCalendar_1 = require("@mui/x-date-pickers/YearCalendar");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
describe('<YearCalendar />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('allows to pick year standalone by click, `Enter` and `Space`', function () {
        var onChange = (0, sinon_1.spy)();
        render(<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2019-02-02')} onChange={onChange}/>);
        var targetYear = internal_test_utils_1.screen.getByRole('radio', { name: '2025' });
        // A native button implies Enter and Space keydown behavior
        // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
        // If this breaks, make sure to add tests for
        // - fireEvent.keyDown(targetDay, { key: 'Enter' })
        // - fireEvent.keyUp(targetDay, { key: 'Space' })
        expect(targetYear.tagName).to.equal('BUTTON');
        internal_test_utils_1.fireEvent.click(targetYear);
        expect(onChange.callCount).to.equal(1);
        expect(onChange.args[0][0]).toEqualDateTime(new Date(2025, 1, 2));
    });
    it('should select start of year without time when no initial value is present', function () {
        var onChange = (0, sinon_1.spy)();
        render(<YearCalendar_1.YearCalendar onChange={onChange}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('radio', { name: '2025' }));
        expect(onChange.callCount).to.equal(1);
        expect(onChange.args[0][0]).toEqualDateTime(new Date(2025, 0, 1, 0, 0, 0, 0));
    });
    it('does not allow to pick year if readOnly prop is passed', function () {
        var onChangeMock = (0, sinon_1.spy)();
        render(<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2019-02-02')} onChange={onChangeMock} readOnly/>);
        var targetYear = internal_test_utils_1.screen.getByRole('radio', { name: '2025' });
        expect(targetYear.tagName).to.equal('BUTTON');
        internal_test_utils_1.fireEvent.click(targetYear);
        expect(onChangeMock.callCount).to.equal(0);
    });
    it('should display years in ascending (chronological order) by default', function () {
        var _a;
        render(<YearCalendar_1.YearCalendar minDate={pickers_1.adapterToUse.date('2020-01-01')} maxDate={pickers_1.adapterToUse.date('2024-12-31')}/>);
        var yearButtons = internal_test_utils_1.screen.queryAllByRole('radio');
        expect((_a = yearButtons[0]) === null || _a === void 0 ? void 0 : _a.textContent).to.equal('2020');
    });
    it('should display years in descending (reverse chronological) order when props.yearsOrder = "desc"', function () {
        var _a;
        render(<YearCalendar_1.YearCalendar minDate={pickers_1.adapterToUse.date('2020-01-01')} maxDate={pickers_1.adapterToUse.date('2024-12-31')} yearsOrder="desc"/>);
        var yearButtons = internal_test_utils_1.screen.queryAllByRole('radio');
        expect((_a = yearButtons[0]) === null || _a === void 0 ? void 0 : _a.textContent).to.equal('2024');
    });
    describe('Disabled', function () {
        it('should disable all years if props.disabled = true', function () {
            var onChange = (0, sinon_1.spy)();
            render(<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2017-02-15')} onChange={onChange} disabled/>);
            internal_test_utils_1.screen.getAllByRole('radio').forEach(function (yearButton) {
                expect(yearButton).to.have.attribute('disabled');
                internal_test_utils_1.fireEvent.click(yearButton);
                expect(onChange.callCount).to.equal(0);
            });
        });
        it('should not render years before props.minDate but should render and not disable the year in which props.minDate is', function () {
            var onChange = (0, sinon_1.spy)();
            render(<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2017-02-15')} onChange={onChange} minDate={pickers_1.adapterToUse.date('2018-02-12')}/>);
            var year2017 = internal_test_utils_1.screen.queryByText('2017', { selector: 'button' });
            var year2018 = internal_test_utils_1.screen.getByText('2018', { selector: 'button' });
            expect(year2017).to.equal(null);
            expect(year2018).not.to.have.attribute('disabled');
            internal_test_utils_1.fireEvent.click(year2018);
            expect(onChange.callCount).to.equal(1);
        });
        it('should not render years after props.maxDate but should render and not disable the year in which props.maxDate is', function () {
            var onChange = (0, sinon_1.spy)();
            render(<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2019-02-15')} onChange={onChange} maxDate={pickers_1.adapterToUse.date('2025-04-12')}/>);
            var year2026 = internal_test_utils_1.screen.queryByText('2026', { selector: 'button' });
            var year2025 = internal_test_utils_1.screen.getByText('2025', { selector: 'button' });
            expect(year2026).to.equal(null);
            expect(year2025).not.to.have.attribute('disabled');
            internal_test_utils_1.fireEvent.click(year2025);
            expect(onChange.callCount).to.equal(1);
        });
        it('should disable years if props.shouldDisableYear returns true', function () {
            var onChange = (0, sinon_1.spy)();
            render(<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2019-01-02')} onChange={onChange} shouldDisableYear={function (month) { return pickers_1.adapterToUse.getYear(month) === 2024; }}/>);
            var year2024 = internal_test_utils_1.screen.getByText('2024', { selector: 'button' });
            var year2025 = internal_test_utils_1.screen.getByText('2025', { selector: 'button' });
            expect(year2024).to.have.attribute('disabled');
            expect(year2025).not.to.have.attribute('disabled');
            internal_test_utils_1.fireEvent.click(year2024);
            expect(onChange.callCount).to.equal(0);
            internal_test_utils_1.fireEvent.click(year2025);
            expect(onChange.callCount).to.equal(1);
        });
    });
    it('should allow to focus years when it contains valid date', function () {
        render(<YearCalendar_1.YearCalendar 
        // date is chose such as replacing year by 2018 or 2020 makes it out of valid range
        defaultValue={pickers_1.adapterToUse.date('2019-08-01')} autoFocus // needed to allow keyboard navigation
        />);
        var button2019 = internal_test_utils_1.screen.getByRole('radio', { name: '2019' });
        (0, internal_test_utils_1.act)(function () { return button2019.focus(); });
        internal_test_utils_1.fireEvent.keyDown(button2019, { key: 'ArrowLeft' });
        expect(document.activeElement).to.have.text('2018');
        (0, internal_test_utils_1.act)(function () { return button2019.focus(); });
        internal_test_utils_1.fireEvent.keyDown(button2019, { key: 'ArrowRight' });
        expect(document.activeElement).to.have.text('2020');
    });
    describe('with fake timers', function () {
        beforeEach(function () {
            vitest_1.vi.setSystemTime(new Date(2019, 0, 1));
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        it('should disable years after initial render when "disableFuture" prop changes', function () {
            var setProps = render(<YearCalendar_1.YearCalendar />).setProps;
            var year2019 = internal_test_utils_1.screen.getByText('2019', { selector: 'button' });
            var year2020 = internal_test_utils_1.screen.getByText('2020', { selector: 'button' });
            expect(year2019).not.to.have.attribute('disabled');
            expect(year2020).not.to.have.attribute('disabled');
            setProps({ disableFuture: true });
            expect(year2019).not.to.have.attribute('disabled');
            expect(year2020).to.have.attribute('disabled');
        });
    });
    it('should not mark the `referenceDate` year as selected', function () {
        render(<YearCalendar_1.YearCalendar referenceDate={pickers_1.adapterToUse.date('2018-02-02')}/>);
        expect(internal_test_utils_1.screen.getByRole('radio', { name: '2018', checked: false })).not.to.equal(null);
    });
});
