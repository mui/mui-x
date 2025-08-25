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
describe('<DateField /> - Editing Keyboard', function () {
    (0, pickers_1.describeAdapters)('key: ArrowDown', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        it("should set the year to today's value when no value is provided (ArrowDown)", function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                key: 'ArrowDown',
                expectedValue: '2022',
            });
        });
        it('should decrement the year when a value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                key: 'ArrowDown',
                expectedValue: '2021',
            });
        });
        it('should set the month to December when no value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.month,
                key: 'ArrowDown',
                expectedValue: 'December',
            });
        });
        it('should decrement the month when a value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.month,
                defaultValue: adapter.date(),
                key: 'ArrowDown',
                expectedValue: 'May',
            });
        });
        it('should go to the last month of the current year when a value in January is provided', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                defaultValue: adapter.date('2022-01-15'),
                key: 'ArrowDown',
                expectedValue: 'December 2022',
            });
        });
        it('should set the day to 31 when no value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.dayOfMonth,
                key: 'ArrowDown',
                expectedValue: '31',
            });
        });
        it('should decrement the day when a value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.dayOfMonth,
                defaultValue: adapter.date(),
                key: 'ArrowDown',
                expectedValue: '14',
            });
        });
        it('should decrement the month and keep the day when the new month has fewer days', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.dayOfMonth),
                defaultValue: adapter.date('2022-05-31'),
                key: 'ArrowDown',
                expectedValue: 'April 31',
            });
        });
        it('should go to the last day of the current month when a value in the first day of the month is provided', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.dayOfMonth),
                defaultValue: adapter.date('2022-06-01'),
                key: 'ArrowDown',
                expectedValue: 'June 30',
                selectedSection: 'day',
            });
        });
        it('should not edit the value when props.readOnly = true and no value is provided (ArrowDown)', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                readOnly: true,
                key: 'ArrowDown',
                expectedValue: 'YYYY',
            });
        });
        it('should not edit the value when props.readOnly = true and a value is provided (ArrowDown)', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                readOnly: true,
                key: 'ArrowDown',
                expectedValue: '2022',
            });
        });
    });
    (0, pickers_1.describeAdapters)('key: ArrowUp', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        it("should set the year to today's value when no value is provided (ArrowUp)", function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                key: 'ArrowUp',
                expectedValue: '2022',
            });
        });
        it('should increment the year when a value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                key: 'ArrowUp',
                expectedValue: '2023',
            });
        });
        it('should set the month to January when no value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.month,
                key: 'ArrowUp',
                expectedValue: 'January',
            });
        });
        it('should increment the month when a value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.month,
                defaultValue: adapter.date(),
                key: 'ArrowUp',
                expectedValue: 'July',
            });
        });
        it('should go to the first month of the current year when a value in December is provided', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                defaultValue: adapter.date('2022-12-15'),
                key: 'ArrowUp',
                expectedValue: 'January 2022',
            });
        });
        it('should set the day 1 when no value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.dayOfMonth,
                key: 'ArrowUp',
                expectedValue: '01',
            });
        });
        it('should increment the day when a value is provided', function () {
            testFieldKeyPress({
                format: adapter.formats.dayOfMonth,
                defaultValue: adapter.date(),
                key: 'ArrowUp',
                expectedValue: '16',
            });
        });
        it('should increment the month and keep the day when the new month has fewer days', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.dayOfMonth),
                defaultValue: adapter.date('2022-05-31'),
                key: 'ArrowUp',
                expectedValue: 'June 31',
            });
        });
        it('should go to the first day of the current month when a value in the last day of the month is provided', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.dayOfMonth),
                defaultValue: adapter.date('2022-06-30'),
                key: 'ArrowUp',
                expectedValue: 'June 01',
                selectedSection: 'day',
            });
        });
        it('should not edit the value when props.readOnly = true and no value is provided (ArrowUp)', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                readOnly: true,
                key: 'ArrowUp',
                expectedValue: 'YYYY',
            });
        });
        it('should not edit the value when props.readOnly = true and a value is provided (ArrowUp)', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                readOnly: true,
                key: 'ArrowUp',
                expectedValue: '2022',
            });
        });
    });
    (0, pickers_1.describeAdapters)('key: Delete', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress, renderWithProps = _a.renderWithProps;
        it('should clear the selected section when only this section is completed', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        // Set a value for the "month" section
                        view.pressKey(0, 'j');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January YYYY');
                        fireUserEvent_1.fireUserEvent.keyPress(view.getActiveSection(0), { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Set a value for the "month" section
                        internal_test_utils_1.fireEvent.change(input, {
                            target: { value: 'j YYYY' },
                        }); // press "j"
                        (0, pickers_1.expectFieldValueV6)(input, 'January YYYY');
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear the selected section when all sections are completed', function () {
            testFieldKeyPress({
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                defaultValue: adapter.date(),
                key: 'Delete',
                expectedValue: 'MMMM 2022',
            });
        });
        it('should clear all the sections when all sections are selected and all sections are completed', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        fireUserEvent_1.fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear all the sections when all sections are selected and not all sections are completed', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        // Set a value for the "month" section
                        view.pressKey(0, 'j');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        fireUserEvent_1.fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Set a value for the "month" section
                        internal_test_utils_1.fireEvent.change(input, {
                            target: { value: 'j YYYY' },
                        }); // Press "j"
                        (0, pickers_1.expectFieldValueV6)(input, 'January YYYY');
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not keep query after typing again on a cleared section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: adapter.formats.year,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '2');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '0002');
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'YYYY');
                        view.pressKey(0, '2');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '0002');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: adapter.formats.year,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 3:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '2' } }); // press "2"
                        (0, pickers_1.expectFieldValueV6)(input, '0002');
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'YYYY');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '2' } }); // press "2"
                        (0, pickers_1.expectFieldValueV6)(input, '0002');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not clear the sections when props.readOnly = true', function () {
            testFieldKeyPress({
                format: adapter.formats.year,
                defaultValue: adapter.date(),
                readOnly: true,
                key: 'Delete',
                expectedValue: '2022',
            });
        });
        it('should not call `onChange` when clearing all sections and both dates are already empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
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
                        fireUserEvent_1.fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(0);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call `onChange` when clearing the first section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6;
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
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg).to.equal(null);
                        return [4 /*yield*/, view.user.keyboard('[ArrowRight][Delete]')];
                    case 3:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                            onChange: onChangeV6,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 5:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg).to.equal(null);
                        return [4 /*yield*/, view.user.keyboard('[ArrowRight][Delete]')];
                    case 6:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call `onChange` if the section is already empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6;
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
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 3:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: adapter.date(),
                            onChange: onChangeV6,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 5:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        return [4 /*yield*/, view.user.keyboard('[Delete]')];
                    case 6:
                        _a.sent();
                        expect(onChangeV6.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)('key: PageUp', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        describe('day section (PageUp)', function () {
            it('should set day to minimal when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.dayOfMonth,
                    key: 'PageUp',
                    expectedValue: '01',
                });
            });
            it('should increment day by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.dayOfMonth,
                    defaultValue: adapter.date('2022-01-15'),
                    key: 'PageUp',
                    expectedValue: '20',
                });
            });
            it('should flip day field when value is higher than 27', function () {
                testFieldKeyPress({
                    format: adapter.formats.dayOfMonth,
                    defaultValue: adapter.date('2022-01-28'),
                    key: 'PageUp',
                    expectedValue: '02',
                });
            });
        });
        describe('weekday section (PageUp)', function () {
            it('should set weekday to Sunday when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.weekday,
                    key: 'PageUp',
                    expectedValue: 'Sunday',
                });
            });
            it('should increment weekday by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.weekday,
                    defaultValue: adapter.date('2024-06-03'),
                    key: 'PageUp',
                    expectedValue: 'Saturday',
                });
            });
            it('should flip weekday field when value is higher than 3', function () {
                testFieldKeyPress({
                    format: adapter.formats.weekday,
                    defaultValue: adapter.date('2024-06-07'),
                    key: 'PageUp',
                    expectedValue: 'Wednesday',
                });
            });
        });
        describe('month section (PageUp)', function () {
            it('should set month to January when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.month,
                    key: 'PageUp',
                    expectedValue: 'January',
                });
            });
            it('should increment month by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.month,
                    defaultValue: adapter.date('2022-01-15'),
                    key: 'PageUp',
                    expectedValue: 'June',
                });
            });
            it('should flip month field when value is higher than 7', function () {
                testFieldKeyPress({
                    format: adapter.formats.month,
                    defaultValue: adapter.date('2022-08-15'),
                    key: 'PageUp',
                    expectedValue: 'January',
                });
            });
        });
        describe('year section (PageUp)', function () {
            it('should set year to current year when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.year,
                    key: 'PageUp',
                    expectedValue: new Date().getFullYear().toString(),
                });
            });
            it('should increment year by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.year,
                    defaultValue: adapter.date('2022-01-15'),
                    key: 'PageUp',
                    expectedValue: '2027',
                });
            });
            it('should flip year field when value is higher than 9995', function () {
                testFieldKeyPress({
                    format: adapter.formats.year,
                    defaultValue: adapter.date('9996-01-15'),
                    key: 'PageUp',
                    expectedValue: '0001',
                });
            });
        });
    });
    (0, pickers_1.describeAdapters)('key: PageDown', DateField_1.DateField, function (_a) {
        var adapter = _a.adapter, testFieldKeyPress = _a.testFieldKeyPress;
        describe('day section (PageDown)', function () {
            it('should set day to maximal when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.dayOfMonth,
                    key: 'PageDown',
                    expectedValue: '31',
                });
            });
            it('should decrement day by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.dayOfMonth,
                    defaultValue: adapter.date('2022-01-15'),
                    key: 'PageDown',
                    expectedValue: '10',
                });
            });
            it('should flip day field when value is lower than 5', function () {
                testFieldKeyPress({
                    format: adapter.formats.dayOfMonth,
                    defaultValue: adapter.date('2022-01-04'),
                    key: 'PageDown',
                    expectedValue: '30',
                });
            });
        });
        describe('weekday section (PageDown)', function () {
            it('should set weekday to Saturday when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.weekday,
                    key: 'PageDown',
                    expectedValue: 'Saturday',
                });
            });
            it('should decrement weekday by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.weekday,
                    defaultValue: adapter.date('2024-06-22'),
                    key: 'PageDown',
                    expectedValue: 'Monday',
                });
            });
            it('should flip weekday field when value is lower than 5', function () {
                testFieldKeyPress({
                    format: adapter.formats.weekday,
                    defaultValue: adapter.date('2024-06-23'),
                    key: 'PageDown',
                    expectedValue: 'Tuesday',
                });
            });
        });
        describe('month section (PageDown)', function () {
            it('should set month to December when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.month,
                    key: 'PageDown',
                    expectedValue: 'December',
                });
            });
            it('should decrement month by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.month,
                    defaultValue: adapter.date('2022-10-15'),
                    key: 'PageDown',
                    expectedValue: 'May',
                });
            });
            it('should flip month field when value is lower than 5', function () {
                testFieldKeyPress({
                    format: adapter.formats.month,
                    defaultValue: adapter.date('2022-04-15'),
                    key: 'PageDown',
                    expectedValue: 'November',
                });
            });
        });
        describe('year section (PageDown)', function () {
            it('should set year to current year when no value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.year,
                    key: 'PageDown',
                    expectedValue: new Date().getFullYear().toString(),
                });
            });
            it('should decrement year by 5 when value is provided', function () {
                testFieldKeyPress({
                    format: adapter.formats.year,
                    defaultValue: adapter.date('2022-01-15'),
                    key: 'PageDown',
                    expectedValue: '2017',
                });
            });
            it('should flip year field when value is lower than 5', function () {
                testFieldKeyPress({
                    format: adapter.formats.year,
                    defaultValue: adapter.date('0003-01-15'),
                    key: 'PageDown',
                    expectedValue: adapter.lib === 'dayjs' ? '1898' : '9998',
                });
            });
        });
    });
});
