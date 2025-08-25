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
var SingleInputDateRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateRangeField");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
describe('<SingleInputDateRangeField /> - Editing', function () {
    (0, pickers_1.describeAdapters)('value props (value, defaultValue, onChange)', SingleInputDateRangeField_1.SingleInputDateRangeField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should not render any value when no value and no default value are defined', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '');
        });
        it('should use the default value when defined', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – 06/05/2022');
        });
        it('should use the controlled value instead of the default value when both are defined', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
                defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
                defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – 06/05/2022');
        });
        it('should use the controlled value instead of the default value when both are defined and the controlled value has null dates', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                value: [adapter.date('2022-06-04'), null],
                defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – MM/DD/YYYY');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                value: [adapter.date('2022-06-04'), null],
                defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – MM/DD/YYYY');
        });
        it('should react to controlled value update (from a non null date to another non null date)', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
            view.setProps({
                value: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2023 – 06/05/2023');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – 06/05/2022');
            view.setProps({
                value: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2023 – 06/05/2023');
        });
        it('should react to controlled value update (from a non null date to a null date)', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
            view.setProps({
                value: [null, adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – 06/05/2022');
            view.setProps({
                value: [null, adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), 'MM/DD/YYYY – 06/05/2022');
        });
        it('should react to controlled value update (from a null date to a non null date)', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                value: [null, adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');
            view.setProps({
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                value: [null, adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), 'MM/DD/YYYY – 06/05/2022');
            view.setProps({
                value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
            });
            (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – 06/05/2022');
        });
        it('should call the onChange callback when the value is updated but should not change the displayed value if the value is controlled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        view.pressKey(2, 'ArrowUp');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
                        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
                            onChange: onChangeV6,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 2:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'ArrowUp' });
                        (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2022 – 06/05/2022');
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
                        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call the onChange callback when the value is updated and should change the displayed value if the value is not controlled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 1:
                        _a.sent();
                        view.pressKey(2, 'ArrowUp');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '06/04/2023 – 06/05/2022');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
                        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
                            onChange: onChangeV6,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('year')];
                    case 2:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        fireUserEvent_1.fireUserEvent.keyPress(input, { key: 'ArrowUp' });
                        (0, pickers_1.expectFieldValueV6)((0, pickers_1.getTextbox)(), '06/04/2023 – 06/05/2022');
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
                        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call the onChange callback before filling the last section of the active date when starting from a null value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: [null, null],
                            onChange: onChangeV7,
                            format: "".concat(adapter.formats.dayOfMonth, " ").concat(adapter.formats.monthShort),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 1:
                        _a.sent();
                        view.pressKey(0, '4');
                        expect(onChangeV7.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '04 MMMM – DD MMMM');
                        view.pressKey(1, 'S');
                        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2022, 8, 4));
                        expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'DD MMMM – DD MMMM');
                            })];
                    case 2:
                        _a.sent();
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            value: [null, null],
                            onChange: onChangeV6,
                            format: "".concat(adapter.formats.dayOfMonth, " ").concat(adapter.formats.monthShort),
                        });
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 3:
                        _a.sent();
                        input = (0, pickers_1.getTextbox)();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '4 MMMM – DD MMMM' } }); // Press 4
                        expect(onChangeV6.callCount).to.equal(0);
                        (0, pickers_1.expectFieldValueV6)(input, '04 MMMM – DD MMMM');
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '04 S – DD MMMM' } }); // Press S
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg[0]).toEqualDateTime(new Date(2022, 8, 4));
                        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
                        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                (0, pickers_1.expectFieldValueV6)(input, 'DD MMMM – DD MMMM');
                            })];
                    case 4:
                        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)("key: Delete", SingleInputDateRangeField_1.SingleInputDateRangeField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should clear all the sections when all sections are selected and all sections are completed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
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
                        internal_test_utils_1.fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY – MMMM YYYY');
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
                        internal_test_utils_1.fireEvent.input(view.getActiveSection(0), { target: { innerHTML: 'j' } });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        internal_test_utils_1.fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Set a value for the "month" section
                        internal_test_utils_1.fireEvent.change(input, {
                            target: { value: 'j YYYY – MMMM YYYY' },
                        }); // Press "j"
                        (0, pickers_1.expectFieldValueV6)(input, 'January YYYY – MMMM YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY – MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
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
                        internal_test_utils_1.fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(0);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call `onChange` when clearing the first section of each date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Start date
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(1);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(2), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(1);
                        // End date
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(3), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(2);
                        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(4), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(2);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(5), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(2);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Start date
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(1);
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(1);
                        // End date
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(2);
                        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(2);
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call `onChange` if the section is already empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(1);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
                        expect(onChangeV7.callCount).to.equal(1);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(1);
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Delete' });
                        expect(onChangeV6.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, pickers_1.describeAdapters)("Backspace editing", SingleInputDateRangeField_1.SingleInputDateRangeField, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
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
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '' } });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY – MMMM YYYY');
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
                        // Set a value for the "month" section
                        internal_test_utils_1.fireEvent.input(view.getActiveSection(0), { target: { innerHTML: 'j' } });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), {
                            key: 'a',
                            keyCode: 65,
                            ctrlKey: true,
                        });
                        view.pressKey(null, '');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Set a value for the "month" section
                        internal_test_utils_1.fireEvent.change(input, {
                            target: { value: 'j YYYY – MMMM YYYY' },
                        }); // Press "j"
                        (0, pickers_1.expectFieldValueV6)(input, 'January YYYY – MMMM YYYY');
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '' } });
                        (0, pickers_1.expectFieldValueV6)(input, 'MMMM YYYY – MMMM YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        view.pressKey(null, '');
                        expect(onChangeV7.callCount).to.equal(0);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            enableAccessibleFieldDOMStructure: false,
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Select all sections
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'Delete' } });
                        expect(onChangeV6.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call `onChange` when clearing the first section of each date (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        // Start date
                        view.pressKey(0, '');
                        expect(onChangeV7.callCount).to.equal(1);
                        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
                        view.pressKey(1, '');
                        expect(onChangeV7.callCount).to.equal(1);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
                        view.pressKey(2, '');
                        expect(onChangeV7.callCount).to.equal(1);
                        // End date
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
                        view.pressKey(3, '');
                        expect(onChangeV7.callCount).to.equal(2);
                        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
                        view.pressKey(4, '');
                        expect(onChangeV7.callCount).to.equal(2);
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
                        view.pressKey(5, '');
                        expect(onChangeV7.callCount).to.equal(2);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        // Start date
                        internal_test_utils_1.fireEvent.change(input, { target: { value: '/15/2022 – 06/15/2023' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));
                        return [4 /*yield*/, view.user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'MM//2022 – 06/15/2023' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        return [4 /*yield*/, view.user.keyboard('{ArrowRight}')];
                    case 4:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'MM/DD/ – 06/15/2023' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        // End date
                        return [4 /*yield*/, view.user.keyboard('{ArrowRight}')];
                    case 5:
                        // End date
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'MM/DD/YYYY – /15/2023' } });
                        expect(onChangeV6.callCount).to.equal(2);
                        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
                        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
                        return [4 /*yield*/, view.user.keyboard('{ArrowRight}')];
                    case 6:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'MM/DD/YYYY – MM//2023' } });
                        expect(onChangeV6.callCount).to.equal(2);
                        return [4 /*yield*/, view.user.keyboard('{ArrowRight}')];
                    case 7:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: 'MM/DD/YYYY – MM/DD/' } });
                        expect(onChangeV6.callCount).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call `onChange` if the section is already empty (Backspace)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChangeV7, view, onChangeV6, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChangeV7 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV7,
                        });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, view.user.keyboard('{Backspace}')];
                    case 2:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        return [4 /*yield*/, view.user.keyboard('{Backspace}')];
                    case 3:
                        _a.sent();
                        expect(onChangeV7.callCount).to.equal(1);
                        view.unmount();
                        onChangeV6 = (0, sinon_1.spy)();
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
                            onChange: onChangeV6,
                        });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 4:
                        _a.sent();
                        internal_test_utils_1.fireEvent.change(input, { target: { value: ' 2022 – June 2023' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        internal_test_utils_1.fireEvent.change(input, { target: { value: ' 2022 – June 2023' } });
                        expect(onChangeV6.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
