"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDayViewValidation = void 0;
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var sinon_1 = require("sinon");
var testDayViewValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), componentFamily = _a.componentFamily, views = _a.views, render = _a.render, withDate = _a.withDate, withTime = _a.withTime;
    describe.skipIf(componentFamily === 'field' || !views.includes('day'))('day view:', function () {
        var defaultProps = {
            onChange: function () { },
            open: true,
            view: 'day',
            reduceAnimations: true,
            slotProps: { toolbar: { hidden: true } },
        };
        it('should apply shouldDisableDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2018-03-12')} shouldDisableDate={function (date) {
                    return pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-10'));
                }}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '12' })).to.have.attribute('disabled');
        });
        it('should apply shouldDisableYear', function () {
            var setProps = render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2018-03-12')} shouldDisableYear={function (date) { return pickers_1.adapterToUse.getYear(date) === 2018; }}/>).setProps;
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '15' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');
            setProps({ value: pickers_1.adapterToUse.date('2019-01-01') });
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '15' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).not.to.have.attribute('disabled');
        });
        it('should apply shouldDisableMonth', function () {
            var setProps = render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2018-03-12')} shouldDisableMonth={function (date) { return pickers_1.adapterToUse.getMonth(date) === 2; }}/>).setProps;
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '15' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');
            setProps({ value: pickers_1.adapterToUse.date('2018-02-01') });
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '15' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '28' })).not.to.have.attribute('disabled');
        });
        describe('with fake timers', function () {
            // TODO: temporary for vitest. Can move to `vi.useFakeTimers`
            var timer = null;
            beforeEach(function () {
                timer = (0, sinon_1.useFakeTimers)({ now: new Date(2018, 0, 1), toFake: ['Date'] });
            });
            afterEach(function () {
                timer === null || timer === void 0 ? void 0 : timer.restore();
            });
            it('should apply disablePast', function () {
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    return <ElementToTest value={now} {...props}/>;
                }
                var setProps = render(<WithFakeTimer {...defaultProps} disablePast/>).setProps;
                var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
                var yesterday = pickers_1.adapterToUse.addDays(now, -1);
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.format(now, 'dayOfMonth') })).not.to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameMonth(now, tomorrow)) {
                    setProps({ value: tomorrow });
                }
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.format(tomorrow, 'dayOfMonth') })).not.to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameMonth(yesterday, tomorrow)) {
                    setProps({ value: yesterday });
                }
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.format(yesterday, 'dayOfMonth') })).to.have.attribute('disabled');
            });
            it('should apply disableFuture', function () {
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    return <ElementToTest value={now} {...props}/>;
                }
                var setProps = render(<WithFakeTimer {...defaultProps} disableFuture/>).setProps;
                var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
                var yesterday = pickers_1.adapterToUse.addDays(now, -1);
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.format(now, 'dayOfMonth') })).not.to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameMonth(now, tomorrow)) {
                    setProps({ value: tomorrow });
                }
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.format(tomorrow, 'dayOfMonth') })).to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameMonth(yesterday, tomorrow)) {
                    setProps({ value: yesterday });
                }
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: pickers_1.adapterToUse.format(yesterday, 'dayOfMonth') })).not.to.have.attribute('disabled');
            });
        });
        it('should apply minDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} minDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByLabelText('Previous month')).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
        });
        it('should apply maxDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} maxDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByLabelText('Next month')).to.have.attribute('disabled');
        });
        // prop only available on DateTime pickers
        it.skipIf(!withDate || !withTime)('should apply maxDateTime', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} maxDateTime={pickers_1.adapterToUse.date('2019-06-04T12:00:00')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');
        });
        // prop only available on DateTime pickers
        it.skipIf(!withDate || !withTime)('should apply minDateTime', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} minDateTime={pickers_1.adapterToUse.date('2019-06-04T12:00:00')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '30' })).not.to.have.attribute('disabled');
        });
    });
};
exports.testDayViewValidation = testDayViewValidation;
