"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMinutesViewValidation = void 0;
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var toMinutesLabel = function (minutes) { return "".concat(String(minutes).padStart(2, '0'), " minutes"); };
var testMinutesViewValidation = function (ElementToTest, getOption) {
    var _a = getOption(), componentFamily = _a.componentFamily, views = _a.views, render = _a.render, withDate = _a.withDate, withTime = _a.withTime, variant = _a.variant;
    describe.skipIf(!views.includes('minutes') || !variant || componentFamily !== 'picker' || variant === 'desktop')('minutes view:', function () {
        var defaultProps = {
            onChange: function () { },
            open: true,
            view: 'minutes',
            openTo: 'minutes',
            reduceAnimations: true,
            slotProps: { toolbar: { hidden: true } },
        };
        it('should apply shouldDisableTime', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2018-03-12T08:15:00')} shouldDisableTime={function (date) {
                    return pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-12T08:20:00'));
                }}/>);
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('10') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('15') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('20') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('25') })).to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('30') })).to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('55') })).to.have.attribute('aria-disabled');
        });
        it('should apply disablePast', function () {
            var now = pickers_1.adapterToUse.date();
            function WithFakeTimer(props) {
                return <ElementToTest value={now} {...props}/>;
            }
            var setProps = render(<WithFakeTimer {...defaultProps} disablePast/>).setProps;
            var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
            var currentMinutes = pickers_1.adapterToUse.getMinutes(now);
            var closestNowMinutesOptionValue = Math.floor(currentMinutes / 5) * 5;
            var previousMinutesOptionValue = Math.floor(currentMinutes / 5) * 5 - 5;
            var nextMinutesOptionValue = Math.floor(currentMinutes / 5) * 5 + 5;
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(previousMinutesOptionValue) })).to.have.attribute('aria-disabled');
            if (currentMinutes <= closestNowMinutesOptionValue) {
                expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(closestNowMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
            }
            else {
                expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(closestNowMinutesOptionValue) })).to.have.attribute('aria-disabled');
            }
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(nextMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
            // following validation is relevant only for DateTimePicker
            if (!withDate || !withTime) {
                return;
            }
            setProps({ value: tomorrow });
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(previousMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(closestNowMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
        });
        it('should apply disableFuture', function () {
            var now = pickers_1.adapterToUse.date();
            function WithFakeTimer(props) {
                return <ElementToTest value={now} {...props}/>;
            }
            var setProps = render(<WithFakeTimer {...defaultProps} disableFuture/>).setProps;
            var yesterday = pickers_1.adapterToUse.addDays(now, -1);
            var currentMinutes = pickers_1.adapterToUse.getMinutes(now);
            var closestNowMinutesOptionValue = Math.floor(currentMinutes / 5) * 5;
            var previousMinutesOptionValue = Math.floor(currentMinutes / 5) * 5 - 5;
            var nextMinutesOptionValue = Math.floor(currentMinutes / 5) * 5 + 5;
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(previousMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
            if (currentMinutes < closestNowMinutesOptionValue) {
                expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(closestNowMinutesOptionValue) })).to.have.attribute('aria-disabled');
            }
            else {
                expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(closestNowMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
            }
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(nextMinutesOptionValue) })).to.have.attribute('aria-disabled');
            // following validation is relevant only for DateTimePicker
            if (!withDate || !withTime) {
                return;
            }
            setProps({ value: yesterday });
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(previousMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel(closestNowMinutesOptionValue) })).not.to.have.attribute('aria-disabled');
        });
        it('should apply maxTime', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15T11:15:00')} maxTime={pickers_1.adapterToUse.date('2019-06-15T11:20:00')}/>);
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('10') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('15') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('20') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('25') })).to.have.attribute('aria-disabled');
        });
        it('should apply minTime', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15T11:15:00')} minTime={pickers_1.adapterToUse.date('2019-06-15T11:10:00')}/>);
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('0') })).to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('5') })).to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('10') })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: toMinutesLabel('15') })).not.to.have.attribute('aria-disabled');
        });
    });
};
exports.testMinutesViewValidation = testMinutesViewValidation;
