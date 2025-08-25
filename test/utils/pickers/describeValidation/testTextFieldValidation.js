"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTextFieldValidation = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
var testTextFieldValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), componentFamily = _a.componentFamily, render = _a.render, withDate = _a.withDate, withTime = _a.withTime;
    describe.skipIf(!['picker', 'field'].includes(componentFamily))('text field:', function () {
        it.skipIf(['picker', 'field'].includes(componentFamily) && !withDate)('should apply shouldDisableDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2018-03-12')} shouldDisableDate={function (date) {
                    return pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-10'));
                }}/>).setProps;
            if (withDate) {
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableDate');
                setProps({ value: pickers_1.adapterToUse.date('2018-03-09') });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.equal(null);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
            else {
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
                expect(onErrorMock.callCount).to.equal(0);
            }
        });
        // TODO: Remove when DateTimePickers will support those props
        it.skipIf(!withDate)('should apply shouldDisableYear', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2018-03-12')} shouldDisableYear={function (date) { return pickers_1.adapterToUse.getYear(date) === 2018; }}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableYear');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            setProps({ value: pickers_1.adapterToUse.date('2019-03-09') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
        });
        // TODO: Remove when DateTimePickers will support those props
        it.skipIf(!withDate)('should apply shouldDisableMonth', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} shouldDisableMonth={function (date) { return pickers_1.adapterToUse.getMonth(date) === 2; }} value={pickers_1.adapterToUse.date('2018-03-12')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableMonth');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            setProps({ value: pickers_1.adapterToUse.date('2019-03-09') });
            expect(onErrorMock.callCount).to.equal(1);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            setProps({ value: pickers_1.adapterToUse.date('2018-04-09') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
        });
        it.skipIf(!withTime)('should apply shouldDisableTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} shouldDisableTime={function (value, view) {
                    var comparingValue = pickers_1.adapterToUse.getHours(value);
                    if (view === 'minutes') {
                        comparingValue = pickers_1.adapterToUse.getMinutes(value);
                    }
                    else if (view === 'seconds') {
                        comparingValue = pickers_1.adapterToUse.getSeconds(value);
                    }
                    return comparingValue === 10;
                }} value={pickers_1.adapterToUse.date('2018-03-12T10:05:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableTime-hours');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            setProps({ value: pickers_1.adapterToUse.date('2019-03-12T09:05:00') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            setProps({ value: pickers_1.adapterToUse.date('2018-03-12T09:10:00') });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableTime-minutes');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            setProps({ value: pickers_1.adapterToUse.date('2018-03-12T09:09:00') });
            expect(onErrorMock.callCount).to.equal(4);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            setProps({ value: pickers_1.adapterToUse.date('2018-03-12T09:09:10') });
            expect(onErrorMock.callCount).to.equal(5);
            expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableTime-seconds');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
        });
        describe.skipIf(!withDate)('with fake timers', function () {
            beforeEach(function () {
                vitest_1.vi.setSystemTime(new Date(2018, 0, 1));
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should apply disablePast', function () {
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    return <ElementToTest value={now} {...props}/>;
                }
                var onErrorMock = (0, sinon_1.spy)();
                var setProps = render(<WithFakeTimer disablePast onError={onErrorMock}/>).setProps;
                var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
                var yesterday = pickers_1.adapterToUse.addDays(now, -1);
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
                setProps({ value: yesterday });
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('disablePast');
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
                setProps({ value: tomorrow });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.equal(null);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            });
        });
        it.skipIf(!withDate)('should apply disableFuture', function () {
            var now = pickers_1.adapterToUse.date();
            function WithFakeTimer(props) {
                return <ElementToTest value={now} {...props}/>;
            }
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<WithFakeTimer disableFuture onError={onErrorMock}/>).setProps;
            var tomorrow = pickers_1.adapterToUse.addDays(now, 1);
            var yesterday = pickers_1.adapterToUse.addDays(now, -1);
            expect(onErrorMock.callCount).to.equal(0);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            setProps({ value: tomorrow });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.equal('disableFuture');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            setProps({ value: yesterday });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
        });
        it.skipIf(['picker', 'field'].includes(componentFamily) && !withDate)('should apply minDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2019-06-01')} minDate={pickers_1.adapterToUse.date('2019-06-15')}/>).setProps;
            if (withDate) {
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('minDate');
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
                setProps({ value: pickers_1.adapterToUse.date('2019-06-20') });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.equal(null);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
            else {
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
        });
        it.skipIf(['picker', 'field'].includes(componentFamily) && !withDate)('should apply maxDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2019-06-25')} maxDate={pickers_1.adapterToUse.date('2019-06-15')}/>).setProps;
            if (withDate) {
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('maxDate');
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
                setProps({ value: pickers_1.adapterToUse.date('2019-06-10') });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.equal(null);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
            else {
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
        });
        it.skipIf(['picker', 'field'].includes(componentFamily) && !withTime)('should apply minTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2019-06-15T10:15:00')} minTime={pickers_1.adapterToUse.date('2010-01-01T12:00:00')}/>).setProps;
            if (withTime) {
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('minTime');
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
                setProps({ value: pickers_1.adapterToUse.date('2019-06-15T13:10:00') });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.equal(null);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
            else {
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
        });
        it.skipIf(['picker', 'field'].includes(componentFamily) && !withTime)('should apply maxTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} maxTime={pickers_1.adapterToUse.date('2010-01-01T12:00:00')} value={pickers_1.adapterToUse.date('2019-06-15T10:15:00')}/>).setProps;
            if (withTime) {
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
                setProps({ value: pickers_1.adapterToUse.date('2019-06-15T13:10:00') });
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('maxTime');
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            }
            else {
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
        });
        it.skipIf(!withDate || !withTime)('should apply maxDateTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2019-06-15T13:15:00')} maxDateTime={pickers_1.adapterToUse.date('2019-06-15T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.equal('maxTime');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            // Test 5 minutes before
            setProps({ value: pickers_1.adapterToUse.date('2019-06-15T11:55:00') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            // Test 1 day before
            setProps({ value: pickers_1.adapterToUse.date('2019-06-14T20:10:00') });
            expect(onErrorMock.callCount).to.equal(2);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            // Test 1 day after
            setProps({ value: pickers_1.adapterToUse.date('2019-06-16T10:00:00') });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.equal('maxDate');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
        });
        it.skipIf(!withDate || !withTime)('should apply minDateTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2019-06-15T13:15:00')} minDateTime={pickers_1.adapterToUse.date('2019-06-15T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            // Test 5 minutes before (invalid)
            setProps({ value: pickers_1.adapterToUse.date('2019-06-15T11:55:00') });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.equal('minTime');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            // Test 1 day before (invalid)
            setProps({ value: pickers_1.adapterToUse.date('2019-06-14T20:10:00') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.equal('minDate');
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
            // Test 1 day after
            setProps({ value: pickers_1.adapterToUse.date('2019-06-16T10:00:00') });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.equal(null);
            expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
        });
        it.skipIf(['picker', 'field'].includes(componentFamily) && !withTime)('should apply minutesStep', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={pickers_1.adapterToUse.date('2019-06-15T10:15:00')} minutesStep={30}/>).setProps;
            if (withTime) {
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.equal('minutesStep');
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'true');
                setProps({ value: pickers_1.adapterToUse.date('2019-06-15T10:30:00') });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.equal(null);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
            else {
                expect(onErrorMock.callCount).to.equal(0);
                expect((0, pickers_1.getFieldInputRoot)()).to.have.attribute('aria-invalid', 'false');
            }
        });
    });
};
exports.testTextFieldValidation = testTextFieldValidation;
