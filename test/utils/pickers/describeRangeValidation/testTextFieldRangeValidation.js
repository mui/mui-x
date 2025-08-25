"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTextFieldRangeValidation = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
var testInvalidStatus = function (expectedAnswer, fieldType) {
    var answers = fieldType === 'multi-input' ? expectedAnswer : [expectedAnswer[0] || expectedAnswer[1]];
    var fields = (0, pickers_1.getAllFieldInputRoot)();
    answers.forEach(function (answer, index) {
        var fieldRoot = fields[index];
        expect(fieldRoot).to.have.attribute('aria-invalid', answer ? 'true' : 'false');
    });
};
var testTextFieldRangeValidation = function (ElementToTest, getOptions) {
    var _a = getOptions(), componentFamily = _a.componentFamily, render = _a.render, fieldType = _a.fieldType, withDate = _a.withDate, withTime = _a.withTime;
    describe.skipIf(!['picker', 'field'].includes(componentFamily))('text field:', function () {
        it('should accept single day range', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-01-01T10:15:00'),
                    pickers_1.adapterToUse.date('2018-01-01T10:15:00'),
                ]}/>);
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
        });
        it('should not accept end date prior to start state', function () {
            var onErrorMock = (0, sinon_1.spy)();
            render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-01-02'), pickers_1.adapterToUse.date('2018-01-01')]}/>);
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['invalidRange', 'invalidRange']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withDate)('should apply shouldDisableDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')]} shouldDisableDate={function (date) {
                    return pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-10'));
                }}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-13')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-12'), pickers_1.adapterToUse.date('2018-03-13')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([
                'shouldDisableDate',
                'shouldDisableDate',
            ]);
            testInvalidStatus([true, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-12'), pickers_1.adapterToUse.date('2018-03-13')],
                shouldDisableDate: function (date) {
                    return pickers_1.adapterToUse.isBefore(date, pickers_1.adapterToUse.date('2018-03-13'));
                },
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['shouldDisableDate', null]);
            testInvalidStatus([true, false], fieldType);
        });
        it.skipIf(!withDate)('should apply shouldDisableDate specifically on end date', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')]} shouldDisableDate={function (date, position) {
                    return position === 'end' ? pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-10')) : false;
                }}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-13')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-12'), pickers_1.adapterToUse.date('2018-03-13')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-12'), pickers_1.adapterToUse.date('2018-03-13')],
                shouldDisableDate: function (date, position) {
                    return position === 'end' ? pickers_1.adapterToUse.isBefore(date, pickers_1.adapterToUse.date('2018-03-13')) : false;
                },
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withDate)('should apply shouldDisableDate specifically on start date', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')]} shouldDisableDate={function (date, position) {
                    return position === 'start'
                        ? pickers_1.adapterToUse.isAfter(date, pickers_1.adapterToUse.date('2018-03-10'))
                        : false;
                }}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-13')],
            });
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-12'), pickers_1.adapterToUse.date('2018-03-13')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['shouldDisableDate', null]);
            testInvalidStatus([true, false], fieldType);
            setProps({
                shouldDisableDate: function (date, position) {
                    return position === 'start'
                        ? pickers_1.adapterToUse.isBefore(date, pickers_1.adapterToUse.date('2018-03-13'))
                        : false;
                },
            });
            expect(onErrorMock.callCount).to.equal(1);
            testInvalidStatus([true, false], fieldType);
        });
        describe('with fake timer', function () {
            beforeEach(function () {
                vitest_1.vi.setSystemTime(new Date(2018, 0, 1));
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should apply disablePast', function () {
                var onErrorMock = (0, sinon_1.spy)();
                var now = pickers_1.adapterToUse.date();
                function WithFakeTimer(props) {
                    return <ElementToTest value={[now, now]} {...props}/>;
                }
                var setProps = render(<WithFakeTimer disablePast onError={onErrorMock}/>).setProps;
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
                setProps({
                    value: [past, now],
                });
                expect(onErrorMock.callCount).to.equal(1);
                expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', null]);
                testInvalidStatus([true, false], fieldType);
                setProps({
                    value: [past, past],
                });
                expect(onErrorMock.callCount).to.equal(2);
                expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', 'disablePast']);
                testInvalidStatus([true, true], fieldType);
            });
        });
        it('should apply disableFuture', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var now = pickers_1.adapterToUse.date();
            function WithFakeTimer(props) {
                return <ElementToTest value={[now, now]} {...props}/>;
            }
            var setProps = render(<WithFakeTimer disableFuture onError={onErrorMock}/>).setProps;
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
            setProps({
                value: [now, future],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disableFuture']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [future, future],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disableFuture', 'disableFuture']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withDate)('should apply minDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')]} minDate={pickers_1.adapterToUse.date('2018-03-15')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', 'minDate']);
            testInvalidStatus([true, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-15')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', null]);
            testInvalidStatus([true, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-16'), pickers_1.adapterToUse.date('2018-03-17')],
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withDate)('should apply minDate when only first field is filled', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-03-09'), null]} minDate={pickers_1.adapterToUse.date('2018-03-11')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', null]);
            testInvalidStatus([true, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-16'), null],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withDate)('should apply minDate when only second field is filled', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[null, pickers_1.adapterToUse.date('2018-03-09')]} minDate={pickers_1.adapterToUse.date('2018-03-15')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'minDate']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [null, pickers_1.adapterToUse.date('2018-03-16')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withDate)('should apply maxDate', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-03-09'), pickers_1.adapterToUse.date('2018-03-10')]} maxDate={pickers_1.adapterToUse.date('2018-03-15')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-15'), pickers_1.adapterToUse.date('2018-03-17')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxDate']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-16'), pickers_1.adapterToUse.date('2018-03-17')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxDate', 'maxDate']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withTime)('should apply minTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-03-10T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-10T10:00:00'),
                ]} minTime={pickers_1.adapterToUse.date('2018-03-10T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', 'minTime']);
            testInvalidStatus([true, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-10T09:00:00'), pickers_1.adapterToUse.date('2018-03-10T12:05:00')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', null]);
            testInvalidStatus([true, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-10T12:15:00'), pickers_1.adapterToUse.date('2018-03-10T18:00:00')],
            });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withTime)('should ignore date when applying minTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-03-05T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-15T10:00:00'),
                ]} minTime={pickers_1.adapterToUse.date('2018-03-10T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', 'minTime']);
            testInvalidStatus([true, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-05T15:00:00'), pickers_1.adapterToUse.date('2018-03-15T16:05:00')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
        it.skipIf(!withTime)('should apply minTime when only first field is filled', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[pickers_1.adapterToUse.date('2018-02-01T15:00:00'), null]} minTime={pickers_1.adapterToUse.date('2018-03-01T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-02-01T05:00:00'), null],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', null]);
            testInvalidStatus([true, false], fieldType);
        });
        it.skipIf(!withTime)('should apply minTime when only second field is filled', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[null, pickers_1.adapterToUse.date('2018-02-01T15:00:00')]} minTime={pickers_1.adapterToUse.date('2018-03-01T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [null, pickers_1.adapterToUse.date('2018-02-01T05:00:00')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'minTime']);
            testInvalidStatus([false, true], fieldType);
        });
        it.skipIf(!withTime)('should apply maxTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-03-10T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-10T10:00:00'),
                ]} maxTime={pickers_1.adapterToUse.date('2018-03-10T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-10T09:00:00'), pickers_1.adapterToUse.date('2018-03-10T12:05:00')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxTime']);
            testInvalidStatus([false, true], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-10T12:15:00'), pickers_1.adapterToUse.date('2018-03-10T18:00:00')],
            });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxTime']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withTime)('should ignore date when applying maxTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-03-05T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-15T10:00:00'),
                ]} maxTime={pickers_1.adapterToUse.date('2018-03-10T12:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({
                value: [pickers_1.adapterToUse.date('2018-03-05T15:00:00'), pickers_1.adapterToUse.date('2018-03-15T16:05:00')],
            });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxTime']);
            testInvalidStatus([true, true], fieldType);
        });
        // prop only available on DateTime pickers
        it.skipIf(!withDate || !withTime)('should apply maxDateTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-03-01T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-02T12:00:00'),
                ]} maxDateTime={pickers_1.adapterToUse.date('2018-03-02T13:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(0);
            testInvalidStatus([false, false], fieldType);
            setProps({ maxDateTime: pickers_1.adapterToUse.date('2018-03-02T08:00:00') });
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxTime']);
            testInvalidStatus([false, true], fieldType);
            setProps({ maxDateTime: pickers_1.adapterToUse.date('2018-03-01T05:00:00') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxDate']);
            testInvalidStatus([true, true], fieldType);
        });
        it.skipIf(!withDate || !withTime)('should apply minDateTime', function () {
            var onErrorMock = (0, sinon_1.spy)();
            var setProps = render(<ElementToTest onError={onErrorMock} value={[
                    pickers_1.adapterToUse.date('2018-03-01T09:00:00'),
                    pickers_1.adapterToUse.date('2018-03-02T12:00:00'),
                ]} minDateTime={pickers_1.adapterToUse.date('2018-03-02T13:00:00')}/>).setProps;
            expect(onErrorMock.callCount).to.equal(1);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', 'minTime']);
            testInvalidStatus([true, true], fieldType);
            setProps({ minDateTime: pickers_1.adapterToUse.date('2018-03-02T08:00:00') });
            expect(onErrorMock.callCount).to.equal(2);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', null]);
            testInvalidStatus([true, false], fieldType);
            setProps({ minDateTime: pickers_1.adapterToUse.date('2018-03-01T05:00:00') });
            expect(onErrorMock.callCount).to.equal(3);
            expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
            testInvalidStatus([false, false], fieldType);
        });
    });
};
exports.testTextFieldRangeValidation = testTextFieldRangeValidation;
