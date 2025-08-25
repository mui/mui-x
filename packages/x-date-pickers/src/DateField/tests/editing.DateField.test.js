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
var DateField_1 = require("@mui/x-date-pickers/DateField");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
describe('<DateField /> - Editing', function () {
    (0, pickers_1.describeAdapters)('value props (value, defaultValue, onChange)', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should call the onChange callback when the value is updated but should not change the displayed value if the value is controlled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: adapter.date('2022-06-04'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        view.pressKey(2, 'ArrowUp');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            value: adapter.date('2022-06-04'),
                            onChange: onChangeV6,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 2:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'ArrowUp' });
                        (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022');
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call the onChange callback when the value is updated and should change the displayed value if the value is not controlled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2022-06-04'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        view.pressKey(2, 'ArrowUp');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2023');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: adapter.date('2022-06-04'),
                            onChange: onChangeV6,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 2:
                        _a.sent();
                        fireUserEvent_1.fireUserEvent.keyPress((0, pickers_1.getTextbox)(), { key: 'ArrowUp' });
                        (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2023');
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call the onChange callback before filling the last section when starting from a null value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: null,
                            onChange: onChangeV7,
                            format: "".concat(adapter.formats.dayOfMonth, " ").concat(adapter.formats.monthShort),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '4');
                        expect(onChangeV7.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '04 MMMM');
                        view.pressKey(1, 'S');
                        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 4));
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'DD MMMM');
                            })];
                    case 2:
                        _a.sent();
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            value: null,
                            onChange: onChangeV6,
                            format: "".concat(adapter.formats.dayOfMonth, " ").concat(adapter.formats.monthShort),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 3:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '4 MMMM' } }); // Press 4
                        expect(onChangeV6.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV6)(input, '04 MMMM');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '04 S' } }); // Press S
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 4));
                        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                (0, pickers_1.expectFieldValueV6)(input, 'DD MMMM');
                            })];
                    case 4:
                        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Disabled field', DateField_1.DateField, function (_a) {
        var renderWithProps = _a.renderWithProps;
        it('should not allow key editing on disabled field', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, keys, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                            disabled: true,
                        });
                        keys = [
                            'ArrowUp',
                            'ArrowDown',
                            'PageUp',
                            'PageDown',
                            'Home',
                            'End',
                            'Delete',
                            'ArrowLeft',
                            'ArrowRight',
                        ];
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        keys.forEach(function (key) {
                            view.pressKey(0, key);
                            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                            expect(onChangeV7.callCount).to.equal(0);
                        });
                        // digit key press
                        fireUserEvent_1.fireUserEvent.keyPress(view.getActiveSection(0), { key: '2' });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                            disabled: true,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // v6 doesn't allow focusing on sections when disabled
                        keys.forEach(function (key) {
                            internal_test_utils_1.fireEvent.change(input, { target: { value: key } });
                            expect(document.activeElement).not.to.equal(input);
                            (0, pickers_1.expectFieldValueV6)(input, '');
                        });
                        expect(onChangeV6.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Digit editing', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldChange = _a.testFieldChange, renderWithProps = _a.renderWithProps;
        it('should set the day to the digit pressed when no digit no value is provided', function () {
            testFieldChange({
                format: adapter.formats.dayOfMonth,
                keyStrokes: [{ value: '1', expected: '01' }],
            });
        });
        it('should concatenate the digit pressed to the current section value if the output is valid (digit format)', function () {
            testFieldChange({
                format: adapter.formats.dayOfMonth,
                defaultValue: adapter.date('2022-06-01'),
                keyStrokes: [
                    { value: '1', expected: '01' },
                    { value: '1', expected: '11' },
                ],
            });
        });
        it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (digit format)', function () {
            testFieldChange({
                format: adapter.formats.dayOfMonth,
                defaultValue: adapter.date('2022-06-04'),
                keyStrokes: [{ value: '1', expected: '01' }],
            });
        });
        it('should concatenate the digit pressed to the current section value if the output is valid (letter format)', function () {
            testFieldChange({
                format: adapter.formats.month,
                defaultValue: adapter.date('2022-02-01'),
                keyStrokes: [
                    { value: '1', expected: 'January' },
                    { value: '1', expected: 'November' },
                ],
            });
        });
        it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (letter format)', function () {
            testFieldChange({
                format: adapter.formats.month,
                defaultValue: adapter.date('2022-06-01'),
                keyStrokes: [{ value: '1', expected: 'January' }],
            });
        });
        it('should support 2-digits year format', function () {
            testFieldChange({
                // This format is not present in any of the adapter formats
                format: adapter.lib.includes('moment') || adapter.lib.includes('dayjs') ? 'YY' : 'yy',
                keyStrokes: [
                    // 1st year: 22
                    { value: '2', expected: '02' },
                    { value: '2', expected: '22' },
                    // 2nd year: 32
                    { value: '3', expected: '03' },
                    { value: '2', expected: '32' },
                    // 3rd year: 00
                    { value: '0', expected: '00' },
                ],
            });
        });
        it('should support 2-digits year format when a value is provided', function () {
            testFieldChange({
                // This format is not present in any of the adapter formats
                format: adapter.lib.includes('moment') || adapter.lib.includes('dayjs') ? 'YY' : 'yy',
                defaultValue: adapter.date('2022-06-04'),
                keyStrokes: [
                    { value: '2', expected: '02' },
                    { value: '2', expected: '22' },
                    { value: '3', expected: '03' },
                ],
            });
        });
        it('should support 4-digits year format', function () {
            testFieldChange({
                format: adapter.formats.year,
                keyStrokes: [
                    { value: '2', expected: '0002' },
                    { value: '0', expected: '0020' },
                    { value: '2', expected: '0202' },
                    { value: '2', expected: '2022' },
                    { value: '2', expected: '0002' },
                    { value: '0', expected: '0020' },
                    { value: '2', expected: '0202' },
                    { value: '3', expected: '2023' },
                ],
            });
        });
        it('should support 4-digits year format when a value is provided', function () {
            testFieldChange({
                format: adapter.formats.year,
                defaultValue: adapter.date('2022-06-04'),
                keyStrokes: [
                    { value: '2', expected: '0002' },
                    { value: '0', expected: '0020' },
                    { value: '2', expected: '0202' },
                    { value: '2', expected: '2022' },
                    { value: '2', expected: '0002' },
                    { value: '0', expected: '0020' },
                    { value: '2', expected: '0202' },
                    { value: '3', expected: '2023' },
                ],
            });
        });
        it('should support month without trailing zeros format', function () {
            testFieldChange({
                format: 'M', // This format is not present in any of the adapter formats
                keyStrokes: [
                    { value: '1', expected: '1' },
                    { value: '1', expected: '11' },
                    { value: '2', expected: '2' },
                ],
                shouldRespectLeadingZeros: true,
            });
        });
        // Luxon doesn't have any day format with a letter suffix
        it.skipIf(adapter.lib === 'luxon')('should support day with letter suffix', function () {
            testFieldChange({
                format: adapter.lib === 'date-fns' ? 'do' : 'Do',
                keyStrokes: [
                    { value: '1', expected: '1st' },
                    { value: '2', expected: '12th' },
                    { value: '2', expected: '2nd' },
                ],
            });
        });
        it('should respect leading zeros when shouldRespectLeadingZeros = true', function () {
            testFieldChange({
                format: ['luxon', 'date-fns'].includes(adapter.lib) ? 'd' : 'D',
                shouldRespectLeadingZeros: true,
                keyStrokes: [
                    { value: '1', expected: '1' },
                    { value: '2', expected: '12' },
                    { value: '2', expected: '2' },
                ],
            });
        });
        it('should not respect leading zeros when shouldRespectLeadingZeros = false', function () {
            testFieldChange({
                format: ['luxon', 'date-fns'].includes(adapter.lib) ? 'd' : 'D',
                shouldRespectLeadingZeros: false,
                keyStrokes: [
                    { value: '1', expected: '01' },
                    { value: '2', expected: '12' },
                    { value: '2', expected: '02' },
                ],
            });
        });
        it('should allow to type the date 29th of February for leap years', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: adapter.formats.keyboardDate,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('2')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('2')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/02/YYYY');
                        return [4 /*yield*/, view.user.keyboard('9')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/29/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/29/0001');
                        return [4 /*yield*/, view.user.keyboard('9')];
                    case 6:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/29/0019');
                        return [4 /*yield*/, view.user.keyboard('8')];
                    case 7:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/29/0198');
                        return [4 /*yield*/, view.user.keyboard('8')];
                    case 8:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/29/1988');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: adapter.formats.keyboardDate,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('2')];
                    case 10:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('2')];
                    case 11:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/02/YYYY');
                        return [4 /*yield*/, view.user.keyboard('9')];
                    case 12:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/29/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 13:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/29/0001');
                        return [4 /*yield*/, view.user.keyboard('9')];
                    case 14:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/29/0019');
                        return [4 /*yield*/, view.user.keyboard('8')];
                    case 15:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/29/0198');
                        return [4 /*yield*/, view.user.keyboard('8')];
                    case 16:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '02/29/1988');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not edit when props.readOnly = true and no value is provided', function () {
            testFieldChange({
                format: adapter.formats.year,
                readOnly: true,
                keyStrokes: [{ value: '1', expected: 'YYYY' }],
            });
        });
        it('should not edit value when props.readOnly = true and a value is provided', function () {
            testFieldChange({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                readOnly: true,
                keyStrokes: [{ value: '1', expected: '2022' }],
            });
        });
        it('should reset the select "all" state when typing a digit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM/DD/YYYY');
                        view.pressKey(null, '1');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('01');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        // select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM/DD/YYYY');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '1/DD/YYYY' } });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('01');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be editable after reenabling field', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            disabled: true,
                        });
                        view.setProps({
                            enableAccessibleFieldDOMStructure: true,
                            disabled: false,
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    view.getSection(2).focus();
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        view.pressKey(undefined, '2');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/0002');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            disabled: true,
                        });
                        view.setProps({
                            enableAccessibleFieldDOMStructure: false,
                            disabled: false,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('3')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), 'MM/DD/0003');
                        view.unmount();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Letter editing', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldChange = _a.testFieldChange, testFieldKeyPress = _a.testFieldKeyPress, renderWithProps = _a.renderWithProps;
        it('should select the first matching month with no previous query and no value is provided (letter format)', function () {
            testFieldChange({
                format: adapter.formats.month,
                keyStrokes: [{ value: 'm', expected: 'March' }],
            });
        });
        it('should select the first matching month with no previous query and a value is provided (letter format)', function () {
            testFieldChange({
                format: adapter.formats.month,
                defaultValue: adapter.date(),
                keyStrokes: [{ value: 'm', expected: 'March' }],
            });
        });
        it('should use the previously typed letters as long as it matches at least one month (letter format)', function () {
            testFieldChange({
                format: adapter.formats.month,
                keyStrokes: [
                    // Current query: "J" => 3 matches
                    { value: 'j', expected: 'January' },
                    // Current query: "JU" => 2 matches
                    { value: 'u', expected: 'June' },
                    // Current query: "JUL" => 1 match
                    { value: 'l', expected: 'July' },
                    // Current query: "JULO" => 0 match => fallback set the query to "O"
                    { value: 'o', expected: 'October' },
                ],
            });
        });
        it('should select the first matching month with no previous query and no value is provided (digit format)', function () {
            testFieldChange({
                format: 'MM', // This format is not present in any of the adapter formats
                keyStrokes: [{ value: 'm', expected: '03' }],
            });
        });
        it('should select the first matching month with no previous query and a value is provided (digit format)', function () {
            testFieldChange({
                format: 'MM', // This format is not present in any of the adapter formats
                defaultValue: adapter.date(),
                keyStrokes: [{ value: 'm', expected: '03' }],
            });
        });
        it('should use the previously typed letters as long as it matches at least one month (digit format)', function () {
            testFieldChange({
                format: 'MM', // This format is not present in any of the adapter formats
                keyStrokes: [
                    // Current query: "J" => 3 matches
                    { value: 'j', expected: '01' },
                    // Current query: "JU" => 2 matches
                    { value: 'u', expected: '06' },
                    // Current query: "JUL" => 1 match
                    { value: 'l', expected: '07' },
                    // Current query: "JULO" => 0 match => fallback set the query to "O"
                    { value: 'o', expected: '10' },
                ],
            });
        });
        it('should not edit when props.readOnly = true and no value is provided (letter)', function () {
            testFieldKeyPress({
                format: adapter.formats.month,
                readOnly: true,
                key: '1',
                expectedValue: 'MMMM',
            });
        });
        it('should not edit value when props.readOnly = true and a value is provided (letter)', function () {
            testFieldKeyPress({
                format: adapter.formats.month,
                defaultValue: adapter.date(),
                readOnly: true,
                key: 'd',
                expectedValue: 'June',
            });
        });
        it('should reset the select "all" state when typing a letter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM/DD/YYYY');
                        view.pressKey(null, 'j');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(adapter.lib === 'luxon' ? '1' : '01');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        // select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM/DD/YYYY');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'j/DD/YYYY' } });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal(adapter.lib === 'luxon' ? '1' : '01');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)("Backspace editing", DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps, testFieldChange = _a.testFieldChange;
        it('should clear the selected section when only this section is completed (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('j')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January YYYY');
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('j')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'January YYYY');
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 6:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear the selected section when all sections are completed (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM 2022');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM 2022');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        view.pressKey(null, '');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '' } });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('j')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('j')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'January YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 6:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not keep query after typing again on a cleared section (Backspace)', function () {
            testFieldChange({
                format: adapter.formats.year,
                keyStrokes: [
                    { value: '2', expected: '0002' },
                    { value: '', expected: 'YYYY' },
                    { value: '2', expected: '0002' },
                ],
            });
        });
        it('should not clear the sections when props.readOnly = true (Backspace)', function () {
            testFieldChange({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                readOnly: true,
                keyStrokes: [{ value: '', expected: '2022' }],
            });
        });
        it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', function () {
            var onChange = (0, sinon_1.spy)();
            testFieldChange({
                format: adapter.formats.year,
                onChange: onChange,
                keyStrokes: [{ value: '', expected: 'YYYY' }],
            });
            expect(onChange.callCount).to.equal(0);
        });
        it('should call `onChange` when clearing the first section (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).to.equal(null);
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 2:
                        _a.sent();
                        view.pressKey(1, '');
                        expect(onChangeV7.callCount).to.equal(1);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: ' 2022' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).to.equal(null);
                        return [4 /*yield*/, view.user.keyboard('{ArrowRight}')];
                    case 4:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'MMMM ' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call `onChange` if the section is already empty (Backspace)', function () {
            var onChange = (0, sinon_1.spy)();
            testFieldChange({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                keyStrokes: [
                    { value: '', expected: 'YYYY' },
                    { value: '', expected: 'YYYY' },
                ],
                onChange: onChange,
            });
            expect(onChange.callCount).to.equal(2);
        });
    });
    (0, pickers_1.describeAdapters)('Pasting', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        var firePasteEventV7 = function (element, pastedValue) { return __awaiter(void 0, void 0, void 0, function () {
            var clipboardEvent, canContinue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clipboardEvent = new window.Event('paste', {
                            bubbles: true,
                            cancelable: true,
                            composed: true,
                        });
                        // @ts-ignore
                        clipboardEvent.clipboardData = {
                            getData: function () { return pastedValue; },
                        };
                        canContinue = true;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                // canContinue is `false` if default have been prevented
                                canContinue = element.dispatchEvent(clipboardEvent);
                            })];
                    case 1:
                        _a.sent();
                        if (!canContinue) {
                            return [2 /*return*/];
                        }
                        internal_test_utils_1.fireEvent.input(element, { target: { textContent: pastedValue } });
                        return [2 /*return*/];
                }
            });
        }); };
        var firePasteEventV6 = function (input, pastedValue, rawValue) { return __awaiter(void 0, void 0, void 0, function () {
            var clipboardEvent, canContinue, prevValue, nextValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clipboardEvent = new window.Event('paste', {
                            bubbles: true,
                            cancelable: true,
                            composed: true,
                        });
                        // @ts-ignore
                        clipboardEvent.clipboardData = {
                            getData: function () { var _a; return (_a = pastedValue !== null && pastedValue !== void 0 ? pastedValue : rawValue) !== null && _a !== void 0 ? _a : ''; },
                        };
                        canContinue = true;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                // canContinue is `false` if default have been prevented
                                canContinue = input.dispatchEvent(clipboardEvent);
                            })];
                    case 1:
                        _a.sent();
                        if (!canContinue) {
                            return [2 /*return*/];
                        }
                        if (!pastedValue) {
                            return [2 /*return*/];
                        }
                        prevValue = input.value;
                        nextValue = "".concat(prevValue.slice(0, input.selectionStart || 0)).concat(pastedValue).concat(prevValue.slice(input.selectionEnd || 0));
                        internal_test_utils_1.fireEvent.change(input, { target: { value: nextValue } });
                        return [2 /*return*/];
                }
            });
        }); };
        it('should set the date when all sections are selected, the pasted value is valid and a value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date(),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), '09/16/2022')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            defaultValue: adapter.date(),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, firePasteEventV6(input, '09/16/2022')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the date when all sections are selected, the pasted value is valid and no value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), '09/16/2022')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, firePasteEventV6(input, '09/16/2022')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not set the date when all sections are selected and the pasted value is not valid', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), 'Some invalid content')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, firePasteEventV6(input, 'Some invalid content')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MM/DD/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the date when all sections are selected and the format contains escaped characters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, startChar, endChar, onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = adapter.escapedCharacters, startChar = _a.start, endChar = _a.end;
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _b.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), "Escaped 2014")];
                    case 2:
                        _b.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(adapter.getYear(onChangeV7.lastCall.firstArg)).to.equal(2014);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 3:
                        _b.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, firePasteEventV6(input, "Escaped 2014")];
                    case 4:
                        _b.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(adapter.getYear(onChangeV6.lastCall.firstArg)).to.equal(2014);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not set the date when all sections are selected and props.readOnly = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                            readOnly: true,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), '09/16/2022')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(0);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            readOnly: true,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, firePasteEventV6(input, '09/16/2022')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the section when one section is selected, the pasted value has the correct type and no value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        return [4 /*yield*/, firePasteEventV7(view.getActiveSection(0), '12')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '12/DD/YYYY');
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MM/DD/YYYY');
                        return [4 /*yield*/, firePasteEventV6(input, '12')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV6)(input, '12/DD/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the section when one section is selected, the pasted value has the correct type and value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2018-01-13'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/13/2018');
                        return [4 /*yield*/, firePasteEventV7(view.getActiveSection(0), '12')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '12/13/2018');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2018, 11, 13));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            defaultValue: adapter.date('2018-01-13'),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '01/13/2018');
                        return [4 /*yield*/, firePasteEventV6(input, '12')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '12/13/2018');
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2018, 11, 13));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update the section when one section is selected and the pasted value has incorrect type', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2018-01-13'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/13/2018');
                        return [4 /*yield*/, firePasteEventV7(view.getActiveSection(0), 'Jun')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/13/2018');
                        expect(onChangeV7.callCount).to.equal(0);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            defaultValue: adapter.date('2018-01-13'),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '01/13/2018');
                        return [4 /*yield*/, firePasteEventV6(input, 'Jun')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '01/13/2018');
                        expect(onChangeV6.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset sections internal state when pasting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2018-12-05'),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 1:
                        _a.sent();
                        view.pressKey(1, '2');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '12/02/2018');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'a', keyCode: 65, ctrlKey: true });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), '09/16/2022')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '09/16/2022');
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 3:
                        _a.sent();
                        view.pressKey(1, '2'); // Press 2
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '09/02/2022'); // If internal state is not reset it would be 22 instead of 02
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            defaultValue: adapter.date('2018-12-05'),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 4:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '12/2/2018' } }); // Press 2
                        (0, pickers_1.expectFieldValueV6)(input, '12/02/2018');
                        return [4 /*yield*/, firePasteEventV6(input, '09/16/2022')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '09/16/2022');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '09/2/2022' } }); // Press 2
                        (0, pickers_1.expectFieldValueV6)(input, '09/02/2022'); // If internal state is not reset it would be 22 instead of 02
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow pasting a section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2018-12-05'),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '1'); // Press 1
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/05/2018');
                        return [4 /*yield*/, firePasteEventV7(view.getActiveSection(0), '05')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '05/05/2018');
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent(); // move back to month section
                        view.pressKey(0, '2'); // check that the search query has been cleared after pasting
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '02/05/2018'); // If internal state is not reset it would be 12 instead of 02
                        view.unmount();
                        view = renderWithProps({
                            defaultValue: adapter.date('2018-12-05'),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 4:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '1/05/2018' } }); // initiate search query on month section
                        (0, pickers_1.expectFieldValueV6)(input, '01/05/2018');
                        return [4 /*yield*/, firePasteEventV6(input, undefined, '05')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '05/05/2018');
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 6:
                        _a.sent(); // move back to month section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '2/05/2018' } }); // check that the search query has been cleared after pasting
                        (0, pickers_1.expectFieldValueV6)(input, '02/05/2018'); // If internal state is not reset it would be 12 instead of 02
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow pasting on disabled field', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChangeV7,
                            disabled: true,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, firePasteEventV7(view.getSectionsContainer(), '09/16/2022')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                            disabled: true,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, firePasteEventV6(input, '9')];
                    case 4:
                        _a.sent();
                        // v6 doesn't allow focusing on sections when disabled
                        expect(document.activeElement).not.to.equal(input);
                        expect(onChangeV6.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV6)(input, '');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Do not loose missing section values ', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should not loose time information when a value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{ArrowDown}')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not loose time information when cleaning the date then filling it again', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('25')];
                    case 6:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/25/YYYY');
                        return [4 /*yield*/, view.user.keyboard('2009')];
                    case 7:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/25/2009');
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2009, 10, 25, 3, 3, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 8:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(input, {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        return [4 /*yield*/, view.user.keyboard('[Backspace][ArrowLeft]')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 10:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '01/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 11:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('25')];
                    case 12:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/25/YYYY');
                        return [4 /*yield*/, view.user.keyboard('2009')];
                    case 13:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/25/2009');
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2009, 10, 25, 3, 3, 3));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not loose date information when using the year format and value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: adapter.formats.year,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            format: adapter.formats.year,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{ArrowDown}')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not loose date information when using the month format and value is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: adapter.formats.month,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 2, 3, 3, 3, 3));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            format: adapter.formats.month,
                            defaultValue: adapter.date('2010-04-03T03:03:03'),
                            onChange: onChangeV6,
                            enableAccessibleFieldDOMStructure: false,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{ArrowDown}')];
                    case 4:
                        _a.sent();
                        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 2, 3, 3, 3, 3));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Imperative change (without any section selected)', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should set the date when the change value is valid and no value is provided', function () {
            // Test with accessible DOM structure
            var onChangeV7 = (0, sinon_1.spy)();
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChangeV7,
            });
            internal_test_utils_1.fireEvent.change(view.getHiddenInput(), { target: { value: '09/16/2022' } });
            expect(onChangeV7.callCount).to.equal(1);
            expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
            view.unmount();
            // Test with non-accessible DOM structure
            var onChangeV6 = (0, sinon_1.spy)();
            renderWithProps({
                onChange: onChangeV6,
                enableAccessibleFieldDOMStructure: false,
            });
            var input = (0, pickers_1.getTextbox)();
            internal_test_utils_1.fireEvent.change(input, { target: { value: '09/16/2022' } });
            expect(onChangeV6.callCount).to.equal(1);
            expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
        });
        it('should set the date when the change value is valid and a value is provided', function () {
            // Test with accessible DOM structure
            var onChangeV7 = (0, sinon_1.spy)();
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                defaultValue: adapter.date('2010-04-03T03:03:03'),
                onChange: onChangeV7,
            });
            internal_test_utils_1.fireEvent.change(view.getHiddenInput(), { target: { value: '09/16/2022' } });
            expect(onChangeV7.callCount).to.equal(1);
            expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16, 3, 3, 3));
            view.unmount();
            // Test with non-accessible DOM structure
            var onChangeV6 = (0, sinon_1.spy)();
            renderWithProps({
                defaultValue: adapter.date('2010-04-03T03:03:03'),
                onChange: onChangeV6,
                enableAccessibleFieldDOMStructure: false,
            });
            var input = (0, pickers_1.getTextbox)();
            internal_test_utils_1.fireEvent.change(input, { target: { value: '09/16/2022' } });
            expect(onChangeV6.callCount).to.equal(1);
            expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16, 3, 3, 3));
        });
    });
    (0, pickers_1.describeAdapters)('Android editing (<input /> textfield DOM structure only)', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        var originalUserAgent = '';
        beforeEach(function () {
            originalUserAgent = globalThis.navigator.userAgent;
            Object.defineProperty(globalThis.navigator, 'userAgent', {
                configurable: true,
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36',
            });
        });
        afterEach(function () {
            Object.defineProperty(globalThis.navigator, 'userAgent', {
                configurable: true,
                value: originalUserAgent,
            });
        });
        it('should support digit editing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input, initialValueStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            defaultValue: adapter.date('2022-11-23'),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        initialValueStr = input.value;
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 1:
                        _a.sent();
                        // Remove the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: initialValueStr.replace('23', '') } });
                        // Set the key pressed in the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: initialValueStr.replace('23', '2') } });
                        // Remove the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: initialValueStr.replace('23', '') } });
                        // Set the key pressed in the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: initialValueStr.replace('23', '1') } });
                        (0, pickers_1.expectFieldValueV6)(input, '11/01/2022');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support letter editing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            defaultValue: adapter.date('2022-01-16'),
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Remove the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: ' 2022' } });
                        // Set the key pressed in the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'J 2022' } });
                        // Remove the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: ' 2022' } });
                        // Set the key pressed in the selected section
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'a 2022' } });
                        (0, pickers_1.expectFieldValueV6)(input, 'April 2022');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Editing from the outside', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should be able to reset the value from the outside', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: adapter.date('2022-11-23'),
                        });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/23/2022');
                        view.setProps({ value: null });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            value: adapter.date('2022-11-23'),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        (0, pickers_1.expectFieldValueV6)(input, '11/23/2022');
                        view.setProps({ value: null });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MM/DD/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it.skipIf(adapter.lib !== 'dayjs')('should reset the input query state on an unfocused field', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true, value: null });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/01/YYYY');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    view.getSectionsContainer().blur();
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 5:
                        _a.sent();
                        view.setProps({ value: adapter.date('2022-11-23') });
                        view.setProps({ value: null });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 7:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 8:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 9:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '11/01/YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false, value: null });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 11:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '01/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 12:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 13:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/01/YYYY');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    input.blur();
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 14:
                        _a.sent();
                        view.setProps({ value: adapter.date('2022-11-23') });
                        view.setProps({ value: null });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 16:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '01/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 17:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/DD/YYYY');
                        return [4 /*yield*/, view.user.keyboard('1')];
                    case 18:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, '11/01/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('Select all', DateField_1.DateField, function (_a) {
        var renderWithProps = _a.renderWithProps;
        it('should edit the 1st section when all sections are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        // When all sections are selected, the value only contains the key pressed
                        view.pressKey(null, '9');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '09/DD/YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        // When all sections are selected, the value only contains the key pressed
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '9' } });
                        (0, pickers_1.expectFieldValueV6)(input, '09/DD/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
