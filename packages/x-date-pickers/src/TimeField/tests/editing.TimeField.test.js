"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var TimeField_1 = require("@mui/x-date-pickers/TimeField");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
describe('<TimeField /> - Editing', function () {
    (0, pickers_1.describeAdapters)('key: ArrowDown', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        describe('24 hours format (ArrowDown)', function () {
            it('should set the hour to 23 when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.hours24h,
                    key: 'ArrowDown',
                    expectedValue: '23',
                });
            });
            it('should decrement the hour when a value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.hours24h,
                    defaultValue: adapter.date('2022-06-15T14:12:25'),
                    key: 'ArrowDown',
                    expectedValue: '13',
                });
            });
            it('should go to the last hour of the previous day when a value in the first hour is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime24h,
                    defaultValue: adapter.date('2022-06-15T00:12:25'),
                    key: 'ArrowDown',
                    expectedValue: '23:12',
                });
            });
            it('should set the minutes to 59 when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.minutes,
                    key: 'ArrowDown',
                    expectedValue: '59',
                });
            });
            it('should decrement the minutes when a value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.minutes,
                    defaultValue: adapter.date('2022-06-15T14:12:25'),
                    key: 'ArrowDown',
                    expectedValue: '11',
                });
            });
            it('should go to the last minute of the current hour when a value with 0 minutes is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime24h,
                    defaultValue: adapter.date('2022-06-15T14:00:25'),
                    key: 'ArrowDown',
                    expectedValue: '14:59',
                    selectedSection: 'minutes',
                });
            });
        });
        describe('12 hours format (ArrowDown)', function () {
            it('should set the hour to 11 when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.hours12h,
                    key: 'ArrowDown',
                    expectedValue: '12',
                });
            });
            it('should go to the last hour of the current morning when a value in the first hour is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    defaultValue: adapter.date('2022-06-15T00:12:25'),
                    key: 'ArrowDown',
                    expectedValue: '11:12 AM',
                });
            });
            it('should set the meridiem to PM when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    key: 'ArrowDown',
                    expectedValue: 'hh:mm PM',
                    selectedSection: 'meridiem',
                });
            });
            it('should set the meridiem to PM when a value in AM is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    defaultValue: adapter.date('2022-06-15T02:12:25'),
                    key: 'ArrowDown',
                    expectedValue: '02:12 PM',
                    selectedSection: 'meridiem',
                });
            });
            it('should set the meridiem to AM when a value in PM is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    defaultValue: adapter.date('2022-06-15T14:12:25'),
                    key: 'ArrowDown',
                    expectedValue: '02:12 AM',
                    selectedSection: 'meridiem',
                });
            });
        });
    });
    (0, pickers_1.describeAdapters)('key: ArrowUp', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        describe('24 hours format (ArrowUp)', function () {
            it('should set the hour to 0 when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.hours24h,
                    key: 'ArrowUp',
                    expectedValue: '00',
                });
            });
            it('should increment the hour when a value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.hours24h,
                    defaultValue: adapter.date('2022-06-15T14:12:25'),
                    key: 'ArrowUp',
                    expectedValue: '15',
                });
            });
            it('should go to the first hour of the current day when a value in the last hour is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime24h,
                    defaultValue: adapter.date('2022-06-15T23:12:25'),
                    key: 'ArrowUp',
                    expectedValue: '00:12',
                });
            });
            it('should set the minutes to 00 when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.minutes,
                    key: 'ArrowUp',
                    expectedValue: '00',
                });
            });
            it('should increment the minutes when a value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.minutes,
                    defaultValue: adapter.date('2022-06-15T14:12:25'),
                    key: 'ArrowUp',
                    expectedValue: '13',
                });
            });
            it('should go to the first minute of the current hour when a value with 59 minutes is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime24h,
                    defaultValue: adapter.date('2022-06-15T14:59:25'),
                    key: 'ArrowUp',
                    expectedValue: '14:00',
                    selectedSection: 'minutes',
                });
            });
        });
        describe('12 hours format (ArrowUp)', function () {
            it('should set the meridiem to AM when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    key: 'ArrowUp',
                    expectedValue: 'hh:mm AM',
                    selectedSection: 'meridiem',
                });
            });
            it('should set the meridiem to PM when a value in AM is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    defaultValue: adapter.date('2022-06-15T02:12:25'),
                    key: 'ArrowUp',
                    expectedValue: '02:12 PM',
                    selectedSection: 'meridiem',
                });
            });
            it('should set the meridiem to AM when a value in PM is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.fullTime12h,
                    defaultValue: adapter.date('2022-06-15T14:12:25'),
                    key: 'ArrowUp',
                    expectedValue: '02:12 AM',
                    selectedSection: 'meridiem',
                });
            });
        });
    });
    (0, pickers_1.describeAdapters)('key: PageDown', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        describe('24 hours format (PageDown)', function () {
            describe('Hours field', function () {
                it('should set hours field to maximal when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageDown',
                        expectedValue: '23',
                        selectedSection: 'hours',
                    });
                });
                it('should decrement hours field by 5 when default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageDown',
                        defaultValue: adapter.date('2024-06-04T10:25:00'),
                        expectedValue: '05',
                        selectedSection: 'hours',
                    });
                });
                it('should flip hours field when default value is lower than 5', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageDown',
                        defaultValue: adapter.date('2024-06-04T02:25:00'),
                        expectedValue: '21',
                        selectedSection: 'hours',
                    });
                });
            });
            describe('Minutes field', function () {
                it('should set minutes field to maximal when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.minutes,
                        key: 'PageDown',
                        expectedValue: '59',
                    });
                });
                it('should decrement minutes field by 5 when default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.minutes,
                        key: 'PageDown',
                        defaultValue: adapter.date('2024-06-04T10:59:00'),
                        expectedValue: '54',
                    });
                });
                it('should flip minutes field when default value is lower than 5', function () {
                    testFieldKeyPress({
                        format: adapter.formats.minutes,
                        key: 'PageDown',
                        defaultValue: adapter.date('2024-06-04T02:02:00'),
                        expectedValue: '57',
                    });
                });
            });
        });
        describe('12 hours format (PageDown)', function () {
            describe('Hours field', function () {
                it('should set hours field to maximal when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours12h,
                        key: 'PageDown',
                        expectedValue: '12',
                    });
                });
                it('should decrement hours field by 5 when default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours12h,
                        key: 'PageDown',
                        defaultValue: adapter.date('2024-06-04T10:25:00'),
                        expectedValue: '05',
                    });
                });
                it('should flip hours field when default value is lower than 5', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours12h,
                        key: 'PageDown',
                        defaultValue: adapter.date('2024-06-04T02:25:00'),
                        expectedValue: '09',
                    });
                });
            });
            describe('Meridiem field', function () {
                it('should set meridiem to PM when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.meridiem,
                        key: 'PageDown',
                        expectedValue: 'PM',
                        selectedSection: 'meridiem',
                    });
                });
                it('should switch between AM and PM when meridiem value is not empty', function () {
                    testFieldKeyPress({
                        format: adapter.formats.meridiem,
                        defaultValue: adapter.date('2024-05-30T02:12:25'),
                        key: 'PageDown',
                        expectedValue: 'PM',
                        selectedSection: 'meridiem',
                    });
                    testFieldKeyPress({
                        format: adapter.formats.meridiem,
                        defaultValue: adapter.date('2024-05-30T20:12:25'),
                        key: 'PageDown',
                        expectedValue: 'AM',
                        selectedSection: 'meridiem',
                    });
                });
            });
        });
    });
    (0, pickers_1.describeAdapters)('key: PageUp', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        describe('24 hours format (PageUp)', function () {
            describe('Hours field', function () {
                it('should set hours field to minimal when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageUp',
                        expectedValue: '00',
                        selectedSection: 'hours',
                    });
                });
                it('should increment hours field by 5 when default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageUp',
                        defaultValue: adapter.date('2024-06-04T10:25:00'),
                        expectedValue: '15',
                        selectedSection: 'hours',
                    });
                });
                it('should flip hours field when default value is higher than 19', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageUp',
                        defaultValue: adapter.date('2024-06-04T21:25:00'),
                        expectedValue: '02',
                        selectedSection: 'hours',
                    });
                });
            });
            describe('Minutes field', function () {
                it('should set minutes field to minimal when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours24h,
                        key: 'PageUp',
                        expectedValue: '00',
                    });
                });
                it('should increment minutes field by 5 when default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.minutes,
                        key: 'PageUp',
                        defaultValue: adapter.date('2024-06-04T10:25:00'),
                        expectedValue: '30',
                    });
                });
                it('should flip minutes field when default value is higher than 55', function () {
                    testFieldKeyPress({
                        format: adapter.formats.minutes,
                        key: 'PageUp',
                        defaultValue: adapter.date('2024-06-04T21:56:00'),
                        expectedValue: '01',
                    });
                });
            });
        });
        describe('12 hours format (PageUp)', function () {
            describe('Hours field', function () {
                it('should set hours field to minimal when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours12h,
                        key: 'PageUp',
                        expectedValue: '01',
                        selectedSection: 'hours',
                    });
                });
                it('should increment hours field by 5 when default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours12h,
                        key: 'PageUp',
                        defaultValue: adapter.date('2024-06-04T05:25:00'),
                        expectedValue: '10',
                        selectedSection: 'hours',
                    });
                });
                it('should flip hours field when default value is higher than 07', function () {
                    testFieldKeyPress({
                        format: adapter.formats.hours12h,
                        key: 'PageUp',
                        defaultValue: adapter.date('2024-06-04T08:25:00'),
                        expectedValue: '01',
                        selectedSection: 'hours',
                    });
                });
            });
            describe('Meridiem field', function () {
                it('should set meridiem to AM when no default value is provided', function () {
                    testFieldKeyPress({
                        format: adapter.formats.meridiem,
                        key: 'PageUp',
                        expectedValue: 'AM',
                        selectedSection: 'meridiem',
                    });
                });
                it('should switch between AM and PM when meridiem value is not empty', function () {
                    testFieldKeyPress({
                        format: adapter.formats.meridiem,
                        defaultValue: adapter.date('2024-05-30T02:12:25'),
                        key: 'PageUp',
                        expectedValue: 'PM',
                        selectedSection: 'meridiem',
                    });
                    testFieldKeyPress({
                        format: adapter.formats.meridiem,
                        defaultValue: adapter.date('2024-05-30T20:12:25'),
                        key: 'PageUp',
                        expectedValue: 'AM',
                        selectedSection: 'meridiem',
                    });
                });
            });
        });
    });
    (0, pickers_1.describeAdapters)('Digit editing', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps, testFieldChange = _a.testFieldChange;
        it('should set the minute to the digit pressed when no digit no value is provided', function () {
            testFieldChange({
                format: adapter.formats.minutes,
                keyStrokes: [{ value: '1', expected: '01' }],
            });
        });
        it('should concatenate the digit pressed to the current section value if the output is valid', function () {
            testFieldChange({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:12:25'),
                keyStrokes: [
                    { value: '1', expected: '01' },
                    { value: '2', expected: '12' },
                ],
            });
        });
        it('should set the minute to the digit pressed if the concatenate exceeds the maximum value for the section', function () {
            testFieldChange({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:12:25'),
                keyStrokes: [
                    { value: '7', expected: '07' },
                    { value: '2', expected: '02' },
                ],
            });
        });
        it('should not edit when props.readOnly = true and no value is provided (digit)', function () {
            testFieldChange({
                format: adapter.formats.minutes,
                readOnly: true,
                keyStrokes: [{ value: '1', expected: 'mm' }],
            });
        });
        it('should not edit value when props.readOnly = true and a value is provided (digit)', function () {
            testFieldChange({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:12:25'),
                readOnly: true,
                keyStrokes: [{ value: '1', expected: '12' }],
            });
        });
        it('should go to the next section when pressing `2` in a 12-hours format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: adapter.formats.fullTime12h,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '2');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02:mm aa');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('mm');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: adapter.formats.fullTime12h,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 2:
                        _a.sent();
                        // Press "2"
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '2:mm aa' } });
                        (0, pickers_1.expectFieldValueV6)(input, '02:mm aa');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('mm');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to the next section when pressing `1` then `3` in a 12-hours format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: adapter.formats.fullTime12h,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '1');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01:mm aa');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('01');
                        // Press "3"
                        view.pressKey(0, '3');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '03:mm aa');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('mm');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: adapter.formats.fullTime12h,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 2:
                        _a.sent();
                        // Press "1"
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '1:mm aa' } });
                        (0, pickers_1.expectFieldValueV6)(input, '01:mm aa');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('01');
                        // Press "3"
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '3:mm aa' } });
                        (0, pickers_1.expectFieldValueV6)(input, '03:mm aa');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('mm');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Letter editing', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, testFieldChange = _a.testFieldChange;
        it('should not edit when props.readOnly = true and no value is provided (letter)', function () {
            testFieldChange({
                format: adapter.formats.meridiem,
                readOnly: true,
                keyStrokes: [{ value: 'a', expected: 'aa' }],
            });
        });
        it('should not edit value when props.readOnly = true and a value is provided (letter)', function () {
            testFieldChange({
                format: adapter.formats.meridiem,
                defaultValue: adapter.date('2022-06-15T14:12:25'),
                readOnly: true,
                keyStrokes: [{ value: 'a', expected: 'PM' }],
            });
        });
        it('should set meridiem to AM when pressing "a" and no value is provided', function () {
            testFieldChange({
                format: adapter.formats.meridiem,
                selectedSection: 'meridiem',
                // Press "a"
                keyStrokes: [{ value: 'a', expected: 'AM' }],
            });
        });
        it('should set meridiem to PM when pressing "p" and no value is provided', function () {
            testFieldChange({
                format: adapter.formats.meridiem,
                selectedSection: 'meridiem',
                // Press "p"
                keyStrokes: [{ value: 'p', expected: 'PM' }],
            });
        });
        it('should set meridiem to AM when pressing "a" and a value is provided', function () {
            testFieldChange({
                format: adapter.formats.meridiem,
                defaultValue: adapter.date('2022-06-15T14:12:25'),
                selectedSection: 'meridiem',
                // Press "a"
                keyStrokes: [{ value: 'a', expected: 'AM' }],
            });
        });
        it('should set meridiem to PM when pressing "p" and a value is provided', function () {
            testFieldChange({
                format: adapter.formats.meridiem,
                defaultValue: adapter.date('2022-06-15T14:12:25'),
                selectedSection: 'meridiem',
                // Press "p"
                keyStrokes: [{ value: 'p', expected: 'PM' }],
            });
        });
        it('should not edit when pressing the Space key', function () {
            testFieldChange({
                format: adapter.formats.hours24h,
                keyStrokes: [{ value: ' ', expected: 'hh' }],
            });
        });
    });
    (0, pickers_1.describeAdapters)('Do not loose missing section values ', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should not loose date information when a value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 1:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowDown' });
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not loose date information when cleaning the date then filling it again', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV7,
                            format: adapter.formats.fullTime24h,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 1:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        view.pressKey(null, '');
                        internal_test_utils_1.fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowLeft' });
                        view.pressKey(0, '3');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '03:mm');
                        view.pressKey(1, '4');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '03:04');
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 3, 4, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                            format: adapter.formats.fullTime24h,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '' } });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '3:mm' } }); // Press "3"
                        (0, pickers_1.expectFieldValueV6)(input, '03:mm');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '03:4' } }); // Press "3"
                        (0, pickers_1.expectFieldValueV6)(input, '03:04');
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 3, 4, 3));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not loose time information when using the hour format and value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV7,
                            format: adapter.formats.hours24h,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 1:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                            format: adapter.formats.hours24h,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('hours')];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowDown' });
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('props: minutesStep', TimeField_1.TimeField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        it('should use `minutesStep` to set initial minutes with ArrowUp', function () {
            testFieldKeyPress({
                format: adapter.formats.minutes,
                key: 'ArrowUp',
                minutesStep: 5,
                expectedValue: '00',
            });
        });
        it('should use `minutesStep` to set initial minutes with ArrowDown', function () {
            testFieldKeyPress({
                format: adapter.formats.minutes,
                key: 'ArrowDown',
                minutesStep: 5,
                expectedValue: '00',
            });
        });
        it('should use `minutesStep` to increase minutes', function () {
            testFieldKeyPress({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:00:25'),
                key: 'ArrowUp',
                minutesStep: 5,
                expectedValue: '05',
            });
        });
        it('should use `minutesStep` to decrease minutes', function () {
            testFieldKeyPress({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:00:25'),
                key: 'ArrowDown',
                minutesStep: 5,
                expectedValue: '55',
            });
        });
        it('should go to the closest valid values according to `minutesStep` when pressing ArrowDown', function () {
            testFieldKeyPress({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:02:25'),
                key: 'ArrowDown',
                minutesStep: 5,
                expectedValue: '00',
            });
        });
        it('should go to the closest valid values according to `minutesStep` when pressing ArrowUp', function () {
            testFieldKeyPress({
                format: adapter.formats.minutes,
                defaultValue: adapter.date('2022-06-15T14:02:25'),
                key: 'ArrowUp',
                minutesStep: 5,
                expectedValue: '05',
            });
        });
    });
});
