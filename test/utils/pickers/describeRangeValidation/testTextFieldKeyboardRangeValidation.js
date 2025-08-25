"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTextFieldKeyboardRangeValidation = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var pickers_1 = require("test/utils/pickers");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var vitest_1 = require("vitest");
var testInvalidStatus = function (expectedAnswer, fieldType) {
    var answers = fieldType === 'multi-input' ? expectedAnswer : [expectedAnswer[0] || expectedAnswer[1]];
    var fieldInputRoots = (0, pickers_1.getAllFieldInputRoot)();
    answers.forEach(function (answer, index) {
        var fieldInputRoot = fieldInputRoots[index];
        expect(fieldInputRoot).to.have.attribute('aria-invalid', answer ? 'true' : 'false');
    });
};
var testTextFieldKeyboardRangeValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), componentFamily = _a.componentFamily, render = _a.render, fieldType = _a.fieldType, withDate = _a.withDate, withTime = _a.withTime, setValue = _a.setValue;
    describe.skipIf(componentFamily !== 'field' || !setValue)('text field keyboard:', function () {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        var setValue = getOptions().setValue;
        it('should not accept end date prior to start state', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock}/>);
            expect(onErrorMock.callCount).to.equal(0);
            (0, createRenderer_1.act)(function () {
                [
                    pickers_1.adapterToUse.date('2018-01-02T12:00:00'),
                    pickers_1.adapterToUse.date('2018-01-01T11:00:00'),
                ].forEach(function (date, index) {
                    setValue(date, { setEndDate: index === 1 });
                });
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['invalidRange', 'invalidRange']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withDate)('should apply shouldDisableDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} shouldDisableDate={function (date) {
                    return pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-11'));
                }}/>).setProps;
            (0, createRenderer_1.act)(function () {
                [pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')].forEach(function (date, index) {
                    setValue(date, { setEndDate: index === 1 });
                });
            });
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-13'), { setEndDate: true });
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
            testInvalidStatus([false, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-12'));
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([
                'shouldDisableDate',
                'shouldDisableDate',
            ]);
            testInvalidStatus([true, true], fieldType);
            setProps({
                shouldDisableDate: function (date) {
                    return pickers_1.adapterToUse.isBefore(date, pickers_1.adapterToUse.date('2018-03-13'));
                },
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['shouldDisableDate', null]);
            testInvalidStatus([true, false], fieldType);
        });
        describe('with fake timers', function () {
            beforeEach(function () {
                vitest_1.vi.setSystemTime(new Date(2018, 0, 1));
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should apply disablePast', function () {
                var onErrorMock = (0, sinon_1.spy)();
                var now = pickers_1.adapterToUse.date();
                render(<ElementToTest disablePast onError={onErrorMock}/>);
                var past = null;
                if (withDate) {
                    past = pickers_1.adapterToUse.addDays(now, -1);
                }
                else if (pickers_1.adapterToUse.isSameDay(pickers_1.adapterToUse.addHours(now, -1), now)) {
                    past = pickers_1.adapterToUse.addHours(now, -1);
                }
                if (past === null) {
                    return;
                }
                (0, createRenderer_1.act)(function () {
                    setValue(past);
                });
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', null]);
                testInvalidStatus([true, false], fieldType);
                (0, createRenderer_1.act)(function () {
                    setValue(past, { setEndDate: true });
                });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', 'disablePast']);
                testInvalidStatus([true, true], fieldType);
                (0, createRenderer_1.act)(function () {
                    setValue(now);
                });
                expect(onErrorMock.callCount).to.equal(3);
                expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disablePast']);
                testInvalidStatus([false, true], fieldType);
            });
        });
        it('should apply disableFuture', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var now = pickers_1.adapterToUse.date();
            render(<ElementToTest disableFuture onError={onErrorMock}/>);
            var future = null;
            if (withDate) {
                future = pickers_1.adapterToUse.addDays(now, 1);
            }
            else if (pickers_1.adapterToUse.isSameDay(pickers_1.adapterToUse.addHours(now, 1), now)) {
                future = pickers_1.adapterToUse.addHours(now, 1);
            }
            if (future === null) {
                return;
            }
            (0, createRenderer_1.act)(function () {
                setValue(future, { setEndDate: true });
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disableFuture']);
            testInvalidStatus([false, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(future);
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disableFuture', 'disableFuture']);
            testInvalidStatus([true, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(now);
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disableFuture']);
            testInvalidStatus([false, true], fieldType);
        });
        it.skipIf(!withDate)('should apply minDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock} minDate={pickers_1.adapterToUse.date('2018-03-15')}/>);
            (0, createRenderer_1.act)(function () {
                [pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')].forEach(function (date, index) {
                    setValue(date, { setEndDate: index === 1 });
                });
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', 'minDate']);
            testInvalidStatus([true, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-15'));
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'minDate']);
            testInvalidStatus([false, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-16'), { setEndDate: true });
            });
            expect(onErrorMock.callCount).to.equal(4);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withDate)('should apply maxDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock} maxDate={pickers_1.adapterToUse.date('2018-03-15')}/>);
            (0, createRenderer_1.act)(function () {
                [pickers_1.adapterToUse.date('2018-03-15'), pickers_1.adapterToUse.date('2018-03-17')].forEach(function (date, index) {
                    setValue(date, { setEndDate: index === 1 });
                });
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxDate']);
            testInvalidStatus([false, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-16'));
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxDate', 'maxDate']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withTime)('should apply minTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock} minTime={pickers_1.adapterToUse.date('2018-03-10T12:00:00')}/>);
            (0, createRenderer_1.act)(function () {
                [
                    pickers_1.adapterToUse.date('2018-03-10T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-10T10:00:00'),
                ].forEach(function (date, index) {
                    setValue(date, { setEndDate: index === 1 });
                });
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', 'minTime']);
            testInvalidStatus([true, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-10T12:10:00'), { setEndDate: true });
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', null]);
            testInvalidStatus([true, false], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-10T12:05:00'));
            });
            expect(onErrorMock.callCount).to.equal(4);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withTime)('should apply maxTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock} maxTime={pickers_1.adapterToUse.date('2018-03-10T12:00:00')}/>);
            (0, createRenderer_1.act)(function () {
                [
                    pickers_1.adapterToUse.date('2018-03-10T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-10T12:15:00'),
                ].forEach(function (date, index) {
                    setValue(date, { setEndDate: index === 1 });
                });
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxTime']);
            testInvalidStatus([false, true], fieldType);
            (0, createRenderer_1.act)(function () {
                setValue(pickers_1.adapterToUse.date('2018-03-10T12:05:00'));
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxTime']);
            testInvalidStatus([true, true], fieldType);
        });
    });
};
exports.testTextFieldKeyboardRangeValidation = testTextFieldKeyboardRangeValidation;
