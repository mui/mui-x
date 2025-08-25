"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMonthViewValidation = void 0;
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var sinon_1 = require("sinon");
var testMonthViewValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), views = _a.views, componentFamily = _a.componentFamily, render = _a.render;
    describe.skipIf(componentFamily === 'field' || !views.includes('month'))('month view:', function () {
        var defaultProps = __assign(__assign({ onChange: function () { } }, (views.length > 1 && {
            views: ['month'],
            view: 'month',
            openTo: 'month',
        })), (componentFamily !== 'calendar' && {
            open: true,
            reduceAnimations: true,
            slotProps: { toolbar: { hidden: true } },
        }));
        it('should apply shouldDisableMonth', function () {
            render(<ElementToTest {...defaultProps} value={null} shouldDisableMonth={function (date) { return pickers_1.adapterToUse.getMonth(date) === 3; }}/>);
            expect(internal_test_utils_1.screen.getByText('Apr')).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Jan')).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('May')).not.to.have.attribute('disabled');
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
                var nextMonth = pickers_1.adapterToUse.addMonths(now, 1);
                var prevMonth = pickers_1.adapterToUse.addMonths(now, -1);
                expect(internal_test_utils_1.screen.getByText(pickers_1.adapterToUse.format(now, 'monthShort'))).not.to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameYear(now, nextMonth)) {
                    setProps({ value: nextMonth });
                }
                expect(internal_test_utils_1.screen.getByText(pickers_1.adapterToUse.format(nextMonth, 'monthShort'))).not.to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameYear(prevMonth, nextMonth)) {
                    setProps({ value: prevMonth });
                }
                expect(internal_test_utils_1.screen.getByText(pickers_1.adapterToUse.format(prevMonth, 'monthShort'))).to.have.attribute('disabled');
                // TODO: define what appends when value is `null`
            });
            it('should apply disableFuture', function () {
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    return <ElementToTest value={now} {...props}/>;
                }
                var setProps = render(<WithFakeTimer {...defaultProps} disableFuture/>).setProps;
                var nextMonth = pickers_1.adapterToUse.addMonths(now, 1);
                var prevMonth = pickers_1.adapterToUse.addMonths(now, -1);
                expect(internal_test_utils_1.screen.getByText(pickers_1.adapterToUse.format(now, 'monthShort'))).not.to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameYear(now, nextMonth)) {
                    setProps({ value: nextMonth });
                }
                expect(internal_test_utils_1.screen.getByText(pickers_1.adapterToUse.format(nextMonth, 'monthShort'))).to.have.attribute('disabled');
                if (!pickers_1.adapterToUse.isSameYear(prevMonth, nextMonth)) {
                    setProps({ value: prevMonth });
                }
                expect(internal_test_utils_1.screen.getByText(pickers_1.adapterToUse.format(prevMonth, 'monthShort'))).not.to.have.attribute('disabled');
                // TODO: define what appends when value is `null`
            });
        });
        it('should apply minDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} minDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            expect(internal_test_utils_1.screen.getByText('Jan')).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('May')).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Jun')).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Jul')).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Dec')).not.to.have.attribute('disabled');
            // TODO: define what appends when value is `null`
        });
        it('should apply maxDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} maxDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            expect(internal_test_utils_1.screen.getByText('Jan')).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Jun')).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Jul')).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByText('Dec')).to.have.attribute('disabled');
            // TODO: define what appends when value is `null`
        });
    });
};
exports.testMonthViewValidation = testMonthViewValidation;
