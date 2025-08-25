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
exports.testYearViewValidation = void 0;
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var sinon_1 = require("sinon");
var queryByTextInView = function (text) {
    var view = internal_test_utils_1.screen.queryByRole('dialog');
    return internal_test_utils_1.screen.queryByText(function (content, element) {
        if (view && !view.contains(element)) {
            return false;
        }
        return content === text;
    });
};
var testYearViewValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), views = _a.views, componentFamily = _a.componentFamily, render = _a.render;
    describe.skipIf(componentFamily === 'field' || !views.includes('year'))('year view:', function () {
        var defaultProps = __assign(__assign({ onChange: function () { } }, (views.length > 1 && {
            views: ['year'],
            view: 'year',
            openTo: 'year',
        })), (componentFamily !== 'calendar' && {
            open: true,
            reduceAnimations: true,
            slotProps: { toolbar: { hidden: true } },
        }));
        it('should apply shouldDisableYear', function () {
            render(<ElementToTest {...defaultProps} value={null} shouldDisableYear={function (date) { return pickers_1.adapterToUse.getYear(date) === 2018; }}/>);
            expect(queryByTextInView('2018')).to.have.attribute('disabled');
            expect(queryByTextInView('2019')).not.to.have.attribute('disabled');
            expect(queryByTextInView('2017')).not.to.have.attribute('disabled');
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
                render(<WithFakeTimer {...defaultProps} disablePast/>);
                var nextYear = pickers_1.adapterToUse.addYears(now, 1);
                var prevYear = pickers_1.adapterToUse.addYears(now, -1);
                expect(queryByTextInView(pickers_1.adapterToUse.format(now, 'year'))).not.to.have.attribute('disabled');
                expect(queryByTextInView(pickers_1.adapterToUse.format(nextYear, 'year'))).not.to.have.attribute('disabled');
                expect(queryByTextInView(pickers_1.adapterToUse.format(prevYear, 'year'))).to.have.attribute('disabled');
            });
            it('should apply disableFuture', function () {
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    return <ElementToTest value={now} {...props}/>;
                }
                render(<WithFakeTimer {...defaultProps} disableFuture/>);
                var nextYear = pickers_1.adapterToUse.addYears(now, 1);
                var prevYear = pickers_1.adapterToUse.addYears(now, -1);
                expect(queryByTextInView(pickers_1.adapterToUse.format(now, 'year'))).not.to.have.attribute('disabled');
                expect(queryByTextInView(pickers_1.adapterToUse.format(nextYear, 'year'))).to.have.attribute('disabled');
                expect(queryByTextInView(pickers_1.adapterToUse.format(prevYear, 'year'))).not.to.have.attribute('disabled');
            });
        });
        it('should apply minDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} minDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            expect(queryByTextInView('2018')).to.equal(null);
            expect(queryByTextInView('2019')).not.to.equal(null);
            expect(queryByTextInView('2020')).not.to.equal(null);
        });
        it('should apply maxDate', function () {
            render(<ElementToTest {...defaultProps} value={pickers_1.adapterToUse.date('2019-06-15')} maxDate={pickers_1.adapterToUse.date('2019-06-04')}/>);
            expect(queryByTextInView('2018')).not.to.equal(null);
            expect(queryByTextInView('2019')).not.to.equal(null);
            expect(queryByTextInView('2020')).to.equal(null);
        });
    });
};
exports.testYearViewValidation = testYearViewValidation;
