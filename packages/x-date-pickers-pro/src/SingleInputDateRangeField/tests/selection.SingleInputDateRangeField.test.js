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
var SingleInputDateRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateRangeField");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
describe('<SingleInputDateRangeField /> - Selection', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: SingleInputDateRangeField_1.SingleInputDateRangeField,
    }).renderWithProps;
    describe('Focus', function () {
        it('should select 1st section (v7) / all sections (v6) on mount focus (`autoFocus = true`)', function () {
            // Test with accessible DOM structure
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                autoFocus: true,
            });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
            view.unmount();
            // Test with non-accessible DOM structure
            renderWithProps({ autoFocus: true, enableAccessibleFieldDOMStructure: false });
            var input = (0, pickers_1.getTextbox)();
            (0, pickers_1.expectFieldValueV6)(input, 'MM/DD/YYYY – MM/DD/YYYY');
            expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM/DD/YYYY – MM/DD/YYYY');
        });
        it('should select all on <Tab> focus (v6 only)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = renderWithProps({ enableAccessibleFieldDOMStructure: false }).user;
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, user.tab()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    input.select();
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'MM/DD/YYYY – MM/DD/YYYY');
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM/DD/YYYY – MM/DD/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Click', function () {
        it('should select the clicked selection when the input is already focused', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: [null, pickers_1.adapterToUse.date('2022-02-24')],
                        });
                        // Start date
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 1:
                        // Start date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        // End date
                        return [4 /*yield*/, view.selectSectionAsync('month', 'last')];
                    case 3:
                        // End date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('02');
                        return [4 /*yield*/, view.selectSectionAsync('day', 'last')];
                    case 4:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('24');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            value: [null, pickers_1.adapterToUse.date('2022-02-24')],
                        });
                        // Start date
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 5:
                        // Start date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 6:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        // End date
                        return [4 /*yield*/, view.selectSectionAsync('month', 'last')];
                    case 7:
                        // End date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('02');
                        return [4 /*yield*/, view.selectSectionAsync('day', 'last')];
                    case 8:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('24');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not change the selection when clicking on the only already selected section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: [null, pickers_1.adapterToUse.date('2022-02-24')],
                        });
                        // Start date
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 1:
                        // Start date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 2:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        // End date
                        return [4 /*yield*/, view.selectSectionAsync('day', 'last')];
                    case 3:
                        // End date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('24');
                        return [4 /*yield*/, view.selectSectionAsync('day', 'last')];
                    case 4:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('24');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            value: [null, pickers_1.adapterToUse.date('2022-02-24')],
                        });
                        // Start date
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 5:
                        // Start date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        return [4 /*yield*/, view.selectSectionAsync('day')];
                    case 6:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        // End date
                        return [4 /*yield*/, view.selectSectionAsync('day', 'last')];
                    case 7:
                        // End date
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('24');
                        return [4 /*yield*/, view.selectSectionAsync('day', 'last')];
                    case 8:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('24');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('key: ArrowRight', function () {
        it('should allow to move from left to right with ArrowRight', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should stay on the current section when the last section is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('year', 'last')];
                    case 1:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(5), { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('year', 'last')];
                    case 2:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowRight' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('key: ArrowLeft', function () {
        it('should allow to move from right to left with ArrowLeft', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('year', 'last')];
                    case 1:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(5), { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('year', 'last')];
                    case 2:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('YYYY');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('DD');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should stay on the current section when the first section is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 1:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
                        input = (0, pickers_1.getTextbox)();
                        return [4 /*yield*/, view.selectSectionAsync('month')];
                    case 2:
                        _a.sent();
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' });
                        expect((0, pickers_1.getCleanedSelectedContent)()).to.equal('MM');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
