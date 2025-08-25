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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDayViewRangeValidation = void 0;
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
var isDisabled = function (el) { return el.getAttribute('disabled') !== null; };
var testDisabledDate = function (day, expectedAnswer, isSingleCalendar) {
    expect(internal_test_utils_1.screen.getAllByRole('gridcell', { name: day }).map(isDisabled)).to.deep.equal(isSingleCalendar ? expectedAnswer.slice(0, 1) : expectedAnswer);
};
var testMonthSwitcherAreDisable = function (areDisable) {
    var prevMonthElement = internal_test_utils_1.screen.getAllByLabelText('Previous month')[0];
    var nbCalendars = internal_test_utils_1.screen.getAllByLabelText('Next month').length;
    var nextMonthElement = internal_test_utils_1.screen.getAllByLabelText('Next month')[nbCalendars - 1];
    // Test prev month
    if (areDisable[0]) {
        expect(prevMonthElement).to.have.attribute('disabled');
    }
    else {
        expect(prevMonthElement).not.to.have.attribute('disabled');
    }
    // Test next month
    if (areDisable[1]) {
        expect(nextMonthElement).to.have.attribute('disabled');
    }
    else {
        expect(nextMonthElement).not.to.have.attribute('disabled');
    }
};
var testDayViewRangeValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), componentFamily = _a.componentFamily, views = _a.views, _b = _a.variant, variant = _b === void 0 ? 'desktop' : _b;
    describe.skipIf(!views.includes('day') || componentFamily === 'field')('validation in day view:', function () {
        var isDesktop = variant === 'desktop';
        var includesTimeView = views.includes('hours');
        var defaultProps = __assign({ referenceDate: pickers_1.adapterToUse.date('2018-03-12'), open: true }, (componentFamily === 'field' || componentFamily === 'picker'
            ? { enableAccessibleFieldDOMStructure: true }
            : {}));
        it('should apply shouldDisableDate', function () {
            var render = getOptions().render;
            render(<ElementToTest {...defaultProps} shouldDisableDate={function (date) {
                    return pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-10'));
                }}/>);
            testDisabledDate('10', [false, true], !isDesktop || includesTimeView);
            testDisabledDate('11', [true, true], !isDesktop || includesTimeView);
        });
        describe('with fake timers', function () {
            beforeEach(function () {
                vitest_1.vi.setSystemTime(new Date(2018, 0, 5));
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should apply disablePast', function () {
                var render = getOptions().render;
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    var referenceDate = props.referenceDate, otherProps = __rest(props, ["referenceDate"]);
                    return <ElementToTest value={[now, null]} {...otherProps}/>;
                }
                var setProps = render(<WithFakeTimer {...defaultProps} disablePast/>).setProps;
                var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
                var yesterday = pickers_1.adapterToUse.addDays(now, -1);
                testDisabledDate(pickers_1.adapterToUse.format(now, 'dayOfMonth'), [false, false], !isDesktop || includesTimeView);
                testDisabledDate(pickers_1.adapterToUse.format(tomorrow, 'dayOfMonth'), [false, false], !isDesktop || includesTimeView);
                if (!pickers_1.adapterToUse.isSameMonth(yesterday, tomorrow)) {
                    setProps({ value: [yesterday, null] });
                }
                testDisabledDate(pickers_1.adapterToUse.format(yesterday, 'dayOfMonth'), [true, false], !isDesktop || includesTimeView);
            });
            it('should apply disableFuture', function () {
                var render = getOptions().render;
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    var referenceDate = props.referenceDate, otherProps = __rest(props, ["referenceDate"]);
                    return <ElementToTest value={[now, null]} {...otherProps}/>;
                }
                var setProps = render(<WithFakeTimer {...defaultProps} disableFuture/>).setProps;
                var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
                var yesterday = pickers_1.adapterToUse.addDays(now, -1);
                testDisabledDate(pickers_1.adapterToUse.format(now, 'dayOfMonth'), [false, true], !isDesktop || includesTimeView);
                testDisabledDate(pickers_1.adapterToUse.format(tomorrow, 'dayOfMonth'), [true, true], !isDesktop || includesTimeView);
                if (!pickers_1.adapterToUse.isSameMonth(yesterday, tomorrow)) {
                    setProps({ value: [yesterday, null] });
                }
                testDisabledDate(pickers_1.adapterToUse.format(yesterday, 'dayOfMonth'), [false, true], !isDesktop || includesTimeView);
            });
        });
        it('should apply minDate', function () {
            var render = getOptions().render;
            render(<ElementToTest {...defaultProps} referenceDate={pickers_1.adapterToUse.date('2019-06-15')} minDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            testDisabledDate('1', [true, false], !isDesktop || includesTimeView);
            testDisabledDate('3', [true, false], !isDesktop || includesTimeView);
            testDisabledDate('4', [false, false], !isDesktop || includesTimeView);
            testDisabledDate('15', [false, false], !isDesktop || includesTimeView);
            testMonthSwitcherAreDisable([true, false]);
        });
        it('should apply maxDate', function () {
            var render = getOptions().render;
            render(<ElementToTest {...defaultProps} referenceDate={pickers_1.adapterToUse.date('2019-06-15')} maxDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            testDisabledDate('1', [false, true], !isDesktop || includesTimeView);
            testDisabledDate('4', [false, true], !isDesktop || includesTimeView);
            testDisabledDate('5', [true, true], !isDesktop || includesTimeView);
            testDisabledDate('15', [true, true], !isDesktop || includesTimeView);
            testMonthSwitcherAreDisable([false, true]);
        });
    });
};
exports.testDayViewRangeValidation = testDayViewRangeValidation;
